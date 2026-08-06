import {
  Code,
  HeartHandshake,
  Lock,
  MousePointerClick,
  Package,
  ScrollText,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

// Shared by <ProofMarquee> and <FeatureHighlights>; kept out of either
// component module so both stay fast-refreshable.
export const proofChips: { icon: LucideIcon; key: string }[] = [
  { icon: Lock, key: "home.chips.lock" },
  { icon: MousePointerClick, key: "home.chips.simple" },
  { icon: Server, key: "home.chips.onprem" },
  { icon: Code, key: "home.chips.source" },
  { icon: Package, key: "home.chips.hardware" },
  { icon: ShieldCheck, key: "home.chips.dguv" },
  { icon: ScrollText, key: "home.chips.logs" },
  { icon: HeartHandshake, key: "home.chips.nonprofit" },
];
