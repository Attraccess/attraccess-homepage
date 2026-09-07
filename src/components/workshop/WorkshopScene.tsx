import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createWorkshop } from "./scene-model";
import type { MachineId, StoryAction, StoryState, SceneView } from "./types";
import { posterKey } from "./story";

export interface WorkshopSceneProps {
  view: SceneView;
  story: StoryState;
  onReady: () => void;
  onUnavailable: () => void;
  onSelect: (machine: MachineId) => void;
  onAction: (action: StoryAction) => void;
}

export default function WorkshopScene(props: WorkshopSceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  latest.current = props;
  const update = useRef<() => void>();

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    let workshop: ReturnType<typeof createWorkshop>;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      workshop = createWorkshop();
    } catch {
      renderer?.dispose();
      latest.current.onUnavailable();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.add(workshop.root);
    scene.add(new THREE.HemisphereLight(0xfff8e8, 0x9daab0, 2.4));
    const sunlight = new THREE.DirectionalLight(0xfff6df, 3.3);
    sunlight.position.set(-3, 10, 7);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.setScalar(window.innerWidth < 768 ? 1024 : 2048);
    Object.assign(sunlight.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 35 });
    sunlight.shadow.normalBias = 0.03;
    sunlight.shadow.bias = -0.0002;
    scene.add(sunlight);
    const fill = new THREE.DirectionalLight(0xdce9ff, 1.1);
    fill.position.set(6, 5, -3);
    scene.add(fill);

    const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 100);
    const target = new THREE.Vector3();
    const goalPosition = new THREE.Vector3();
    const goalTarget = new THREE.Vector3();
    let span = 10;
    let goalSpan = 10;
    let aspect = 1;
    let frame = 0;
    let visible = true;
    let first = true;
    let lost = false;
    let previousTime = 0;
    let assetsReady = false;
    let readyReported = false;
    let startupTimer: number | undefined;
    let startupStarted = 0;
    let startupRemaining = 10000;

    function canRender() { return visible && !document.hidden && !lost; }
    function pauseStartupWatchdog() {
      if (startupTimer === undefined) return;
      startupRemaining -= performance.now() - startupStarted;
      clearTimeout(startupTimer);
      startupTimer = undefined;
    }
    // Only time an eligible render. Hidden or offscreen scenes cannot draw a first frame.
    function updateStartupWatchdog() {
      if (readyReported || lost || assetsReady || !canRender()) { pauseStartupWatchdog(); return; }
      if (startupTimer !== undefined) return;
      startupStarted = performance.now();
      startupTimer = window.setTimeout(() => {
        startupTimer = undefined;
        if (!readyReported && !lost && canRender()) { lost = true; latest.current.onUnavailable(); }
      }, startupRemaining);
    }

    function draw(time: number) {
      frame = 0;
      if (!canRender()) return;
      const delta = Math.min((time - previousTime) / 1000 || 1 / 60, 0.05);
      previousTime = time;
      const blend = first ? 1 : 1 - Math.exp(-7 * delta);
      camera.position.lerp(goalPosition, blend);
      target.lerp(goalTarget, blend);
      span += (goalSpan - span) * blend;
      camera.left = -span * aspect / 2;
      camera.right = span * aspect / 2;
      camera.top = span / 2;
      camera.bottom = -span / 2;
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      try {
        renderer.render(scene, camera);
      } catch {
        lost = true;
        latest.current.onUnavailable();
        return;
      }
      if (assetsReady && !readyReported) { readyReported = true; updateStartupWatchdog(); latest.current.onReady(); }
      first = false;
      const moving = camera.position.distanceTo(goalPosition) + target.distanceTo(goalTarget) + Math.abs(span - goalSpan) > 0.008;
      container.dataset.settled = String(!moving && assetsReady);
      if (moving) frame = requestAnimationFrame(draw);
    }

    function requestDraw() {
      updateStartupWatchdog();
      if (!frame && canRender()) {
        previousTime = performance.now();
        frame = requestAnimationFrame(draw);
      }
    }

    function sync() {
      const { view, story } = latest.current;
      const pose = workshop.frames[view];
      goalPosition.set(...pose.position);
      goalTarget.set(...pose.target);
      // Fit the same composition horizontally on a narrow canvas, rather than cropping hardware.
      goalSpan = pose.span * Math.max(1, 1.35 / aspect);
      workshop.setState(view, story);
      renderer.shadowMap.needsUpdate = true;
      container.dataset.view = view;
      container.dataset.story = posterKey(view, story);
      container.dataset.settled = "false";
      requestDraw();
    }

    const resize = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      aspect = width / height;
      renderer.setSize(width, height);
      sync();
    });
    resize.observe(container);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestDraw();
      else { pauseStartupWatchdog(); cancelAnimationFrame(frame); frame = 0; }
    });
    intersection.observe(container);
    function visibilityChange() {
      if (document.hidden) pauseStartupWatchdog();
      else requestDraw();
    }
    document.addEventListener("visibilitychange", visibilityChange);

    const raycaster = new THREE.Raycaster();
    let pointerStart: [number, number] = [0, 0];
    function pointerDown(event: PointerEvent) { pointerStart = [event.clientX, event.clientY]; }
    function pointerUp(event: PointerEvent) {
      if (event.button !== 0) return;
      if (Math.hypot(event.clientX - pointerStart[0], event.clientY - pointerStart[1]) > 8) return;
      const bounds = canvas.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1), camera);
      const hit = raycaster.intersectObject(workshop.root, true).find(({ object }) => {
        for (let node: THREE.Object3D | null = object; node; node = node.parent) {
          if (!node.visible) return false;
        }
        return true;
      });
      let object: THREE.Object3D | null = hit?.object ?? null;
      while (object) {
        if (object.userData.storyAction) { latest.current.onAction(object.userData.storyAction); return; }
        object = object.parent;
      }
      object = hit?.object ?? null;
      while (object) {
        if (object.userData.machine) { latest.current.onSelect(object.userData.machine); break; }
        object = object.parent;
      }
    }
    function contextLost(event: Event) {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      latest.current.onUnavailable();
    }
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("webglcontextlost", contextLost);
    update.current = sync;
    sync();
    void workshop.ready.then(() => {
      if (lost) return;
      assetsReady = true;
      requestDraw();
    }).catch(() => {
      if (!lost) { lost = true; latest.current.onUnavailable(); }
    });

    return () => {
      update.current = undefined;
      lost = true;
      pauseStartupWatchdog();
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibilityChange);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("webglcontextlost", contextLost);
      workshop.dispose();
      sunlight.shadow.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  useEffect(() => { update.current?.(); }, [props.view, props.story]);

  return <div ref={host} className="workshop-canvas" />;
}
