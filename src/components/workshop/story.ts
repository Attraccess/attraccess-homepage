import type { SceneView, StoryAction, StoryState } from "./types";

export const initialStory: StoryState = {
  identity: "locked",
  preflight: "pending",
  handoff: "dirty",
  handoffAnswer: false,
  maintenance: "observed",
  automation: false,
};

export function posterKey(view: SceneView, state: StoryState): string {
  if (view === "identify" && state.identity !== "locked") return `${view}-${state.identity}`;
  if (view === "evaluate" && state.preflight !== "pending") return `${view}-${state.preflight}`;
  if (view === "apply" && state.automation) return `${view}-automation`;
  if (view === "record" && state.handoff === "form" && state.handoffAnswer) return `${view}-form-checked`;
  if (view === "record" && state.handoff !== "dirty") return `${view}-${state.handoff}`;
  if (view === "connect" && state.maintenance !== "observed") return `${view}-${state.maintenance}`;
  return view;
}

export function sceneStory(view: SceneView, state: StoryState): StoryState {
  switch (view) {
    case "identify": return { ...initialStory, identity: state.identity };
    case "evaluate": return { ...initialStory, preflight: state.preflight };
    case "apply": return { ...initialStory, automation: state.automation };
    case "record": return { ...initialStory, handoff: state.handoff, handoffAnswer: state.handoffAnswer };
    case "connect": return { ...initialStory, maintenance: state.maintenance };
    default: return initialStory;
  }
}

// Each chapter is a self-contained example so jumping ahead never needs hidden prerequisite clicks.
export function storyReducer(state: StoryState, action: StoryAction): StoryState {
  switch (action) {
    case "tap-card": return { ...state, identity: "identified" };
    case "show-supervision": return { ...state, identity: "supervision" };
    case "reset-identity": return { ...state, identity: "locked" };
    case "check-accessory": return { ...state, preflight: state.preflight === "pending" ? "checked" : "pending" };
    case "submit-check": return state.preflight === "checked" ? { ...state, preflight: "submitted" } : state;
    case "reset-check": return { ...state, preflight: "pending" };
    case "clean-workspace": return state.handoff === "dirty" ? { ...state, handoff: "cleaned" } : state;
    case "end-session": return state.handoff === "cleaned" ? { ...state, handoff: "form", handoffAnswer: false } : state;
    case "answer-handoff": return state.handoff === "form" ? { ...state, handoffAnswer: !state.handoffAnswer } : state;
    case "confirm-handoff": return state.handoff === "form" && state.handoffAnswer ? { ...state, handoff: "confirmed" } : state;
    case "reset-handoff": return { ...state, handoff: "dirty", handoffAnswer: false };
    case "report-problem": return state.maintenance === "observed" ? { ...state, maintenance: "reported" } : state;
    case "start-maintenance": return state.maintenance === "reported" ? { ...state, maintenance: "active" } : state;
    case "complete-maintenance": return state.maintenance === "active" ? { ...state, maintenance: "resolved" } : state;
    case "reset-maintenance": return { ...state, maintenance: "observed" };
    case "toggle-automation": return { ...state, automation: !state.automation };
  }
}
