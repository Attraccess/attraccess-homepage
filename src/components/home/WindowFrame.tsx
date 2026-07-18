import React from "react";
import { cn } from "@/lib/utils";

interface WindowFrameProps {
  title: string;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export function WindowFrame({ title, size = "md", className, children }: WindowFrameProps) {
  const dot = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div
        className={cn(
          "flex items-center gap-1.5 border-b border-border bg-muted px-3.5",
          size === "sm" ? "h-[26px]" : "h-[34px]"
        )}
      >
        <span className={cn(dot, "rounded-full bg-brand-red")} />
        <span className={cn(dot, "rounded-full bg-brand-amber")} />
        <span className={cn(dot, "rounded-full bg-brand-green")} />
        <span
          className={cn(
            "ml-2 font-semibold text-muted-foreground",
            size === "sm" ? "text-[11px]" : "text-xs"
          )}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
