"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { Footer } from "@/components/landing/Footer";

/* Outcome-Focused Business Components */
const InteractiveDemo = dynamic(() =>
  import("@/components/landing/InteractiveDemo").then((m) => m.InteractiveDemo)
);
const ProblemSolution = dynamic(() =>
  import("@/components/landing/ProblemSolution").then((m) => m.ProblemSolution)
);
const ValueGrid = dynamic(() => import("@/components/landing/ValueGrid").then((m) => m.ValueGrid));
const EffortlessSetup = dynamic(() =>
  import("@/components/landing/EffortlessSetup").then((m) => m.EffortlessSetup)
);
const SectionNaturalConversation = dynamic(() =>
  import("@/components/landing/SectionNaturalConversation").then((m) => m.SectionNaturalConversation)
);
const Testimonials = dynamic(() =>
  import("@/components/landing/Testimonials").then((m) => m.Testimonials)
);

export default function HomePageClient() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden relative">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "AnserTech",
            operatingSystem: "Web",
            applicationCategory: "BusinessApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description:
              "AnserTech is an AI receptionist software that handles calls, books tables, and manages customers 24/7.",
            url: "https://ansertech.com",
            publisher: {
              "@type": "Organization",
              name: "AnserTech",
              url: "https://ansertech.com",
            },
          }),
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <InteractiveDemo />
        <ProblemSolution />
        <ValueGrid />
        <EffortlessSetup />
        <SectionNaturalConversation />
        <Testimonials />
        <Footer />
      </div>
    </main>
  );
}
