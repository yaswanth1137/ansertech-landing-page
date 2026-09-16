"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Sparkles, ArrowRight, Globe, PhoneCall, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authUrl } from "@/lib/authUrls";

const plans = [
    {
        name: "Starter",
        price: { monthly: "₹2,499", yearly: "₹1,999" },
        description: "Perfect for local shops and small cafes.",
        features: [
            "1 AI Receptionist",
            "Up to 500 Calls/mo",
            "Basic Appointment Booking",
            "Email Support",
            "Multi-language (Hindi/English)",
            "Web Dashboard Access"
        ],
        icon: PhoneCall,
        color: "from-blue-500/20 to-cyan-500/20",
        btnText: "Start Free Trial",
        ctaHref: authUrl('/register'),
        popular: false
    },
    {
        name: "Business",
        price: { monthly: "₹7,999", yearly: "₹6,499" },
        description: "Ideal for growing restaurants and clinics.",
        features: [
            "3 AI Receptionists",
            "Up to 2,500 Calls/mo",
            "Google Calendar Integration",
            "Knowledge Base from Website & Docs",
            "12 Indian Languages",
            "Priority Phone Support",
            "Call Summaries & Transcripts",
            "Analytics Dashboard"
        ],
        icon: Zap,
        color: "from-primary/20 to-amber-500/20",
        btnText: "Get Started",
        ctaHref: authUrl('/register'),
        popular: true
    },
    {
        name: "Enterprise",
        price: { monthly: "Custom", yearly: "Custom" },
        description: "For multi-location chains and large enterprises.",
        features: [
            "Unlimited AI Agents",
            "Unlimited Calls",
            "Full API Access",
            "Dedicated Account Manager",
            "Human Call Escalation & Transfer",
            "Custom Onboarding & Setup"
        ],
        icon: Shield,
        color: "from-purple-500/20 to-pink-500/20",
        btnText: "Contact Sales",
        ctaHref: "/book-appointment",
        popular: false
    }
];

export function PricingTable() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

    return (
        <section className="pt-2 pb-10 sm:pt-16 sm:pb-24 px-3.5 sm:px-4 relative overflow-hidden">
            <div className="container mx-auto">
                {/* Billing Toggle */}
                <div className="flex justify-center mb-8 sm:mb-16">
                    <div className="bg-muted/50 p-1 rounded-2xl border border-border/50 flex items-center relative">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={cn(
                                "px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative z-10",
                                billingCycle === "monthly" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={cn(
                                "px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative z-10",
                                billingCycle === "yearly" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Yearly
                        </button>
                        <motion.div
                            animate={{ x: billingCycle === "monthly" ? 0 : "100%" }}
                            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-primary rounded-xl shadow-lg shadow-primary/20"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative group flex flex-col p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border transition-all duration-500",
                                plan.popular 
                                    ? "bg-card border-primary/50 shadow-[0_0_50px_-12px_rgba(212,175,55,0.2)] scale-100 sm:scale-105 z-10 my-2 sm:my-0" 
                                    : "bg-card/50 border-border/50 hover:border-border"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-1.5 bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-5 sm:mb-8">
                                <div className={cn("w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 sm:mb-6 shadow-inner", plan.color)}>
                                    <plan.icon className="text-foreground w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black mb-1.5 sm:mb-2">{plan.name}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-5 sm:mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl sm:text-5xl font-black tracking-tight">
                                        {billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                                    </span>
                                    {plan.price.monthly !== "Custom" && (
                                        <span className="text-muted-foreground font-medium text-xs sm:text-base">/mo</span>
                                    )}
                                </div>
                                {billingCycle === "yearly" && plan.price.monthly !== "Custom" && (
                                    <p className="text-[11px] sm:text-xs text-primary font-bold mt-1.5 sm:mt-2">Save up to 20% with yearly billing</p>
                                )}
                            </div>

                            <div className="space-y-2.5 sm:space-y-4 mb-6 sm:mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-2.5 sm:gap-3">
                                        <div className="mt-0.5 sm:mt-1 bg-primary/10 rounded-full p-0.5 shrink-0">
                                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium text-foreground/80">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={plan.ctaHref}
                                className={cn(
                                    "w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn",
                                    plan.popular
                                        ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-1"
                                        : "bg-secondary text-foreground hover:bg-secondary/80"
                                )}
                            >
                                {plan.btnText}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badge */}
                <div className="mt-10 sm:mt-20 flex flex-col items-center">
                    <div className="flex items-center gap-4 sm:gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 scale-90 sm:scale-100">
                        <Activity className="w-6 h-6 sm:w-8 sm:h-8" />
                        <Globe className="w-6 h-6 sm:w-8 sm:h-8" />
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                        <Zap className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <p className="mt-4 sm:mt-8 text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center">Built for scale // Trusted by industry leaders</p>
                </div>
            </div>
        </section>
    );
}
