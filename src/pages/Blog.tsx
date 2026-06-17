import React from "react";
import { useSEO } from "@/hooks/use-seo";

export function Blog() {
  useSEO({
    title: "Blog",
    description: "Read the latest news, guides, and updates from Attraccess — tips on managing shared resources, makerspace operations, and open-source tool access control.",
    canonicalPath: "/blog",
  });
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
