"use client";

import React, { useRef, useEffect } from "react";
import { Phone, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function BookingSimulator() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const hiddenLayerRef = useRef<HTMLDivElement | null>(null);
    const mainCanvasRef = useRef<HTMLDivElement | null>(null);
    const dialogueLinesRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none",
                    once: true
                }
            });

            // 1. Editorial Header Reveal
            tl.fromTo(
                headerRef.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );

            // 2. Hidden Signal Blueprint Layer Reveal
            tl.fromTo(
                hiddenLayerRef.current,
                { opacity: 0, scale: 0.98, x: -10 },
                { opacity: 1, scale: 1, x: 0, duration: 0.55, ease: "power2.out" },
                "-=0.25"
            );

            // 3. Main Conversation Surface Reveal
            tl.fromTo(
                mainCanvasRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                "-=0.35"
            );

            // 4. Progressive Transcript Line Stagger
            const validLines = dialogueLinesRef.current.filter(Boolean);
            if (validLines.length > 0) {
                tl.fromTo(
                    validLines,
                    { opacity: 0, y: 8 },
                    { opacity: 1, y: 0, duration: 0.28, stagger: 0.08, ease: "power2.out" },
                    "-=0.2"
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section 
            id="experience"
            ref={sectionRef} 
            className="relative py-20 sm:py-24 lg:py-28 bg-[#FBF9F5] text-[#171717] overflow-hidden border-b border-[#DDDAD2]/80 selection:bg-[#E8B84A]/30 selection:text-[#171717]"
        >
            {/* SUBTLE PAPER NOTEBOOK DRAFTING GRID */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.16]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #DDDAD2 1px, transparent 1px),
                        linear-gradient(to bottom, #DDDAD2 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1240px]">
                
                {/* 1. EDITORIAL HEADLINE BLOCK */}
                <div ref={headerRef} className="max-w-[820px] mx-auto text-center mb-12 sm:mb-16">
                    <div className="font-['IBM_Plex_Mono',monospace] text-[10.5px] text-[#D97706] tracking-[0.2em] font-semibold uppercase mb-3 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84A]" /> NATURAL CONVERSATION
                    </div>

                    <h2 className="text-[2.3rem] sm:text-[2.9rem] lg:text-[3.3rem] font-['Manrope',sans-serif] font-bold tracking-[-0.035em] text-[#171717] leading-[1.1] mb-4">
                        Your customers shouldn&apos;t have to<br />
                        learn how to talk to your business.
                    </h2>

                    <p className="font-['Manrope',sans-serif] text-[15.5px] sm:text-[17px] text-[#555550] font-normal leading-[1.65] max-w-[620px] mx-auto">
                        No menus to memorize. No rigid scripts. Customers simply say what they need. OBI follows the conversation and takes care of the rest.
                    </p>
                </div>

                {/* 2. LAYERED PRODUCT ARTIFACT: MAIN CONVERSATION SURFACE WITH EXPOSED UNDERLYING TECHNICAL SIGNAL LAYER */}
                <div className="relative max-w-[960px] mx-auto">
                    
                    {/* A. PARTIALLY EXPOSED UNDERLYING TECHNICAL SIGNAL LAYER */}
                    <div 
                        ref={hiddenLayerRef}
                        className="absolute -inset-2.5 sm:-inset-4 bg-[#F2EDE2] border border-[#DDD7C8] rounded-2xl p-4 sm:p-6 select-none pointer-events-none z-0 shadow-sm flex flex-col justify-between overflow-hidden"
                        style={{
                            backgroundImage: `radial-gradient(#D2CABA 1px, transparent 1px)`,
                            backgroundSize: '16px 16px'
                        }}
                    >
                        {/* Top Technical Metadata Ribbon */}
                        <div className="flex items-center justify-between font-['IBM_Plex_Mono',monospace] text-[9px] text-[#888880] tracking-wider uppercase border-b border-[#E0D9C8] pb-1.5">
                            <div className="flex items-center gap-3">
                                <span>SIGNAL: 8kHz PCM</span>
                                <span className="text-[#C2BAA8]">•</span>
                                <span>LATENCY: 180ms</span>
                                <span className="text-[#C2BAA8]">•</span>
                                <span>CONTEXT BUFFER: RETAINED</span>
                            </div>
                            <div className="hidden sm:block text-[#666660] font-semibold">
                                CONTINUOUS INTENT RESOLUTION
                            </div>
                        </div>

                        {/* Traditional Phone-Menu Ghost (Receding & Crossed-Through Visual Trace) */}
                        <div className="my-auto py-8 max-w-[280px] opacity-[0.28]">
                            <div className="font-['IBM_Plex_Mono',monospace] text-[8.5px] tracking-widest text-[#777770] uppercase mb-1">
                                [ LEGACY IVR TREE — BYPASSED ]
                            </div>
                            <div className="space-y-1 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#777770] line-through decoration-[#999990]">
                                <div>PRESS 1 — SALES</div>
                                <div>PRESS 2 — SUPPORT</div>
                                <div>PRESS 3 — APPOINTMENTS</div>
                                <div>PRESS 9 — SPEAK TO OPERATOR</div>
                            </div>
                        </div>

                        {/* Bottom Technical Grid Telemetry */}
                        <div className="flex items-center justify-between font-['IBM_Plex_Mono',monospace] text-[8.5px] text-[#999990] tracking-wider uppercase border-t border-[#E0D9C8] pt-1.5">
                            <span>SESSION ID: #8824-LIVE</span>
                            <span>NATURAL VOICE SYNCHRONIZATION</span>
                        </div>
                    </div>

                    {/* B. ELEVATED MAIN CONVERSATION SURFACE */}
                    <div 
                        ref={mainCanvasRef}
                        className="relative z-10 bg-[#FFFDF8] border border-[#DDD9CE] rounded-xl shadow-[0_16px_45px_rgba(25,25,25,0.07)] overflow-hidden"
                    >
                        {/* Telemetry Header */}
                        <div className="bg-[#F5F2EA] border-b border-[#E2DDD0] px-4 sm:px-6 py-2.5 flex items-center justify-between font-['IBM_Plex_Mono',monospace] text-[10.5px] text-[#777770] select-none">
                            <div className="flex items-center gap-2">
                                <Phone size={12} className="text-[#10B981]" />
                                <span className="font-semibold text-[#171717]">INCOMING CALL</span>
                                <span className="text-[#C5C0B2]">/</span>
                                <span>10:42 AM</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                <span className="font-semibold text-[#171717] tracking-wider uppercase">NATURAL FLOW ACTIVE</span>
                            </div>
                        </div>

                        {/* Conversation Transcript Dialogue Body */}
                        <div className="p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-5 bg-[#FFFDF8]">
                            
                            {/* Dialogue Line 1: Caller */}
                            <div 
                                ref={(el) => { dialogueLinesRef.current[0] = el; }}
                                className="flex items-start gap-3 sm:gap-4 max-w-[620px]"
                            >
                                <div className="px-2 py-0.5 rounded bg-[#F4EFE6] border border-[#E2DDD0] font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#666660] uppercase shrink-0 mt-0.5 select-none">
                                    CALLER
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[15px] sm:text-[16px] text-[#171717] font-medium leading-relaxed">
                                    &ldquo;Hey, I was actually supposed to come in tomorrow but...&rdquo;
                                </div>
                            </div>

                            {/* Dialogue Line 2: OBI */}
                            <div 
                                ref={(el) => { dialogueLinesRef.current[1] = el; }}
                                className="flex items-start gap-3 sm:gap-4 pl-4 sm:pl-8 max-w-[620px]"
                            >
                                <div className="px-2 py-0.5 rounded bg-[#FFFBF0] border border-[#E8B84A] font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#D97706] uppercase shrink-0 mt-0.5 flex items-center gap-1 select-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84A]" />
                                    OBI
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[15px] sm:text-[16px] text-[#333330] leading-relaxed">
                                    &ldquo;Sure.&rdquo;
                                </div>
                            </div>

                            {/* Dialogue Line 3: Caller (Self-Correction & Hesitation) */}
                            <div 
                                ref={(el) => { dialogueLinesRef.current[2] = el; }}
                                className="flex items-start gap-3 sm:gap-4 max-w-[620px]"
                            >
                                <div className="px-2 py-0.5 rounded bg-[#F4EFE6] border border-[#E2DDD0] font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#666660] uppercase shrink-0 mt-0.5 select-none">
                                    CALLER
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[15px] sm:text-[16px] text-[#171717] font-medium leading-relaxed">
                                    &ldquo;Wait — sorry. Not tomorrow. Friday afternoon.&rdquo;
                                </div>
                            </div>

                            {/* Dialogue Line 4: OBI (Context Retained & Direct Slot Offer) */}
                            <div 
                                ref={(el) => { dialogueLinesRef.current[3] = el; }}
                                className="flex items-start gap-3 sm:gap-4 pl-4 sm:pl-8 max-w-[620px]"
                            >
                                <div className="px-2 py-0.5 rounded bg-[#FFFBF0] border border-[#E8B84A] font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#D97706] uppercase shrink-0 mt-0.5 flex items-center gap-1 select-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84A]" />
                                    OBI
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[15px] sm:text-[16px] text-[#333330] leading-relaxed">
                                    &ldquo;Friday afternoon works. I have 3:30 or 4:30.&rdquo;
                                </div>
                            </div>

                            {/* Dialogue Line 5: Caller */}
                            <div 
                                ref={(el) => { dialogueLinesRef.current[4] = el; }}
                                className="flex items-start gap-3 sm:gap-4 max-w-[620px]"
                            >
                                <div className="px-2 py-0.5 rounded bg-[#F4EFE6] border border-[#E2DDD0] font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#666660] uppercase shrink-0 mt-0.5 select-none">
                                    CALLER
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[15px] sm:text-[16px] text-[#171717] font-medium leading-relaxed">
                                    &ldquo;3:30.&rdquo;
                                </div>
                            </div>

                            {/* Dialogue Line 6: OBI */}
                            <div 
                                ref={(el) => { dialogueLinesRef.current[5] = el; }}
                                className="flex items-start gap-3 sm:gap-4 pl-4 sm:pl-8 max-w-[620px]"
                            >
                                <div className="px-2 py-0.5 rounded bg-[#FFFBF0] border border-[#E8B84A] font-['IBM_Plex_Mono',monospace] text-[9.5px] font-semibold text-[#D97706] uppercase shrink-0 mt-0.5 flex items-center gap-1 select-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84A]" />
                                    OBI
                                </div>
                                <div className="font-['Manrope',sans-serif] text-[15px] sm:text-[16px] text-[#333330] leading-relaxed">
                                    &ldquo;Done.&rdquo;
                                </div>
                            </div>

                        </div>

                        {/* Confirmation Bottom Footer Bar */}
                        <div className="bg-[#FAF8F3] border-t border-[#EAE6DB] px-4 sm:px-6 py-3 flex items-center justify-between font-['IBM_Plex_Mono',monospace]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                <span className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
                                    APPOINTMENT UPDATED
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] text-[#777770]">
                                <Check size={12} className="text-[#10B981]" />
                                <span>FRI, 3:30 PM LOCKED</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
