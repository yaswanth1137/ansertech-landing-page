"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, Cpu, ShieldCheck, Zap, Network, Database, 
  Sparkles, Layers, ArrowUpRight, BarChart2, CheckCircle2, 
  Workflow, Bell, Terminal, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

const OBI_FEATURES = [
  {
    icon: Network,
    title: "Multi-Agent Orchestrator",
    description: "Chain specialized agents together. Route customer calls dynamically based on caller sentiment, account tier, or spoken language.",
    badge: "Core Engine",
  },
  {
    icon: Activity,
    title: "Real-Time Speech Telemetry",
    description: "Sub-300ms speech-to-text-to-speech roundtrip latency with active barge-in detection and acoustic echo cancellation.",
    badge: "0s Latency",
  },
  {
    icon: Database,
    title: "Bi-directional CRM & Webhook Sync",
    description: "Instant data ingestion into HubSpot, Salesforce, or Django SQL backends with zero data loss or retry lag.",
    badge: "Enterprise",
  },
  {
    icon: ShieldCheck,
    title: "Autonomous Compliance & Guardrails",
    description: "Built-in PII redaction, prompt injection shielding, and automatic audit logs for healthcare & financial privacy.",
    badge: "SOC-2 Ready",
  },
];

const TELEMETRY_NODES = [
  { label: "Incoming Carrier (Plivo)", status: "Active (24ms)", color: "text-emerald-400" },
  { label: "OBI Acoustic Engine", status: "Active (42ms)", color: "text-blue-400" },
  { label: "LLM Orchestrator (Gemini 1.5)", status: "Active (180ms)", color: "text-purple-400" },
  { label: "CRM Webhook Trigger", status: "Success (200 OK)", color: "text-amber-400" },
];

export function OBIShowcase() {
  const [selectedNode, setSelectedNode] = useState(0);
  const [liveStreamActive, setLiveStreamActive] = useState(true);

  return (
    <section id="obi-platform" className="py-20 md:py-28 relative overflow-hidden bg-muted/20 border-y border-border/40">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow/10 border border-yellow/20 text-yellow text-xs font-bold uppercase tracking-wider mb-4">
            <Cpu size={14} /> Open Business Intelligence (OBI)
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            The Intelligence Layer Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow via-amber-400 to-primary">Autonomous Business Operations</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            OBI connects voice telephony, customer analytics, and automated workflow triggers into a unified AI brain.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {OBI_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 bg-card border border-border/70 rounded-2xl shadow-sm hover:border-yellow/50 transition-all duration-300 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow/10 border border-yellow/20 flex items-center justify-center text-yellow group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-yellow transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border/40 flex items-center text-xs font-semibold text-yellow group-hover:translate-x-1 transition-transform">
                  Explore Architecture <ArrowUpRight size={14} className="ml-1" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic OBI Node Connection Graph & Webhook Payload Viewer */}
        <div className="bg-card/90 border border-border/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  OBI Live Telemetry Monitor <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">ONLINE</span>
                </h3>
                <p className="text-xs text-muted-foreground">Inspecting real-time multi-agent execution pipeline nodes</p>
              </div>
            </div>

            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              className="px-3.5 py-1.5 rounded-lg bg-secondary text-xs font-semibold hover:bg-secondary/80 transition flex items-center gap-1.5"
            >
              <RefreshCw size={13} className={cn(liveStreamActive && "animate-spin")} /> {liveStreamActive ? "Pause Stream" : "Resume Stream"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Pipeline Nodes */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">Execution Pipeline Nodes</span>
              {TELEMETRY_NODES.map((node, index) => {
                const isSelected = selectedNode === index;
                return (
                  <div
                    key={node.label}
                    onClick={() => setSelectedNode(index)}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between",
                      isSelected
                        ? "bg-surface-base border-yellow shadow-md"
                        : "bg-muted/20 border-border/50 hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2.5 h-2.5 rounded-full", isSelected ? "bg-yellow animate-pulse" : "bg-muted-foreground/40")} />
                      <span className="text-xs font-semibold text-foreground">{node.label}</span>
                    </div>
                    <span className={cn("text-[11px] font-mono font-bold", node.color)}>{node.status}</span>
                  </div>
                );
              })}
            </div>

            {/* Right: Code Console Payload View */}
            <div className="lg:col-span-7 bg-surface-base border border-border/70 rounded-xl p-4 sm:p-5 font-mono text-xs text-foreground/90 overflow-x-auto custom-scrollbar shadow-inner">
              <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Terminal size={13} className="text-yellow" /> OBI_TELEMETRY_STREAM_EVENT.json
                </span>
                <span className="text-emerald-400 font-bold">200 OK</span>
              </div>
              <pre className="leading-relaxed text-[11px] sm:text-xs">
{`{
  "event_id": "evt_obi_998432a",
  "node_target": "${TELEMETRY_NODES[selectedNode].label}",
  "timestamp": "${new Date().toISOString()}",
  "speech_metrics": {
    "roundtrip_latency_ms": 284,
    "barge_in_triggered": false,
    "sentiment_score": 0.982
  },
  "crm_integration": {
    "platform": "Django ORM",
    "customer_id": "cust_8829",
    "action": "AUTO_BOOKING_CONFIRMED"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
