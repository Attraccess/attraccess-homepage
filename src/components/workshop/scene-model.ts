import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { SceneView, StoryState, MachineId } from "./types";
import { initialStory, sceneStory } from "./story";

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  span: number;
}

type Point = [number, number, number];
type DisplayState = "locked" | "available" | "active" | "preflight-pending" | "preflight-checked" | "handoff" | "handoff-checked" | "maintenance" | "supervision";

export function createWorkshop(): {
  root: THREE.Group;
  frames: Record<SceneView, CameraPose>;
  setState: (view: SceneView, story: StoryState) => void;
  ready: Promise<void>;
  dispose: () => void;
} {
  const root = new THREE.Group();
  root.name = "Attraccess workshop";
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const geometryCache = new Map<string, THREE.BufferGeometry>();
  let disposed = false;
  const pendingLoads = new Set<() => void>();
  const teal = "#256d7b";
  const amber = "#a96816";
  const danger = "#b13d35";

  function texture(width: number, height: number, paint: (ctx: CanvasRenderingContext2D) => void) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) paint(ctx);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    textures.add(result);
    return result;
  }

  const grain = texture(512, 128, (ctx) => {
    ctx.fillStyle = "#e3c697";
    ctx.fillRect(0, 0, 512, 128);
    let seed = 73;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < 190; i++) {
      const y = random() * 128;
      const phase = random() * Math.PI * 2;
      ctx.strokeStyle = `rgba(119, 83, 43, ${0.025 + random() * 0.07})`;
      ctx.lineWidth = 0.3 + random() * 0.6;
      ctx.beginPath();
      for (let x = 0; x <= 512; x += 8) {
        const bend = Math.sin(x / 95 + phase) * 1.4 + Math.sin(x / 33 + phase) * 0.35;
        if (x === 0) ctx.moveTo(x, y + bend);
        else ctx.lineTo(x, y + bend);
      }
      ctx.stroke();
    }
  });
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;

  const ply = texture(128, 64, (ctx) => {
    ctx.fillStyle = "#d9bd91";
    ctx.fillRect(0, 0, 128, 64);
    for (let y = 0; y < 64; y += 8) {
      ctx.fillStyle = y % 16 ? "#b89a70" : "#f1dbb6";
      ctx.fillRect(0, y, 128, 2);
    }
  });

  function standard(color: THREE.ColorRepresentation, extra: THREE.MeshStandardMaterialParameters = {}) {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra });
    materials.add(mat);
    return mat;
  }

  function basic(extra: THREE.MeshBasicMaterialParameters) {
    const mat = new THREE.MeshBasicMaterial({ toneMapped: false, ...extra });
    materials.add(mat);
    return mat;
  }

  const m = {
    floor: standard("#e7e1d4", { roughness: 0.95 }),
    slab: standard("#cfc6b6"),
    wall: standard("#f5f7f7"),
    trim: standard("#d5cebf"),
    wood: standard("#ffffff", { map: grain, roughness: 0.76 }),
    ply: standard("#ffffff", { map: ply }),
    endgrain: standard("#c6a476"),
    sage: standard("#91a797", { roughness: 0.5, metalness: 0.12 }),
    sageDark: standard("#637b71", { roughness: 0.55, metalness: 0.18 }),
    sageLight: standard("#bac8b6"),
    graphite: standard("#343e42", { roughness: 0.58, metalness: 0.3 }),
    rubber: standard("#252e31", { roughness: 0.92 }),
    steel: standard("#b9c4c3", { metalness: 0.68, roughness: 0.35 }),
    steelDark: standard("#6e7c7d", { metalness: 0.58, roughness: 0.45 }),
    white: standard("#ffffff"),
    teal: standard(teal, { roughness: 0.44, metalness: 0.1 }),
    tealDark: standard("#1c5864"),
    terra: standard("#c78369"),
    ochre: standard("#d6b36e"),
    red: standard("#bc6659"),
    paper: standard("#f9f3e6", { roughness: 0.93 }),
    soil: standard("#615648"),
    leaf: standard("#748b60", { side: THREE.DoubleSide }),
    leafLight: standard("#a5b385", { side: THREE.DoubleSide }),
    guard: standard("#d1e1de", { transparent: true, opacity: 0.32, depthWrite: false, roughness: 0.25 }),
  };

  function geometry(key: string, build: () => THREE.BufferGeometry) {
    let result = geometryCache.get(key);
    if (!result) {
      result = build();
      geometryCache.set(key, result);
      geometries.add(result);
    }
    return result;
  }

  function group(name: string, parent: THREE.Group = root, position: Point = [0, 0, 0]) {
    const result = new THREE.Group();
    result.name = name;
    result.position.set(...position);
    parent.add(result);
    return result;
  }

  function mesh(parent: THREE.Group, geo: THREE.BufferGeometry, mat: THREE.Material, position: Point) {
    const result = new THREE.Mesh(geo, mat);
    result.position.set(...position);
    result.castShadow = !mat.transparent;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  }

  function box(parent: THREE.Group, size: Point, position: Point, mat: THREE.Material, radius = 0) {
    const r = Math.min(radius, Math.min(...size) * 0.35);
    const geo = geometry(`box:${size.join()}:${r}`, () => r
      ? new RoundedBoxGeometry(...size, 1, r)
      : new THREE.BoxGeometry(...size));
    return mesh(parent, geo, mat, position);
  }

  function cylinder(parent: THREE.Group, radius: number, height: number, position: Point,
    mat: THREE.Material, topRadius = radius, segments = 16) {
    const geo = geometry(`cylinder:${radius}:${topRadius}:${height}:${segments}`,
      () => new THREE.CylinderGeometry(topRadius, radius, height, segments));
    return mesh(parent, geo, mat, position);
  }

  function rod(parent: THREE.Group, from: Point, to: Point, radius: number, mat: THREE.Material, segments = 8) {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const center = start.clone().add(end).multiplyScalar(0.5);
    const result = cylinder(parent, radius, start.distanceTo(end), center.toArray() as Point, mat, radius, segments);
    result.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    return result;
  }

  function pipe(parent: THREE.Group, points: Point[], radius: number, mat: THREE.Material, segments = 28) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, "centripetal");
    const geo = new THREE.TubeGeometry(curve, segments, radius, 8, false);
    geometries.add(geo);
    return mesh(parent, geo, mat, [0, 0, 0]);
  }

  function torus(parent: THREE.Group, radius: number, tube: number, position: Point, mat: THREE.Material, arc = Math.PI * 2) {
    const geo = geometry(`torus:${radius}:${tube}:${arc}`,
      () => new THREE.TorusGeometry(radius, tube, 6, 32, arc));
    return mesh(parent, geo, mat, position);
  }

  function plane(parent: THREE.Group, width: number, height: number, position: Point, mat: THREE.Material) {
    const geo = geometry(`plane:${width}:${height}`, () => new THREE.PlaneGeometry(width, height));
    const result = mesh(parent, geo, mat, position);
    result.castShadow = false;
    return result;
  }

  function label(text: string, foreground = "#ecf0e6", background = "#343e42") {
    return basic({ map: texture(256, 64, (ctx) => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = foreground;
      ctx.font = "500 32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 128, 34);
    }) });
  }

  function annotation(title: string, detail: string, color = teal) {
    return basic({ map: texture(512, 144, (ctx) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 144);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 10, 144);
      ctx.strokeStyle = "#d5dede";
      ctx.strokeRect(11, 1, 500, 142);
      ctx.font = "600 32px sans-serif";
      ctx.fillText(title, 28, 59, 456);
      ctx.fillStyle = "#5d6b6e";
      ctx.font = "24px sans-serif";
      ctx.fillText(detail, 28, 106, 456);
    }) });
  }

  const contactTexture = texture(128, 128, (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = teal;
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, 122, 122);
    ctx.lineCap = "round";
    for (const radius of [36, 45]) {
      for (const start of [-2.35, 0.79]) {
        ctx.beginPath();
        ctx.arc(64, 64, radius, start, start + 1.56);
        ctx.stroke();
      }
    }
    ctx.fillStyle = teal;
    ctx.font = "500 30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NFC", 64, 75);
  });
  const contactMaterial = basic({ map: contactTexture, transparent: true, depthWrite: false });

  // Simplified, source-backed Touch layouts, not exact firmware captures. Forms are owner-configured.
  function screen(state: DisplayState, title = "Tischkreissaege") {
    return basic({ map: texture(480, 480, (ctx) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 480, 480);
      ctx.textBaseline = "middle";
      if (state === "locked") {
        // No unverified lock-screen instruction: the original PNG mascot is placed alongside this wordmark.
        ctx.fillStyle = "#202729";
        ctx.font = "700 60px sans-serif";
        ctx.fillText("Attraccess", 128, 240, 328);
        return;
      }
      ctx.fillStyle = teal;
      ctx.fillRect(24, 28, 432, 8);
      ctx.fillStyle = "#202729";
      ctx.font = "600 34px sans-serif";
      ctx.fillText(title, 28, 78, 424);

      function button(text: string, enabled = true) {
        ctx.fillStyle = enabled ? teal : "#edf1f1";
        ctx.fillRect(28, 378, 424, 66);
        ctx.fillStyle = enabled ? "#ffffff" : "#5d6b6e";
        ctx.font = "500 30px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, 240, 411, 402);
        ctx.textAlign = "left";
      }

      if (state === "supervision") {
        ctx.fillStyle = "#5d6b6e";
        ctx.font = "30px sans-serif";
        ctx.fillText("Aufsicht erforderlich", 28, 166);
        ctx.fillStyle = "#202729";
        ctx.fillText("Aufsichts-Karte auflegen", 28, 236, 424);
        ctx.font = "23px sans-serif";
        ctx.fillText("Aufsicht kann auch im Web freigeben.", 28, 299, 424);
        button("Abbrechen");
      } else if (state === "preflight-pending" || state === "preflight-checked" || state === "handoff" || state === "handoff-checked") {
        const ending = state === "handoff" || state === "handoff-checked";
        const checked = state === "preflight-checked" || state === "handoff-checked";
        ctx.fillStyle = "#5d6b6e";
        ctx.font = "24px sans-serif";
        ctx.fillText(ending ? "Bitte vor dem Ende ausfuellen" : "Bitte vor dem Start ausfuellen", 28, 139, 424);
        ctx.fillStyle = "#202729";
        ctx.font = "500 31px sans-serif";
        ctx.fillText(ending ? "Arbeitsplatz sauber" : "Zubehör geprüft?", 28, 211, 424);
        if (ending) ctx.fillText("hinterlassen?", 28, 250);
        ctx.fillStyle = checked ? teal : "#8a989b";
        ctx.beginPath();
        ctx.roundRect(28, 292, 92, 44, 22);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(checked ? 98 : 50, 314, 17, 0, Math.PI * 2);
        ctx.fill();
        // End-form confirmation remains a human answer, not pre-filled from the physical cleanup illustration.
        button("Absenden", checked);
      } else if (state === "maintenance") {
        ctx.fillStyle = "#fbeeed";
        ctx.fillRect(28, 152, 424, 167);
        ctx.fillStyle = danger;
        ctx.font = "600 35px sans-serif";
        ctx.fillText("In Wartung", 48, 195);
        ctx.font = "27px sans-serif";
        ctx.fillText("Neue Nutzung gesperrt", 48, 262, 384);
      } else if (state === "active") {
        ctx.fillStyle = "#5d6b6e";
        ctx.font = "27px sans-serif";
        ctx.fillText("Nutzer", 28, 170);
        ctx.fillText("Dauer", 28, 270);
        ctx.fillStyle = "#202729";
        ctx.font = "500 35px sans-serif";
        ctx.fillText("Lea", 28, 214);
        ctx.fillText("00:18:42", 28, 314);
        button("Sitzung beenden");
      } else {
        button("Ressource verwenden");
      }
    }) });
  }

  const screens: Record<DisplayState, THREE.MeshBasicMaterial> = {
    locked: screen("locked"),
    available: screen("available"),
    active: screen("active"),
    "preflight-pending": screen("preflight-pending"),
    "preflight-checked": screen("preflight-checked"),
    handoff: screen("handoff"),
    "handoff-checked": screen("handoff-checked"),
    maintenance: screen("maintenance", "Bandsaege"),
    supervision: screen("supervision"),
  };
  const resourceScreens: Record<MachineId, THREE.MeshBasicMaterial> = {
    "table-saw": screens.available,
    bandsaw: screen("available", "Bandsaege"),
    cnc: screen("available", "CNC-Fraese"),
  };
  const mascotMaterial = basic({ transparent: true, depthWrite: false });
  const mascots: THREE.Mesh[] = [];

  const shadowTexture = texture(128, 128, (ctx) => {
    const gradient = ctx.createRadialGradient(64, 64, 12, 64, 64, 64);
    gradient.addColorStop(0, "rgba(61, 49, 33, 0.30)");
    gradient.addColorStop(0.48, "rgba(61, 49, 33, 0.13)");
    gradient.addColorStop(1, "rgba(61, 49, 33, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  });
  const shadowMaterial = basic({ map: shadowTexture, transparent: true, depthWrite: false, toneMapped: true });

  function shadow(parent: THREE.Group, x: number, z: number, width: number, depth: number) {
    const result = plane(parent, width, depth, [x, 0.008, z], shadowMaterial);
    result.rotation.x = -Math.PI / 2;
    result.receiveShadow = false;
    result.raycast = () => undefined;
  }

  const architecture = group("Open-front cutaway, 10 x 8 metres");
  box(architecture, [10.2, 0.26, 8.2], [0, -0.17, 0], m.slab, 0.045);
  box(architecture, [10, 0.1, 8], [0, -0.05, 0], m.floor, 0.018);
  const rearWall = group("Partial rear wall");
  box(rearWall, [8.9, 3, 0.14], [-0.55, 1.5, -4], m.wall, 0.02);
  box(rearWall, [0.14, 3, 1.75], [-5, 1.5, -3.2], m.wall, 0.02);
  box(rearWall, [8.8, 0.12, 0.08], [-0.55, 0.08, -3.88], m.trim);
  box(rearWall, [8.96, 0.055, 0.19], [-0.55, 3.025, -4], m.ply, 0.01);
  box(rearWall, [0.19, 0.055, 1.75], [-5, 3.025, -3.2], m.ply, 0.01);
  for (const x of [-2.5, 0, 2.5]) box(architecture, [0.012, 0.001, 8], [x, 0.002, 0], m.trim);
  box(architecture, [10, 0.001, 0.012], [0, 0.002, 0], m.trim);
  box(architecture, [1.25, 0.018, 0.018], [-3.9, 0.004, 3.85], m.terra);

  const furnishings = group("Joinery, hand tools and workshop furniture");

  function worktable(parent: THREE.Group, x: number, z: number, width: number, depth: number, height: number, steelLegs = false) {
    box(parent, [width, 0.105, depth], [x, height - 0.0525, z], m.wood, 0.018);
    box(parent, [width - 0.01, 0.075, 0.006], [x, height - 0.058, z + depth / 2 + 0.001], m.ply);
    for (const dx of [-width / 2 + 0.12, width / 2 - 0.12]) {
      for (const dz of [-depth / 2 + 0.11, depth / 2 - 0.11]) {
        box(parent, [0.085, height - 0.12, 0.085], [x + dx, (height - 0.12) / 2, z + dz], steelLegs ? m.graphite : m.wood, 0.008);
        box(parent, [0.1, 0.035, 0.1], [x + dx, 0.025, z + dz], m.rubber, 0.008);
      }
      box(parent, [0.055, 0.07, depth - 0.2], [x + dx, 0.28, z], steelLegs ? m.graphite : m.wood);
    }
    box(parent, [width - 0.2, 0.12, 0.055], [x, height - 0.19, z - depth / 2 + 0.1], steelLegs ? m.graphite : m.wood);
    shadow(parent, x, z, width + 0.5, depth + 0.5);
  }

  worktable(furnishings, -1.55, -3.35, 2.7, 0.8, 0.91);
  box(furnishings, [2.34, 0.065, 0.57], [-1.55, 0.26, -3.35], m.wood, 0.012);
  for (let i = 0; i < 3; i++) {
    box(furnishings, [0.59, 0.27, 0.46], [-2.31 + i * 0.77, 0.435, -3.33], i === 1 ? m.sage : m.white, 0.025);
    box(furnishings, [0.16, 0.035, 0.012], [-2.31 + i * 0.77, 0.49, -3.092], m.graphite, 0.009);
  }
  // Vise with a visible screw and contrasting wooden jaws.
  box(furnishings, [0.37, 0.15, 0.2], [-2.32, 0.88, -2.87], m.sageDark, 0.025);
  box(furnishings, [0.4, 0.14, 0.055], [-2.32, 0.95, -2.73], m.wood, 0.008);
  rod(furnishings, [-2.32, 0.85, -2.9], [-2.32, 0.85, -2.61], 0.025, m.steel);
  rod(furnishings, [-2.45, 0.85, -2.62], [-2.19, 0.85, -2.62], 0.012, m.steel);

  const pegTexture = texture(128, 128, (ctx) => {
    ctx.fillStyle = "#d5bc93";
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "#9f8b6e";
    for (let x = 8; x < 128; x += 16) for (let y = 8; y < 128; y += 16) {
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  });
  pegTexture.wrapS = pegTexture.wrapT = THREE.RepeatWrapping;
  pegTexture.repeat.set(4, 2);
  const pegMaterial = standard("#ffffff", { map: pegTexture });
  box(furnishings, [2.7, 1.08, 0.055], [-1.55, 1.84, -3.855], m.wood, 0.015);
  plane(furnishings, 2.62, 1.0, [-1.55, 1.84, -3.823], pegMaterial);
  for (let i = 0; i < 5; i++) {
    const x = -2.53 + i * 0.36;
    rod(furnishings, [x, 1.63, -3.73], [x, 1.99, -3.73], 0.018, m.steel);
    box(furnishings, [0.068, 0.2, 0.065], [x, 1.65, -3.73], i % 2 ? m.terra : m.wood, 0.02);
    if (i < 2) box(furnishings, [0.21, 0.085, 0.085], [x, 2.04, -3.73], m.steelDark, 0.01);
    else box(furnishings, [0.038 + i * 0.007, 0.15, 0.014], [x, 2.06, -3.73], m.steel, 0.004);
  }
  box(furnishings, [0.035, 0.48, 0.035], [-0.51, 1.93, -3.74], m.ochre);
  box(furnishings, [0.3, 0.035, 0.035], [-0.375, 1.708, -3.74], m.ochre);
  const handsawShape = new THREE.Shape();
  handsawShape.moveTo(-0.23, 0.1); handsawShape.lineTo(0.23, 0.06);
  for (let i = 0; i <= 18; i++) handsawShape.lineTo(0.23 - i * 0.026, -0.075 + (i % 2) * 0.022);
  handsawShape.closePath();
  const handsawGeo = new THREE.ExtrudeGeometry(handsawShape, { depth: 0.012, bevelEnabled: false });
  geometries.add(handsawGeo);
  mesh(furnishings, handsawGeo, m.steel, [-0.79, 1.48, -3.73]);
  const sawHandle = torus(furnishings, 0.079, 0.022, [-0.49, 1.49, -3.7], m.terra);
  sawHandle.scale.set(0.8, 1, 1);

  for (const y of [2.48, 2.84]) {
    box(furnishings, [2.9, 0.065, 0.34], [-1.48, y, -3.69], m.wood, 0.012);
    for (const x of [-2.65, -0.3]) {
      rod(furnishings, [x, y - 0.22, -3.86], [x, y - 0.025, -3.52], 0.014, m.graphite);
    }
  }
  for (let i = 0; i < 6; i++) {
    box(furnishings, [0.31, 0.22, 0.25], [-2.61 + i * 0.44, 2.625, -3.69], i % 3 === 0 ? m.terra : m.white, 0.018);
    box(furnishings, [0.12, 0.045, 0.006], [-2.61 + i * 0.44, 2.63, -3.56], m.paper);
  }
  for (let i = 0; i < 4; i++) cylinder(furnishings, 0.063, 0.12, [-2.4 + i * 0.19, 2.94, -3.68], i % 2 ? m.sage : m.ochre);

  // Cantilever timber rack, parallel to the open left edge rather than across the sightline.
  for (const z of [-0.3, 1.45]) {
    box(furnishings, [0.075, 1.72, 0.075], [-4.7, 0.86, z], m.graphite, 0.008);
    box(furnishings, [0.62, 0.06, 0.3], [-4.5, 0.06, z], m.graphite, 0.01);
    for (const y of [0.42, 0.95, 1.47]) box(furnishings, [0.49, 0.045, 0.06], [-4.48, y, z], m.steelDark);
  }
  for (let level = 0; level < 3; level++) for (let i = 0; i < 3; i++) {
    box(furnishings, [0.13, 0.075, 2.25 - i * 0.12], [-4.66 + i * 0.16, 0.48 + level * 0.525, 0.52 + i * 0.03], m.wood, 0.006);
  }
  const leaningPanel = box(furnishings, [0.07, 1.6, 0.78], [-4.81, 0.8, 2.42], m.wood, 0.008);
  leaningPanel.rotation.z = -0.09;

  const machines = {} as Record<MachineId, THREE.Group>;
  const readers = {} as Record<MachineId, { screen: THREE.Mesh; logo: THREE.Group; lamp: THREE.MeshStandardMaterial; ring: THREE.Mesh }>;
  const routeGroups = {} as Record<MachineId, THREE.Group>;
  const machinePositions: Record<MachineId, Point> = {
    "table-saw": [-1.52, 0, 1.0],
    bandsaw: [-3.35, 0, -1.6],
    cnc: [1.85, 0, -1.75],
  };

  function machine(id: MachineId, name: string) {
    const result = group(name, root, machinePositions[id]);
    result.userData.machine = id;
    machines[id] = result;
    return result;
  }

  const wedgeGeometry = geometry("reader-wedge", () => {
    const profile = new THREE.Shape();
    profile.moveTo(-0.08, -0.31);
    profile.lineTo(0.15, -0.31);
    profile.lineTo(0.035, 0.31);
    profile.lineTo(-0.08, 0.31);
    profile.closePath();
    const geo = new THREE.ExtrudeGeometry(profile, {
      depth: 0.38, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 1, steps: 1,
    });
    geo.rotateY(-Math.PI / 2);
    geo.translate(0.19, 0, 0);
    return geo;
  });

  const readerFaces = {} as Record<MachineId, THREE.Group>;
  function reader(parent: THREE.Group, id: MachineId, position: Point) {
    const enclosure = group(`${id} / Attractap Touch / teal enclosure illustration`, parent, position);
    enclosure.userData.machine = id;
    mesh(enclosure, wedgeGeometry, m.teal, [0, 0, 0]);
    box(enclosure, [0.33, 0.49, 0.035], [0, 0, -0.099], m.tealDark, 0.014);
    const face = group("Touchscreen and NFC contact target", enclosure, [0, 0, 0.105]);
    face.rotation.x = -Math.atan(0.115 / 0.62);
    readerFaces[id] = face;
    box(face, [0.326, 0.326, 0.014], [0, 0.096, 0], m.rubber, 0.016);
    const display = plane(face, 0.3, 0.3, [0, 0.096, 0.009], screens.locked);
    display.name = `${id} touchscreen`;
    display.userData.keepSeparate = true;
    const logo = group("Original full-color mascot on lock screen", face);
    const mascot = plane(logo, 0.047, 0.094, [-0.108, 0.096, 0.011], mascotMaterial);
    mascot.visible = false;
    mascots.push(mascot);
    plane(face, 0.174, 0.174, [0, -0.2, 0.008], contactMaterial).name = `${id} NFC contact target`;
    const lampMaterial = standard(teal, { emissive: teal, emissiveIntensity: 0.2, roughness: 0.4 });
    box(face, [0.07, 0.012, 0.01], [0, 0.288, 0.004], lampMaterial, 0.003);
    for (const x of [-0.16, 0.16]) for (const y of [-0.277, 0.279]) {
      const screw = cylinder(face, 0.007, 0.007, [x, y, 0.004], m.steelDark, 0.007, 8);
      screw.rotation.x = Math.PI / 2;
    }
    box(parent, [0.065, position[1] - 0.28, 0.065], [position[0], (position[1] - 0.28) / 2, position[2] - 0.025], m.graphite, 0.008);
    box(parent, [0.27, 0.035, 0.23], [position[0], 0.025, position[2] - 0.025], m.steelDark, 0.025);
    const ringGeo = geometry("reader-floor-ring", () => new THREE.RingGeometry(0.215, 0.235, 40));
    const ring = mesh(parent, ringGeo, basic({ color: teal, transparent: true, opacity: 0.85, depthWrite: false }),
      [position[0], 0.015, position[2] - 0.025]);
    ring.rotation.x = -Math.PI / 2;
    ring.castShadow = ring.receiveShadow = false;
    ring.raycast = () => undefined;
    ring.userData.keepSeparate = true;
    readers[id] = { screen: display, logo, lamp: lampMaterial, ring };
    return enclosure;
  }

  function controlBox(parent: THREE.Group, position: Point, number: string) {
    const [x, y, z] = position;
    box(parent, [0.32, 0.4, 0.17], [x, y, z], m.white, 0.025);
    box(parent, [0.277, 0.354, 0.012], [x, y, z + 0.094], m.trim, 0.016);
    box(parent, [0.252, 0.332, 0.012], [x, y, z + 0.104], m.white, 0.015);
    plane(parent, 0.12, 0.035, [x - 0.035, y + 0.115, z + 0.112], label(number, "#586667", "#f5f0e6"));
    for (const dx of [-0.055, 0.055]) {
      const switchBase = cylinder(parent, 0.025, 0.015, [x + dx, y + 0.015, z + 0.12], m.graphite);
      switchBase.rotation.x = Math.PI / 2;
    }
    box(parent, [0.055, 0.035, 0.012], [x + 0.063, y - 0.12, z + 0.12], m.ochre, 0.004);
    for (const dx of [-0.08, 0.08]) cylinder(parent, 0.017, 0.045, [x + dx, y - 0.222, z], m.graphite, 0.017, 8);
  }

  function stopButton(parent: THREE.Group, position: Point) {
    const [x, y, z] = position;
    const back = cylinder(parent, 0.062, 0.014, [x, y, z], m.ochre);
    back.rotation.x = Math.PI / 2;
    const button = cylinder(parent, 0.037, 0.036, [x, y, z + 0.022], m.red);
    button.rotation.x = Math.PI / 2;
  }

  const saw = machine("table-saw", "01 / Table saw");
  shadow(saw, 0, 0, 2.7, 2.1);
  for (const x of [-0.48, 0.48]) for (const z of [-0.38, 0.38]) {
    box(saw, [0.17, 0.12, 0.17], [x, 0.09, z], m.graphite, 0.02);
    box(saw, [0.21, 0.035, 0.21], [x, 0.025, z], m.rubber, 0.012);
  }
  const cabinetShape = new THREE.Shape();
  cabinetShape.moveTo(-0.46, 0.14); cabinetShape.lineTo(0.46, 0.14);
  cabinetShape.lineTo(0.59, 0.9); cabinetShape.lineTo(-0.59, 0.9); cabinetShape.closePath();
  const cabinetGeo = new THREE.ExtrudeGeometry(cabinetShape, {
    depth: 0.87, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 1,
  });
  geometries.add(cabinetGeo);
  mesh(saw, cabinetGeo, m.sage, [0, 0, -0.435]);
  box(saw, [0.91, 0.61, 0.022], [0, 0.51, 0.47], m.sageDark, 0.025);
  box(saw, [0.86, 0.56, 0.019], [0, 0.51, 0.485], m.sage, 0.023);
  for (let i = 0; i < 5; i++) box(saw, [0.28, 0.018, 0.012], [-0.23, 0.32 + i * 0.044, 0.501], m.graphite, 0.004);
  box(saw, [0.37, 0.32, 0.45], [-0.65, 0.53, -0.08], m.sageDark, 0.05);
  box(saw, [1.91, 0.09, 1.44], [0.03, 0.985, 0], m.steel, 0.015);
  for (const x of [-0.66, 0.64]) box(saw, [0.025, 0.004, 1.38], [x, 1.033, 0], m.steelDark);
  for (const x of [-0.34, 0.32]) box(saw, [0.021, 0.004, 1.34], [x, 1.034, 0], m.graphite);
  for (const z of [-0.78, 0.8]) box(saw, [2.13, 0.068, 0.058], [0.08, 0.94, z], m.graphite, 0.009);
  box(saw, [0.16, 0.01, 0.6], [-0.08, 1.039, 0.01], m.terra, 0.015);
  box(saw, [0.025, 0.005, 0.51], [-0.08, 1.046, 0.01], m.rubber);
  const bladeShape = new THREE.Shape();
  for (let i = 0; i < 96; i++) {
    const angle = i / 96 * Math.PI * 2;
    const radius = i % 3 === 0 ? 0.218 : 0.199;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) bladeShape.moveTo(x, y); else bladeShape.lineTo(x, y);
  }
  bladeShape.closePath();
  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.009, bevelEnabled: false });
  geometries.add(bladeGeo);
  const blade = mesh(saw, bladeGeo, m.steel, [-0.084, 0.982, -0.02]);
  blade.rotation.y = Math.PI / 2;
  box(saw, [0.012, 0.18, 0.085], [-0.08, 1.11, -0.28], m.steelDark, 0.006);
  box(saw, [0.13, 0.11, 0.53], [-0.08, 1.203, -0.01], m.guard, 0.036);
  rod(saw, [-0.08, 1.27, -0.27], [-0.08, 1.27, 0.14], 0.012, m.ochre);
  box(saw, [0.09, 0.14, 1.72], [0.5, 1.12, 0.015], m.steel, 0.01);
  box(saw, [0.22, 0.16, 0.12], [0.5, 1.045, 0.86], m.sageDark, 0.018);
  rod(saw, [0.5, 1.035, 0.92], [0.5, 0.91, 1.02], 0.025, m.graphite);
  const ruler = basic({ map: texture(512, 32, (ctx) => {
    ctx.fillStyle = "#d6dddd"; ctx.fillRect(0, 0, 512, 32);
    ctx.fillStyle = "#4d5a5c";
    for (let i = 0; i <= 64; i++) ctx.fillRect(i * 8, 0, 1, i % 8 === 0 ? 24 : i % 4 === 0 ? 16 : 10);
  }) });
  plane(saw, 1.88, 0.034, [0.03, 0.985, 0.727], ruler);
  const handwheel = torus(saw, 0.146, 0.016, [0.13, 0.59, 0.61], m.graphite);
  handwheel.name = "Stationary blade-height handwheel";
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2;
    rod(saw, [0.13, 0.59, 0.61], [0.13 + Math.cos(a) * 0.14, 0.59 + Math.sin(a) * 0.14, 0.61], 0.008, m.steel);
  }
  rod(saw, [0.13, 0.59, 0.49], [0.13, 0.59, 0.63], 0.023, m.steel);
  rod(saw, [0.255, 0.65, 0.61], [0.255, 0.65, 0.7], 0.019, m.graphite);
  stopButton(saw, [0.65, 0.81, 0.68]);
  plane(saw, 0.29, 0.072, [-0.18, 0.78, 0.501], label("01 / SAW"));
  reader(saw, "table-saw", [1.02, 1.32, 0.92]);
  box(saw, [0.24, 0.06, 0.09], [0.66, 0.63, 0.36], m.graphite, 0.008);
  controlBox(saw, [0.81, 0.62, 0.45], "01");
  pipe(saw, [[1.02, 1.06, 0.83], [1.01, 0.95, 0.79], [0.93, 0.67, 0.64], [0.89, 0.4, 0.45]], 0.016, m.graphite, 16);
  worktable(saw, 0, -1.31, 1.48, 1.06, 1.025, true);
  box(saw, [0.31, 0.04, 1.08], [-0.39, 1.05, -1.32], m.wood, 0.008);

  const pushstickGeometry = geometry("notched wooden pushstick with handle hole", () => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.36, -0.16);
    for (const [x, y] of [[-0.29, -0.16], [-0.29, -0.09], [0.08, 0.035], [0.17, 0.185],
      [0.235, 0.23], [0.3, 0.205], [0.33, 0.135], [0.285, 0.06], [0.16, -0.035], [-0.36, -0.23]]) shape.lineTo(x, y);
    shape.closePath();
    const grip = new THREE.Path();
    grip.absellipse(0.232, 0.154, 0.047, 0.026, 0, Math.PI * 2, true, 0.45);
    shape.holes.push(grip);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.028, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 1, curveSegments: 10,
    });
  });
  const holder = group("Physical pushstick holder with painted outline", saw);
  box(holder, [0.55, 0.84, 0.025], [-0.605, 0.575, 0.56], m.white, 0.012);
  const outline = mesh(holder, pushstickGeometry, m.trim, [-0.595, 0.64, 0.575]);
  outline.rotation.z = Math.PI / 2;
  outline.scale.set(1.04, 1.04, 0.12);
  rod(holder, [-0.747, 0.872, 0.573], [-0.747, 0.872, 0.669], 0.01, m.steel);
  rod(holder, [-0.747, 0.872, 0.669], [-0.747, 0.903, 0.669], 0.01, m.steel);
  plane(holder, 0.44, 0.085, [-0.605, 0.22, 0.576], label("Schiebestock", teal, "#ffffff"));

  const accessory = group("Schiebestock / Lea inspects and returns this accessory", saw);
  mesh(accessory, pushstickGeometry, m.wood, [0, 0, 0]);
  const accessoryFocus = group("Illustration / human pre-use inspection", saw);
  const inspectionMaterials = {
    pending: annotation("Schiebestock ansehen", "Lea prueft das Zubehoer", amber),
    checked: annotation("Von Lea geprueft", "Antwort noch nicht abgesendet"),
    submitted: annotation("Antwort erfasst", "Zubehoer von Lea geprueft"),
  };
  const inspectionLabel = plane(accessoryFocus, 1.04, 0.2925, [-0.35, 1.57, 0.78], inspectionMaterials.pending);
  inspectionLabel.userData.keepSeparate = true;
  rod(accessoryFocus, [-0.45, 1.415, 0.77], [-0.45, 1.1, 0.47], 0.006, m.teal);
  const focusMaterials = [amber, teal].map((color) => basic({ map: texture(256, 160, (ctx) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    for (const [x, y, dx, dy] of [[8, 8, 1, 1], [248, 8, -1, 1], [8, 152, 1, -1], [248, 152, -1, -1]]) {
      ctx.beginPath();
      ctx.moveTo(x + dx * 40, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * 40);
      ctx.stroke();
    }
  }), transparent: true, depthWrite: false }));
  const accessoryMarker = plane(accessoryFocus, 0.91, 0.61, [-0.46, 1.045, 0.4], focusMaterials[0]);
  accessoryMarker.rotation.x = -Math.PI / 2;
  accessoryMarker.raycast = () => undefined;

  // These props change only to illustrate a human cleanup action, never a sensor result or an app-driven sweep.
  const debris = group("Physical woodchips, scattered offcuts and dust", saw);
  const dustMaterial = basic({ map: texture(256, 256, (ctx) => {
    const haze = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    haze.addColorStop(0, "rgba(156, 105, 46, 0.45)");
    haze.addColorStop(0.68, "rgba(177, 128, 65, 0.2)");
    haze.addColorStop(1, "rgba(177, 128, 65, 0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, 256, 256);
    let seed = 119;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < 1400; i++) {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * 117;
      ctx.fillStyle = `rgba(153, 103, 49, ${0.15 + random() * 0.46})`;
      ctx.fillRect(128 + Math.cos(angle) * radius, 128 + Math.sin(angle) * radius, 1 + random() * 3, 1 + random() * 2);
    }
  }), transparent: true, depthWrite: false });
  for (const [x, y, z, width, depth] of [[-0.52, 1.039, 0.01, 0.78, 1.33], [0.77, 1.039, 0.02, 0.39, 1.28], [-0.14, 0.016, 1.21, 2.55, 1.2]]) {
    const dust = plane(debris, width, depth, [x, y, z], dustMaterial);
    dust.rotation.x = -Math.PI / 2;
    dust.receiveShadow = false;
  }
  for (const [x, y, z, width, depth, rotation] of [
    [-0.61, 1.063, -0.4, 0.47, 0.18, 0.24], [-0.68, 1.105, -0.36, 0.33, 0.12, -0.32],
    [-0.68, 1.061, 0.03, 0.25, 0.13, -0.5], [0.77, 1.063, -0.28, 0.26, 0.21, 0.2],
    [-0.68, 0.036, 1.16, 0.54, 0.18, 0.31], [-0.2, 0.026, 1.52, 0.35, 0.15, -0.45],
    [0.17, 0.026, 1.15, 0.29, 0.19, 0.86], [-0.99, 0.026, 1.56, 0.26, 0.15, -0.08],
  ]) {
    const offcut = box(debris, [width, 0.042, depth], [x, y, z], m.wood, 0.004);
    offcut.rotation.y = rotation;
  }
  for (let i = 0; i < 132; i++) {
    const a = (i * 0.618034) % 1;
    const b = (i * 0.414214) % 1;
    const onTable = i < 64;
    const x = onTable ? (i % 3 === 0 ? 0.62 + a * 0.28 : -0.86 + a * 0.53) : -1.18 + a * 1.91;
    const z = onTable ? -0.61 + b * 1.23 : 0.88 + b * 0.92;
    const chip = box(debris, [0.026 + i % 4 * 0.009, 0.01, 0.018], [x, onTable ? 1.044 : 0.021, z], i % 3 ? m.endgrain : m.ochre);
    chip.rotation.y = i * 2.39996;
  }
  const brush = group("Hand brush / cleanup is performed by Lea", saw, [0.76, 1.076, 0.32]);
  brush.rotation.y = Math.PI / 2 - 0.08;
  box(brush, [0.25, 0.04, 0.115], [0, 0.015, 0], m.wood, 0.01);
  box(brush, [0.25, 0.033, 0.05], [-0.21, 0.016, 0], m.wood, 0.014);
  for (let i = 0; i < 9; i++) box(brush, [0.017, 0.037, 0.095], [-0.102 + i * 0.025, -0.019, 0], m.graphite);

  const cleanupFocus = group("Illustration / physical cleanup before the end form", saw);
  const cleanupMaterials = {
    dirty: annotation("Lea raeumt selbst auf", "Spaene weg, Zubehoer zurueck", amber),
    cleaned: annotation("Von Lea aufgeraeumt", "Sitzung noch nicht beendet"),
    form: annotation("Jetzt am Leser bestaetigen", "Leas Antwort, keine Messung"),
    confirmed: annotation("Bereit fuer die Uebergabe", "Lea hat die Sitzung beendet"),
  };
  const cleanupLabel = plane(cleanupFocus, 1.22, 0.343, [-0.29, 1.95, 0.52], cleanupMaterials.dirty);
  cleanupLabel.userData.keepSeparate = true;

  const band = machine("bandsaw", "02 / Bandsaw");
  shadow(band, 0.03, 0.04, 1.7, 1.4);
  box(band, [0.99, 0.08, 0.72], [0, 0.06, 0], m.graphite, 0.025);
  for (const x of [-0.32, 0.32]) for (const z of [-0.23, 0.23]) {
    const leg = box(band, [0.075, 0.45, 0.075], [x, 0.28, z], m.sageDark, 0.008);
    leg.rotation.z = -Math.sign(x) * 0.14;
  }
  box(band, [0.82, 0.67, 0.43], [0, 0.62, 0], m.sage, 0.12);
  box(band, [0.18, 1.26, 0.38], [-0.36, 1.24, -0.035], m.sageDark, 0.028);
  box(band, [0.86, 0.73, 0.43], [0, 1.82, 0], m.sage, 0.13);
  for (const y of [0.63, 1.84]) {
    box(band, [0.737, 0.575, 0.019], [0, y, 0.223], m.sageLight, 0.105);
    box(band, [0.697, 0.535, 0.023], [0, y, 0.237], m.sage, 0.092);
    torus(band, 0.201, 0.007, [0, y, 0.253], m.sageDark);
    const hub = cylinder(band, 0.03, 0.017, [0, y, 0.263], m.graphite);
    hub.rotation.x = Math.PI / 2;
    box(band, [0.035, 0.09, 0.035], [0.3, y, 0.27], m.graphite, 0.01);
    for (const dy of [-0.17, 0.17]) box(band, [0.045, 0.075, 0.025], [-0.355, y + dy, 0.233], m.steelDark, 0.006);
  }
  box(band, [1.11, 0.065, 0.79], [0.12, 1.03, 0.21], m.steel, 0.015);
  box(band, [0.014, 0.004, 0.55], [0.235, 1.066, 0.32], m.graphite);
  box(band, [0.015, 0.47, 0.009], [0.235, 1.283, 0.05], m.steel);
  box(band, [0.067, 0.225, 0.06], [0.235, 1.43, 0.034], m.graphite, 0.008);
  rod(band, [0.15, 1.39, -0.035], [0.15, 1.79, -0.035], 0.023, m.steel);
  box(band, [0.055, 0.086, 0.76], [-0.04, 1.103, 0.2], m.sageDark, 0.008);
  cylinder(band, 0.023, 0.15, [0, 2.234, -0.03], m.steel);
  cylinder(band, 0.083, 0.033, [0, 2.31, -0.03], m.graphite);
  const bandMotor = cylinder(band, 0.19, 0.3, [-0.04, 0.62, -0.36], m.graphite);
  bandMotor.rotation.x = Math.PI / 2;
  stopButton(band, [-0.365, 1.18, 0.2]);
  plane(band, 0.24, 0.06, [-0.02, 2.065, 0.253], label("02 / BAND"));
  reader(band, "bandsaw", [0.9, 1.35, 0.58]);
  controlBox(band, [0.5, 0.66, 0.08], "02");
  pipe(band, [[0.9, 1.08, 0.51], [0.85, 0.78, 0.42], [0.64, 0.47, 0.16], [0.58, 0.44, 0.08]], 0.014, m.graphite, 16);

  // Observation/report annotations belong to the illustration, not a fabricated reader-native report UI.
  const maintenanceFocus = group("Illustration / observation, web request and authorized maintenance", band);
  const maintenanceMaterials = {
    observed: annotation("Problem beobachtet", "Noch keine Wartung", amber),
    reported: annotation("Im Web gemeldet", "Meldung allein sperrt nicht", amber),
    active: annotation("Wartung aktiv", "Neue Nutzung gesperrt", danger),
    resolved: annotation("Wartung beendet", "Nach Reparatur durch Personal"),
  };
  const maintenanceLabel = plane(maintenanceFocus, 1.15, 0.323, [0.13, 1.84, 0.48], maintenanceMaterials.observed);
  maintenanceLabel.userData.keepSeparate = true;
  rod(maintenanceFocus, [0.13, 1.666, 0.48], [0.15, 1.42, 0.3], 0.007, m.steelDark);

  const cnc = machine("cnc", "03 / CNC router");
  shadow(cnc, 0, 0, 3.45, 2.45);
  for (const x of [-1.18, 1.18]) for (const z of [-0.75, 0.75]) {
    box(cnc, [0.11, 0.83, 0.11], [x, 0.45, z], m.graphite, 0.01);
    cylinder(cnc, 0.09, 0.06, [x, 0.04, z], m.rubber);
  }
  for (const x of [-1.18, 1.18]) box(cnc, [0.08, 0.08, 1.62], [x, 0.28, 0], m.graphite, 0.008);
  box(cnc, [2.43, 0.08, 0.08], [0, 0.28, -0.75], m.graphite, 0.008);
  box(cnc, [2.77, 0.19, 1.95], [0, 0.865, 0], m.sage, 0.028);
  box(cnc, [2.43, 0.07, 1.64], [0, 0.996, 0], m.wood, 0.006);
  for (let i = 0; i < 9; i++) box(cnc, [0.012, 0.004, 1.62], [-1.04 + i * 0.26, 1.034, 0], m.endgrain);
  for (const x of [-1.29, 1.29]) {
    box(cnc, [0.105, 0.055, 1.93], [x, 1.017, 0], m.steel, 0.008);
    rod(cnc, [x, 1.06, -0.88], [x, 1.06, 0.88], 0.019, m.steelDark);
    box(cnc, [0.21, 0.17, 0.4], [x, 1.105, -0.17], m.graphite, 0.02);
    box(cnc, [0.19, 0.62, 0.32], [x, 1.377, -0.19], m.sageDark, 0.035);
    box(cnc, [0.23, 0.16, 0.39], [x, 1.68, -0.19], m.sage, 0.022);
    for (const y of [1.19, 1.58]) {
      const bolt = cylinder(cnc, 0.016, 0.013, [x, y, -0.018], m.steel, 0.016, 8);
      bolt.rotation.x = Math.PI / 2;
    }
  }
  box(cnc, [2.6, 0.245, 0.235], [0, 1.605, -0.2], m.steel, 0.018);
  for (const y of [1.52, 1.68]) box(cnc, [2.34, 0.032, 0.045], [0, y, -0.062], m.steelDark, 0.005);
  rod(cnc, [-1.13, 1.6, -0.028], [1.13, 1.6, -0.028], 0.018, m.graphite);
  box(cnc, [0.4, 0.38, 0.105], [-0.34, 1.498, 0.016], m.sage, 0.025);
  cylinder(cnc, 0.098, 0.295, [-0.34, 1.388, 0.172], m.steel);
  cylinder(cnc, 0.115, 0.055, [-0.34, 1.462, 0.172], m.graphite);
  cylinder(cnc, 0.065, 0.085, [-0.34, 1.205, 0.172], m.graphite);
  cylinder(cnc, 0.012, 0.075, [-0.34, 1.125, 0.172], m.steel, 0.012, 8);
  const boot = torus(cnc, 0.125, 0.023, [-0.34, 1.19, 0.172], m.white);
  boot.rotation.x = Math.PI / 2;
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2;
    cylinder(cnc, 0.009, 0.06, [-0.34 + Math.cos(a) * 0.125, 1.152, 0.172 + Math.sin(a) * 0.125], m.graphite, 0.009, 6);
  }
  box(cnc, [0.94, 0.042, 0.63], [-0.34, 1.055, 0.22], m.wood, 0.01);
  const toolpath = torus(cnc, 0.2, 0.004, [-0.34, 1.078, 0.22], m.endgrain);
  toolpath.rotation.x = Math.PI / 2;
  for (const x of [-0.87, 0.2]) {
    box(cnc, [0.15, 0.03, 0.055], [x, 1.072, 0.36], m.ochre, 0.007);
    cylinder(cnc, 0.024, 0.038, [x, 1.106, 0.36], m.graphite, 0.024, 8);
  }
  for (let i = 0; i < 15; i++) {
    box(cnc, [0.112, 0.065, 0.095], [-1.05 + i * 0.127, 1.775, -0.21], m.graphite, 0.01);
  }
  pipe(cnc, [[-0.34, 1.56, 0.16], [-0.34, 1.87, 0.1], [-0.56, 1.93, -0.17], [-0.9, 1.78, -0.2]], 0.022, m.graphite, 16);
  stopButton(cnc, [0.91, 0.87, 0.997]);
  plane(cnc, 0.42, 0.088, [0, 0.865, 0.978], label("03 / CNC"));
  reader(cnc, "cnc", [1.62, 1.25, 0.82]);
  controlBox(cnc, [1.33, 0.6, 0.44], "03");
  pipe(cnc, [[1.62, 0.97, 0.74], [1.6, 0.79, 0.66], [1.44, 0.46, 0.47], [1.41, 0.378, 0.44]], 0.015, m.graphite, 16);

  // The card illustrates Lea's identification, not a permission grant or a power command.
  const card = group("Lea / enrolled NFC card", readerFaces["table-saw"], [0.14, -0.21, 0.13]);
  card.rotation.set(0.08, -0.2, -0.16);
  box(card, [0.19, 0.12, 0.008], [0, 0, 0], m.white, 0.009);
  const cardFace = basic({ map: texture(480, 300, (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 480, 300);
    ctx.fillStyle = teal;
    ctx.fillRect(0, 0, 38, 300);
    ctx.font = "500 32px sans-serif";
    ctx.fillText("Attraccess", 66, 60);
    ctx.font = "600 84px sans-serif";
    ctx.fillText("Lea", 66, 175);
    ctx.font = "30px sans-serif";
    ctx.fillText("NFC", 359, 252);
  }) });
  plane(card, 0.182, 0.11375, [0, 0, 0.0045], cardFace);

  // Raised rigid ducting and short flexible drops stay out of the floor circulation route.
  const extraction = group("Dust extraction and overhead ducts");
  const filterPosition: Point = [-4.38, 1.09, -3.16];
  shadow(extraction, -4.38, -3.16, 1.15, 1.1);
  cylinder(extraction, 0.31, 0.74, filterPosition, m.white, 0.31, 24);
  for (let i = 0; i < 13; i++) {
    const rib = torus(extraction, 0.312, 0.008, [-4.38, 0.75 + i * 0.057, -3.16], m.trim);
    rib.rotation.x = Math.PI / 2;
  }
  cylinder(extraction, 0.27, 0.14, [-4.38, 1.53, -3.16], m.sageDark);
  cylinder(extraction, 0.27, 0.4, [-4.38, 0.51, -3.16], m.sage, 0.19);
  cylinder(extraction, 0.25, 0.2, [-4.38, 0.2, -3.16], m.white);
  box(extraction, [0.73, 0.065, 0.65], [-4.38, 0.07, -3.16], m.graphite, 0.02);
  pipe(extraction, [[-4.38, 1.61, -3.16], [-4.38, 2.55, -3.16], [-4.08, 2.76, -3.44], [-3.8, 2.76, -3.5]], 0.092, m.steel, 24);
  rod(extraction, [-3.8, 2.76, -3.5], [3.32, 2.76, -3.5], 0.09, m.steel, 12);
  for (const x of [-3.45, -1.55, 0.45, 2.65]) {
    const clamp = torus(extraction, 0.099, 0.014, [x, 2.76, -3.5], m.steelDark);
    clamp.rotation.y = Math.PI / 2;
    rod(extraction, [x, 2.76, -3.53], [x, 2.76, -3.92], 0.017, m.graphite);
  }
  pipe(extraction, [[-3.55, 2.76, -3.5], [-3.7, 2.55, -3.31], [-3.78, 1.4, -2.18], [-3.55, 0.51, -1.98]], 0.055, m.graphite, 30);
  pipe(extraction, [[-1.61, 2.76, -3.5], [-1.48, 2.47, -3.05], [-1.48, 1.35, -2.77], [-1.5, 0.37, -2.55], [-1.78, 0.3, -1.3], [-1.87, 0.31, 0.6]], 0.063, m.steelDark, 42);
  pipe(extraction, [[2.75, 2.76, -3.5], [2.79, 2.53, -3.17], [2.49, 2.1, -2.36], [1.6, 2.06, -1.8], [1.51, 1.49, -1.578]], 0.068, m.graphite, 36);

  worktable(furnishings, 3.96, 0.33, 1.39, 1.35, 0.82, true);
  box(furnishings, [0.59, 0.025, 0.4], [3.96, 0.845, 0.28], m.graphite, 0.015);
  box(furnishings, [0.51, 0.006, 0.17], [3.96, 0.861, 0.28], m.steelDark, 0.009);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 9; col++) {
    box(furnishings, [0.04, 0.004, 0.031], [3.755 + col * 0.05, 0.866, 0.225 + row * 0.043], m.graphite, 0.003);
  }
  box(furnishings, [0.16, 0.004, 0.071], [3.96, 0.863, 0.418], m.steelDark, 0.005);
  const laptopLid = group("Laptop, illustrative workshop overview", furnishings, [3.96, 0.866, 0.075]);
  laptopLid.rotation.x = -0.17;
  box(laptopLid, [0.59, 0.38, 0.022], [0, 0.19, 0], m.graphite, 0.014);
  const laptopMaterial = basic({ map: texture(384, 240, (ctx) => {
    ctx.fillStyle = "#f5f7f7"; ctx.fillRect(0, 0, 384, 240);
    ctx.fillStyle = "#edf1f1"; ctx.fillRect(0, 0, 76, 240);
    ctx.fillStyle = teal; ctx.fillRect(18, 22, 39, 9);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i === 1 ? teal : "#8a989b"; ctx.fillRect(18, 61 + i * 26, 38, 5); }
    ctx.fillStyle = "#202729"; ctx.font = "500 20px sans-serif"; ctx.fillText("Ressourcen", 98, 39);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = "#ffffff"; ctx.fillRect(95, 61 + i * 51, 267, 40);
      ctx.fillStyle = teal; ctx.fillRect(107, 73 + i * 51, 15, 15);
      ctx.fillStyle = "#202729"; ctx.font = "18px sans-serif";
      ctx.fillText(["Tischkreissaege", "Bandsaege", "CNC-Fraese"][i], 137, 88 + i * 51);
    }
  }) });
  plane(laptopLid, 0.536, 0.327, [0, 0.197, 0.014], laptopMaterial);
  box(furnishings, [0.24, 0.012, 0.32], [4.39, 0.83, 0.51], m.terra, 0.008);
  box(furnishings, [0.215, 0.023, 0.295], [4.39, 0.846, 0.51], m.paper, 0.008);
  rod(furnishings, [4.26, 0.869, 0.65], [4.46, 0.869, 0.41], 0.008, m.graphite);
  cylinder(furnishings, 0.061, 0.105, [3.49, 0.876, 0.56], m.white);
  cylinder(furnishings, 0.052, 0.003, [3.49, 0.929, 0.56], m.soil);
  torus(furnishings, 0.056, 0.005, [3.49, 0.93, 0.56], m.white).rotation.x = Math.PI / 2;
  torus(furnishings, 0.035, 0.009, [3.56, 0.886, 0.56], m.white);
  cylinder(furnishings, 0.118, 0.028, [4.43, 0.839, -0.16], m.graphite);
  rod(furnishings, [4.43, 0.853, -0.16], [4.49, 1.22, -0.23], 0.012, m.graphite);
  rod(furnishings, [4.49, 1.22, -0.23], [4.21, 1.38, -0.13], 0.012, m.graphite);
  const lampHead = group("Desk task lamp, emissive diffuser only", furnishings, [4.2, 1.335, -0.11]);
  lampHead.rotation.z = -0.22;
  cylinder(lampHead, 0.107, 0.092, [0, 0, 0], m.sageDark, 0.044);
  cylinder(lampHead, 0.098, 0.004, [0, -0.048, 0], standard("#fff0ca", { emissive: "#ffe4ad", emissiveIntensity: 0.35 }));

  const infrastructure = group("Small infrastructure rack and wall controls");
  shadow(infrastructure, 4.28, -2.92, 1.1, 1.1);
  box(infrastructure, [0.67, 1.09, 0.71], [4.28, 0.6, -2.92], m.graphite, 0.035);
  box(infrastructure, [0.57, 0.92, 0.025], [4.28, 0.6, -2.548], m.rubber, 0.014);
  for (let i = 0; i < 4; i++) {
    box(infrastructure, [0.51, 0.14, 0.03], [4.28, 0.92 - i * 0.21, -2.519], m.steelDark, 0.008);
    for (let j = 0; j < 6; j++) box(infrastructure, [0.044, 0.036, 0.007], [4.115 + j * 0.063, 0.94 - i * 0.21, -2.499], m.rubber, 0.004);
    box(infrastructure, [0.027, 0.012, 0.008], [4.083, 0.887 - i * 0.21, -2.498], m.sageLight, 0.003);
  }
  for (const x of [4.0, 4.56]) box(infrastructure, [0.07, 0.08, 0.56], [x, 0.065, -2.92], m.rubber, 0.01);
  box(infrastructure, [0.32, 0.045, 0.22], [4.28, 1.17, -2.92], m.white, 0.012);
  for (const x of [4.17, 4.39]) rod(infrastructure, [x, 1.185, -2.99], [x + 0.025, 1.36, -2.99], 0.009, m.graphite);
  controlBox(infrastructure, [3.33, 1.66, -3.79], "00");
  box(infrastructure, [0.42, 0.3, 0.13], [2.69, 1.71, -3.8], m.sage, 0.023);
  box(infrastructure, [0.3, 0.14, 0.006], [2.69, 1.73, -3.727], m.graphite, 0.012);
  plane(infrastructure, 0.23, 0.048, [2.69, 1.737, -3.722], label("I / O", "#e3eee8"));
  rod(infrastructure, [2.7, 1.55, -3.8], [2.7, 0.22, -3.8], 0.022, m.trim);
  rod(infrastructure, [3.34, 1.43, -3.8], [3.34, 0.22, -3.8], 0.022, m.trim);
  box(infrastructure, [8.5, 0.09, 0.11], [-0.45, 0.23, -3.8], m.trim, 0.015);
  pipe(infrastructure, [[3.5, 0.24, -3.77], [4.14, 0.2, -3.7], [4.28, 0.23, -3.29], [4.28, 0.5, -3.25]], 0.017, m.graphite, 18);
  pipe(infrastructure, [[4.36, 0.83, -2.49], [4.47, 0.73, -2.47], [4.34, 0.61, -2.49]], 0.012, m.teal, 12);
  pipe(infrastructure, [[4.22, 0.62, -2.49], [4.11, 0.52, -2.47], [4.25, 0.4, -2.49]], 0.012, m.terra, 12);
  pipe(infrastructure, [[4.26, 1.16, -3.02], [4.64, 0.96, -3.09], [4.69, 0.19, -2.44], [4.69, 0.12, -0.39], [4.41, 0.61, -0.24], [4.08, 0.83, 0.07]], 0.012, m.graphite, 32);

  const routes: Record<MachineId, Point[]> = {
    "table-saw": [[-0.71, 0.4, 1.45], [-0.56, 0.13, 1.18], [-0.4, 0.065, 0.45], [-0.4, 0.065, -0.8], [-0.4, 0.065, -2.46], [-0.43, 0.2, -3.69], [1.7, 0.25, -3.72], [3.33, 0.25, -3.72], [3.33, 1.44, -3.69]],
    bandsaw: [[-2.85, 0.44, -1.52], [-2.81, 0.15, -1.72], [-3.03, 0.07, -2.37], [-3.11, 0.2, -3.69], [-0.5, 0.25, -3.73], [1.7, 0.25, -3.73], [3.28, 0.25, -3.7], [3.28, 1.44, -3.69]],
    cnc: [[3.18, 0.38, -1.31], [3.3, 0.18, -1.49], [3.37, 0.075, -2.37], [3.33, 0.25, -3.69], [3.38, 1.44, -3.69]],
  };
  const routeMaterial = standard(teal, { emissive: teal, emissiveIntensity: 0.18, roughness: 0.6 });
  for (const id of ["table-saw", "bandsaw", "cnc"] as const) {
    pipe(infrastructure, routes[id], 0.026, m.graphite, 42);
    const routeGroup = group(`${id} / configured control route illustration`);
    routeGroup.userData.machine = id;
    pipe(routeGroup, routes[id], 0.033, routeMaterial, 42);
    routeGroups[id] = routeGroup;
  }
  pipe(routeGroups["table-saw"], [[-0.5, 1.06, 1.83], [-0.51, 0.95, 1.79], [-0.59, 0.67, 1.64], [-0.63, 0.4, 1.45]], 0.023, routeMaterial, 16);
  const controlTrace = group("Configured flow, not proof of machine actuation", saw);
  const controlColors = { configured: basic({ color: teal }), unconfigured: basic({ color: "#d5dede" }) };
  const controlOutline = plane(controlTrace, 0.48, 0.56, [0.81, 0.62, 0.44], controlColors.unconfigured);
  controlOutline.userData.keepSeparate = true;
  controlOutline.raycast = () => undefined;
  const controlMaterials = {
    configured: annotation("Flow konfiguriert", "Nutzung -> MQTT"),
    unconfigured: annotation("Sitzung aktiv", "Schaltung nur mit Flow", "#5d6b6e"),
  };
  const controlLabel = plane(controlTrace, 0.83, 0.234, [0.79, 0.24, 0.69], controlMaterials.unconfigured);
  controlLabel.userData.keepSeparate = true;

  const planning = group("Pilot planning table");
  worktable(planning, 1.49, 2.54, 1.91, 1.02, 0.91);
  box(planning, [1.63, 0.045, 0.63], [1.49, 0.25, 2.54], m.wood, 0.009);
  const drawing = basic({ map: texture(384, 256, (ctx) => {
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 384, 256);
    ctx.strokeStyle = "#8a989b"; ctx.lineWidth = 2;
    ctx.strokeRect(29, 24, 326, 207);
    ctx.strokeRect(51, 108, 90, 78); ctx.strokeRect(53, 47, 45, 42);
    ctx.strokeRect(202, 45, 120, 81); ctx.strokeRect(247, 162, 70, 40);
    ctx.strokeStyle = teal; ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(154, 211); ctx.lineTo(154, 78); ctx.lineTo(187, 78); ctx.stroke();
    ctx.setLineDash([]);
    for (const [x, y] of [[145, 146], [105, 65], [330, 105]]) {
      ctx.fillStyle = teal; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
    }
  }) });
  const planSheet = plane(planning, 0.89, 0.6, [1.29, 0.966, 2.51], drawing);
  planSheet.rotation.x = -Math.PI / 2;
  planSheet.rotation.z = -0.13;
  box(planning, [0.32, 0.06, 0.23], [2.02, 0.947, 2.35], m.terra, 0.015);
  box(planning, [0.29, 0.01, 0.21], [2.02, 0.982, 2.35], m.paper, 0.006);
  rod(planning, [1.65, 0.933, 2.79], [1.98, 0.933, 2.7], 0.009, m.ochre);
  const tapeRoll = torus(planning, 0.068, 0.025, [0.76, 0.946, 2.29], m.ochre);
  tapeRoll.rotation.x = Math.PI / 2;

  function stool(x: number, z: number) {
    cylinder(furnishings, 0.225, 0.065, [x, 0.57, z], m.wood, 0.225, 24);
    const brace = torus(furnishings, 0.19, 0.013, [x, 0.23, z], m.graphite);
    brace.rotation.x = Math.PI / 2;
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * Math.PI * 2;
      rod(furnishings, [x + Math.cos(a) * 0.15, 0.54, z + Math.sin(a) * 0.15],
        [x + Math.cos(a) * 0.255, 0.035, z + Math.sin(a) * 0.255], 0.025, m.graphite);
    }
    shadow(furnishings, x, z, 0.8, 0.8);
  }
  stool(1.04, 3.42);
  stool(2.86, 2.68);
  stool(3.96, 1.46);

  const leafGeo = geometry("leaf", () => new THREE.SphereGeometry(1, 8, 5));
  function plant(x: number, z: number, size: number) {
    cylinder(furnishings, size * 0.19, size * 0.37, [x, size * 0.185, z], m.terra, size * 0.245);
    cylinder(furnishings, size * 0.22, 0.014, [x, size * 0.372, z], m.soil);
    for (let i = 0; i < 9; i++) {
      const a = i * 2.39996;
      const height = size * (0.64 + (i % 3) * 0.16);
      const end: Point = [x + Math.cos(a) * size * 0.25, height, z + Math.sin(a) * size * 0.25];
      rod(furnishings, [x, size * 0.35, z], end, 0.008 * size, m.leaf);
      const leaf = mesh(furnishings, leafGeo, i % 2 ? m.leaf : m.leafLight, end);
      leaf.scale.set(size * 0.095, size * 0.245, size * 0.035);
      leaf.rotation.set(Math.sin(a) * 0.65, -a, Math.cos(a) * 0.65);
    }
    shadow(furnishings, x, z, size * 0.8, size * 0.8);
  }
  plant(4.48, 2.65, 1.05);
  plant(-3.71, 3.18, 0.63);

  // Flush painted circulation marks, not physical rails across the walking surface.
  const markings = group("Floor tape and circulation path");
  for (let i = 0; i < 7; i++) box(markings, [0.055, 0.003, 0.2], [0.08, 0.005, 2.79 - i * 0.48], m.ochre);
  for (let i = 0; i < 7; i++) box(markings, [0.22, 0.003, 0.04], [-3.0 + i * 0.42, 0.005, 2.3], m.ochre);
  for (const [x, z, dx, dz] of [[-2.83, 1.99, 1, -1], [-2.83, 0.1, 1, 1], [-0.18, 1.99, -1, -1], [0.28, -0.58, 1, -1], [3.23, -0.58, -1, -1]]) {
    box(markings, [0.27, 0.003, 0.033], [x + dx * 0.135, 0.006, z], m.white);
    box(markings, [0.033, 0.003, 0.27], [x, 0.006, z + dz * 0.135], m.white);
  }
  plane(rearWall, 1.61, 0.26, [0.92, 2.33, -3.923], label("Attraccess", teal, "#f5f7f7"));
  box(rearWall, [0.34, 0.024, 0.012], [0.28, 2.095, -3.91], m.teal, 0.004);

  // Merge only within an owner group. Dynamic displays/visibility and machine ancestors survive.
  function batch(parent: THREE.Group) {
    for (const child of [...parent.children]) if (child instanceof THREE.Group) batch(child);
    const batches = new Map<string, THREE.Mesh[]>();
    for (const child of parent.children) {
      if (!(child instanceof THREE.Mesh) || Array.isArray(child.material) || child.userData.keepSeparate || child.material.transparent) continue;
      const key = `${child.material.uuid}:${child.castShadow}:${child.receiveShadow}`;
      const items = batches.get(key) ?? [];
      items.push(child);
      batches.set(key, items);
    }
    for (const items of batches.values()) {
      if (items.length < 2) continue;
      const parts = items.map((part) => {
        part.updateMatrix();
        const geo = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
        geo.applyMatrix4(part.matrix);
        // Standard primitives sometimes add a secondary UV set; only the shared surface attributes are needed.
        for (const name of Object.keys(geo.attributes)) if (!["position", "normal", "uv"].includes(name)) geo.deleteAttribute(name);
        return geo;
      });
      const combined = mergeGeometries(parts, false);
      for (const part of parts) part.dispose();
      if (!combined) continue;
      geometries.add(combined);
      combined.computeBoundingSphere();
      const merged = new THREE.Mesh(combined, items[0].material);
      merged.name = `${parent.name} / static surfaces`;
      merged.castShadow = items[0].castShadow;
      merged.receiveShadow = items[0].receiveShadow;
      parent.remove(...items);
      parent.add(merged);
    }
  }
  batch(root);
  root.updateMatrixWorld(true);

  // +Y is up; +Z is the open front. The renderer fits these vertical spans on narrow canvases.
  const frames: Record<SceneView, CameraPose> = {
    overview: { position: [3.45, 5.65, 7.25], target: [-1.64, 0.65, 1.06], span: 4.35 },
    identify: { position: [1.05, 2.0, 5.4], target: [-0.49, 1.35, 2.04], span: 0.94 },
    evaluate: { position: [0.6, 3.6, 5.8], target: [-1.45, 1.05, 1.25], span: 2.48 },
    apply: { position: [1.63, 2.4, 5.12], target: [-0.69, 0.83, 1.66], span: 1.8 },
    record: { position: [0.38, 4.82, 6.15], target: [-1.63, 0.57, 1.66], span: 2.95 },
    connect: { position: [-1.6, 3.04, 3.5], target: [-3.0, 1.17, -1.05], span: 2.7 },
    pilot: { position: [8.18, 12.45, 13.15], target: [-0.22, 1.16, -0.17], span: 10.55 },
    "table-saw": { position: [3.97, 3.58, 6.86], target: [-1.39, 0.54, 0.83], span: 3.12 },
    bandsaw: { position: [-0.05, 3.27, 4.06], target: [-3.27, 1.04, -1.48], span: 2.92 },
    cnc: { position: [6.54, 4.43, 4.35], target: [2.03, 0.81, -1.51], span: 3.34 },
  };

  function setState(view: SceneView, story: StoryState) {
    if (disposed) return;
    story = sceneStory(view, story);
    const selected: MachineId | null = view === "bandsaw" || view === "connect" ? "bandsaw"
      : view === "cnc" ? "cnc"
        : ["identify", "evaluate", "apply", "record", "table-saw"].includes(view) ? "table-saw" : null;

    // Chapters are self-contained examples: jumping to the handoff presupposes an already active session.
    let sawState: DisplayState = "locked";
    if (view === "identify") sawState = story.identity === "identified" ? "available" : story.identity;
    else if (view === "evaluate") sawState = story.preflight === "submitted" ? "active"
      : story.preflight === "checked" ? "preflight-checked" : "preflight-pending";
    else if (view === "apply") sawState = "active";
    else if (view === "record") sawState = story.handoff === "confirmed" ? "available" : story.handoff === "form" ? story.handoffAnswer ? "handoff-checked" : "handoff" : "active";
    else if (view === "pilot") sawState = "available";
    else if (view === "table-saw") {
      if (story.handoff !== "dirty") sawState = story.handoff === "confirmed" ? "available" : story.handoff === "form" ? "handoff" : "active";
      else if (story.preflight === "submitted") sawState = "active";
      else if (story.preflight === "checked") sawState = "preflight-checked";
      else sawState = story.identity === "identified" ? "available" : story.identity;
    }
    const activeSession = sawState === "active" || sawState === "handoff" || sawState === "handoff-checked";
    const cleaned = view === "pilot" || ((view === "record" || view === "table-saw") && story.handoff !== "dirty");
    debris.visible = !cleaned;
    accessory.position.set(...(cleaned ? [-0.595, 0.64, 0.614] as Point : [-0.46, 1.055, 0.4] as Point));
    accessory.rotation.set(...(cleaned ? [0, 0, Math.PI / 2] as Point : [-Math.PI / 2, 0, -0.12] as Point));
    accessoryFocus.visible = view === "evaluate";
    inspectionLabel.material = inspectionMaterials[story.preflight];
    accessoryMarker.material = focusMaterials[story.preflight === "pending" ? 0 : 1];
    cleanupFocus.visible = view === "record";
    cleanupLabel.material = cleanupMaterials[story.handoff];
    maintenanceFocus.visible = view === "connect" || view === "bandsaw";
    maintenanceLabel.material = maintenanceMaterials[story.maintenance];

    // Action ownership survives batching on these groups; invisible ancestors must be filtered by the renderer.
    delete readerFaces["table-saw"].userData.storyAction;
    if (view === "identify" && story.identity === "locked") readerFaces["table-saw"].userData.storyAction = "tap-card";
    for (const prop of [debris, accessory, brush, cleanupFocus, accessoryFocus]) delete prop.userData.storyAction;
    if (view === "evaluate" && story.preflight !== "submitted") {
      accessory.userData.storyAction = accessoryFocus.userData.storyAction = "check-accessory";
    }
    if (view === "record" && story.handoff === "dirty") {
      for (const prop of [debris, accessory, brush, cleanupFocus]) prop.userData.storyAction = "clean-workspace";
    }
    card.visible = view === "identify" && story.identity !== "locked";
    const controlState = story.automation ? "configured" : "unconfigured";
    controlTrace.visible = view === "apply" || (view === "table-saw" && activeSession);
    controlLabel.material = controlMaterials[controlState];
    controlOutline.material = controlColors[controlState];

    for (const id of ["table-saw", "bandsaw", "cnc"] as const) {
      const state: DisplayState = id === "table-saw" ? sawState
        : id === "bandsaw" && story.maintenance === "active" ? "maintenance"
          : selected === id || view === "pilot" ? "available" : "locked";
      readers[id].screen.material = state === "available" ? resourceScreens[id] : screens[state];
      readers[id].screen.userData.displayState = state;
      readers[id].logo.visible = state === "locked";
      const color = state === "maintenance" ? danger : state === "supervision" ? amber : state === "locked" ? "#8a989b" : teal;
      readers[id].lamp.color.set(color);
      readers[id].lamp.emissive.set(color);
      readers[id].ring.visible = selected === id;
      // A session/report does not imply physical switching. Colored signal paths require the configured-flow toggle.
      routeGroups[id].visible = story.automation && (view === "pilot" || (id === "table-saw" && activeSession));
    }
    root.updateMatrixWorld(true);
  }

  function loadTexture(url: string, install: (loaded: THREE.Texture) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const finish = (error?: Error) => { pendingLoads.delete(cancel); if (error) reject(error); else resolve(); };
      const cancel = () => finish();
      pendingLoads.add(cancel);
      let result: THREE.Texture | undefined;
      try {
        result = new THREE.TextureLoader().load(url, (loaded) => {
          if (disposed) loaded.dispose();
          else {
            loaded.colorSpace = THREE.SRGBColorSpace;
            loaded.anisotropy = 4;
            install(loaded);
          }
          finish();
        }, undefined, () => {
          if (result && textures.delete(result)) result.dispose();
          finish(new Error(`Could not load required workshop image: ${url}`));
        });
        textures.add(result);
      } catch {
        finish(new Error(`Could not load required workshop image: ${url}`));
      }
    });
  }

  const ready = Promise.all([
    loadTexture("/reader-ui/firmware-theme-supervision.png", (loaded) => {
      screens.supervision.map = loaded;
      screens.supervision.needsUpdate = true;
    }),
    loadTexture("/logo.png", (loaded) => {
      mascotMaterial.map = loaded;
      mascotMaterial.needsUpdate = true;
      for (const mascot of mascots) mascot.visible = true;
    }),
  ]).then(() => undefined);

  function dispose() {
    if (disposed) return;
    disposed = true;
    // Include anything still attached as well as cached construction geometries that were merged away.
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
    });
    for (const geo of geometries) geo.dispose();
    for (const mat of materials) mat.dispose();
    for (const tex of textures) tex.dispose();
    geometryCache.clear();
    geometries.clear();
    materials.clear();
    textures.clear();
    for (const finish of pendingLoads) finish();
    mascots.length = 0;
    root.clear();
  }

  setState("overview", initialStory);
  return { root, frames, setState, ready, dispose };
}
