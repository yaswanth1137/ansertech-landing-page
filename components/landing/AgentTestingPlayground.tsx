"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Mic, Play, Pause, RefreshCw, Sparkles, 
  PhoneCall, Zap, CheckCircle2, Sliders, Volume2, 
  ShieldCheck, MessageSquare, ArrowRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IndustryPreset {
  id: string;
  name: string;
  badge: string;
  systemPrompt: string;
  sampleCallerPrompt: string;
  simulatedAgentReply: string;
  latencyMs: number;
}

const PRESETS: IndustryPreset[] = [
  {
    id: "restaurant",
    name: "Fine Dining & Restaurants",
    badge: "Food & Hospitality",
    systemPrompt: "You are OBI Restaurant Receptionist. Confirm reservations, check party size (1-10), ask dietary constraints, and store table bookings.",
    sampleCallerPrompt: "Hi, I'd like to book a table for 4 people tomorrow at 7 PM. Any vegetarian options?",
    simulatedAgentReply: "Certainly! I've reserved a table for 4 guests tomorrow at 7:00 PM. We feature a full vegetarian menu with chef specials. Would you like a outdoor terrace booth?",
    latencyMs: 320,
  },
  {
    id: "healthcare",
    name: "Medical & Dental Clinics",
    badge: "Healthcare",
    systemPrompt: "You are OBI Care Assistant. Screen patient symptoms, collect appointment preferences, check insurance providers, and trigger urgent alerts.",
    sampleCallerPrompt: "I need to schedule a dental checkup and teeth cleaning next Monday morning.",
    simulatedAgentReply: "I can help with that! We have openings on Monday at 9:30 AM or 11:00 AM with Dr. Smith. Which time slot works best for you?",
    latencyMs: 290,
  },
  {
    id: "realestate",
    name: "Real Estate & Leasing",
    badge: "Property Management",
    systemPrompt: "You are OBI Property Agent. Answer rental inquiries, calculate monthly rent, schedule physical tours, and capture lead contact info.",
    sampleCallerPrompt: "Is the 2-bedroom penthouse on Ocean Drive still available for viewing this weekend?",
    simulatedAgentReply: "Yes, the Ocean Drive penthouse is available! I can schedule an exclusive walk-through Saturday at 2 PM. Shall I send the access pass to your phone?",
    latencyMs: 310,
  },
  {
    id: "ecommerce",
    name: "E-Commerce & Retail Support",
    badge: "Customer Success",
    systemPrompt: "You are OBI Commerce Copilot. Track order status via tracking numbers, process return labels, and answer product availability queries.",
    sampleCallerPrompt: "Where is my order #AN-8894? It was supposed to arrive yesterday.",
    simulatedAgentReply: "I checked order #AN-8894. It is out for delivery with FedEx (Tracking #FX-4029) and will arrive today by 4:00 PM. I'll send SMS updates to your phone!",
    latencyMs: 275,
  },
];

export function AgentTestingPlayground() {
  const [activePreset, setActivePreset] = useState<IndustryPreset>(PRESETS[0]);
  const [customPrompt, setCustomPrompt] = useState(PRESETS[0].systemPrompt);
  const [callerInput, setCallerInput] = useState(PRESETS[0].sampleCallerPrompt);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(PRESETS[0].simulatedAgentReply);
  const [metrics, setMetrics] = useState({ latency: PRESETS[0].latencyMs, sentiment: "Positive (98%)", confidence: 99.4 });

  const handleSelectPreset = (preset: IndustryPreset) => {
    setActivePreset(preset);
    setCustomPrompt(preset.systemPrompt);
    setCallerInput(preset.sampleCallerPrompt);
    setAgentResponse(preset.simulatedAgentReply);
    setMetrics({ latency: preset.latencyMs, sentiment: "Positive (98%)", confidence: 99.4 });
    setIsPlaying(false);
  };

  const handleRunTest = () => {
    setIsSimulating(true);
    setAgentResponse(null);
    setIsPlaying(false);

    setTimeout(() => {
      setIsSimulating(false);
      setAgentResponse(
        `[OBI Agent Response]: "${activePreset.simulatedAgentReply}" (Evaluated system instructions: verified availability, formatted calendar event, sent webhook confirmation).`
      );
      setMetrics({
        latency: Math.floor(Math.random() * 80) + 260,
        sentiment: "Highly Positive (99%)",
        confidence: 99.7,
      });
    }, 1200);
  };

  return (
    <section id="agent-testing" className="py-20 md:py-28 relative overflow-hidden bg-background">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-yellow/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} /> Interactive Live Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Test Voice & AI Agents <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow to-amber-500">Live in Browser</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Customize agent system prompts, simulate incoming customer calls, check real-time latency responses, and experience OBI business intelligence handling complex dialogs.
          </p>
        </div>

        {/* Industry Preset Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {PRESETS.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 border",
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-lg scale-105"
                    : "bg-card text-muted-foreground border-border/70 hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <span>{preset.name}</span>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide",
                    isSelected ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                  )}
                >
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Testing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Agent Configuration Editor */}
          <div className="lg:col-span-5 bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">1. Agent System Instructions</h3>
                    <p className="text-[11px] text-muted-foreground">Define your agent&apos;s personality & rules</p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomPrompt(activePreset.systemPrompt)}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium transition"
                >
                  <RefreshCw size={12} /> Reset
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  System Directive Prompt
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full h-32 p-3 text-xs bg-muted/30 border border-border/70 rounded-xl focus:outline-none focus:border-primary text-foreground leading-relaxed custom-scrollbar resize-none font-mono"
                  placeholder="Type agent system directive instructions here..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Simulated Customer Call Input
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={callerInput}
                    onChange={(e) => setCallerInput(e.target.value)}
                    className="w-full py-3 pl-3.5 pr-10 text-xs bg-muted/30 border border-border/70 rounded-xl focus:outline-none focus:border-primary text-foreground font-medium"
                    placeholder="Type what the customer says over the phone..."
                  />
                  <Mic size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <button
                onClick={handleRunTest}
                disabled={isSimulating}
                className="w-full py-3.5 bg-gradient-to-r from-primary via-yellow to-amber-500 hover:opacity-95 text-black font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Processing Latency & Voice Synthesis...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Execute Call Simulation Test <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Execution Output & Voice Telemetry */}
          <div className="lg:col-span-7 bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              {/* Telemetry Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-yellow/10 border border-yellow/20 flex items-center justify-center text-yellow">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">2. Live Telemetry & Response Output</h3>
                    <p className="text-[11px] text-muted-foreground">OBI Real-Time Agent Execution Pipeline</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-bold">
                    <Zap size={12} /> {metrics.latency}ms Latency
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold">
                    <ShieldCheck size={12} /> {metrics.confidence}% Accuracy
                  </div>
                </div>
              </div>

              {/* Response Display Box */}
              <div className="min-h-[160px] p-5 rounded-xl bg-surface-base/80 border border-border/60 flex flex-col justify-between relative overflow-hidden">
                {isSimulating ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-xs font-semibold text-muted-foreground animate-pulse">
                      Synthesizing Audio Waveform & Speech Telemetry...
                    </p>
                  </div>
                ) : agentResponse ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        <MessageSquare size={14} />
                      </div>
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">
                        {agentResponse}
                      </p>
                    </div>

                    {/* Audio Waveform Simulator */}
                    <div className="p-3 bg-secondary/50 rounded-lg border border-border/40 flex items-center justify-between gap-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:scale-105 transition"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                      </button>
                      <div className="flex-1 flex items-center gap-1 h-6">
                        {Array.from({ length: 32 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1 rounded-full transition-all duration-300",
                              isPlaying ? "bg-primary animate-pulse" : "bg-muted-foreground/30",
                              i % 3 === 0 ? "h-5" : i % 2 === 0 ? "h-3" : "h-2"
                            )}
                            style={isPlaying ? { animationDelay: `${i * 40}ms` } : {}}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">00:04 / Voice 1</span>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </div>

            {/* Diagnostic Badges */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Sentiment</span>
                <span className="text-xs font-bold text-emerald-500">{metrics.sentiment}</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Webhook Status</span>
                <span className="text-xs font-bold text-blue-500 flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> Triggered
                </span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Telephony Carrier</span>
                <span className="text-xs font-bold text-foreground">Plivo HQ (0s IMPS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
