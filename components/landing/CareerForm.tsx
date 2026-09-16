"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
    { id: "intern", name: "Intern" },
    { id: "frontend", name: "Frontend Developer" },
    { id: "backend", name: "Backend Developer" },
    { id: "fullstack", name: "Full Stack Developer" },
];

export function CareerForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [fileName, setFileName] = useState("");
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        
        const formData = new FormData(e.currentTarget);
        
        try {
            const response = await fetch(`${apiBase}/tools/careers/apply/`, {
                method: "POST",
                body: formData,
            });
            
            if (response.ok) {
                setStatus("success");
            } else {
                const data = await response.json();
                setStatus("error");
                setErrorMessage(JSON.stringify(data));
            }
        } catch {
            setStatus("error");
            setErrorMessage("Failed to connect to the server. Please try again.");
        }
    };

    if (status === "success") {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-primary/20 rounded-3xl p-12 text-center space-y-6"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="text-primary" size={40} />
                </div>
                <h3 className="text-3xl font-black">Application Received</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Our team will review your profile and get back to you within 3-5 business days. Keep building!
                </p>
                <button 
                    onClick={() => setStatus("idle")}
                    className="text-primary font-bold hover:underline"
                >
                    Submit another application
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {/* Full Name */}
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                    <input 
                        required
                        name="full_name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                
                {/* Email */}
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">Email Address</label>
                    <input 
                        required
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {/* Phone */}
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">Phone Number</label>
                    <input 
                        required
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                
                {/* Role */}
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">Desired Role</label>
                    <select 
                        required
                        name="role"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">Select a role</option>
                        {ROLES.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">GitHub URL</label>
                    <input 
                        name="github_url"
                        type="url"
                        placeholder="github.com/username"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">LinkedIn URL</label>
                    <input 
                        name="linkedin_url"
                        type="url"
                        placeholder="linkedin.com/in/username"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">Portfolio (Optional)</label>
                    <input 
                        name="portfolio_url"
                        type="url"
                        placeholder="portfolio.com"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">Resume (PDF)</label>
                <div className="relative group/upload">
                    <input 
                        required
                        name="resume"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-muted/50 border-2 border-dashed border-border/50 rounded-2xl sm:rounded-3xl p-5 sm:p-10 flex flex-col items-center justify-center gap-2 sm:gap-4 group-hover/upload:border-primary/30 transition-colors">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs sm:text-sm font-bold">{fileName || "Click to upload or drag and drop"}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">PDF format only (max. 5MB)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40 ml-1">Brief Introduction (Optional)</label>
                <textarea 
                    name="cover_letter"
                    rows={4}
                    placeholder="Tell us about your potential and what you want to build..."
                    className="w-full bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {status === "error" && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 text-destructive text-xs sm:text-sm bg-destructive/10 p-3 sm:p-4 rounded-xl"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                type="submit"
                disabled={status === "loading"}
                className={cn(
                    "w-full py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3",
                    status === "loading" 
                        ? "bg-muted text-muted-foreground cursor-not-allowed" 
                        : "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-1"
                )}
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                        Processing...
                    </>
                ) : (
                    <>
                        Submit Application
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                )}
            </button>
        </form>
    );
}
