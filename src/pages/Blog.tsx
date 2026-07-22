import React from "react";
import { useSEO } from "@/hooks/use-seo";
import seoMeta from "@/lib/seo-meta.json";

export function Blog() {
  useSEO(seoMeta["/blog"]);
  return (
    <div className="flex-1 w-full h-[calc(100vh-4rem)]">
      <iframe
        src="https://ghost.attraccess.apps.janjaap.de"
        className="w-full h-full border-0"
        title="Attraccess Blog"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}
