"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import phoneSymbol from "./assets/phone_symbol.png";

const footerLinks = {
    Product: [
        { name: "Pricing", href: "/pricing" },
        { name: "Integrations Hub", href: "/integrations" },
        { name: "Features", href: "/#features" },
        { name: "Book Demo", href: "/book-appointment" },
    ],
    Resources: [
        { name: "Product Deep Dive", href: "/docs" },
        { name: "API Engine", href: "/api" },
        { name: "Community Nodes", href: "/community" },
        { name: "System Status", href: "/status" },
    ],
    Company: [
        { name: "Our Story", href: "/about" },
        { name: "Careers (Lab)", href: "/careers" },
        { name: "Insights (Blog)", href: "/blog" },
        { name: "Get Support", href: "mailto:hello@ansertech.com" },
    ],
};

interface FooterProps {
    showClosingFrame?: boolean;
}

export function Footer({ showClosingFrame = true }: FooterProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click or escape key
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setActiveDropdown(null);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const toggleDropdown = (category: string) => {
        setActiveDropdown((prev) => (prev === category ? null : category));
    };

    const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = newsletterEmail.trim();
        if (!email) return;

        setNewsletterStatus("success");
        const subject = encodeURIComponent("Newsletter Subscription");
        const body = encodeURIComponent(`Please subscribe this email to updates: ${email}`);
        window.location.href = `mailto:hello@ansertech.com?subject=${subject}&body=${body}`;

        setTimeout(() => {
            setNewsletterEmail("");
            setNewsletterStatus("idle");
        }, 3000);
    };

    return (
        <footer className="relative z-20 w-full h-screen h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-[#F8F7F2] text-[#171717] font-['Manrope',sans-serif] selection:bg-[#E8B84A]/30 selection:text-[#171717] overflow-hidden border-t border-[#DDDAD2] -mt-px pt-0">

            {/* SUBTLE PAPER NOTEBOOK DRAFTING GRID (MATCHING HERO & SECTION SYSTEM) */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.20]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #DDDAD2 1px, transparent 1px),
                        linear-gradient(to bottom, #DDDAD2 1px, transparent 1px)
                    `,
                    backgroundSize: "24px 24px",
                }}
            />

            {/* ============================================================
                UPPER CLOSING FRAME: EDITORIAL VOICE RESOLUTION (SECTION 7)
                Fits seamlessly within 100dvh single-screen view without scrolling
               ============================================================ */}
            {showClosingFrame && (
                <section className="relative z-10 w-full flex-1 min-h-0 flex flex-col justify-between pt-4 sm:pt-6 md:pt-8 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1400px] mx-auto">

                    {/* Top Corner Metadata Row */}
                    <div className="flex justify-between items-start mb-3 sm:mb-4 font-['IBM_Plex_Mono',monospace] text-[9.5px] sm:text-[10.5px] tracking-[0.2em] uppercase text-[#666661] leading-tight select-none">
                        <div>
                            <p>DIFFERENT</p>
                            <p>CONVERSATIONS</p>
                            <p>A BRIGHTER</p>
                            <p>BUSINESS</p>
                            <p className="mt-0.5">—</p>
                        </div>
                        <div className="text-right">
                            <p>BUILT</p>
                            <p>FOR</p>
                            <p>WHAT’S</p>
                            <p>NEXT</p>
                            <p className="mt-0.5">—</p>
                        </div>
                    </div>

                    {/* Locked Group: Main Stage + Circuit Line */}
                    <div className="w-full flex-1 min-h-0 flex flex-col justify-end mb-8 sm:mb-12 lg:mb-16 -translate-y-[3%]">
                        {/* Main Stage: Left Headline & Action | Right Telephone Handset & Manual Text */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">

                            {/* Left Column: Bold condensed display typography shifted right by 3% and upward by another 2% */}
                            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-start pl-4 sm:pl-8 lg:pl-14 pb-6 sm:pb-10 lg:pb-14 translate-x-[3%] -translate-y-[10%]">
                                <h2 className="font-['Bebas_Neue',sans-serif] text-[2.65rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem] xl:text-[5.25rem] tracking-[0.01em] uppercase text-[#171717] leading-[0.92] m-0">
                                    THE PHONE ISN’T<br />
                                    THE PROBLEM<br />
                                    <span className="text-[#C88E27]">ANYMORE.</span>
                                </h2>

                                <p className="font-['IBM_Plex_Mono',monospace] text-xs sm:text-sm md:text-[15px] text-[#44423D] mt-3 sm:mt-3.5 tracking-normal">
                                    That’s what OBI is for.
                                </p>

                                {/* Bracketed Link [ SEE OBI -> ] */}
                                <div className="mt-3.5 sm:mt-4.5">
                                    <Link
                                        href="/#demo"
                                        className="inline-flex items-center gap-2.5 font-['IBM_Plex_Mono',monospace] text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#171717] hover:text-[#C88E27] transition-colors group"
                                    >
                                        <span className="text-[#888680] group-hover:text-[#C88E27]">[</span>
                                        <span className="border-b border-[#171717] group-hover:border-[#C88E27] pb-0.5 inline-flex items-center gap-2">
                                            <span>SEE OBI</span>
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <span className="text-[#888680] group-hover:text-[#C88E27]">]</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Phone Handset moved downward by 4% (total -7%) */}
                            <div className="lg:col-span-5 xl:col-span-4 flex items-end justify-between sm:justify-end gap-5 sm:gap-8 relative pb-2 sm:pb-4 lg:pb-6 -translate-y-[7%]">

                                {/* Phone Handset - 100% transparent PNG with cord connected to circuit line */}
                                <div className="relative flex-shrink-0 -mb-[1.5px]">
                                    <div className="relative w-[110px] sm:w-[130px] md:w-[150px] lg:w-[165px] xl:w-[180px] select-none flex items-end">
                                        <Image
                                            src={phoneSymbol}
                                            alt="OBI Voice Connected Handset"
                                            className="w-full h-auto max-h-[38vh] object-contain block pointer-events-none select-none"
                                            priority
                                        />

                                        {/* Small clean wire connector joining phone cord tip to circuit line */}
                                        <svg
                                            width="130"
                                            height="9"
                                            viewBox="0 0 18 26"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute right-[18%] -bottom-[7.25px] text-[#171717] pointer-events-none select-none z-20"
                                        >
                                            <path
                                                d="M 14 0 C 16 8, 10 16, 2 24"
                                                stroke="currentColor"
                                                strokeWidth="4.6"
                                                strokeLinecap="round"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Manually Coded Text: REAL PEOPLE. REAL PROGRESS. — */}
                                <div className="flex-shrink-0 font-['IBM_Plex_Mono',monospace] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#666661] leading-relaxed select-none pb-2 sm:pb-3 lg:pb-4">
                                    <p>REAL</p>
                                    <p>PEOPLE.</p>
                                    <p>REAL</p>
                                    <p>PROGRESS.</p>
                                    <p className="mt-1">—</p>
                                </div>

                            </div>
                        </div>

                        {/* Circuit Connector Line: Easily movable upward via pixel transform (-translate-y-[30px]) */}
                        <div className="relative w-full flex items-center h-[16px] -mt-[1px] -translate-y-[45px]">
                            {/* LINE 01 READY Indicator */}
                            <div className="flex-shrink-0 flex flex-col font-['IBM_Plex_Mono',monospace] text-[8.5px] uppercase tracking-[0.18em] text-[#666661] leading-tight pr-3 select-none">
                                <span>LINE 01</span>
                                <span>READY</span>
                            </div>

                            {/* Audio Waveform SVG */}
                            <div className="flex-shrink-0 pr-2.5 select-none">
                                <svg
                                    width="38"
                                    height="14"
                                    viewBox="0 0 42 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-[#171717]"
                                >
                                    <path
                                        d="M1 8H6L9 2L12 14L16 1L19 15L23 4L26 12L29 6L32 10L35 8H41"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* Hairline Wire: 82% total width (OBI card dot at 62%, line extends 20% past the dot) */}
                            <div className="relative flex-grow flex items-center">
                                <div className="w-[82%] h-[1.5px] bg-[#171717] relative flex items-center">
                                    {/* OBI Micro-Chip Badge at 62% position (dot at ~75.6% along the 82% wire) */}
                                    <div className="absolute left-[75.6%] -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                                        <div className="relative bg-[#E5AA30] border-[1.5px] border-[#171717] text-[#171717] font-['IBM_Plex_Mono',monospace] text-[9.5px] font-bold tracking-[0.12em] px-2.5 py-0.5 rounded-[2px] shadow-[1px_1px_0px_#171717]">
                                            OBI
                                        </div>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================
                FOOTER COMPONENTS WRAPPER (MAIN BAR + BOTTOM UTILITY ROW)
                Shifted upward to occupy free space below Section 7 circuit line
               ============================================================ */}
            <div className="relative z-10 flex-shrink-0 -translate-y-14 sm:-translate-y-18 lg:-translate-y-22">

                {/* MAIN FOOTER BAR (NAVIGATION, ACCESSIBLE DROPDOWNS, NEWSLETTER) */}
                <div className="border-t border-[#DDDAD2] bg-[#F8F7F2]/90">
                    <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-4 sm:py-5">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">

                            {/* Brand Logo / Wordmark - Uses bold neo-grotesque matching the official AnserTech font */}
                            <div className="flex-shrink-0">
                                <Link
                                    href="/"
                                    className="group inline-flex items-baseline font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif] font-black text-2xl sm:text-[1.75rem] tracking-[-0.04em] text-[#171717] transition-colors"
                                >
                                    <span>AnserTech</span>
                                    <span className="text-[11px] font-bold tracking-normal align-super ml-0.5">®</span>
                                </Link>
                            </div>

                            {/* Middle: Expandable Dropdown Navigation Items */}
                            <nav
                                ref={dropdownRef}
                                aria-label="Footer Navigation"
                                className="relative flex flex-wrap items-center gap-6 sm:gap-9 font-['IBM_Plex_Mono',monospace] text-xs sm:text-[12.5px] font-semibold tracking-[0.16em] uppercase text-[#171717]"
                            >
                                {Object.entries(footerLinks).map(([category, links]) => {
                                    const isOpen = activeDropdown === category;
                                    return (
                                        <div key={category} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => toggleDropdown(category)}
                                                aria-expanded={isOpen}
                                                aria-controls={`footer-dropdown-${category}`}
                                                className={`inline-flex items-center gap-1.5 py-1 transition-colors focus:outline-none focus:text-[#C88E27] ${isOpen ? "text-[#C88E27]" : "hover:text-[#C88E27]"
                                                    }`}
                                            >
                                                <span>{category}</span>
                                                <span
                                                    className={`text-[12px] transition-transform duration-200 ${isOpen ? "rotate-45 text-[#C88E27]" : ""
                                                        }`}
                                                >
                                                    +
                                                </span>
                                            </button>

                                            {/* Dropdown Card */}
                                            {isOpen && (
                                                <div
                                                    id={`footer-dropdown-${category}`}
                                                    className="absolute bottom-full left-0 mb-2.5 w-52 sm:w-60 bg-[#FDFCF9] border border-[#DDDAD2] shadow-[0_6px_20px_rgba(23,23,23,0.07)] rounded-md p-2.5 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150"
                                                >
                                                    <div className="text-[8.5px] font-['IBM_Plex_Mono',monospace] text-[#8C8880] tracking-[0.2em] uppercase px-2 py-0.5 border-b border-[#EBE7DC] mb-1">
                                                        {category} Directory
                                                    </div>
                                                    <ul className="space-y-0.5">
                                                        {links.map((link) => (
                                                            <li key={link.name}>
                                                                <Link
                                                                    href={link.href}
                                                                    onClick={() => setActiveDropdown(null)}
                                                                    className="block px-2 py-1 text-xs text-[#2A2926] hover:text-[#C88E27] hover:bg-[#F3EFE6] rounded transition-colors font-medium normal-case font-['Manrope',sans-serif]"
                                                                >
                                                                    {link.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>

                            {/* Right: Stay Updated Newsletter Input */}
                            <div className="flex-shrink-0 w-full lg:w-auto lg:min-w-[290px] max-w-sm">
                                <div className="font-['IBM_Plex_Mono',monospace] text-[10px] font-bold tracking-[0.2em] uppercase text-[#171717] mb-1.5 select-none">
                                    STAY UPDATED
                                </div>
                                <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        placeholder="Business email"
                                        required
                                        className="w-full bg-transparent border-b border-[#171717] pb-1 pr-7 text-xs font-['IBM_Plex_Mono',monospace] text-[#171717] placeholder:text-[#8C8880] focus:outline-none focus:border-[#C88E27] transition-colors rounded-none"
                                    />
                                    <button
                                        type="submit"
                                        aria-label="Subscribe to newsletter"
                                        className="absolute right-0 pb-1 text-[#171717] hover:text-[#C88E27] transition-colors focus:outline-none disabled:opacity-40"
                                        disabled={!newsletterEmail.trim()}
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                                {newsletterStatus === "success" && (
                                    <p className="font-['IBM_Plex_Mono',monospace] text-[9.5px] text-[#C88E27] mt-1">
                                        Subscription initiated.
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* BOTTOM UTILITY ROW (COPYRIGHT, ACCESSIBLE ICONS, PRIVACY/TERMS) */}
                <div className="border-t border-[#DDDAD2] bg-[#F5F4EE]">
                    <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-2.5 sm:py-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-['IBM_Plex_Mono',monospace] text-[#666661]">

                            {/* Copyright */}
                            <div className="select-none text-[10.5px]">
                                © 2026 AnserTech
                            </div>

                            {/* Social Icons & Legal Links */}
                            <div className="flex items-center gap-5 sm:gap-6">

                                {/* Recognizable Symbol-Only Icons */}
                                <div className="flex items-center gap-3.5 text-[#171717]">
                                    {/* X / Twitter */}
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="AnserTech on X (formerly Twitter)"
                                        title="X (formerly Twitter)"
                                        className="hover:text-[#C88E27] transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>

                                    {/* LinkedIn */}
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="AnserTech on LinkedIn"
                                        title="LinkedIn"
                                        className="hover:text-[#C88E27] transition-colors"
                                    >
                                        <Linkedin className="w-3.5 h-3.5" />
                                    </a>

                                    {/* GitHub */}
                                    <a
                                        href="https://github.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="AnserTech on GitHub"
                                        title="GitHub"
                                        className="hover:text-[#C88E27] transition-colors"
                                    >
                                        <Github className="w-3.5 h-3.5" />
                                    </a>

                                    {/* Slack Icon */}
                                    <a
                                        href="https://ansertech.com/community"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="AnserTech Community on Slack"
                                        title="Slack Community"
                                        className="hover:text-[#C88E27] transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                                        </svg>
                                    </a>

                                    {/* Email Contact */}
                                    <a
                                        href="mailto:hello@ansertech.com"
                                        aria-label="Email AnserTech support"
                                        title="Contact hello@ansertech.com"
                                        className="hover:text-[#C88E27] transition-colors"
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                {/* Hairline Divider */}
                                <div className="h-3 w-px bg-[#DDDAD2]" />

                                {/* Legal Links */}
                                <div className="flex items-center gap-4 text-[10.5px]">
                                    <Link
                                        href="/privacy"
                                        className="text-[#666661] hover:text-[#171717] transition-colors"
                                    >
                                        Privacy
                                    </Link>
                                    <Link
                                        href="/terms"
                                        className="text-[#666661] hover:text-[#171717] transition-colors"
                                    >
                                        Terms
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
