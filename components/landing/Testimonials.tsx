"use client";

import { motion } from "framer-motion";

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    company: string;
    logo?: string;
}

// ponytail: intentionally empty — fabricating quotes/logos here would be the
// same "AI-generated fake proof" problem flagged in the audit. Fill this in
// with real customer testimonials before shipping; the section renders
// nothing until then rather than going live with invented ones.
const TESTIMONIALS: Testimonial[] = [];

export function Testimonials() {
    if (TESTIMONIALS.length === 0) return null;

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Trusted by real businesses
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl border border-border/50 bg-card/50 p-8 flex flex-col gap-4"
                        >
                            <p className="text-foreground/90 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                            <div className="mt-auto pt-4 border-t border-border/50">
                                <p className="font-bold text-sm">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
