"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { authUrl } from "@/lib/authUrls";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: "OBI", href: "#demo" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "/pricing" },
        { label: "Resources", href: "/docs" },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                const offset = 75;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                setIsMobileMenuOpen(false);
            }
        }
    };

    return (
        <>
            {/* CLEAN PRODUCT NAVBAR */}
            <header className="sticky top-0 z-50 w-full bg-[#F8F7F2] border-b border-[#DDDAD2]/70 transition-colors">
                <div className="container mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1440px]">
                    <div className="flex items-center justify-between h-[72px] sm:h-[76px]">
                        
                        {/* Left Group: Logo + Increased spacing to Navigation Links */}
                        <div className="flex items-center gap-12 md:gap-16 lg:gap-20 xl:gap-24">
                            <Logo
                                size="md"
                                href="/"
                                className="transition-opacity hover:opacity-90 flex-shrink-0"
                            />

                            {/* Center Navigation Links: Larger Font Size & Generous Spacing */}
                            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 lg:gap-10 xl:gap-12">
                                {navLinks.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        className="font-['Manrope',sans-serif] text-[15px] sm:text-[15.5px] font-semibold text-[#171717] hover:text-[#C88E27] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Right Group: Sign In + Sign Up CTA */}
                        <div className="flex items-center gap-6 sm:gap-8">
                            <Link
                                href={authUrl('/login')}
                                className="hidden sm:inline-block font-['Manrope',sans-serif] text-[15px] sm:text-[15.5px] font-semibold text-[#171717] hover:text-[#C88E27] px-1 py-1 transition-colors"
                            >
                                Sign In
                            </Link>

                            <Link
                                href={authUrl('/register')}
                                className="group inline-flex items-center gap-2 bg-[#E8B84A] text-[#171717] font-['Manrope',sans-serif] text-[14px] sm:text-[14.5px] font-semibold px-4.5 py-2.5 sm:px-5 sm:py-2.5 rounded-md border border-[#D8A739] shadow-2xs hover:bg-[#dfad3f] active:scale-[0.98] transition-all"
                            >
                                <span>Sign Up</span>
                                <ArrowRight size={14} strokeWidth={2.4} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={isMobileMenuOpen}
                                className="p-2 md:hidden text-[#171717] hover:bg-[#FAF9F5] rounded-md border border-transparent hover:border-[#DDDAD2] transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[72px] sm:top-[76px] inset-x-0 z-40 bg-[#F8F7F2] border-b border-[#DDDAD2] md:hidden px-6 py-6 shadow-lg overflow-hidden"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="text-base font-['Manrope',sans-serif] font-medium text-[#171717] hover:text-[#C88E27] transition-colors py-1"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="h-px w-full bg-[#DDDAD2] my-1" />
                            <div className="flex flex-col gap-3 pt-1">
                                <Link
                                    href={authUrl('/login')}
                                    className="text-sm font-['Manrope',sans-serif] font-medium text-[#171717] hover:text-[#C88E27] transition-colors py-1"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={authUrl('/register')}
                                    className="inline-flex items-center justify-center gap-2 bg-[#E8B84A] text-[#171717] font-['Manrope',sans-serif] text-sm font-semibold px-4 py-2.5 rounded-md border border-[#D8A739] hover:bg-[#dfad3f] transition-all text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>Sign Up</span>
                                    <ArrowRight size={14} strokeWidth={2.4} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
