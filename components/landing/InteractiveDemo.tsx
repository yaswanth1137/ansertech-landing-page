"use client";

import React, { useState, useRef, useEffect } from "react";
import { Phone, Check, CornerDownRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function InteractiveDemo() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [hoveredEntity, setHoveredEntity] = useState<"intent" | "context" | "action" | null>(null);

    // Fast GSAP reveal animation (600ms, non-scroll-locked, once: true)
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 16 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section 
            id="demo" 
            ref={sectionRef} 
            className="relative py-16 sm:py-20 lg:py-24 bg-[#F8F7F2] text-[#171717] overflow-hidden border-b border-[#DDDAD2]/80 selection:bg-[#E8B84A]/30 selection:text-[#171717]"
        >
            {/* SUBTLE DRAFTING NOTEBOOK GRID */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.18]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #DDDAD2 1px, transparent 1px),
                        linear-gradient(to bottom, #DDDAD2 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1240px]">
                
                {/* 1. EDITORIAL TYPOGRAPHIC HEADER */}
                <div className="max-w-[760px] mx-auto text-center mb-10 sm:mb-12">
                    <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#D97706] tracking-[0.2em] font-semibold uppercase mb-3 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84A]" /> CONVERSATION INTELLIGENCE
                    </div>

                    <h2 className="text-[2.4rem] sm:text-[3rem] lg:text-[3.4rem] font-['Manrope',sans-serif] font-bold tracking-[-0.035em] text-[#171717] leading-[1.08] mb-4">
                        It Doesn’t Just Talk.<br />
                        It Understands.
                    </h2>

                    <p className="font-['Manrope',sans-serif] text-[17px] sm:text-[18px] text-[#5A5A55] font-normal leading-[1.65] max-w-[640px] mx-auto">
                        OBI listens to a live caller, extracts what they need, retains relevant context, and prepares the right business action in real time.
                    </p>
                </div>

                {/* 2. PRODUCT HERO INTERFACE (LIVE CALL PROCESSING) */}
                <div 
                    ref={containerRef}
                    className="max-w-[980px] mx-auto bg-[#FFFDF8] border border-[#DDD9CE] rounded-xl shadow-[0_12px_40px_rgba(25,25,25,0.06)] overflow-hidden"
                >
                    {/* A. SYSTEM STATUS BAR */}
                    <div className="bg-[#F5F2EA] border-b border-[#E2DDD0] px-4 sm:px-6 py-2.5 flex items-center justify-between font-['IBM_Plex_Mono',monospace] text-[10.5px] text-[#777770] select-none">
                        <div className="flex items-center gap-2">
                            <Phone size={12} className="text-[#10B981]" />
                            <span className="font-semibold text-[#171717]">LIVE CALL PROCESSING</span>
                            <span className="text-[#C5C0B2]">/</span>
                            <span>INBOUND AUDIO STREAM</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                            <span className="font-medium text-[#171717]">CONTEXT RESOLVED</span>
                        </div>
                    </div>

                    {/* B. UPPER CHAMBER: LIVE TRANSCRIPT */}
                    <div className="p-5 sm:p-7 lg:p-8 bg-[#FFFDF8] border-b border-[#EFECE1]">
                        <div className="text-[10px] font-['IBM_Plex_Mono',monospace] text-[#888882] tracking-wider uppercase font-semibold mb-4">
                            LIVE TRANSCRIPT
                        </div>

                        <div className="space-y-4 max-w-[850px]">
                            {/* Caller Dialogue */}
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="px-2 py-0.5 rounded bg-[#F4EFE6] border border-[#E2DDD0] font-['IBM_Plex_Mono',monospace] text-[10px] font-semibold text-[#666660] uppercase shrink-0 mt-0.5">
                                    CALLER
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[15.5px] sm:text-[16.5px] text-[#171717] font-medium leading-relaxed">
                                    &ldquo;Hi, I wanted to know if you have any{" "}
                                    <span 
                                        className={`transition-all duration-200 px-1 py-0.5 rounded ${
                                            hoveredEntity === "intent" || hoveredEntity === "context" || hoveredEntity === "action"
                                                ? "bg-[#E8B84A]/25 text-[#171717] font-semibold ring-1 ring-[#E8B84A]"
                                                : "bg-[#F4EFE6] text-[#171717]"
                                        }`}
                                    >
                                        availability this Saturday
                                    </span>
                                    .&rdquo;
                                </div>
                            </div>

                            {/* OBI Dialogue */}
                            <div className="flex items-start gap-3 sm:gap-4 pl-0 sm:pl-2">
                                <div className="px-2 py-0.5 rounded bg-[#FFFBF0] border border-[#E8B84A] font-['IBM_Plex_Mono',monospace] text-[10px] font-semibold text-[#D97706] uppercase shrink-0 mt-0.5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84A]" />
                                    OBI
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[15.5px] sm:text-[16.5px] text-[#333330] leading-relaxed">
                                    &ldquo;Sure. Let me check that for you.&rdquo;
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* C. LOWER CHAMBER: REAL-TIME UNDERSTANDING PIPELINE */}
                    <div className="p-5 sm:p-7 lg:p-8 bg-[#FAF8F3]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-[10px] font-['IBM_Plex_Mono',monospace] text-[#888882] tracking-wider uppercase font-semibold">
                                REAL-TIME UNDERSTANDING PIPELINE
                            </div>
                            <div className="text-[10px] font-['IBM_Plex_Mono',monospace] text-[#888882]">
                                Hover steps to inspect context
                            </div>
                        </div>

                        {/* 3-Column Pipeline Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                            
                            {/* 1. INTENT */}
                            <div 
                                onMouseEnter={() => setHoveredEntity("intent")}
                                onMouseLeave={() => setHoveredEntity(null)}
                                className={`p-4 rounded-lg border transition-all duration-200 cursor-default bg-[#FFFDF8] ${
                                    hoveredEntity === "intent"
                                        ? "border-[#E8B84A] shadow-md ring-1 ring-[#E8B84A]/40"
                                        : "border-[#DDD9CE] hover:border-[#B5B0A2]"
                                }`}
                            >
                                <div className="font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#888882] uppercase tracking-wider mb-2 flex items-center justify-between">
                                    <span>01 · INTENT</span>
                                    <Check size={12} className="text-[#10B981]" />
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[14px] font-bold text-[#171717] leading-tight mb-1">
                                    Availability enquiry
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[11.5px] text-[#666660] leading-normal">
                                    Identified caller request to inspect calendar openings.
                                </div>
                            </div>

                            {/* 2. CONTEXT */}
                            <div 
                                onMouseEnter={() => setHoveredEntity("context")}
                                onMouseLeave={() => setHoveredEntity(null)}
                                className={`p-4 rounded-lg border transition-all duration-200 cursor-default bg-[#FFFDF8] ${
                                    hoveredEntity === "context"
                                        ? "border-[#E8B84A] shadow-md ring-1 ring-[#E8B84A]/40"
                                        : "border-[#DDD9CE] hover:border-[#B5B0A2]"
                                }`}
                            >
                                <div className="font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#888882] uppercase tracking-wider mb-2 flex items-center justify-between">
                                    <span>02 · CONTEXT</span>
                                    <Check size={12} className="text-[#10B981]" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[11px] text-[#171717] font-semibold">
                                        <span className="w-1 h-1 rounded-full bg-[#E8B84A]" />
                                        <span>Target date: Saturday</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[11px] text-[#555550]">
                                        <span className="w-1 h-1 rounded-full bg-[#888882]" />
                                        <span>Type: Inbound inquiry</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. NEXT ACTION */}
                            <div 
                                onMouseEnter={() => setHoveredEntity("action")}
                                onMouseLeave={() => setHoveredEntity(null)}
                                className={`p-4 rounded-lg border transition-all duration-200 cursor-default bg-[#FFFDF8] ${
                                    hoveredEntity === "action"
                                        ? "border-[#E8B84A] shadow-md ring-1 ring-[#E8B84A]/40"
                                        : "border-[#DDD9CE] hover:border-[#B5B0A2]"
                                }`}
                            >
                                <div className="font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#888882] uppercase tracking-wider mb-2 flex items-center justify-between">
                                    <span>03 · NEXT ACTION</span>
                                    <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-[#E8F5E9] text-[#10B981] font-semibold text-[9px]">
                                        READY
                                    </span>
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[14px] font-bold text-[#171717] leading-tight mb-1">
                                    Check availability
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[11.5px] text-[#666660] leading-normal">
                                    Query system schedule for open slots matching Saturday.
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* D. SYSTEM FOOTER NOTE */}
                    <div className="bg-[#F5F2EA] border-t border-[#E2DDD0] px-4 sm:px-6 py-2 flex items-center justify-between font-['IBM_Plex_Mono',monospace] text-[9.5px] text-[#777770]">
                        <div className="flex items-center gap-1.5">
                            <CornerDownRight size={11} className="text-[#D97706]" />
                            <span>OBI executes the action autonomously while continuing the natural call.</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
