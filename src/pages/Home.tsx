import React from "react";
import { useSEO } from "@/hooks/use-seo";
import { HomeHero } from "@/components/home/HomeHero";
import { ControlLoopSection } from "@/components/home/ControlLoopSection";
import { HomepageSections } from "@/components/home/HomepageSections";

export function Home() {
  useSEO({ canonicalPath: "/" });
  return (
    <div className="min-h-screen">
      <HomeHero />
      <ControlLoopSection />
      <HomepageSections />
    </div>
  );
}
