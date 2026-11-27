import { randomUUID } from 'node:crypto';

// Inserts historical evidence into the isolated film database. These are the
// production entity shapes, including the meter's fixed-point billionths.
const MIN = 60_000;
const DAY = 24 * 60 * MIN;
const ts = (value) => new Date(value).toISOString().replace('T', ' ').replace('Z', '');
const parseTime = (value) => new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`).getTime();
const fixed = (value) => String(Math.round(value * 1_000_000_000));
const all = (db, sql, params = []) => new Promise((resolve, reject) => db.all(sql, params, (error, rows) => error ? reject(error) : resolve(rows)));

export async function seedEvidence({ db, run, get, insert, storageRoot, resources, users, now, projects }) {
  const laser = resources.laser;
  const printer = resources.printer;
  const mia = users[0];
  const tutor = users[1];
  const maintainer = users[5];
  const learner = users.at(-1);
  const meterIds = {};
  const reassignUsage = async (usageId, userId) => {
    const transaction = await get(db, 'SELECT id, userId, amount FROM billing_transaction WHERE resourceUsageId = ?', [usageId]);
    if (transaction && transaction.userId !== userId) {
      await run(db, 'UPDATE user SET creditBalance = creditBalance - ? WHERE id = ?', [transaction.amount, transaction.userId]);
      await run(db, 'UPDATE user SET creditBalance = creditBalance + ? WHERE id = ?', [transaction.amount, userId]);
      await run(db, 'UPDATE billing_transaction SET userId = ? WHERE id = ?', [userId, transaction.id]);
    }
    await run(db, 'UPDATE resource_usage SET userId = ? WHERE id = ?', [userId, usageId]);
  };

  // The old end-of-session report is replaced by the real start-form workflow.
  const previousForms = await all(db, 'SELECT id FROM form WHERE resourceId = ?', [laser.id]);
  for (const form of previousForms) {
    await run(db, 'DELETE FROM form_submission WHERE formId = ?', [form.id]);
    await run(db, 'DELETE FROM form_field WHERE formId = ?', [form.id]);
    await run(db, 'DELETE FROM form WHERE id = ?', [form.id]);
  }
  const formId = await insert(db, 'form', {
    name: 'Laser cutting preparation', resourceId: laser.id,
    isRequiredOnResourceUsageStart: 1, isRequiredOnResourceUsageEnd: 0,
    isRequiredOnResourceUsageTakeOver: 0, createdAt: ts(now - 90 * DAY), updatedAt: ts(now - 9 * DAY),
  });
  const definitions = [
    { name: 'Material', type: 'select', isRequired: 1, position: 0, description: 'Choose an approved material for this cut.', options: ['Birch plywood', 'Cast acrylic', 'Cardboard', 'Balsa wood'] },
    { name: 'Thickness (mm)', type: 'number', isRequired: 1, position: 1, description: 'Measure the stock before setting the focus.', options: null },
    { name: 'Extraction running', type: 'boolean', isRequired: 1, position: 2, description: 'Confirm that the extraction is running before starting the laser.', options: null },
  ];
  const fields = [];
  for (const definition of definitions) {
    const id = await insert(db, 'form_field', { ...definition, formId, options: definition.options === null ? null : JSON.stringify(definition.options) });
    fields.push({ ...definition, id, formId });
  }

  // Supervised learners are represented by genuine completed usage sessions.
  await run(db, "UPDATE resource SET supervisionMode = 'supervision_allowed', supervisedUsagesUntilIntroduction = 3, autoIntroductionTarget = 'resource' WHERE id = ?", [laser.id]);
  const learnerIntroduction = await get(db, 'SELECT id FROM resource_introduction WHERE resourceId = ? AND receiverUserId = ?', [laser.id, learner.id]);
  if (learnerIntroduction) {
    await run(db, 'DELETE FROM resource_introduction_history_item WHERE introductionId = ?', [learnerIntroduction.id]);
    await run(db, 'DELETE FROM resource_introduction WHERE id = ?', [learnerIntroduction.id]);
  }
  // Reserve precisely two completed sessions for the learner; their third is
  // still pending. Other ordinary history keeps its original attribution.
  const learnerUsages = await all(db, 'SELECT id FROM resource_usage WHERE resourceId = ? AND userId = ? AND endTime IS NOT NULL ORDER BY startTime DESC', [laser.id, learner.id]);
  for (const usage of learnerUsages) await reassignUsage(usage.id, mia.id);
  const candidates = await all(db, 'SELECT id FROM resource_usage WHERE resourceId = ? AND endTime IS NOT NULL ORDER BY startTime DESC LIMIT 7', [laser.id]);
  for (const [index, usage] of candidates.slice(3, 5).entries()) {
    await reassignUsage(usage.id, learner.id);
    await run(db, 'UPDATE resource_usage SET userId = ?, supervisorUserId = ?, startNotes = ?, endNotes = ? WHERE id = ?', [
      learner.id, tutor.id,
      index === 0 ? 'Supervised session 2 of 3: acrylic enclosure panels for Bioreactor.' : 'Supervised session 1 of 3: focus calibration and plywood test coupon.',
      index === 0 ? 'Clean kerf; extraction and focus checked with supervisor.' : 'Completed setup, material check and emergency-stop walkthrough.', usage.id,
    ]);
  }
  const introduction = await get(db, 'SELECT id FROM resource_introduction WHERE resourceId = ? AND receiverUserId = ?', [laser.id, mia.id]);
  if (introduction) {
    await run(db, "UPDATE resource_introduction_history_item SET comment = 'Laser setup, approved materials, extraction and supervised test cut completed.' WHERE introductionId = ? AND action = 'grant'", [introduction.id]);
    await insert(db, 'resource_introduction_history_item', {
      introductionId: introduction.id, action: 'grant', performedByUserId: tutor.id,
      comment: 'Refresher with Priya Nair: focus tool, lens inspection and project attribution verified.', createdAt: ts(now - 9 * DAY),
    });
    await run(db, 'UPDATE resource_introduction SET completedAt = ?, tutorUserId = ? WHERE id = ?', [ts(now - 9 * DAY), tutor.id, introduction.id]);
  }

  await run(db,"UPDATE resource_usage SET projectId = ? WHERE resourceId = ? AND supervisorUserId IS NOT NULL AND startNotes LIKE '%Bioreactor%'",[projects[2].id,laser.id]);
  const meterDefinitions = [
    { key: 'electricity', resource: laser, name: 'Electricity · kWh', rate: 35, baseline: 114.32, consumption: (minutes, index) => Math.round((minutes * (0.011 + (index % 5) * 0.001)) * 1000) / 1000, source: 'Shelly Pro 3EM' },
    { key: 'runtime', resource: laser, name: 'Run time · h', rate: 0, baseline: 236.4, consumption: (minutes) => Math.round((minutes / 60) * 1000) / 1000, source: 'Laser operating counter' },
    { key: 'filament', resource: printer, name: 'Filament · g', rate: 3, baseline: 2820, consumption: (minutes, index) => Math.round(minutes * (0.24 + (index % 4) * 0.025)), source: 'Printer filament counter' },
  ];
  const resourceTerms = new Map();
  for (const definition of meterDefinitions) {
    const existing = await get(db, 'SELECT id FROM resource_meter WHERE resourceId = ? AND name = ?', [definition.resource.id, definition.name]);
    const meterId = existing?.id ?? await insert(db, 'resource_meter', { resourceId: definition.resource.id, name: definition.name, creditsPerUnit: definition.rate, lifetimeValue: '0' });
    meterIds[definition.key] = meterId;
    const rates = resourceTerms.get(definition.resource.id) ?? [];
    rates.push({ meterId, name: definition.name, creditsPerUnit: definition.rate });
    resourceTerms.set(definition.resource.id, rates);
  }
  const usageByResource = new Map();
  for (const [resourceId, rates] of resourceTerms) {
    if (resourceId === laser.id && projects?.[0]) await run(db, 'UPDATE resource_usage SET projectId = ? WHERE resourceId = ? AND projectId IS NULL AND id % 4 != 0', [projects[0].id, resourceId]);
    const usages = await all(db, 'SELECT * FROM resource_usage WHERE resourceId = ? ORDER BY startTime', [resourceId]);
    usageByResource.set(resourceId, usages);
    await run(db, 'UPDATE resource_usage SET meterRates = ?, sessionDurationCreditsPerMinute = ?, operatingDurationCreditsPerMinute = 0, creditsPerUsage = ?, billingFactor = 100 WHERE resourceId = ?', [JSON.stringify(rates), resourceId === laser.id ? 10 : 2, resourceId === laser.id ? 50 : 0, resourceId]);
  }

  for (const definition of meterDefinitions) {
    const meterId = meterIds[definition.key];
    let lifetime = definition.baseline;
    const usages = usageByResource.get(definition.resource.id);
    for (const [index, usage] of usages.entries()) {
      const startedAt = parseTime(usage.startTime);
      const end = usage.endTime ? parseTime(usage.endTime) : now;
      const consumed = definition.consumption(Math.max(1, (end - startedAt) / MIN), index);
      const sessionId = randomUUID();
      const operationId = randomUUID();
      const active = !usage.endTime;
      const charge = Math.round(consumed * definition.rate);
      await insert(db, 'resource_metering_session', {
        id: sessionId, resourceId: definition.resource.id, usageId: usage.id,
        meterId, meterName: definition.name, collectionMode: 'requested', status: active ? 'active' : 'settled',
        creditsPerUnit: definition.rate, baselineValue: fixed(lifetime), source: definition.source,
        latestValue: fixed(consumed), latestObservedAt: ts(end), consumedValue: active ? null : fixed(consumed),
        chargeCredits: active ? null : charge, finalOperationId: active ? null : operationId,
        settledAt: active ? null : ts(end), createdAt: ts(startedAt), updatedAt: ts(end),
      });
      for (const [step, fraction] of [0, 0.33, 0.67, 1].entries()) {
        const observed = startedAt + (end - startedAt) * fraction;
        const total = Math.round(consumed * fraction * 1000) / 1000;
        await insert(db, 'resource_metering_operation', {
          id: step === 3 ? operationId : randomUUID(), sessionId, meterId, resourceId: definition.resource.id,
          kind: step === 0 ? 'start' : step === 3 && !active ? 'final' : 'interim', status: 'completed',
          requestedAt: ts(observed), completedAt: ts(observed + 120), totalValue: fixed(total),
          observedAt: ts(observed), source: definition.source, reportedValue: fixed(lifetime + total), readingMode: 'total', createdAt: ts(observed),
        });
      }
      lifetime += consumed;
      if (!active && definition.rate > 0) {
        let transaction = await get(db, 'SELECT id, amount FROM billing_transaction WHERE resourceUsageId = ?', [usage.id]);
        if (!transaction) {
          const minutes = Math.ceil((end - startedAt) / MIN);
          const base = (definition.resource.id === laser.id ? 50 : 0) + minutes * (definition.resource.id === laser.id ? 10 : 2);
          const id = await insert(db, 'billing_transaction', { userId: usage.userId, resourceUsageId: usage.id, amount: -base, status: 'completed', createdAt: ts(end), updatedAt: ts(end) });
          await insert(db, 'billing_transaction_item', { billingTransactionId: id, name: `${definition.resource.name} · ${minutes} min`, unitPrice: definition.resource.id === laser.id ? 10 : 2, quantity: minutes, durationMs: minutes * MIN });
          if (definition.resource.id === laser.id) await insert(db, 'billing_transaction_item', { billingTransactionId: id, name: 'Session setup', unitPrice: 50, quantity: 1 });
          await run(db, 'UPDATE user SET creditBalance = creditBalance - ? WHERE id = ?', [base, usage.userId]);
          transaction = { id, amount: -base };
        }
        await insert(db, 'billing_transaction_item', { billingTransactionId: transaction.id, name: definition.name, unitPrice: charge, quantity: 1, meterQuantity: String(consumed), meterCreditsPerUnit: definition.rate });
        await run(db, 'UPDATE billing_transaction SET amount = amount - ? WHERE id = ?', [charge, transaction.id]);
        await run(db, 'UPDATE user SET creditBalance = creditBalance - ? WHERE id = ?', [charge, usage.userId]);
      }
    }
    await run(db, 'UPDATE resource_meter SET lifetimeValue = ?, counterValue = ?, latestObservedAt = ? WHERE id = ?', [fixed(lifetime), fixed(lifetime), ts(now), meterId]);
  }

  const laserTransactions=await all(db,'SELECT t.id,t.userId FROM billing_transaction t JOIN resource_usage u ON u.id=t.resourceUsageId WHERE u.resourceId = ? AND u.endTime IS NOT NULL',[laser.id]);
  for(const transaction of laserTransactions){await insert(db,'billing_transaction_item',{billingTransactionId:transaction.id,name:'Extraction & filter contribution',unitPrice:25,quantity:1});await run(db,'UPDATE billing_transaction SET amount = amount - 25 WHERE id = ?',[transaction.id]);await run(db,'UPDATE user SET creditBalance = creditBalance - 25 WHERE id = ?',[transaction.userId]);}
  const activeUsages=await all(db,'SELECT * FROM resource_usage WHERE endTime IS NULL AND resourceId IN (?,?)',[laser.id,printer.id]);
  for(const usage of activeUsages)if(!await get(db,'SELECT id FROM billing_transaction WHERE resourceUsageId = ?',[usage.id]))await insert(db,'billing_transaction',{userId:usage.userId,resourceUsageId:usage.id,amount:0,status:'pending',createdAt:usage.startTime,updatedAt:usage.startTime});
  if(projects?.[0]){const candidate=users.at(-1);if(!projects[0].members.some(u=>u.id===candidate.id))await insert(db,'project_invitations',{projectId:projects[0].id,inviterId:projects[0].members[0].id,invitedUserId:candidate.id,status:'pending',requestedRole:'viewer',createdAt:ts(now-DAY),updatedAt:ts(now-DAY)});}
  await run(db,"UPDATE resource_usage SET startNotes = 'Birch plywood test coupon · Focus and extraction checked before cutting.' WHERE resourceId = ? AND (startNotes IS NULL OR startNotes = '')",[laser.id]);
  const laserUsages = usageByResource.get(laser.id);
  for (const [index, usage] of laserUsages.entries()) {
    const material = definitions[0].options[index % definitions[0].options.length];
    const answers = [material, String([3, 4, 1, 6][index % 4]), 'true'];
    const data = Object.fromEntries(fields.map((field, position) => [String(field.id), { value: answers[position], fieldDefinition: field }]));
    await insert(db, 'form_submission', { formId, userId: usage.userId, resourceUsageId: usage.id, action: 'start', data: JSON.stringify(data), createdAt: usage.startTime, updatedAt: usage.startTime });
  }

  // One well-defined operating-hours schedule with a completed baseline.
  const hourSchedule = await get(db, "SELECT id FROM resource_maintenance_schedule WHERE resourceId = ? AND triggerType = 'USAGE_HOURS' LIMIT 1", [laser.id]);
  const scheduleId = hourSchedule?.id ?? await insert(db, 'resource_maintenance_schedule', { resourceId: laser.id, name: 'Lens & mirror cleaning', triggerType: 'USAGE_HOURS', durationBasis: 'ATTRIBUTABLE_OPERATING_DURATION', enabled: 1, createdAt: ts(now - 90 * DAY), updatedAt: ts(now - 7 * DAY) });
  await run(db, "UPDATE resource_maintenance_schedule SET name = 'Lens & mirror cleaning', durationBasis = 'ATTRIBUTABLE_OPERATING_DURATION', enabled = 1 WHERE id = ?", [scheduleId]);
  const config = await get(db, 'SELECT id FROM resource_maintenance_schedule_usage_hours_config WHERE scheduleId = ?', [scheduleId]);
  if (config) await run(db, "UPDATE resource_maintenance_schedule_usage_hours_config SET duration = 40, unit = 'HOURS' WHERE id = ?", [config.id]);
  else await insert(db, 'resource_maintenance_schedule_usage_hours_config', { scheduleId, duration: 40, unit: 'HOURS' });
  const baseline = now - 6 * DAY;
  const maintenanceId = await insert(db, 'resource_maintenance', {
    resourceId: laser.id, startTime: ts(baseline - 48 * MIN), endTime: ts(baseline),
    completedAt: ts(baseline), createdAt: ts(baseline - 3 * DAY), updatedAt: ts(baseline),
    reason: 'Lens & mirror cleaning — residue removed, beam alignment checked and extraction filter inspected.',
    createdByUserId: maintainer.id, completedByUserId: maintainer.id, maintenanceScheduleId: scheduleId,
  });
  await insert(db, 'resource_maintenance_request', {
    resourceId: laser.id, reason: 'Faint residue on the focusing lens after cutting plywood; edges show more charring than the reference sample.',
    status: 'resolved', createdByUserId: users[3].id, resolvedByUserId: maintainer.id,
    resolvedAt: ts(baseline), resultingMaintenanceId: maintenanceId, createdAt: ts(baseline - 3 * DAY), updatedAt: ts(baseline),
  });
  await insert(db, 'resource_maintenance_request', {
    resourceId: laser.id, reason: 'Extraction pre-filter is approaching the replacement mark. Please check it during the next scheduled lens cleaning.',
    status: 'open', createdByUserId: mia.id, createdAt: ts(now - 21 * 60 * MIN), updatedAt: ts(now - 21 * 60 * MIN),
  });
  // Restore positive credit balances with normal historical top-ups.
  for (const user of users) {
    const current = await get(db, 'SELECT creditBalance FROM user WHERE id = ?', [user.id]);
    if (current.creditBalance >= 2000) continue;
    const amount = Math.ceil((6800 - current.creditBalance) / 500) * 500;
    await insert(db, 'billing_transaction', { userId: user.id, initiatorId: mia.id, amount, status: 'completed', externalReference: `SUMUP-NC-${String(user.id).padStart(4, '0')}-1026`, createdAt: ts(now - 23 * DAY), updatedAt: ts(now - 23 * DAY) });
    await run(db, 'UPDATE user SET creditBalance = creditBalance + ? WHERE id = ?', [amount, user.id]);
  }

  for (const usage of laserUsages.slice(-24)) {
    await insert(db, 'audit_log', { at: usage.startTime, domain: 'resource', action: 'usage_session.started', operationId: randomUUID(), actorId: usage.userId, authenticationMethod: 'session', outcome: 'succeeded', subjectType: 'resource', subjectId: laser.id, ipAddress: '127.0.0.1', userAgent: 'Attraccess web', details: JSON.stringify({ usageId: usage.id, usageUserId: usage.userId }) });
    if (usage.endTime) await insert(db, 'audit_log', { at: usage.endTime, domain: 'resource', action: 'usage_session.ended', operationId: randomUUID(), actorId: usage.userId, authenticationMethod: 'session', outcome: 'succeeded', subjectType: 'resource', subjectId: laser.id, ipAddress: '127.0.0.1', userAgent: 'Attraccess web', details: JSON.stringify({ usageId: usage.id, usageUserId: usage.userId }) });
  }
  const recentAudit = [
    { action: 'introduction.granted', actor: tutor, ago: 31 * MIN, subject: laser.id, details: { recipientUserId: users[3].id, tutorUserId: tutor.id } },
    { action: 'maintenance_schedule.updated', actor: maintainer, ago: 2 * 60 * MIN, subject: laser.id, details: { scheduleId, name: 'Lens & mirror cleaning', triggerType: 'USAGE_HOURS', usageDuration: 40, usageUnit: 'HOURS' } },
    { action: 'health.transition', actor: null, ago: 3 * 60 * MIN, subject: resources.cnc.id, details: { healthSource: 'maintenance', previousStatus: 'available', status: 'maintenance' } },
    { action: 'supervision.approved', actor: tutor, ago: 4 * 60 * MIN, subject: laser.id, details: { requesterUserId: learner.id, supervisorUserId: tutor.id, requestId: randomUUID() } },
  ];
  for (const event of recentAudit) await insert(db, 'audit_log', { at: ts(now - event.ago), domain: 'resource', action: event.action, operationId: randomUUID(), actorId: event.actor?.id ?? null, authenticationMethod: event.actor ? 'session' : null, outcome: 'succeeded', subjectType: 'resource', subjectId: event.subject, ipAddress: '127.0.0.1', details: JSON.stringify(event.details) });

  const conversationId = await insert(db, 'conversation', { createdAt: ts(now - 2 * DAY), updatedAt: ts(now - 19 * MIN) });
  for (const user of [mia, tutor]) await insert(db, 'conversation_participant', { conversationId, userId: user.id, lastReadAt: ts(now - 2 * 60 * MIN), lastNotifiedAt: ts(now) });
  const messages = [
    { sender: mia, ago: 2 * DAY, content: 'The Solar Boat bulkhead drawings are ready. Could we review the 3 mm plywood settings before the afternoon workshop?' },
    { sender: tutor, ago: 25 * MIN, content: 'Reviewed the test coupon. Use the birch plywood profile and check extraction before starting. The focus tool is back in its tray.' },
    { sender: mia, ago: 19 * MIN, content: 'Thanks! I have linked this run to Solar Boat 2027. We are cutting the revised battery cradle first.' },
  ];
  for (const message of messages) await insert(db, 'message', { conversationId, senderId: message.sender.id, content: message.content, referenceType: 'RESOURCE', referenceId: laser.id, referenceLabel: laser.name, referenceUrl: `/resources/${laser.id}`, createdAt: ts(now - message.ago) });

  const supplemental = await seedSupplementalEvidence({ db, run, get, insert, resources, users, now, projects });
  return { meterIds, formId, scheduleId, learnerId: learner.id, conversationId, ...supplemental, gaps: ['Meter charts are not implemented in this revision; lifetime and per-session meter totals are real UI.', 'Maintenance requests have no photo or assigned-maintainer fields; resolved requests link to maintenance with a completed-by maintainer.', 'Supervised session progress is stored as two of three completed sessions; the people view has no numeric progress widget.'] };
}

// Safe to run alone against an already-seeded film database. Does not recreate
// forms, metering records, billing records, maintenance, messages or audits.
export async function seedSupplementalEvidence({ db, run, get, insert, resources, users, now, projects }) {
  const laserId = resources.laser.id;
  const operatingNode = await get(db, "SELECT id FROM resource_flow_node WHERE resourceId = ? AND type = 'output.resource.activity.operating' LIMIT 1", [laserId]);
  const idleNode = await get(db, "SELECT id FROM resource_flow_node WHERE resourceId = ? AND type = 'output.resource.activity.idle' LIMIT 1", [laserId]);
  const usages = await all(db, 'SELECT id, startTime, endTime FROM resource_usage WHERE resourceId = ? ORDER BY startTime', [laserId]);
  let insertedIntervals = 0;
  for (const [index, usage] of usages.entries()) {
    const start = parseTime(usage.startTime);
    if (usage.endTime) {
      const end = parseTime(usage.endTime);
      const duration = end - start;
      const operatingStart = start + Math.min(4 * MIN, duration * 0.12);
      const operatingEnd = Math.max(operatingStart + 1000, end - duration * (0.12 + (index % 4) * 0.03));
      const existing = await get(db, 'SELECT id FROM resource_operating_interval WHERE resourceId = ? AND startTime = ? AND endTime = ?', [laserId, ts(operatingStart), ts(operatingEnd)]);
      if (!existing) {
        await insert(db, 'resource_operating_interval', { resourceId: laserId, startTime: ts(operatingStart), endTime: ts(operatingEnd), createdAt: ts(operatingStart), startFlowNodeId: operatingNode?.id ?? null, endFlowNodeId: idleNode?.id ?? null });
        insertedIntervals++;
      }
      await run(db, 'UPDATE resource_usage SET attributedOperatingDurationInMinutes = ? WHERE id = ?', [(operatingEnd - operatingStart) / MIN, usage.id]);
    } else {
      const operatingStart = Math.max(start, now - 10 * MIN);
      const existing = await get(db, 'SELECT id FROM resource_operating_interval WHERE resourceId = ? AND endTime IS NULL', [laserId]);
      if (existing) await run(db, 'UPDATE resource_operating_interval SET startTime = ?, startFlowNodeId = COALESCE(?, startFlowNodeId) WHERE id = ?', [ts(operatingStart), operatingNode?.id ?? null, existing.id]);
      else {
        await insert(db, 'resource_operating_interval', { resourceId: laserId, startTime: ts(operatingStart), endTime: null, createdAt: ts(operatingStart), startFlowNodeId: operatingNode?.id ?? null });
        insertedIntervals++;
      }
      await run(db, 'UPDATE resource_usage SET attributedOperatingDurationInMinutes = ? WHERE id = ?', [(now - operatingStart) / MIN, usage.id]);
    }
  }
  // Provenance can be filled when the integration seed has added its nodes.
  if (operatingNode) await run(db, 'UPDATE resource_operating_interval SET startFlowNodeId = ? WHERE resourceId = ? AND startFlowNodeId IS NULL', [operatingNode.id, laserId]);
  if (idleNode) await run(db, 'UPDATE resource_operating_interval SET endFlowNodeId = ? WHERE resourceId = ? AND endTime IS NOT NULL AND endFlowNodeId IS NULL', [idleNode.id, laserId]);

  for (const project of projects) {
    const record = await get(db, 'SELECT userId FROM project WHERE id = ?', [project.id]);
    for (const user of users.slice(0, 2)) {
      if (record.userId === user.id) continue;
      const existing = await get(db, 'SELECT id FROM project_members WHERE projectId = ? AND userId = ?', [project.id, user.id]);
      if (!existing) await insert(db, 'project_members', { projectId: project.id, userId: user.id, role: 'viewer', joinedAt: ts(now - 28 * DAY) });
    }
  }

  let operator = await get(db, "SELECT id FROM user WHERE username = 'film.operator'");
  if (!operator) {
    const source = await get(db, 'SELECT * FROM user WHERE id = ?', [users[0].id]);
    const id = await insert(db, 'user', { username: 'film.operator', email: 'operator@north-campus.example', isEmailVerified: 1, creditBalance: Math.max(8500, source.creditBalance), billingFactor: source.billingFactor, locale: 'en', dateTimeLocale: 'en-GB', createdAt: ts(now - 30 * DAY), updatedAt: ts(now) });
    const auth = await get(db, "SELECT password FROM authentication_detail WHERE userId = ? AND type = 'local_password'", [users[0].id]);
    if (!auth?.password) throw new Error('Film operator requires the seeded local authentication record.');
    await insert(db, 'authentication_detail', { userId: id, type: 'local_password', password: auth.password });
    operator = { id };
  }
  const administrator = await get(db, "SELECT id FROM role WHERE key = 'administrator'");
  const normalUser = await get(db, "SELECT id FROM role WHERE key = 'user'");
  for (const role of [administrator, normalUser]) {
    const existing = await get(db, "SELECT id FROM user_role WHERE userId = ? AND roleId = ? AND source = 'manual'", [operator.id, role.id]);
    if (!existing) await insert(db, 'user_role', { userId: operator.id, roleId: role.id, source: 'manual' });
  }
  for(const project of projects??[]){const owner=await get(db,'SELECT userId FROM project WHERE id = ?',[project.id]);if(owner.userId!==operator.id&&!await get(db,'SELECT id FROM project_members WHERE projectId = ? AND userId = ?',[project.id,operator.id]))await insert(db,'project_members',{projectId:project.id,userId:operator.id,role:'viewer',joinedAt:ts(now-20*DAY)});}
  return { insertedIntervals, operatorId: operator.id };
}
