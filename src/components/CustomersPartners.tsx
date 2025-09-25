import React from "react";
import workingLabLogo from "@/assets/workinglab-logo.png";
import tuhhLogo from "@/assets/tuhh-logo.svg";
import attraktorLogo from "@/assets/attraktor-logo.svg";

export function CustomersPartners() {
  const partners = [
    {
      name: "Working Lab & Sick Makerspace",
      logo: workingLabLogo,
      className: "h-12"
    },
    {
      name: "TUHH",
      logo: tuhhLogo,
      className: "h-16"
    },
    {
      name: "Attraktor",
      logo: attraktorLogo,
      className: "h-14"
    }
  ];

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Vertraut von führenden Organisationen
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Innovative Unternehmen und Bildungseinrichtungen setzen auf unsere Lösungen
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4 transition-all duration-300 hover:scale-105 grayscale hover:grayscale-0"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} Logo`}
                className={`${partner.className} object-contain opacity-70 hover:opacity-100 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}