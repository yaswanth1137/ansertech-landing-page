"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

interface MarketingPageWrapperProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    showGradient?: boolean;
}

export function MarketingPageWrapper({ 
    children, 
    title, 
    subtitle, 
    showGradient = true 
}: MarketingPageWrapperProps) {
    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
            <Navbar />
            
            {/* Background Effects */}
            {showGradient && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-primary/4 blur-[100px] rounded-full opacity-35" />
                    <div className="absolute top-[20%] -right-[10%] w-[520px] h-[520px] bg-primary/3 blur-[90px] rounded-full opacity-20" />
                </div>
            )}

            <div className="relative z-10">
                {/* Hero Header for Marketing Pages */}
                {(title || subtitle) && (
                    <section className="pt-24 pb-3 sm:pt-40 sm:pb-16 px-3.5 sm:px-4">
                        <div className="container mx-auto text-center max-w-4xl">
                            {title && (
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-3 sm:mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
                                >
                                    {title}
                                </motion.h1>
                            )}
                            {subtitle && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-xs sm:text-lg md:text-xl text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto"
                                >
                                    {subtitle}
                                </motion.p>
                            )}
                        </div>
                    </section>
                )}

                {children}
            </div>

            <Footer />
        </main>
    );
}
