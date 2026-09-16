"use client";

import { ReactNode } from "react";
import { MarketingPageWrapper } from "@/components/landing/MarketingPageWrapper";

interface LegalPageProps {
    title: string;
    lastUpdated: string;
    children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
    return (
        <MarketingPageWrapper title={title} subtitle={`Last Protocol Update: ${lastUpdated}`}>
            <section className="py-4 sm:py-24 px-3 sm:px-4 pb-12 sm:pb-32">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-card border border-border/50 rounded-xl sm:rounded-[2.5rem] p-4 sm:p-10 md:p-16 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] pointer-events-none select-none">
                            <div className="text-4xl sm:text-[10rem] font-black leading-none">LEGAL</div>
                        </div>
                        
                        <div className="[&_h2]:text-sm sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-4 sm:[&_h2]:mt-8 [&_h2]:mb-1.5 sm:[&_h2]:mb-3 [&_p]:text-[11px] sm:[&_p]:text-base [&_p]:text-muted-foreground [&_p]:leading-snug sm:[&_p]:leading-relaxed [&_p]:mb-3 sm:[&_p]:mb-4 [&_li]:text-[11px] sm:[&_li]:text-base [&_li]:text-muted-foreground [&_ul]:my-2 [&_ul]:pl-4 [&_ul]:space-y-1">
                            {children}
                        </div>
                    </div>
                </div>
            </section>
        </MarketingPageWrapper>
    );
}
