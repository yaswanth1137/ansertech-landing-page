"use client";

import { useEffect, useRef, useState } from "react";
import { 
    Calendar, 
    User, 
    HelpCircle, 
    Clock, 
    CheckCircle2, 
    Activity 
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function ValueGrid() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const centerGroupRef = useRef<HTMLDivElement | null>(null);
    const orbitRingRef = useRef<HTMLDivElement | null>(null);
    const headerBlockRef = useRef<HTMLDivElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const subtextRef = useRef<HTMLDivElement | null>(null);
    const headerNoteRef = useRef<HTMLDivElement | null>(null);
    const connectorLinesRef = useRef<SVGSVGElement | null>(null);
    const cardAppointmentsRef = useRef<HTMLDivElement | null>(null);
    const cardLeadsRef = useRef<HTMLDivElement | null>(null);
    const cardSupportRef = useRef<HTMLDivElement | null>(null);
    const cardFollowUpsRef = useRef<HTMLDivElement | null>(null);
    const footerStatementRef = useRef<HTMLDivElement | null>(null);
    const bottomCalloutRef = useRef<HTMLDivElement | null>(null);

    // Dynamic audio waveform simulation
    const [waveHeights, setWaveHeights] = useState<number[]>([
        14, 28, 48, 70, 92, 100, 84, 58, 40, 68, 92, 96, 75, 52, 34, 20,
        24, 46, 74, 92, 98, 80, 60, 84, 90, 62, 38, 16
    ]);

    // Continuous organic waveform breathing & GSAP entrance
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        // 1. Organic Waveform Oscillation Loop
        const waveInterval = setInterval(() => {
            setWaveHeights((prev) => 
                prev.map((h) => {
                    const delta = (Math.random() - 0.48) * 16;
                    return Math.max(14, Math.min(100, h + delta));
                })
            );
        }, 180);

        if (mediaQuery.matches) return () => clearInterval(waveInterval);

        const ctx = gsap.context(() => {
            // Master Entrance Timeline (Fast, subtle, non-scroll-locked choreography)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none",
                    once: true
                }
            });

            // 1. FIRST: "Meet OBI." heading appears, supporting text & note immediately after
            tl.fromTo(
                headingRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }
            );

            tl.fromTo(
                subtextRef.current,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" },
                "-=0.14"
            );

            tl.fromTo(
                headerNoteRef.current,
                { opacity: 0, y: 6 },
                { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" },
                "-=0.12"
            );

            // 2. THEN: Central OBI component appears in the center (subtle scale + fade)
            tl.fromTo(
                centerGroupRef.current,
                { opacity: 0, scale: 0.97, y: 6 },
                { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power2.out" },
                "-=0.08"
            );

            // 3. IMMEDIATELY AFTER: Surrounding task cards & connector lines appear
            tl.fromTo(
                connectorLinesRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.25, ease: "power2.out" },
                "-=0.15"
            );

            tl.fromTo(
                [cardAppointmentsRef.current, cardLeadsRef.current, cardSupportRef.current, cardFollowUpsRef.current],
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, stagger: 0.06, duration: 0.32, ease: "power2.out" },
                "-=0.2"
            );

            // 4. Footer Statements appear subtly at the end
            tl.fromTo(
                [footerStatementRef.current, bottomCalloutRef.current],
                { opacity: 0, y: 6 },
                { opacity: 1, y: 0, duration: 0.25, stagger: 0.05, ease: "power2.out" },
                "-=0.15"
            );

            // Continuous ultra-slow orbit rotation
            if (orbitRingRef.current) {
                gsap.to(orbitRingRef.current, {
                    rotation: 360,
                    duration: 90,
                    repeat: -1,
                    ease: "none"
                });
            }
        }, sectionRef);

        return () => {
            clearInterval(waveInterval);
            ctx.revert();
        };
    }, []);

    return (
        <section 
            id="features" 
            ref={sectionRef} 
            className="relative min-h-[720px] h-screen max-h-[920px] pt-4 sm:pt-5 lg:pt-6 pb-3 sm:pb-4 lg:pb-5 bg-[#FBF9F5] text-[#171717] selection:bg-[#E8B84A]/30 selection:text-[#171717] border-b border-[#DDDAD2]/80 flex flex-col justify-between overflow-hidden"
        >
            {/* SUBTLE DRAFTING NOTEBOOK GRID OVERLAY */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.15]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #DDDAD2 1px, transparent 1px),
                        linear-gradient(to bottom, #DDDAD2 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] h-full flex flex-col justify-between">

                {/* ========================================================================= */}
                {/* 2. SPATIAL "OBI DESK" CANVAS (FULL HEADROOM UTILIZATION) */}
                {/* ========================================================================= */}
                <div className="relative flex-1 w-full my-auto flex flex-col justify-between select-none min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] xl:min-h-[700px]">
                    
                    {/* SVG VECTOR CONNECTOR LINES (4 CARDINAL DIRECTIONS: NORTH, EAST, SOUTH, WEST) */}
                    <svg ref={connectorLinesRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block" xmlns="http://www.w3.org/2000/svg">
                        {/* Center to North (Appointments) */}
                        <path d="M 53% 49% L 41% 22%" stroke="#DDD9CE" strokeWidth="1.5" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
                        {/* Center to West (Leads) */}
                        <path d="M 53% 49% L 26% 44%" stroke="#DDD9CE" strokeWidth="1.5" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
                        {/* Center to East (Support) */}
                        <path d="M 53% 49% L 69% 44%" stroke="#DDD9CE" strokeWidth="1.5" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
                        {/* Center to South (Follow-Ups) */}
                        <path d="M 53% 49% L 41.5% 73%" stroke="#DDD9CE" strokeWidth="1.5" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
                    </svg>

                    {/* --------------------------------------------------------------------- */}
                    {/* TOP-LEFT HEADER: "Meet OBI." */}
                    {/* --------------------------------------------------------------------- */}
                    <div ref={headerBlockRef} className="lg:absolute lg:left-0 lg:top-0 z-20 max-w-[300px] flex flex-col items-start mb-4 lg:mb-0">
                        <h2 ref={headingRef} className="text-[2.2rem] sm:text-[2.6rem] lg:text-[2.9rem] font-['Manrope',sans-serif] font-black tracking-tight text-[#171717] leading-[1.05] mb-1.5">
                            Meet OBI.
                        </h2>

                        <div ref={subtextRef}>
                            <p className="font-['Manrope',sans-serif] text-[13px] sm:text-[13.5px] font-semibold text-[#171717] leading-snug mb-1">
                                OBI is the voice operator for your business. It listens, understands, and resolves everyday customer calls — without putting them on your team.
                            </p>

                            <p className="font-['Manrope',sans-serif] text-[12px] text-[#666661] leading-relaxed mb-2">
                                Tell it how your business works. OBI <span className="text-[#171717] font-semibold underline decoration-[#E8B84A] decoration-2 underline-offset-2">handles</span> the conversations.
                            </p>
                        </div>

                        {/* Handwritten annotation */}
                        <div ref={headerNoteRef} className="relative font-['Caveat',cursive] text-[1.15rem] text-[#171717] flex items-center gap-1.5">
                            <span>So who answers when you can&apos;t? OBI does.</span>
                            <svg className="w-7 h-5 text-[#171717] ml-1" viewBox="0 0 50 35" fill="none">
                                <path d="M5,5 C18,16 32,20 44,24 M44,24 L34,18 M44,24 L38,30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* --------------------------------------------------------------------- */}
                    {/* CENTER HUB: OBI ENGINE NODE */}
                    {/* --------------------------------------------------------------------- */}
                    <div 
                        ref={centerGroupRef} 
                        className="lg:absolute lg:top-[49%] lg:left-[53%] lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 mx-auto my-auto flex flex-col items-center justify-center"
                    >
                        {/* Orbital Radio / Radar Signal Rings */}
                        <div className="relative flex items-center justify-center">
                            
                            {/* Rotating Orbit with 4 Yellow Nodes */}
                            <div ref={orbitRingRef} className="absolute w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full border border-dashed border-[#DDD9CE] pointer-events-none">
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#E8B84A] shadow-[0_0_8px_rgba(232,184,74,0.7)]" />
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#E8B84A] shadow-[0_0_8px_rgba(232,184,74,0.7)]" />
                                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#E8B84A] shadow-[0_0_8px_rgba(232,184,74,0.7)]" />
                                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#E8B84A] shadow-[0_0_8px_rgba(232,184,74,0.7)]" />
                            </div>
                            
                            {/* Inner Faint Static Ring */}
                            <div className="absolute w-[160px] h-[160px] sm:w-[190px] sm:h-[190px] rounded-full border border-[#E5E1D5] pointer-events-none" />

                            {/* PRIMARY OBI WORDMARK (ZERO TRAILING PERIODS OR SQUARES) */}
                            <div className="relative py-2 px-6 sm:px-10 flex flex-col items-center justify-center">
                                <h1 className="text-[4.4rem] sm:text-[5.4rem] lg:text-[5.8rem] font-['Manrope',sans-serif] font-black tracking-tight text-[#171717] leading-none">
                                    OBI
                                </h1>
                                
                                <div className="font-['IBM_Plex_Mono',monospace] text-[9.5px] sm:text-[10.5px] tracking-[0.22em] font-bold text-[#666661] uppercase mt-1.5">
                                    [ <span className="text-[#171717]">OPEN BUSINESS INTELLIGENCE</span> ]
                                </div>
                            </div>

                        </div>

                        {/* LIVE ACTIVE AUDIO FREQUENCY WAVEFORM */}
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-6 w-full max-w-[220px] sm:max-w-[260px] px-4 mt-1.5 transition-opacity duration-500 opacity-90 hover:opacity-100">
                            {waveHeights.map((h, idx) => (
                                <div 
                                    key={idx}
                                    className="w-[2.5px] sm:w-[3px] bg-[#E8B84A] rounded-full transition-all duration-150"
                                    style={{
                                        height: `${h}%`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Monospace status label below waveform */}
                        <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#777770] italic mt-1 tracking-wide">
                            listening...
                        </div>

                    </div>

                    {/* --------------------------------------------------------------------- */}
                    {/* 3. 4 CARDINAL TASK CARDS (BIGGER, HANDWRITTEN QUOTES & GENEROUS SPACING) */}
                    {/* --------------------------------------------------------------------- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:block gap-4">
                        
                        {/* ----------------------------------------------------------------- */}
                        {/* CARD NORTH: (APPOINTMENTS) */}
                        {/* ----------------------------------------------------------------- */}
                        <div 
                            ref={cardAppointmentsRef}
                            className="lg:absolute lg:top-[0%] lg:left-[41%] lg:-translate-x-1/2 z-20 max-w-[280px] sm:max-w-[305px] transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="relative bg-[#FFFDF8] border border-[#DDD9CE] rounded-xs p-5 sm:p-6 shadow-[6px_10px_24px_rgba(30,30,30,0.07)] rotate-[-1deg]">
                                {/* Top Center Paper Tape */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#E8DEC8]/85 backdrop-blur-2xs -rotate-1 border-t border-b border-[#D0CCB7]" />
                                
                                <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#888882] uppercase tracking-wider font-semibold mb-2.5">
                                    <Calendar size={12} className="text-[#D97706]" /> APPOINTMENTS
                                </div>

                                <p className="font-['Caveat',cursive] text-[1.4rem] sm:text-[1.5rem] font-bold text-[#171717] leading-tight mb-4">
                                    &ldquo;I&apos;d like to book a consultation.&rdquo;
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-[#EFECE1] font-['IBM_Plex_Mono',monospace]">
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#444440]">
                                        <Clock size={11} className="text-[#888882]" /> THU, MAY 30 • 4:00 PM
                                    </div>
                                    <span className="flex items-center gap-1 text-[9.5px] font-bold text-[#4F9D69] uppercase">
                                        <CheckCircle2 size={11} className="text-[#4F9D69]" /> BOOKED
                                    </span>
                                </div>
                            </div>

                            {/* Handwritten note alongside with arrow */}
                            <div className="hidden xl:block absolute left-[103%] top-2 w-[155px] font-['Caveat',cursive] text-[1.2rem] text-[#171717]/85 leading-tight pointer-events-none">
                                <span>OBI checks availability and confirms instantly.</span>
                                <svg className="w-7 h-5 text-[#171717] mt-0.5" viewBox="0 0 35 25" fill="none">
                                    <path d="M28,5 C18,12 12,18 6,22 M6,22 L14,18 M6,22 L10,14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        {/* ----------------------------------------------------------------- */}
                        {/* CARD WEST: (LEADS) */}
                        {/* ----------------------------------------------------------------- */}
                        <div 
                            ref={cardLeadsRef}
                            className="lg:absolute lg:top-[31%] lg:left-[11%] xl:left-[13%] z-20 max-w-[285px] sm:max-w-[310px] transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="relative bg-[#FFFDF8] border border-[#DDD9CE] rounded-xs p-4 sm:p-5 shadow-[6px_10px_24px_rgba(30,30,30,0.07)] rotate-[-1.5deg]">
                                {/* Top Center Paper Tape */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#E8DEC8]/85 backdrop-blur-2xs rotate-1 border-t border-b border-[#D0CCB7]" />
                                
                                <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#888882] uppercase tracking-wider font-semibold mb-2">
                                    <User size={12} className="text-[#D97706]" /> LEADS
                                </div>

                                <p className="font-['Caveat',cursive] text-[1.4rem] sm:text-[1.5rem] font-bold text-[#171717] leading-tight mb-2.5">
                                    &ldquo;Someone is interested in your services.&rdquo;
                                </p>

                                {/* Lead Details Box */}
                                <div className="bg-[#F6F4ED] rounded-xs p-2.5 mb-2.5 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#444440] space-y-1">
                                    <div className="flex justify-between"><span className="text-[#888882]">NAME:</span> <span className="font-bold text-[#171717]">Sarah J.</span></div>
                                    <div className="flex justify-between"><span className="text-[#888882]">SERVICE:</span> <span className="font-bold text-[#171717]">Dental Checkup</span></div>
                                    <div className="flex justify-between"><span className="text-[#888882]">PHONE:</span> <span className="font-bold text-[#171717]">+91 ••••• 4821</span></div>
                                </div>

                                <div className="flex items-center gap-1 font-['IBM_Plex_Mono',monospace] text-[9.5px] font-bold text-[#4F9D69] uppercase">
                                    <CheckCircle2 size={11} className="text-[#4F9D69]" /> LEAD CAPTURED
                                </div>
                            </div>

                            {/* Handwritten note below */}
                            <div className="mt-2.5 ml-1 font-['Caveat',cursive] text-[1.25rem] text-[#171717]/85 leading-tight pointer-events-none">
                                <span>Capture every enquiry.<br /><span className="underline decoration-[#E8B84A] decoration-2 underline-offset-2 font-bold">Never miss a lead.</span></span>
                            </div>
                        </div>

                        {/* ----------------------------------------------------------------- */}
                        {/* CARD EAST: (SUPPORT) */}
                        {/* ----------------------------------------------------------------- */}
                        <div 
                            ref={cardSupportRef}
                            className="lg:absolute lg:top-[31%] lg:right-[6%] xl:right-[8%] z-20 max-w-[280px] sm:max-w-[305px] transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="relative bg-[#FFFDF8] border border-[#DDD9CE] rounded-xs p-4 sm:p-5 shadow-[6px_10px_24px_rgba(30,30,30,0.07)] rotate-[1.8deg]">
                                {/* Top Center Paper Tape */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#E8DEC8]/85 backdrop-blur-2xs -rotate-2 border-t border-b border-[#D0CCB7]" />
                                
                                <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#888882] uppercase tracking-wider font-semibold mb-2">
                                    <HelpCircle size={12} className="text-[#8067A8]" /> SUPPORT
                                </div>

                                <p className="font-['Caveat',cursive] text-[1.4rem] sm:text-[1.5rem] font-bold text-[#171717] leading-tight mb-2.5">
                                    &ldquo;Do you provide emergency appointments?&rdquo;
                                </p>

                                {/* Support Response Box */}
                                <div className="bg-[#F6F4ED] rounded-xs p-2.5 mb-2.5 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#444440] leading-relaxed">
                                    Yes, we do. Same-day slots are available. Would you like me to help you with that?
                                </div>

                                <div className="flex items-center gap-1 font-['IBM_Plex_Mono',monospace] text-[9.5px] font-bold text-[#4F9D69] uppercase">
                                    <CheckCircle2 size={11} className="text-[#4F9D69]" /> ANSWERED
                                </div>
                            </div>

                            {/* Handwritten note alongside */}
                            <div className="hidden xl:block absolute left-[103%] top-2 w-[145px] font-['Caveat',cursive] text-[1.2rem] text-[#171717]/85 leading-tight pointer-events-none">
                                <span>Answer customer questions.<br /><span className="underline decoration-[#E8B84A] decoration-2 underline-offset-2 font-bold">Automatically.</span></span>
                            </div>
                        </div>

                        {/* ----------------------------------------------------------------- */}
                        {/* CARD SOUTH: (FOLLOW-UPS) - MOVED LEFT 1.5% */}
                        {/* ----------------------------------------------------------------- */}
                        <div 
                            ref={cardFollowUpsRef}
                            className="lg:absolute lg:bottom-[3%] lg:left-[41.5%] lg:-translate-x-1/2 z-20 max-w-[280px] sm:max-w-[305px] transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="relative bg-[#FFFDF8] border border-[#DDD9CE] rounded-xs p-4 sm:p-5 shadow-[6px_10px_24px_rgba(30,30,30,0.07)] rotate-[-1deg]">
                                {/* Top Center Paper Tape */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#E8DEC8]/85 backdrop-blur-2xs rotate-1 border-t border-b border-[#D0CCB7]" />
                                
                                <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#888882] uppercase tracking-wider font-semibold mb-2">
                                    <Clock size={12} className="text-[#D97706]" /> FOLLOW-UPS
                                </div>

                                <p className="font-['Caveat',cursive] text-[1.4rem] sm:text-[1.5rem] font-bold text-[#171717] leading-tight mb-2.5">
                                    &ldquo;Please call me back tomorrow morning.&rdquo;
                                </p>

                                {/* Follow-up Details */}
                                <div className="bg-[#F6F4ED] rounded-xs p-2.5 mb-2.5 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#444440] flex items-center gap-1.5">
                                    <Clock size={10.5} className="text-[#888882]" /> TOMORROW • 10:00 AM
                                </div>

                                <div className="flex items-center gap-1 font-['IBM_Plex_Mono',monospace] text-[9.5px] font-bold text-[#4F9D69] uppercase">
                                    <CheckCircle2 size={11} className="text-[#4F9D69]" /> FOLLOW-UP SCHEDULED
                                </div>
                            </div>

                            {/* Handwritten note alongside with arrow */}
                            <div className="hidden xl:block absolute left-[103%] top-1 w-[155px] font-['Caveat',cursive] text-[1.2rem] text-[#171717]/85 leading-tight pointer-events-none">
                                <span>Keep conversations moving. OBI follows through.</span>
                                <svg className="w-7 h-5 text-[#171717] mt-0.5" viewBox="0 0 35 25" fill="none">
                                    <path d="M28,5 C18,12 12,18 6,22 M6,22 L14,18 M6,22 L10,14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                    </div>

                    {/* --------------------------------------------------------------------- */}
                    {/* 4. FOOTER STATEMENTS */}
                    {/* --------------------------------------------------------------------- */}
                    {/* Bottom-Left Statement */}
                    <div ref={footerStatementRef} className="lg:absolute lg:bottom-1 lg:left-0 z-20 select-none mt-4 lg:mt-0">
                        <div className="border-l-2 border-[#DDD9CE] pl-2.5 py-0.5 font-['IBM_Plex_Mono',monospace] text-[10.5px] sm:text-[11px] font-bold text-[#171717] uppercase tracking-[0.14em]">
                            [ WORK LESS. NEVER MISS OUT. ]
                        </div>
                    </div>

                    {/* Bottom-Right Handwritten Callout */}
                    <div ref={bottomCalloutRef} className="lg:absolute lg:bottom-1 lg:right-0 z-20 select-none mt-2 lg:mt-0 font-['Caveat',cursive] text-[1.35rem] sm:text-[1.45rem] text-[#171717]">
                        <span>One OBI. <span className="underline decoration-[#E8B84A] decoration-2 underline-offset-2 font-bold">Many conversations.</span></span>
                    </div>

                </div>

            </div>
        </section>
    );
}
