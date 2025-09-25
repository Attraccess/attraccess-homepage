import React from "react";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { CustomersPartners } from "@/components/CustomersPartners";

export function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <CustomersPartners />
      <Benefits />
      <Features />
      <HowItWorks />
    </div>
  );
}
