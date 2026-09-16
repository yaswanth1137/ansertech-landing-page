"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Calendar, RotateCcw, Star, Zap, PhoneCall, MessageSquare, Sparkles } from "lucide-react";
import { authUrl } from "@/lib/authUrls";

const LOGO_PATHS = [
    { fill: "#d6ae3a", d: "m217.25 27.75 2.777-.062c7.873-.045 13.694 1.834 20.598 5.687l2.102 1.148c19.553 12.7 27.652 40.292 36.675 60.62 2.309 5.169 4.773 10.247 7.32 15.302 4.215 8.365 8.245 16.813 12.242 25.283q1.749 3.703 3.5 7.403 2.25 4.752 4.482 9.511a649 649 0 0 0 3.944 8.251l1.665 3.47c.476.98.953 1.958 1.445 2.966 1.035 2.764 1.208 4.748 1 7.671-6.374 1.337-12.77 2.52-19.187 3.625l-2.303.41c-9.289 1.573-9.289 1.573-13.51.965-1.938-2.066-2.798-3.488-4-6l-1.344-2.733a580 580 0 0 1-4.719-10.142l-1.727-3.751c-2.758-5.99-5.492-11.99-8.226-17.991l-4.176-9.157a456 456 0 0 0-8.533-17.635c-2.33-4.598-4.533-9.25-6.705-13.923l-.93-2.003a3122 3122 0 0 1-4.63-10.021C229.984 74.339 229.984 74.339 222 64c-2.1-.584-2.1-.584-4.375-.562l-2.273-.13c-4.516 1.328-6.96 6.02-9.226 9.91l-1.77 3.497-.99 1.939c-1.067 2.091-2.123 4.187-3.179 6.284l-2.248 4.412q-2.324 4.557-4.637 9.119a3871 3871 0 0 1-10.74 20.969l-1.012 1.968c-4.278 8.306-8.667 16.535-13.258 24.673-2.795 4.97-5.391 10.011-7.912 15.125-3.465 7.014-7.04 13.97-10.63 20.921l-.991 1.92c-4.54 8.778-9.2 17.482-13.982 26.132-5.624 10.246-10.904 20.671-16.196 31.091-4.01 7.874-8.133 15.653-12.566 23.3-2.324 4.045-4.25 8.111-6.015 12.432l3.078-2.344c7.15-5.42 14.32-10.714 21.836-15.62a396 396 0 0 0 8.501-5.797c7.198-5.01 14.508-9.828 21.898-14.552l2.71-1.74c5.378-3.416 10.843-6.574 16.456-9.587a217 217 0 0 0 6.287-3.528C192.18 217.195 204.028 211.553 216 206l2.399-1.122C243.829 193.035 270.304 183.691 298 179l2.091-.36c26.834-4.44 56.146-2.616 78.897 13.473 16.347 12.691 25.518 30.962 28.699 51.275 2.488 20.73 0 41.517-12.93 58.569-3.767 4.332-7.53 8.549-12.757 11.043-2.75-.062-2.75-.062-5-1-2.52-3.781-2.526-7.163-2.875-11.562-.579-6.369-1.672-11.44-4.363-17.282-1.82-5.148.056-10.417 1.3-15.531 2.979-13.064.33-26.893-6.546-38.293L363 227l-2.125-3.312c-9.97-9.32-23.672-11.758-36.875-11.688-37.472 1.645-73.882 16.34-107 33l-2.188 1.098C194.429 256.41 174.981 268.312 156 281l-2.115 1.413c-14.475 9.714-28.475 20.09-42.197 30.837C78.88 338.882 78.88 338.882 61 337c-5.159-1.363-9.654-2.72-13.562-6.437-4.346-7.746-4.743-15.396-2.567-24.01 3.114-9.355 7.062-17.922 11.691-26.615q1.08-2.058 2.157-4.117c4.395-8.374 8.905-16.684 13.484-24.958 5.867-10.677 11.35-21.557 16.86-32.42 4.13-8.116 8.363-16.144 12.892-24.045 3.097-5.41 5.874-10.952 8.623-16.546 3.188-6.428 6.498-12.794 9.797-19.165l.997-1.925c4.252-8.21 8.53-16.407 12.85-24.582 3.629-6.874 7.204-13.777 10.778-20.68 4.383-8.465 8.775-16.924 13.24-25.346a888 888 0 0 0 6.947-13.42C184.148 35.492 184.148 35.492 203 29c4.719-1.367 9.37-1.223 14.25-1.25" },
    { fill: "#d6ae39", d: "m324.313 213.75 2.705-.062 2.595-.016 2.337-.028c2.634.458 3.416 1.27 5.05 3.356 1.04 1.83 1.04 1.83 1.98 3.887l1.076 2.317 1.132 2.483q1.21 2.61 2.425 5.215l1.221 2.625c1.621 3.438 3.322 6.833 5.041 10.223 3.355 6.647 6.599 13.346 9.813 20.063l1.368 2.856c1.324 2.773 2.636 5.55 3.944 8.331l1.38 2.917c5.931 12.74 9.259 26.04 4.593 39.735-4.335 10.463-11.056 15.806-21.227 20.368-32.386 11.563-75.817-9.629-104.433-22.895C191.43 289.43 191.43 289.43 176 274c.05-2.407.05-2.407 1-5 2.253-1.821 2.253-1.821 5.207-3.48l3.217-1.838 3.388-1.87 3.354-1.904A570 570 0 0 1 201 255l2.038-1.255c2.692-1.022 4.235-.581 6.962.255 2.07 1.025 2.07 1.025 4.125 2.3l2.355 1.444 2.52 1.568a4409 4409 0 0 0 5.45 3.31q4.019 2.445 8.037 4.894c28.236 17.082 64.378 35.609 97.826 37.171l3.863.2L337 305c-1.421-7.038-4.19-12.966-7.375-19.375a5000 5000 0 0 1-3.27-6.707l-1.69-3.467c-3.67-7.605-7.167-15.289-10.68-22.967a918 918 0 0 0-6.22-13.28l-1.566-3.317a654 654 0 0 0-2.986-6.237l-1.326-2.826-1.181-2.466c-.856-2.86-.63-4.539.294-7.358 6.491-3.934 15.937-3.206 23.313-3.25" },
    { fill: "#b99d46", d: "M361 280c1.78 2.67 2.891 4.976 4.063 7.938l1.035 2.59c3.475 9.522 3.025 19.603-1.223 28.777L364 321c-1.091-3.274-.905-3.989-.062-7.187 1.596-7.21 1.226-14.473 1.062-21.813h-2c-1.138-4.266-2-7.565-2-12" },
    { fill: "#dbb44b", d: "M266 80c2.996 3.533 4.663 7.522 6.438 11.75 2.358 5.513 4.79 10.93 7.562 16.25l-2 1-1-2-4-1-1-11h-2l-.375-1.937L269 91l-2-1c-.414-2.285-.414-2.285-.625-5.062l-.227-2.786z" },
    { fill: "#0a0a05", d: "m210 254 3 2-1 2-1.687-1.062c-2.974-1.206-4.264-.882-7.313.062-4.269 1.646-4.269 1.646-7 5l2 1c-2.906 1.257-4.796 2-8 2v1l-8 2v-2q5.187-2.97 10.375-5.937l2.984-1.71 2.852-1.63 2.634-1.508c3.684-2.077 5.01-2.327 9.155-1.215" },
    { fill: "#2c2715", d: "m356 328 3 1c-1.374 3.364-2.57 4.789-5.875 6.313-8.213 3.122-17.56 1.48-26.125.687v-1l2.965-.113c8.665-.435 16.358-1.04 23.91-5.637z" },
];

export function CTASection() {
    return (
        <section className="py-16 md:py-32 relative overflow-hidden bg-background border-b border-border/50">
            {/* Background atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-yellow/50 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[1200px] h-[300px] md:h-[600px] bg-yellow/5 blur-[40px] md:blur-[200px] rounded-full transform-gpu" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* MOBILE VIEW (< md screens) - Direct Header & CTA Cards */}
                <div className="flex flex-col items-center text-center md:hidden max-w-md mx-auto">
                    
                    {/* Header Copy */}
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3 leading-tight">
                        Ready to <span className="text-yellow">Transform</span><br />
                        Your Calls?
                    </h2>
                    <p className="text-xs text-muted-foreground mb-6 leading-relaxed max-w-xs">
                        Join hundreds of businesses using AI voice agents to automate calls, increase bookings, and grow revenue.
                    </p>

                    {/* BOTTOM CTA CARD CONTAINER */}
                    <div className="w-full rounded-[2rem] bg-card/90 border border-border/80 p-5 shadow-xl text-center flex flex-col gap-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow/10 border border-yellow/20 text-yellow text-[11px] font-bold mx-auto mb-1">
                            <Star size={12} className="fill-yellow" />
                            Start your 14-day free trial
                        </div>

                        <Link
                            href={authUrl('/register')}
                            className="w-full py-3.5 bg-yellow text-black font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-95"
                        >
                            Get Started Free
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/book-appointment"
                            className="w-full py-3.5 bg-card border border-border text-foreground font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition hover:bg-muted/50 active:scale-95"
                        >
                            Talk to Sales
                            <ArrowRight size={16} />
                        </Link>

                        {/* 3-Feature Icon Footer Row */}
                        <div className="grid grid-cols-3 gap-2 w-full pt-3 mt-1 border-t border-border/40 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <ShieldCheck size={14} className="text-muted-foreground" />
                                <span className="text-[9px] text-muted-foreground font-medium leading-tight">No credit card required</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Calendar size={14} className="text-muted-foreground" />
                                <span className="text-[9px] text-muted-foreground font-medium leading-tight">14-day free trial</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <RotateCcw size={14} className="text-muted-foreground" />
                                <span className="text-[9px] text-muted-foreground font-medium leading-tight">Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DESKTOP VIEW (md+ screens) - Strictly Preserved Original Desktop Layout */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="hidden md:block max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-8 leading-tight">
                        Ready to{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                            Transform
                        </span>
                        <br />
                        Your Calls?
                    </h2>

                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
                        Join hundreds of businesses using AI voice agents to automate calls,
                        increase bookings, and grow revenue.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={authUrl('/register')}
                            className="group relative px-12 py-5 bg-yellow text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:shadow-[0_0_60px_rgba(245,202,60,0.3)] hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link
                            href="/book-appointment"
                            className="group relative px-12 py-5 bg-secondary border border-border text-secondary-foreground font-bold text-lg rounded-full overflow-hidden transition-all hover:bg-secondary/80 hover:scale-105"
                        >
                            <span className="relative z-10">Talk to Sales</span>
                        </Link>
                    </div>

                    <p className="mt-8 text-muted-foreground text-sm font-medium">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
