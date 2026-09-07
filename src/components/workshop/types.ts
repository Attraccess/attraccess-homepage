export type ChapterId = "overview" | "identify" | "evaluate" | "apply" | "record" | "connect" | "pilot";
export type MachineId = "table-saw" | "bandsaw" | "cnc";
export type SceneView = ChapterId | MachineId;

export interface StoryState {
  identity: "locked" | "identified" | "supervision";
  preflight: "pending" | "checked" | "submitted";
  handoff: "dirty" | "cleaned" | "form" | "confirmed";
  handoffAnswer: boolean;
  maintenance: "observed" | "reported" | "active" | "resolved";
  automation: boolean;
}

export type StoryAction =
  | "tap-card" | "show-supervision" | "reset-identity"
  | "check-accessory" | "submit-check" | "reset-check"
  | "clean-workspace" | "end-session" | "answer-handoff" | "confirm-handoff" | "reset-handoff"
  | "report-problem" | "start-maintenance" | "complete-maintenance" | "reset-maintenance"
  | "toggle-automation";
