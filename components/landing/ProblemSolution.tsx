"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight, Users, ArrowRight } from "lucide-react";
import terminalAsset from "./assets/edited (1).png";

export function ProblemSolution() {
    return (
        <section className="relative py-20 lg:py-28 bg-[#F8F7F2] text-[#171717] overflow-hidden border-b border-[#DDDAD2]/70 selection:bg-[#E8B84A]/30 selection:text-[#171717]">
            
            {/* SUBTLE DRAFTING NOTEBOOK GRID */}
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
                
                {/* 12-COLUMN ASYMMETRIC GRID (TIGHTENED EDITORIAL COMPOSITION) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-start">
                    
                    {/* ========================================================================= */}
                    {/* LEFT COLUMN: EDITORIAL STATEMENT & STATISTIC CARD */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-5 flex flex-col items-start pt-2">
                        
                        {/* 1. HANDWRITTEN ANNOTATION TOP-LEFT */}
                        <div className="relative mb-3 flex items-center gap-2 font-['Caveat',cursive] text-[1.3rem] sm:text-[1.4rem] text-[#171717] select-none">
                            <span>the cost of a missed call.</span>
                            {/* Small yellow hand-drawn underline */}
                            <svg className="absolute -bottom-1 left-0 w-full h-[5px] pointer-events-none" viewBox="0 0 120 6" fill="none" preserveAspectRatio="none">
                                <path d="M2,3 C35,6 80,1 118,4" stroke="#E8B84A" strokeWidth="2.2" strokeLinecap="round" />
                            </svg>
                        </div>

                        {/* 2. PRIMARY HEADLINE (MANROPE) */}
                        <motion.h2 
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-[2.6rem] sm:text-[3.2rem] lg:text-[3.65rem] xl:text-[3.9rem] font-['Manrope',sans-serif] font-bold tracking-tight text-[#171717] leading-[1.06] mb-5"
                        >
                            Your next customer <br />
                            might be calling <br />
                            <span className="text-[#E8B84A]">right now.</span>
                        </motion.h2>

                        {/* 3. SUPPORTING SUBTITLE */}
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="font-['Manrope',sans-serif] text-[15px] sm:text-[16px] text-[#5A5A55] font-normal leading-[1.6] max-w-[430px] mb-8 sm:mb-10"
                        >
                            If nobody answers, they{" "}
                            <span className="relative inline-block font-medium text-[#171717]">
                                don&apos;t
                                <svg className="absolute -bottom-0.5 left-0 w-full h-[3px] text-[#C85A46]" viewBox="0 0 30 4" fill="none" preserveAspectRatio="none">
                                    <path d="M1,2 L29,2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </span>{" "}
                            always call back.
                        </motion.p>

                        {/* 4. STATISTIC INDEX CARD (NEUTRAL ATTRIBUTION) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-full max-w-[430px] bg-[#FAF8F3] border border-[#DDD9CE] rounded-lg p-5 sm:p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] select-none"
                        >
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E8E4D8]">
                                
                                {/* 70% Voicemail Stat */}
                                <div>
                                    <div className="text-3xl sm:text-4xl font-['Manrope',sans-serif] font-extrabold text-[#C85A46] tracking-tight">
                                        70%
                                    </div>
                                    <p className="font-['Manrope',sans-serif] text-xs text-[#5A5A55] mt-1 leading-snug">
                                        of callers won&apos;t leave a voicemail.
                                    </p>
                                </div>

                                {/* Competitor Stat */}
                                <div className="flex flex-col justify-between pl-2 border-l border-[#E8E4D8]">
                                    <div className="w-8 h-8 rounded-full bg-[#FDF4EE] border border-[#F5D8C8] flex items-center justify-center text-[#C85A46]">
                                        <Users size={16} />
                                    </div>
                                    <p className="font-['Manrope',sans-serif] text-xs text-[#5A5A55] mt-1 leading-snug">
                                        They call your <br />
                                        <strong className="text-[#C85A46] font-semibold">competitor.</strong>
                                    </p>
                                </div>
                            </div>

                            {/* Card Footer Citation */}
                            <div className="flex items-center justify-between pt-3 font-['Caveat',cursive] text-sm text-[#777770]">
                                <span>Customer call behavior study</span>
                                <ArrowRight size={14} className="text-[#777770]" />
                            </div>
                        </motion.div>

                    </div>

                    {/* ========================================================================= */}
                    {/* RIGHT COLUMN: DOMINANT PHYSICAL MISSED-CALL TERMINAL & SCENE */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-7 flex flex-col items-center lg:items-start lg:pl-2 xl:pl-4 justify-center pt-6 lg:pt-0">
                        
                        <div className="w-full max-w-[620px] space-y-4">
                            
                            {/* 1. DOMINANT PHYSICAL MISSED-CALL TERMINAL (SCALED +10% WITH SUBTLE RINGING CUES) */}
                            <div className="relative w-full">
                                
                                {/* Subtle Hand-Drawn Ringing Acoustic Lines (Casual Journal Diagram) */}
                                <svg 
                                    className="absolute -top-4 -left-5 sm:-left-7 w-12 sm:w-16 h-12 sm:h-16 text-[#171717] opacity-25 pointer-events-none -rotate-12" 
                                    viewBox="0 0 60 60" 
                                    fill="none"
                                >
                                    <path d="M12,45 C6,34 8,18 20,10 C32,2 48,6 54,16" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" strokeLinecap="round" />
                                    <path d="M18,48 C14,40 16,26 26,18 C36,10 46,14 50,22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                </svg>
                                <svg 
                                    className="absolute -top-3 -right-4 sm:-right-6 w-10 sm:w-14 h-10 sm:h-14 text-[#171717] opacity-20 pointer-events-none rotate-45" 
                                    viewBox="0 0 50 50" 
                                    fill="none"
                                >
                                    <path d="M10,40 C5,30 8,15 20,8 C30,2 42,6 46,15" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 3" strokeLinecap="round" />
                                </svg>

                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.15 }}
                                    className="relative w-full rounded-2xl overflow-hidden shadow-[0_22px_50px_rgba(0,0,0,0.11),0_8px_20px_rgba(0,0,0,0.06)] border border-[#D5D1C4]"
                                >
                                    <Image
                                        src={terminalAsset}
                                        alt="Missed Call Terminal Interface"
                                        priority
                                        className="w-full h-auto object-cover"
                                    />

                                    {/* SEAMLESS CHASSIS OVERLAY BADGE TO NEUTRALIZE EARLY OBI REFERENCE */}
                                    <div 
                                        className="absolute font-['IBM_Plex_Mono',monospace] text-[8.5px] uppercase tracking-widest text-[#7A7669] flex flex-col items-center justify-center pointer-events-none select-none"
                                        style={{
                                            top: '55%',
                                            right: '5.5%',
                                            width: '14%',
                                            height: '9%',
                                            backgroundColor: '#DDD9C9',
                                            borderRadius: '2px',
                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08), 0 1px 1px rgba(255,255,255,0.4)'
                                        }}
                                    >
                                        <span className="font-bold text-[#44423C] leading-none">VOICE UNIT</span>
                                        <span className="text-[7px] text-[#7A7669] leading-tight">LINE 01</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* 2. TAPED CALL LOG & CALLER MESSAGE ROW */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                                
                                {/* Call Log Sheet (Taped to canvas) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.25 }}
                                    className="sm:col-span-7 relative bg-[#FAF8F3] border border-[#DDD9CE] rounded-lg p-3.5 shadow-xs font-['IBM_Plex_Mono',monospace] text-[10.5px]"
                                >
                                    {/* Frosted Tape on top */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-white/75 backdrop-blur-xs border border-white/40 shadow-2xs rotate-[-1deg]" />
                                    
                                    <div className="text-[9px] uppercase tracking-widest text-[#777770] font-semibold mb-2">
                                        CALL LOG (TODAY)
                                    </div>

                                    <div className="space-y-1 text-[#555550]">
                                        <div className="flex justify-between">
                                            <span>08:41 PM</span>
                                            <span>INCOMING CALL</span>
                                            <span className="text-[#888882]">NO ANSWER</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>08:43 PM</span>
                                            <span>INCOMING CALL</span>
                                            <span className="text-[#888882]">NO ANSWER</span>
                                        </div>
                                        <div className="flex justify-between text-[#C85A46] font-semibold pt-0.5 border-t border-[#EAE6DC]">
                                            <span>09:07 PM</span>
                                            <span>INCOMING CALL</span>
                                            <span>NO ANSWER</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Caller Cut-Off Message Slip */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="sm:col-span-5 relative bg-[#FDF9EA] border border-[#EBE3C8] rounded-lg p-3 shadow-xs font-['IBM_Plex_Mono',monospace] text-[10.5px] rotate-[1deg]"
                                >
                                    {/* Tape on top */}
                                    <div className="absolute -top-2 right-4 w-9 h-3.5 bg-white/75 backdrop-blur-xs border border-white/40 shadow-2xs rotate-[20deg]" />
                                    
                                    <span className="text-[8.5px] uppercase tracking-wider text-[#777770] block mb-1">
                                        Caller message (cut off):
                                    </span>
                                    <p className="text-[#C85A46] font-medium leading-tight">
                                        &ldquo;I was calling to ask about...&rdquo;
                                    </p>
                                </motion.div>

                            </div>

                            {/* 3. LEAD LOST MONETARY VALUE BOX ($1,200) */}
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.35 }}
                                className="bg-[#FAF5F2] border border-dashed border-[#E5BDB5] rounded-lg p-3.5 sm:p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#FCECE8] text-[#C85A46] flex items-center justify-center shrink-0">
                                        <ArrowDownRight size={18} strokeWidth={2.2} />
                                    </div>
                                    <div>
                                        <h4 className="font-['Manrope',sans-serif] font-bold text-sm text-[#171717]">
                                            Lead lost
                                        </h4>
                                        <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#777770]">
                                            Potential value
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-2xl sm:text-3xl font-['Manrope',sans-serif] font-extrabold text-[#C85A46] tracking-tight">
                                        $1,200
                                    </span>
                                </div>
                            </motion.div>

                            {/* 4. LOWER-RIGHT HANDWRITTEN ANNOTATIONS (INTENTIONAL EDITORIAL USE OF SPACE) */}
                            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between pt-3 gap-3 select-none">
                                
                                {/* "they were ready to buy." with arrow toward Lead Lost */}
                                <div className="flex items-center gap-2 font-['Caveat',cursive] text-[1.3rem] text-[#C85A46] leading-tight pl-2">
                                    <svg className="w-6 h-6 text-[#C85A46] -rotate-[135deg]" viewBox="0 0 35 35" fill="none">
                                        <path d="M8,4 C16,14 24,20 28,26 M28,26 L20,24 M28,26 L26,18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>they were ready to buy.</span>
                                </div>

                                {/* "So who answers when you can't?" narrative bridge */}
                                <div className="flex items-center gap-2 font-['Caveat',cursive] text-[1.35rem] text-[#171717] leading-tight pr-1">
                                    <span>
                                        So who answers when you{" "}
                                        <span className="underline decoration-[#C85A46] text-[#C85A46]">can&apos;t?</span>
                                    </span>
                                    <svg className="w-6 h-6 text-[#171717] rotate-[45deg]" viewBox="0 0 35 35" fill="none">
                                        <path d="M8,4 C16,14 24,20 28,26 M28,26 L20,24 M28,26 L26,18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}
