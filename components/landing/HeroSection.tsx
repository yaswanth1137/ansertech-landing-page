"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { authUrl } from "@/lib/authUrls";
import deskUnitCutout from "./assets/obi-telephone.webp";

export function HeroSection() {
    // Audio Demo State Machine
    // 'idle' -> 'ringing' -> 'connecting' -> 'connected'
    const [callState, setCallState] = useState<'idle' | 'ringing' | 'connecting' | 'connected'>('idle');
    const [callDuration, setCallDuration] = useState(4); // Default visual 00:04 matching concept reference
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [waveHeights, setWaveHeights] = useState<number[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const waveIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initial natural voice waveform with center-weighted amplitude matching reference
    const baseWaveform = [
        12, 18, 28, 22, 45, 62, 38, 72, 92, 56, 32, 80, 96, 72, 
        42, 28, 56, 84, 70, 88, 64, 38, 72, 52, 32, 18, 14, 10
    ];

    // Initialize HTML5 Audio & Waveform
    useEffect(() => {
        setWaveHeights(baseWaveform);

        const audio = new Audio('/audio/anser-demo.mp3');
        audio.preload = 'auto';
        
        audio.onended = () => {
            setIsPlayingAudio(false);
            setCallState('idle');
            setCallDuration(0);
        };

        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = '';
            if (timerRef.current) clearInterval(timerRef.current);
            if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
        };
    }, []);

    // Stitch Waveform Dynamic Organic Animator (Center-weighted voice envelope)
    useEffect(() => {
        if (callState === 'connected' && isPlayingAudio) {
            waveIntervalRef.current = setInterval(() => {
                setWaveHeights(() => {
                    return baseWaveform.map((base, idx) => {
                        // Center-weighted multiplier
                        const centerFactor = 1 - Math.abs(idx - 14) / 16;
                        const jitter = (Math.random() * 0.7 + 0.5);
                        return Math.min(100, Math.max(12, Math.floor(base * jitter * (0.6 + centerFactor * 0.6))));
                    });
                });
            }, 110);
        } else {
            if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
            setWaveHeights(baseWaveform);
        }
        return () => {
            if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
        };
    }, [callState, isPlayingAudio]);

    // Call Duration Ticker
    useEffect(() => {
        if (callState === 'connected') {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            if (callState === 'idle') {
                setCallDuration(4);
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [callState]);

    // Trigger OBI Audio Sequence
    const handleTriggerCallDemo = () => {
        if (callState === 'connected') {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setIsPlayingAudio(false);
            setCallState('idle');
            return;
        }

        if (callState !== 'idle') return;

        // Sequence:
        // 1. RINGING (0.8s) -> device vibrates
        setCallState('ringing');
        setCallDuration(0);

        setTimeout(() => {
            // 2. CONNECTING (0.5s)
            setCallState('connecting');

            setTimeout(() => {
                // 3. CONNECTED (Play OBI voice audio)
                setCallState('connected');
                setIsPlayingAudio(true);
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(() => {
                        console.log("Audio playback active");
                    });
                }
            }, 500);
        }, 800);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className="relative min-h-[calc(100vh-4.75rem)] flex flex-col justify-center overflow-hidden bg-[#F8F7F2] text-[#171717] pt-8 pb-12 sm:pt-10 sm:pb-14 selection:bg-[#E8B84A]/30 selection:text-[#171717]">
            
            {/* SUBTLE PAPER NOTEBOOK DRAFTING GRID */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.20]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #DDDAD2 1px, transparent 1px),
                        linear-gradient(to bottom, #DDDAD2 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="container relative z-10 mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1400px]">
                
                {/* HERO ASYMMETRIC 12-COLUMN EDITORIAL GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-center">
                    
                    {/* ========================================================================= */}
                    {/* LEFT COLUMN: EDITORIAL HEADLINE, SUPPORTING COPY & CTA */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start pt-1">
                        
                        {/* 1. FINAL MAIN HEADLINE (MANROPE 500/600, SANS-SERIF) */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-6 sm:mb-7"
                        >
                            <h1 className="text-[2.2rem] sm:text-[2.85rem] lg:text-[3.25rem] xl:text-[3.5rem] font-['Manrope',sans-serif] font-semibold tracking-[-0.035em] text-[#171717] leading-[1.12]">
                                Every call deserves an answer. <br />
                                Your work deserves your{" "}
                                <span className="bg-gradient-to-r from-[#F5C542] via-[#EFA318] to-[#D97706] bg-clip-text text-transparent">
                                    attention.
                                </span>
                            </h1>
                        </motion.div>

                        {/* 2. SUPPORTING COPY (MANROPE 400) */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-['Manrope',sans-serif] text-[15px] sm:text-[16px] text-[#5A5A55] font-normal leading-[1.65] max-w-[440px] mb-7 sm:mb-8"
                        >
                            AnserTech answers the calls your business can&apos;t. OBI understands what callers need, responds naturally, and takes action — so your team can focus on the work that actually matters.
                        </motion.p>

                        {/* 3. CTA BUTTONS */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-wrap items-center gap-7 sm:gap-8"
                        >
                            <Link
                                href={authUrl('/register')}
                                className="group inline-flex items-center justify-center gap-2 bg-[#E8B84A] text-[#171717] font-['Manrope',sans-serif] font-semibold text-sm px-6 py-3.5 rounded-md border border-[#D8A739] shadow-2xs hover:bg-[#dfad3f] active:scale-[0.98] transition-all duration-200"
                            >
                                <span>Try AnserTech</span>
                                <ArrowRight size={15} strokeWidth={2.2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>

                            <button
                                onClick={handleTriggerCallDemo}
                                className="inline-flex items-center gap-2 text-sm font-['Manrope',sans-serif] font-medium text-[#171717] hover:text-[#5A5A55] transition-colors py-2 px-1 group cursor-pointer"
                            >
                                <Play size={13} className="text-[#171717] stroke-current group-hover:scale-110 transition-transform" />
                                <span className="underline underline-offset-4 decoration-[#DDDAD2] group-hover:decoration-[#171717] transition-colors">
                                    {callState === 'connected' ? 'End active demo' : 'Hear it yourself'}
                                </span>
                            </button>
                        </motion.div>
                    </div>

                    {/* ========================================================================= */}
                    {/* RIGHT COLUMN: LARGE FLOATING PHYSICAL TELEPHONE ASSET WITH ANNOTATIONS */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-7 xl:col-span-7 relative flex flex-col items-center lg:items-end justify-center pt-8 lg:pt-0 translate-y-[4%] lg:translate-y-[8%]">
                        
                        {/* HANDWRITTEN ANNOTATION WITH ORGANIC INK ARROW ABOVE TELEPHONE */}
                        <div className="absolute -top-7 right-20 sm:right-32 z-20 hidden sm:flex items-center gap-2 font-['Caveat',cursive] text-[1.3rem] sm:text-[1.4rem] text-[#171717] select-none pointer-events-none">
                            <span>your AI receptionist</span>
                            <svg className="w-10 h-8 text-[#171717] rotate-[15deg]" viewBox="0 0 50 38" fill="none">
                                <path d="M5,4 C22,16 38,24 40,32 M40,32 L30,30 M40,32 L36,20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* PHYSICAL TELEPHONE PRODUCT ASSET SITTING DIRECTLY ON GRID */}
                        <motion.div
                            animate={{
                                x: callState === 'ringing' ? [0, -3, 3, -2, 2, 0] : 0,
                                y: callState === 'ringing' ? [0, -2, 2, -1, 1, 0] : 0,
                            }}
                            transition={{
                                x: callState === 'ringing' ? { repeat: Infinity, duration: 0.25 } : {},
                                y: callState === 'ringing' ? { repeat: Infinity, duration: 0.25 } : {},
                            }}
                            onClick={handleTriggerCallDemo}
                            className="relative w-full max-w-[500px] sm:max-w-[540px] lg:max-w-[580px] cursor-pointer select-none mix-blend-multiply"
                        >
                            {/* Isolated Transparent Telephone Cutout with Soft Natural Contact Shadow */}
                            <Image
                                src={deskUnitCutout}
                                alt="AnserTech OBI Physical Telephone"
                                priority
                                className="w-full h-auto"
                            />

                            {/* DYNAMIC INTERACTIVE SCREEN OVERLAY (IBM PLEX MONO) */}
                            <div 
                                className="absolute font-['IBM_Plex_Mono',monospace] text-[#171717] flex flex-col justify-between"
                                style={{
                                    top: '16.5%',
                                    left: '29.5%',
                                    width: '59%',
                                    height: '47.5%',
                                }}
                            >
                                {/* Top Inset Screen Header: INCOMING CALL | LINE 01 */}
                                <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-medium text-[#171717] pb-0.5">
                                    <span>
                                        {callState === 'ringing' ? 'INCOMING CALL' : callState === 'connecting' ? 'CONNECTING...' : 'INCOMING CALL'}
                                    </span>
                                    <span className="text-[#666661] text-[8px] sm:text-[10px]">LINE 01</span>
                                </div>

                                {/* Phone Number */}
                                <div className="text-xs sm:text-[16px] font-semibold text-[#171717] tracking-wider">
                                    +91 98••••••21
                                </div>
                                
                                {/* Status Row (Timer on the right aligning with the image's CONNECTED marker) */}
                                <div className="flex items-center justify-between text-[8px] sm:text-[10.5px]">
                                    <div className="opacity-0 pointer-events-none">
                                        CONNECTED
                                    </div>
                                    <span className="text-[#171717] font-semibold">
                                        {formatDuration(callDuration)}
                                    </span>
                                </div>

                                {/* Live Spoken Dialogue Text */}
                                <div className="text-[9px] sm:text-[12px] font-['Manrope',sans-serif] font-medium text-[#171717] leading-tight">
                                    &ldquo;Hi, how can I help you?&rdquo;
                                </div>

                                {/* STITCH RESPONSIVE VOICE WAVEFORM */}
                                <div className="flex items-center justify-between gap-[1.5px] sm:gap-[2px] h-4 sm:h-6 pt-0.5">
                                    {waveHeights.map((height, i) => (
                                        <div
                                            key={i}
                                            className="w-[1.5px] sm:w-[2.2px] bg-[#171717] rounded-xs transition-all duration-100 ease-in-out"
                                            style={{ 
                                                height: `${height}%`,
                                                opacity: (i < 2 || i > 25) ? 0.35 : 0.9
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* STATUS LABEL BELOW TELEPHONE */}
                        <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#666661] mt-2 mr-16 select-none">
                            STATUS: <span className="text-[#4F9D69] font-bold underline underline-offset-4 decoration-[#4F9D69]/60">ACTIVE</span>
                        </div>

                        {/* TAPED INDEX CARD WITH TELEPHONE SKETCH (BOTTOM RIGHT) */}
                        <div className="mt-3 relative w-full max-w-[270px] bg-[#FAF9F5] border border-[#DDD9CE] p-3.5 shadow-sm rotate-[-1.5deg] select-none">
                            {/* Masking Tape in top-right corner */}
                            <div className="absolute -top-2 -right-2 w-9 h-3.5 bg-white/75 backdrop-blur-xs border border-white/40 shadow-2xs rotate-[35deg]" />
                            
                            <div className="flex items-center gap-3">
                                {/* Vintage telephone hand-drawn icon */}
                                <div className="w-8 h-8 border border-[#171717] rounded-xs flex items-center justify-center bg-[#FFFFFF] shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <p className="font-['Caveat',cursive] text-[#171717] text-[16px] leading-snug">
                                    you focus on the work that actually matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
