import React from "react";

export function Blog() {
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
