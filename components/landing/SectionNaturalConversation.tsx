"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import { Phone, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import state1Img from "./assets/state_1.png";
import state2Img from "./assets/state_2.png";
import state3Img from "./assets/state_3.png";
import paperEarlierImg from "./assets/blue_paper_clean.png";
import paperCurrentImg from "./assets/yellow_paper_clean.png";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ImageState {
    id: number;
    image: StaticImageData;
    alt: string;
}

const IMAGE_STATES: ImageState[] = [
    { id: 1, image: state1Img, alt: "Caller speaking naturally about that order" },
    { id: 2, image: state2Img, alt: "Caller clarifying thought to the other one" },
    { id: 3, image: state3Img, alt: "Caller satisfied and saying perfect" }
];

function State2PictorialVisual({ isActive }: { isActive: boolean }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Paper refs
    const bluePaperRef = useRef<HTMLDivElement | null>(null);
    const blueAnchorRef = useRef<HTMLSpanElement | null>(null);
    const lastWeekCardRef = useRef<HTMLDivElement | null>(null);
    const lastWeekAnchorRef = useRef<HTMLSpanElement | null>(null);
    const thirdCardRef = useRef<HTMLDivElement | null>(null);
    const thirdCardAnchorRef = useRef<HTMLSpanElement | null>(null);
    const yellowPaperRef = useRef<HTMLDivElement | null>(null);
    const yellowAnchorRef = useRef<HTMLSpanElement | null>(null);
    const yellowBottomAnchorRef = useRef<HTMLSpanElement | null>(null);
    const highlightRef = useRef<HTMLSpanElement | null>(null);

    // Connection & Coded Card refs
    const centerPointRef = useRef<SVGGElement | null>(null);
    const line1Ref = useRef<SVGPathElement | null>(null);
    const line2Ref = useRef<SVGPathElement | null>(null);
    const line3Ref = useRef<SVGPathElement | null>(null);
    const lineMainRef = useRef<SVGPathElement | null>(null);
    const arrowRef = useRef<SVGPolygonElement | null>(null);
    const lineDropRef = useRef<SVGPathElement | null>(null);
    const arrowDropRef = useRef<SVGPolygonElement | null>(null);
    const codedCardTopAnchorRef = useRef<HTMLSpanElement | null>(null);
    const understoodRef = useRef<HTMLDivElement | null>(null);

    // Dynamic paths & positions
    const [paths, setPaths] = useState<{
        line1D: string;
        line2D: string;
        line3D: string;
        mainD: string;
        dropD: string;
        center: { x: number; y: number };
        arrowPoint: { x: number; y: number };
        arrowDropPoint: { x: number; y: number };
    }>({
        line1D: "M 265 95 C 340 95, 360 250, 420 250",
        line2D: "M 265 250 C 330 250, 360 250, 420 250",
        line3D: "M 265 410 C 340 410, 360 250, 420 250",
        mainD: "M 420 250 C 480 250, 500 150, 540 150",
        dropD: "M 660 260 L 660 305",
        center: { x: 420, y: 250 },
        arrowPoint: { x: 540, y: 150 },
        arrowDropPoint: { x: 660, y: 305 },
    });

    const updatePaths = useCallback(() => {
        if (!containerRef.current) return;
        const cRect = containerRef.current.getBoundingClientRect();

        const getAnchor = (ref: React.RefObject<HTMLSpanElement | null>, defX: number, defY: number) => {
            if (!ref.current) return { x: defX, y: defY };
            const r = ref.current.getBoundingClientRect();
            return {
                x: r.left + r.width / 2 - cRect.left,
                y: r.top + r.height / 2 - cRect.top,
            };
        };

        const a1 = getAnchor(thirdCardAnchorRef, 245, 90);
        const a2 = getAnchor(lastWeekAnchorRef, 245, 240);
        const a3 = getAnchor(blueAnchorRef, 245, 390);
        const aYellow = getAnchor(yellowAnchorRef, 540, 240);
        const aYellowBottom = getAnchor(yellowBottomAnchorRef, 660, 340);
        const aCodedTop = getAnchor(codedCardTopAnchorRef, 660, 390);

        // Central relationship point placed midway horizontally, vertically level with middle card (a2.y)
        const maxX = Math.max(a1.x, a2.x, a3.x);
        const gap = aYellow.x - maxX;
        const cx = gap > 60 ? maxX + gap * 0.48 : maxX + 40;
        const cy = a2.y;

        // Converge 3 curves from the left into a clean junction just left of the central dot
        const junctionX = cx - 10;
        const run1 = junctionX - a1.x;
        const l1D = `M ${a1.x.toFixed(1)} ${a1.y.toFixed(1)} C ${(a1.x + run1 * 0.48).toFixed(1)} ${a1.y.toFixed(1)}, ${(junctionX - run1 * 0.38).toFixed(1)} ${cy.toFixed(1)}, ${junctionX.toFixed(1)} ${cy.toFixed(1)}`;

        const run2 = junctionX - a2.x;
        const l2D = `M ${a2.x.toFixed(1)} ${a2.y.toFixed(1)} C ${(a2.x + run2 * 0.48).toFixed(1)} ${a2.y.toFixed(1)}, ${(junctionX - run2 * 0.38).toFixed(1)} ${cy.toFixed(1)}, ${junctionX.toFixed(1)} ${cy.toFixed(1)}`;

        const run3 = junctionX - a3.x;
        const l3D = `M ${a3.x.toFixed(1)} ${a3.y.toFixed(1)} C ${(a3.x + run3 * 0.48).toFixed(1)} ${a3.y.toFixed(1)}, ${(junctionX - run3 * 0.38).toFixed(1)} ${cy.toFixed(1)}, ${junctionX.toFixed(1)} ${cy.toFixed(1)}`;

        // Main line: graceful smooth curve from right of the dot into yellow paper left edge
        const startMainX = cx + 10;
        const targetX = Math.max(startMainX + 15, aYellow.x - 3);
        const run4 = targetX - startMainX;
        const mainD = `M ${startMainX.toFixed(1)} ${cy.toFixed(1)} C ${(startMainX + run4 * 0.45).toFixed(1)} ${cy.toFixed(1)}, ${(targetX - run4 * 0.45).toFixed(1)} ${aYellow.y.toFixed(1)}, ${targetX.toFixed(1)} ${aYellow.y.toFixed(1)}`;

        // Vertical line: straight down from yellow paper bottom directly toward OBI UNDERSTANDS card
        const targetDropY = aCodedTop.y - 7;
        const dropD = `M ${aYellowBottom.x.toFixed(1)} ${aYellowBottom.y.toFixed(1)} L ${aYellowBottom.x.toFixed(1)} ${targetDropY.toFixed(1)}`;

        setPaths({
            line1D: l1D,
            line2D: l2D,
            line3D: l3D,
            mainD,
            dropD,
            center: { x: cx, y: cy },
            arrowPoint: { x: targetX, y: aYellow.y },
            arrowDropPoint: { x: aYellowBottom.x, y: targetDropY + 1 },
        });
    }, []);

    useEffect(() => {
        updatePaths();
        const raf = requestAnimationFrame(updatePaths);
        window.addEventListener("resize", updatePaths);

        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined" && containerRef.current) {
            ro = new ResizeObserver(() => {
                updatePaths();
            });
            ro.observe(containerRef.current);
            if (yellowPaperRef.current) ro.observe(yellowPaperRef.current);
            if (bluePaperRef.current) ro.observe(bluePaperRef.current);
            if (lastWeekCardRef.current) ro.observe(lastWeekCardRef.current);
            if (thirdCardRef.current) ro.observe(thirdCardRef.current);
            if (understoodRef.current) ro.observe(understoodRef.current);
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", updatePaths);
            if (ro) ro.disconnect();
        };
    }, [updatePaths]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (mediaQuery.matches) {
            gsap.set([centerPointRef.current, arrowRef.current, arrowDropRef.current, understoodRef.current], {
                opacity: 1,
                scale: 1,
                y: 0,
            });
            [line1Ref.current, line2Ref.current, line3Ref.current, lineMainRef.current, lineDropRef.current].forEach(line => {
                if (line) gsap.set(line, { strokeDashoffset: 0 });
            });
            if (highlightRef.current) {
                gsap.set(highlightRef.current, { backgroundColor: "rgba(253, 224, 71, 0.9)" });
            }
            return;
        }

        const tl = gsap.timeline({ paused: true });

        [line1Ref.current, line2Ref.current, line3Ref.current, lineMainRef.current, lineDropRef.current].forEach(line => {
            if (line) {
                const len = line.getTotalLength ? line.getTotalLength() : 260;
                gsap.set(line, {
                    strokeDasharray: len,
                    strokeDashoffset: len,
                });
            }
        });

        gsap.set(centerPointRef.current, { scale: 0, opacity: 0 });
        gsap.set([arrowRef.current, arrowDropRef.current], { opacity: 0 });
        gsap.set(understoodRef.current, { opacity: 0, y: 10 });
        if (highlightRef.current) {
            gsap.set(highlightRef.current, { backgroundColor: "transparent" });
        }

        if (isActive) {
            tl.to(
                [line1Ref.current, line2Ref.current, line3Ref.current],
                {
                    strokeDashoffset: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: "power2.out",
                }
            )
                .to(centerPointRef.current, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.35,
                    ease: "back.out(2.2)",
                }, "-=0.25")
                .to(lineMainRef.current, {
                    strokeDashoffset: 0,
                    duration: 0.6,
                    ease: "power2.out",
                }, "-=0.1")
                .to(arrowRef.current, {
                    opacity: 1,
                    duration: 0.15,
                }, "-=0.1")
                .to(highlightRef.current, {
                    backgroundColor: "rgba(253, 224, 71, 0.9)",
                    duration: 0.45,
                    ease: "power1.inOut",
                })
                .to(lineDropRef.current, {
                    strokeDashoffset: 0,
                    duration: 0.4,
                    ease: "power1.out",
                }, "-=0.1")
                .to(arrowDropRef.current, {
                    opacity: 1,
                    duration: 0.15,
                }, "-=0.1")
                .fromTo(understoodRef.current,
                    { opacity: 0, y: 8 },
                    { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
                    "-=0.1"
                );
            tl.play();
        }
    }, [isActive, paths]);

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-none select-none py-2 font-['Manrope',sans-serif]"
        >
            {/* SVG Connection Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
                <defs>
                    <radialGradient id="centerAuraGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#E8B84A" stopOpacity="0.35" />
                        <stop offset="45%" stopColor="#E8B84A" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#E8B84A" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Line 1: from top yellow paper ("that order") to center */}
                {paths.line1D && (
                    <path
                        ref={line1Ref}
                        d={paths.line1D}
                        fill="none"
                        stroke="#E8B84A"
                        strokeOpacity="0.65"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                    />
                )}

                {/* Line 2: from middle blue paper ("the one we discussed") to center */}
                {paths.line2D && (
                    <path
                        ref={line2Ref}
                        d={paths.line2D}
                        fill="none"
                        stroke="#0E7490"
                        strokeOpacity="0.5"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                    />
                )}

                {/* Line 3: from bottom blue paper ("last week") to center */}
                {paths.line3D && (
                    <path
                        ref={line3Ref}
                        d={paths.line3D}
                        fill="none"
                        stroke="#0E7490"
                        strokeOpacity="0.42"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                    />
                )}

                {/* Central Relationship Point with soft glowing radial field */}
                <g ref={centerPointRef} style={{ transformOrigin: `${paths.center.x}px ${paths.center.y}px` }}>
                    {/* Soft radiating aura */}
                    <circle
                        cx={paths.center.x}
                        cy={paths.center.y}
                        r="38"
                        fill="url(#centerAuraGlow)"
                    />
                    {/* Faint concentric ring 2 */}
                    <circle
                        cx={paths.center.x}
                        cy={paths.center.y}
                        r="16"
                        fill="none"
                        stroke="#E8B84A"
                        strokeWidth="0.75"
                        strokeOpacity="0.25"
                        strokeDasharray="3 3"
                    />
                    {/* Faint concentric ring 1 */}
                    <circle
                        cx={paths.center.x}
                        cy={paths.center.y}
                        r="9"
                        fill="none"
                        stroke="#E8B84A"
                        strokeWidth="0.85"
                        strokeOpacity="0.4"
                    />
                    {/* Tiny warm-yellow dot */}
                    <circle
                        cx={paths.center.x}
                        cy={paths.center.y}
                        r="3.5"
                        fill="#E8B84A"
                    />
                </g>

                {/* Main Connection Line: from center to yellow paper */}
                {paths.mainD && (
                    <path
                        ref={lineMainRef}
                        d={paths.mainD}
                        fill="none"
                        stroke="#E8B84A"
                        strokeWidth="1.45"
                        strokeLinecap="round"
                    />
                )}

                {/* Arrowhead at yellow paper left edge */}
                <polygon
                    ref={arrowRef}
                    points={`${paths.arrowPoint.x},${paths.arrowPoint.y} ${paths.arrowPoint.x - 5},${paths.arrowPoint.y - 3} ${paths.arrowPoint.x - 5},${paths.arrowPoint.y + 3}`}
                    fill="#E8B84A"
                />

                {/* Vertical Dashed Line from yellow paper down to OBI UNDERSTANDS */}
                {paths.dropD && (
                    <path
                        ref={lineDropRef}
                        d={paths.dropD}
                        fill="none"
                        stroke="#C4BCAC"
                        strokeWidth="1.2"
                        strokeDasharray="2.5 2.5"
                    />
                )}

                {/* Arrowhead pointing down to coded card */}
                {paths.arrowDropPoint && (
                    <polygon
                        ref={arrowDropRef}
                        points={`${paths.arrowDropPoint.x},${paths.arrowDropPoint.y} ${paths.arrowDropPoint.x - 3.5},${paths.arrowDropPoint.y - 5} ${paths.arrowDropPoint.x + 3.5},${paths.arrowDropPoint.y - 5}`}
                        fill="#8C857B"
                    />
                )}
            </svg>

            <div className="relative w-full min-h-[580px] sm:min-h-[560px] flex flex-col sm:block">

                {/* LEFT COLUMN: Earlier in the conversation - Perfectly fitted paper cards */}
                <div className="relative sm:absolute sm:top-0 sm:left-0 z-10 w-[205px] sm:w-[218px] md:w-[228px] flex flex-col gap-3.5 sm:gap-4">
                    <span className="font-['IBM_Plex_Mono',monospace] text-[10.5px] text-[#78716C] font-bold tracking-widest uppercase">
                        EARLIER IN THE CONVERSATION
                    </span>

                    {/* 1. TOP TORN PAPER (Yellow contextual paper - 10:42 AM "that order") */}
                    <div
                        ref={thirdCardRef}
                        className="relative w-full aspect-[191/131] overflow-visible drop-shadow-[0_8px_20px_rgba(35,25,12,0.08)]"
                    >
                        <Image
                            src={paperCurrentImg}
                            alt="Earlier conversational context: that order"
                            fill
                            sizes="(max-width: 640px) 205px, 228px"
                            className="object-contain pointer-events-none select-none"
                            priority
                            onLoad={updatePaths}
                        />

                        {/* Live HTML overlay - bold, perfectly fitted, filling the card edge-to-edge */}
                        <div className="absolute inset-0 flex flex-col justify-center h-full pl-7 pr-3.5 py-3">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] sm:text-[10.5px] text-[#78716C] font-semibold tracking-wider leading-none mb-1.5">
                                10:42 AM
                            </span>
                            <p className="font-['Manrope',sans-serif] text-[17px] sm:text-[18px] md:text-[19px] text-[#171717] font-bold leading-[1.26] tracking-tight">
                                I was calling<br />
                                about <span className="text-[#D97706] font-extrabold">that order.</span>
                            </p>
                            <div className="w-10 sm:w-12 h-[2.5px] rounded-full bg-[#D97706] mt-2" />
                        </div>

                        {/* Invisible DOM anchor on right edge for connection line */}
                        <span ref={thirdCardAnchorRef} className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none opacity-0" />
                    </div>

                    {/* 2. MIDDLE BLUE TORN PAPER: "the one we discussed" */}
                    <div
                        ref={lastWeekCardRef}
                        className="relative w-full aspect-[191/131] overflow-visible drop-shadow-[0_8px_20px_rgba(35,25,12,0.08)]"
                    >
                        <Image
                            src={paperEarlierImg}
                            alt="Earlier conversational context: the one we discussed"
                            fill
                            sizes="(max-width: 640px) 205px, 228px"
                            className="object-contain pointer-events-none select-none"
                            priority
                            onLoad={updatePaths}
                        />

                        {/* Live HTML overlay - bold, perfectly fitted, filling the card edge-to-edge */}
                        <div className="absolute inset-0 flex flex-col justify-center h-full pl-7 pr-3.5 py-3">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] sm:text-[10.5px] text-[#78716C] font-semibold tracking-wider leading-none mb-1.5">
                                10:43 AM
                            </span>
                            <p className="font-['Manrope',sans-serif] text-[17px] sm:text-[18px] md:text-[19px] text-[#171717] font-bold leading-[1.26] tracking-tight">
                                Yeah, <span className="text-[#0E7490] font-extrabold">the one</span><br />
                                <span className="text-[#0E7490] font-extrabold">we discussed.</span>
                            </p>
                            <div className="w-10 sm:w-12 h-[2.5px] rounded-full bg-[#0E7490] mt-2" />
                        </div>

                        {/* Invisible DOM anchor on right edge for connection line */}
                        <span ref={lastWeekAnchorRef} className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none opacity-0" />
                    </div>

                    {/* 3. BOTTOM BLUE TORN PAPER: "last week" */}
                    <div
                        ref={bluePaperRef}
                        className="relative w-full aspect-[191/131] overflow-visible drop-shadow-[0_8px_20px_rgba(35,25,12,0.08)]"
                    >
                        <Image
                            src={paperEarlierImg}
                            alt="Earlier conversational context: last week"
                            fill
                            sizes="(max-width: 640px) 205px, 228px"
                            className="object-contain pointer-events-none select-none"
                            priority
                            onLoad={updatePaths}
                        />

                        {/* Live HTML overlay - bold, perfectly fitted, filling the card edge-to-edge */}
                        <div className="absolute inset-0 flex flex-col justify-center h-full pl-7 pr-3.5 py-3">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] sm:text-[10.5px] text-[#78716C] font-semibold tracking-wider leading-none mb-1.5">
                                10:43 AM
                            </span>
                            <p className="font-['Manrope',sans-serif] text-[17px] sm:text-[18px] md:text-[19px] text-[#171717] font-bold leading-[1.26] tracking-tight">
                                It was placed<br />
                                <span className="text-[#0E7490] font-extrabold">last week.</span>
                            </p>
                            <div className="w-10 sm:w-12 h-[2.5px] rounded-full bg-[#0E7490] mt-2" />
                        </div>

                        {/* Invisible DOM anchor on right edge for connection line */}
                        <span ref={blueAnchorRef} className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none opacity-0" />
                    </div>
                </div>

                {/* RIGHT COLUMN: Balanced commanding presence matching concept reference */}
                <div className="relative sm:absolute sm:top-10 md:top-12 sm:right-0 mt-8 sm:mt-0 z-10 w-[285px] sm:w-[305px] md:w-[320px] flex flex-col">
                    <span className="font-['IBM_Plex_Mono',monospace] text-[10.5px] text-[#78716C] font-bold tracking-widest uppercase mb-2">
                        CURRENT REFERENCE
                    </span>

                    {/* Yellow Torn Paper (Bold, commanding headline, perfectly occupying paper area) */}
                    <div
                        ref={yellowPaperRef}
                        className="relative w-full aspect-[289/228] overflow-visible drop-shadow-[0_12px_28px_rgba(35,25,12,0.10)]"
                    >
                        {/* Anchor on left edge level with center dot */}
                        <span ref={yellowAnchorRef} className="absolute left-0 top-[58%] -translate-y-1/2 w-0 h-0 pointer-events-none opacity-0" />

                        <Image
                            src={paperCurrentImg}
                            alt="Current clarification"
                            fill
                            sizes="(max-width: 640px) 285px, 320px"
                            className="object-contain pointer-events-none select-none"
                            priority
                            onLoad={updatePaths}
                        />

                        {/* Live HTML overlay - perfectly centered & fitted, filling paper area with authority */}
                        <div className="absolute inset-0 pt-4 pb-5 pl-8 sm:pl-9 pr-6 flex flex-col justify-center">
                            <span className="font-serif text-[#D97706] text-[26px] sm:text-[28px] font-bold leading-none select-none mb-1 block">
                                &ldquo;
                            </span>
                            <p className="font-['Manrope',sans-serif] text-[23px] sm:text-[25px] md:text-[27px] text-[#171717] font-bold leading-[1.20] tracking-tight">
                                Wait, sorry &mdash;<br />
                                I mean<br />
                                <span
                                    ref={highlightRef}
                                    className="bg-[#FDE047]/90 text-[#111827] font-extrabold px-3 py-0.5 rounded-[3px] shadow-xs inline-block mt-1.5 transition-colors duration-200"
                                >
                                    the other one.
                                </span>
                            </p>
                        </div>

                        {/* Anchor at bottom edge for vertical line to OBI UNDERSTANDS */}
                        <span ref={yellowBottomAnchorRef} className="absolute left-1/2 bottom-0 -translate-x-1/2 w-0 h-0 pointer-events-none opacity-0" />
                    </div>

                    {/* Gap for vertical dashed drop line */}
                    <div className="h-7 sm:h-9" />

                    {/* Anchor & Header for OBI UNDERSTANDS */}
                    <span
                        ref={codedCardTopAnchorRef}
                        className="font-['IBM_Plex_Mono',monospace] text-[10.5px] text-[#78716C] font-bold tracking-widest uppercase mb-2 block"
                    >
                        OBI UNDERSTANDS
                    </span>

                    {/* Coded Card (Matching concept reference, clean human typography, no AI tropes) */}
                    <div
                        ref={understoodRef}
                        className="w-full bg-[#FFFFFF]/95 sm:bg-[#FAF8F5]/95 border border-[#E0DBD0] rounded-2xl p-4.5 sm:p-5 shadow-[0_10px_28px_rgba(25,20,10,0.06)] backdrop-blur-xs select-none flex flex-col justify-between"
                    >
                        <div className="flex items-start gap-3.5 sm:gap-4">
                            {/* Clean Subtle Plus/Context Badge matching reference */}
                            <div className="w-10 h-10 rounded-full bg-[#EBF7F5] border border-[#A2D9CE] flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-[#0E7490]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </div>

                            {/* Body explanation */}
                            <p className="font-['Manrope',sans-serif] text-[14.5px] sm:text-[15px] md:text-[15.5px] text-[#292524] leading-[1.4] font-normal">
                                <strong className="font-bold text-[#0E7490]">The other one</strong> refers to the most recent order in this conversation.
                            </p>
                        </div>

                        {/* Centered context retained footer */}
                        <div className="mt-3.5 pt-3 border-t border-[#EAE6DE] flex items-center justify-center">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] sm:text-[10.5px] font-semibold tracking-[0.18em] text-[#0D9488] uppercase">
                                CONTEXT RETAINED
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export function SectionNaturalConversation() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const leftColRef = useRef<HTMLDivElement | null>(null);
    const imageCardRef = useRef<HTMLDivElement | null>(null);
    const rightColRef = useRef<HTMLDivElement | null>(null);
    const [activeState, setActiveState] = useState<number>(1);
    const stateRefs = useRef<(HTMLDivElement | null)[]>([]);
    const finalLineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(min-width: 1024px)", () => {
                if (leftColRef.current && finalLineRef.current) {
                    ScrollTrigger.create({
                        trigger: leftColRef.current,
                        endTrigger: finalLineRef.current,
                        pin: leftColRef.current,
                        start: "top top+=140",
                        end: () => `bottom top+=${140 + (leftColRef.current ? Math.round(leftColRef.current.offsetHeight * 1.1) : 440)}`,
                        pinSpacing: false,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    });
                }
            });

            // Synchronize each conversation state with the active visual image
            stateRefs.current.forEach((stateEl, idx) => {
                if (!stateEl) return;

                ScrollTrigger.create({
                    trigger: stateEl,
                    start: "top center+=50",
                    end: "bottom center+=50",
                    onEnter: () => setActiveState(idx + 1),
                    onEnterBack: () => setActiveState(idx + 1),
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="conversation"
            ref={sectionRef}
            className="relative pt-10 sm:pt-14 lg:pt-16 pb-28 sm:pb-36 lg:pb-44 bg-[#FBF9F5] text-[#171717] border-b border-[#DDDAD2]/80 selection:bg-[#E8B84A]/30 selection:text-[#171717] overflow-hidden"
        >
            {/* SUBTLE PAPER NOTEBOOK DRAFTING GRID */}
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

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1240px]">

                {/* ------------------------------------------------------------- */}
                {/* 1. DOMINANT HERO HEADLINE (ALIGNED WITH RIGHT CONTENT COLUMN)  */}
                {/* ------------------------------------------------------------- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 xl:gap-20 mb-8 sm:mb-10 lg:mb-12">
                    <div className="hidden lg:block lg:col-span-5 xl:col-span-4" />

                    <div className="lg:col-span-7 xl:col-span-8 pl-0 lg:pl-4 xl:pl-8">
                        <h2 className="text-[3.6rem] sm:text-[4.6rem] lg:text-[5.4rem] xl:text-[6.2rem] font-['Manrope',sans-serif] font-bold tracking-[-0.045em] text-[#171717] leading-[0.95] mb-4">
                            JUST TALK.
                        </h2>

                        <p className="font-['Manrope',sans-serif] text-[19px] sm:text-[22px] text-[#555550] font-semibold leading-snug mb-3">
                            OBI handles the rest.
                        </p>

                        <p className="font-['Manrope',sans-serif] text-[15.5px] sm:text-[17px] text-[#666660] leading-relaxed max-w-[540px]">
                            People don&apos;t call businesses with perfectly structured requests. They just start talking.
                        </p>
                    </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 2. CONVERSATION ROW (LEFT: GIRL CARD, RIGHT: 3-STATE FLOW)    */}
                {/* ------------------------------------------------------------- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 xl:gap-20 items-start relative">

                    {/* LEFT COLUMN: STICKY PIXEL-ART VISUAL (ORIGINAL MIDDLE POSITION) */}
                    <div
                        ref={leftColRef}
                        className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-start self-start select-none will-change-transform z-10"
                    >
                        <div
                            ref={imageCardRef}
                            className="relative w-[270px] sm:w-[290px] lg:w-[300px] xl:w-[320px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(25,25,25,0.06)] border border-black/5 bg-[#F4EFE6]"
                        >
                            {IMAGE_STATES.map((st) => {
                                const isActive = activeState === st.id;

                                return (
                                    <div
                                        key={st.id}
                                        className={`absolute inset-0 w-full h-full transition-all duration-200 flex items-center justify-center ${isActive
                                            ? "opacity-100 translate-y-0 pointer-events-auto"
                                            : "opacity-0 translate-y-1 pointer-events-none"
                                            }`}
                                    >
                                        <Image
                                            src={st.image}
                                            alt={st.alt}
                                            priority={st.id === 1}
                                            className="w-full h-full object-contain rounded-2xl"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: 3-STATE PROGRESSIVE VOICE CONVERSATION STREAM */}
                    <div
                        ref={rightColRef}
                        className="lg:col-span-7 xl:col-span-8 flex flex-col justify-start pl-0 lg:pl-4 xl:pl-8"
                    >

                        <div className="space-y-32 sm:space-y-40 lg:space-y-48 pb-16 font-['Manrope',sans-serif]">

                            {/* ========================================================= */}
                            {/* STATE 1: CALLER SPEAKS → AUDIO WAVEFORM → OBI RESPONDS     */}
                            {/* ========================================================= */}
                            <div
                                ref={(el) => { stateRefs.current[0] = el; }}
                                className={`transition-opacity duration-300 max-w-[580px] space-y-8 sm:space-y-9 ${activeState === 1 ? "opacity-100" : "opacity-40"
                                    }`}
                            >
                                {/* CALLER STATEMENT (YELLOW ACCENT LINE) */}
                                <div className="border-l-2 border-[#E8B84A] pl-5 sm:pl-6">
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[10px] font-bold text-[#777770] uppercase tracking-wider mb-1.5">
                                        CALLER
                                    </div>
                                    <div className="text-[1.9rem] sm:text-[2.3rem] lg:text-[2.6rem] font-bold text-[#171717] tracking-tight leading-[1.18]">
                                        &ldquo;Hey, I was calling<br className="hidden sm:inline" /> about that order.&rdquo;
                                    </div>
                                </div>

                                {/* SUBTLE LIVE AUDIO WAVEFORM TRACK */}
                                <div className="py-2 flex items-center gap-3 select-none">
                                    <div
                                        className="flex-1 h-px opacity-40 max-w-[120px]"
                                        style={{
                                            backgroundImage: `radial-gradient(#888882 1px, transparent 1px)`,
                                            backgroundSize: '6px 6px'
                                        }}
                                    />
                                    <div className="flex items-center gap-1 h-4 px-2">
                                        {[14, 28, 48, 76, 92, 64, 40, 68, 88, 52, 24, 16].map((h, i) => (
                                            <div
                                                key={i}
                                                className="w-[2px] bg-[#888882]/70 rounded-full transition-all duration-300"
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                    <div
                                        className="flex-1 h-px opacity-40 max-w-[120px]"
                                        style={{
                                            backgroundImage: `radial-gradient(#888882 1px, transparent 1px)`,
                                            backgroundSize: '6px 6px'
                                        }}
                                    />
                                    <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#888882] uppercase tracking-widest flex items-center gap-1">
                                        LIVE VOICE <span className="text-[#E8B84A] font-bold">●</span>
                                    </span>
                                </div>

                                {/* OBI RESPONSE STATEMENT (CYAN ACCENT LINE) */}
                                <div className="border-l-2 border-[#06B6D4] pl-5 sm:pl-6">
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[10px] font-bold text-[#777770] uppercase tracking-wider mb-1.5">
                                        OBI
                                    </div>
                                    <div className="text-[1.9rem] sm:text-[2.3rem] lg:text-[2.6rem] font-semibold text-[#171717] tracking-tight leading-[1.18]">
                                        &ldquo;Sure — what can<br className="hidden sm:inline" /> I help you with?&rdquo;
                                    </div>
                                </div>

                                {/* TELEMETRY FOOTER */}
                                <div className="pt-2 flex items-center gap-2 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#777770] uppercase tracking-wider">
                                    <Phone size={12} className="text-[#06B6D4]" />
                                    <span>INCOMING CALL</span>
                                </div>
                            </div>

                            {/* ========================================================= */}
                            {/* STATE 2: VISUAL CONTEXT / MEMORY (PICTORIAL)              */}
                            {/* ========================================================= */}
                            <div
                                ref={(el) => { stateRefs.current[1] = el; }}
                                className={`transition-opacity duration-300 w-full max-w-none ${activeState === 2 ? "opacity-100" : "opacity-40"
                                    }`}
                            >
                                <State2PictorialVisual isActive={activeState === 2} />
                            </div>

                            {/* ========================================================= */}
                            {/* STATE 3: RESOLUTION & "PERFECT." MOMENT                   */}
                            {/* ========================================================= */}
                            <div
                                ref={(el) => { stateRefs.current[2] = el; }}
                                className={`transition-opacity duration-300 max-w-[560px] ${activeState === 3 ? "opacity-100" : "opacity-40"
                                    }`}
                            >
                                {/* CALLER RESOLUTION (YELLOW ACCENT LINE) */}
                                <div className="border-l-2 border-[#E8B84A] pl-5 sm:pl-6">
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[10.5px] sm:text-[11px] font-medium tracking-[0.16em] text-[#777770] uppercase mb-2">
                                        CALLER
                                    </div>
                                    <div className="text-[3.0rem] sm:text-[3.6rem] lg:text-[4.2rem] font-bold text-[#171717] tracking-[-0.025em] leading-[1.05] font-['Manrope',sans-serif]">
                                        &ldquo;Perfect.&rdquo;
                                    </div>
                                </div>

                                {/* TOP DIVIDER LINE */}
                                <div className="w-full h-px bg-[#E5E2DA] my-7 sm:my-8" />

                                {/* RESOLUTION STATUS & CHECKLIST */}
                                <div className="space-y-4 sm:space-y-5">
                                    {/* Badge + Header */}
                                    <div className="flex items-center gap-3.5 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                                            <Check className="w-5 h-5 text-[#065F46]" strokeWidth={3} />
                                        </div>
                                        <span className="font-['IBM_Plex_Mono',monospace] text-[12px] sm:text-[13px] font-semibold tracking-[0.18em] text-[#065F46] uppercase">
                                            REQUEST RESOLVED
                                        </span>
                                    </div>

                                    {/* Checklist items */}
                                    <div className="pl-13.5 sm:pl-15 space-y-2.5 sm:space-y-3 font-['IBM_Plex_Mono',monospace] text-[12.5px] sm:text-[13px] text-[#44403C]">
                                        <div className="flex items-center gap-2.5">
                                            <Check className="w-3.5 h-3.5 text-[#065F46] shrink-0" strokeWidth={2.5} />
                                            <span>Order reference understood</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Check className="w-3.5 h-3.5 text-[#065F46] shrink-0" strokeWidth={2.5} />
                                            <span>Customer assisted</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Check className="w-3.5 h-3.5 text-[#065F46] shrink-0" strokeWidth={2.5} />
                                            <span>Conversation complete</span>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM DIVIDER LINE & CALL CONCLUDED FOOTER */}
                                <div ref={finalLineRef} className="mt-7 sm:mt-8">
                                    <div className="w-full h-px bg-[#E5E2DA] mb-3" />
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[10px] sm:text-[10.5px] font-medium text-[#888882] uppercase tracking-[0.18em]">
                                        CALL CONCLUDED
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}
