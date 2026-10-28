import {
  ClipboardCheck,
  Code2,
  Compass,
  Factory,
  FileClock,
  FlaskConical,
  Gauge,
  Nfc,
  Plane,
  Power,
  Rocket,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { UseCaseId } from '../lib/routes';

export const USE_CASE_ICONS: Record<UseCaseId, LucideIcon> = {
  kritis: Plane,
  industry: Factory,
  research: FlaskConical,
};

// Step keys are shared by every use case's scenario, so the copy only has to pick one.
export const USE_CASE_STEP_ICONS: Record<string, LucideIcon> = {
  qualify: ClipboardCheck,
  tap: Nfc,
  enable: Power,
  check: Gauge,
  record: FileClock,
  defect: Wrench,
};

export const SMALL_TEAM_ICONS: Record<string, LucideIcon> = {
  engineers: Users,
  speed: Rocket,
  shape: Compass,
  source: Code2,
};
