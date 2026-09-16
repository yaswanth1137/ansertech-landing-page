"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import {
    Play,
    Zap,
    Plus,
    Calendar,
    User,
    Mail,
    Clock,
    Phone,
    Maximize2,
    Minimize2,
    RotateCcw,
    Minus,
    CheckCircle2,
    Trash2,
    Check,
    Loader2,
    X,
    MessageSquare,
    Globe,
    CreditCard,
    Bell
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export interface WorkflowNode {
    id: string;
    title: string;
    subtitle: string;
    category: "trigger" | "obi" | "action" | "integration";
    icon: string;
    x: number;
    y: number;
    isAccent?: boolean;
}

export interface WorkflowConnection {
    id: string;
    from: string;
    to: string;
}

const INITIAL_NODES: WorkflowNode[] = [
    {
        id: "trigger-call",
        title: "Incoming Call",
        subtitle: "Twilio",
        category: "trigger",
        icon: "phone",
        x: 30,
        y: 400
    },
    {
        id: "obi-core",
        title: "OBI Understands",
        subtitle: "Intent Detection",
        category: "obi",
        icon: "obi",
        x: 300,
        y: 400,
        isAccent: true
    },
    {
        id: "check-avail",
        title: "Check Availability",
        subtitle: "Google Calendar",
        category: "integration",
        icon: "calendar",
        x: 540,
        y: 200
    },
    {
        id: "book-appt",
        title: "Book Appointment",
        subtitle: "Calendar",
        category: "action",
        icon: "check-calendar",
        x: 770,
        y: 200
    },
    {
        id: "create-lead",
        title: "Create / Update Lead",
        subtitle: "Your CRM",
        category: "integration",
        icon: "user",
        x: 540,
        y: 450
    },
    {
        id: "send-confirm",
        title: "Send Confirmation",
        subtitle: "Email / SMS",
        category: "action",
        icon: "mail",
        x: 770,
        y: 450
    },
    {
        id: "schedule-followup",
        title: "Schedule Follow-up",
        subtitle: "OBI Follow-ups",
        category: "action",
        icon: "clock",
        x: 540,
        y: 700
    }
];

const INITIAL_CONNECTIONS: WorkflowConnection[] = [
    { id: "c1", from: "trigger-call", to: "obi-core" },
    { id: "c2", from: "obi-core", to: "check-avail" },
    { id: "c3", from: "check-avail", to: "book-appt" },
    { id: "c4", from: "obi-core", to: "create-lead" },
    { id: "c5", from: "create-lead", to: "send-confirm" },
    { id: "c6", from: "create-lead", to: "schedule-followup" }
];

export function EffortlessSetup() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const rightContentRef = useRef<HTMLDivElement | null>(null);

    // Port DOM measurement refs & state
    const portRefs = useRef<Record<string, { input: HTMLDivElement | null; output: HTMLDivElement | null }>>({});
    const [portPositions, setPortPositions] = useState<Record<string, { inX: number; inY: number; outX: number; outY: number }>>({});

    const [nodes, setNodes] = useState<WorkflowNode[]>(INITIAL_NODES);
    const [connections, setConnections] = useState<WorkflowConnection[]>(INITIAL_CONNECTIONS);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    // Add Custom Node Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [customTitle, setCustomTitle] = useState<string>("");
    const [customSubtitle, setCustomSubtitle] = useState<string>("");
    const [customIcon, setCustomIcon] = useState<string>("zap");

    // Trigger Playback Simulation Animation State
    const [isTriggering, setIsTriggering] = useState<boolean>(false);
    const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);
    const [activeConnIds, setActiveConnIds] = useState<string[]>([]);
    const triggerTimeoutRef = useRef<NodeJS.Timeout[]>([]);

    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const dragStartPos = useRef<{ mouseX: number; mouseY: number; nodeX: number; nodeY: number }>({
        mouseX: 0,
        mouseY: 0,
        nodeX: 0,
        nodeY: 0
    });

    const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
    const [mouseCanvasPos, setMouseCanvasPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [executionLogs, setExecutionLogs] = useState([
        { id: "trigger-call", text: "Call received", time: "10:02:31 AM" },
        { id: "obi-core", text: "Intent identified", time: "10:02:32 AM" },
        { id: "check-avail", text: "Availability found", time: "10:02:33 AM" },
        { id: "book-appt", text: "Appointment booked", time: "10:02:34 AM" },
        { id: "send-confirm", text: "Confirmation sent", time: "10:02:35 AM" }
    ]);

    // Measure Port DOM Positions relative to inner track
    const measurePorts = useCallback(() => {
        if (!trackRef.current) return;
        const trackRect = trackRef.current.getBoundingClientRect();
        if (!trackRect.width || !trackRect.height) return;

        const next: Record<string, { inX: number; inY: number; outX: number; outY: number }> = {};

        nodes.forEach((n) => {
            const refs = portRefs.current[n.id];
            const inRect = refs?.input?.getBoundingClientRect();
            const outRect = refs?.output?.getBoundingClientRect();

            const inX = inRect
                ? ((inRect.left + inRect.width / 2 - trackRect.left) / trackRect.width) * 1000
                : n.x - 2;
            const inY = inRect
                ? ((inRect.top + inRect.height / 2 - trackRect.top) / trackRect.height) * 1000
                : n.y + 22;

            const outX = outRect
                ? ((outRect.left + outRect.width / 2 - trackRect.left) / trackRect.width) * 1000
                : n.x + 165;
            const outY = outRect
                ? ((outRect.top + outRect.height / 2 - trackRect.top) / trackRect.height) * 1000
                : n.y + 22;

            next[n.id] = { inX, inY, outX, outY };
        });

        setPortPositions(next);
    }, [nodes]);

    useLayoutEffect(() => {
        measurePorts();
    }, [nodes, zoomLevel, measurePorts]);

    useEffect(() => {
        if (!trackRef.current) return;
        const observer = new ResizeObserver(() => measurePorts());
        observer.observe(trackRef.current);
        return () => observer.disconnect();
    }, [measurePorts]);

    // GSAP Entrance
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none",
                    once: true
                }
            });

            tl.fromTo(
                canvasRef.current,
                { opacity: 0, y: 12, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" }
            );

            tl.fromTo(
                rightContentRef.current,
                { opacity: 0, x: 16 },
                { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
                "-=0.35"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Dynamic Interactive Trigger Flow Animation Execution
    const handleRunTriggerSimulation = () => {
        if (isTriggering || nodes.length === 0) return;
        setIsTriggering(true);

        triggerTimeoutRef.current.forEach(clearTimeout);
        triggerTimeoutRef.current = [];

        const now = new Date();
        const baseTime = (offsetSec: number) => {
            const t = new Date(now.getTime() + Math.round(offsetSec * 1000));
            return t.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        };

        // 1. Build Adjacency Graph from active connections
        const outEdges = new Map<string, { to: string; connId: string }[]>();
        const inDegree = new Map<string, number>();

        nodes.forEach((n) => {
            outEdges.set(n.id, []);
            inDegree.set(n.id, 0);
        });

        connections.forEach((c) => {
            if (outEdges.has(c.from)) {
                outEdges.get(c.from)!.push({ to: c.to, connId: c.id });
            }
            if (inDegree.has(c.to)) {
                inDegree.set(c.to, (inDegree.get(c.to) || 0) + 1);
            }
        });

        // 2. Discover Root Node(s) (trigger category or nodes with inDegree === 0)
        let rootIds = nodes.filter((n) => n.category === "trigger" || inDegree.get(n.id) === 0).map((n) => n.id);
        if (rootIds.length === 0 && nodes.length > 0) {
            rootIds = [nodes[0].id];
        }

        // 3. BFS Traversal to compute execution stages
        interface StageInfo {
            nodeIds: string[];
            connIds: string[];
        }

        const stages: StageInfo[] = [];
        let currentLevel = [...rootIds];
        const visitedNodes = new Set<string>(rootIds);
        const visitedConns = new Set<string>();

        while (currentLevel.length > 0) {
            const nextLevel: string[] = [];
            const nextConns: string[] = [];

            currentLevel.forEach((nodeId) => {
                const edges = outEdges.get(nodeId) || [];
                edges.forEach((edge) => {
                    if (!visitedConns.has(edge.connId)) {
                        visitedConns.add(edge.connId);
                        nextConns.push(edge.connId);
                    }
                    if (!visitedNodes.has(edge.to)) {
                        visitedNodes.add(edge.to);
                        nextLevel.push(edge.to);
                    }
                });
            });

            stages.push({
                nodeIds: currentLevel,
                connIds: nextConns
            });

            currentLevel = nextLevel;
        }

        // 4. Execute Stages Sequentially
        setExecutionLogs([]);
        setActiveNodeIds([]);
        setActiveConnIds([]);

        const stageDelayMs = 850;

        stages.forEach((stage, idx) => {
            const t = setTimeout(() => {
                setActiveNodeIds((prev) => Array.from(new Set([...prev, ...stage.nodeIds])));
                setActiveConnIds((prev) => Array.from(new Set([...prev, ...stage.connIds])));

                const newLogs = stage.nodeIds.map((nId, nIdx) => {
                    const nodeObj = nodeMap.get(nId);
                    const title = nodeObj?.title || "Custom Node";
                    const subtitle = nodeObj?.subtitle || "Executed";
                    return {
                        id: nId,
                        text: `${title} (${subtitle})`,
                        time: baseTime(idx + nIdx * 0.2)
                    };
                });

                setExecutionLogs((prev) => [...prev, ...newLogs]);
            }, idx * stageDelayMs);

            triggerTimeoutRef.current.push(t);
        });

        // 5. Conclude after full graph playback
        const totalDuration = (stages.length + 1.6) * stageDelayMs;
        const finalT = setTimeout(() => {
            setIsTriggering(false);
            setActiveNodeIds([]);
            setActiveConnIds([]);
        }, totalDuration);

        triggerTimeoutRef.current.push(finalT);
    };

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => triggerTimeoutRef.current.forEach(clearTimeout);
    }, []);

    // Global Mouse Handlers using inner track element
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();

            const curX = Math.max(0, Math.min(1000, ((e.clientX - rect.left) / rect.width) * 1000));
            const curY = Math.max(0, Math.min(1000, ((e.clientY - rect.top) / rect.height) * 1000));
            setMouseCanvasPos({ x: curX, y: curY });

            if (draggingNodeId) {
                const deltaX = ((e.clientX - dragStartPos.current.mouseX) / rect.width) * 1000;
                const deltaY = ((e.clientY - dragStartPos.current.mouseY) / rect.height) * 1000;

                const newX = Math.max(20, Math.min(820, dragStartPos.current.nodeX + deltaX));
                const newY = Math.max(20, Math.min(880, dragStartPos.current.nodeY + deltaY));

                setNodes((prev) =>
                    prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
                );
            }
        };

        const handleGlobalMouseUp = () => {
            setDraggingNodeId(null);
            setConnectingFromId(null);
        };

        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("mouseup", handleGlobalMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove);
            window.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [draggingNodeId, connectingFromId]);

    const handleNodeMouseDown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const node = nodes.find((n) => n.id === id);
        if (!node) return;

        setSelectedNodeId(id);
        setDraggingNodeId(id);
        dragStartPos.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            nodeX: node.x,
            nodeY: node.y
        };
    };

    // Start a new wire from output port (right)
    const handlePortStartConnect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConnectingFromId(id);
    };

    // Detach and re-route an existing incoming wire from input port (left)
    const handlePortStartRewire = (targetNodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const existingConn = connections.find((c) => c.to === targetNodeId);
        if (existingConn) {
            setConnections((prev) => prev.filter((c) => c.id !== existingConn.id));
            setConnectingFromId(existingConn.from);
        } else {
            setConnectingFromId(null);
        }
    };

    // Complete connection to a target node
    const handlePortEndConnect = (targetId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (connectingFromId && connectingFromId !== targetId) {
            const exists = connections.some((c) => c.from === connectingFromId && c.to === targetId);
            if (!exists) {
                setConnections((prev) => [
                    ...prev,
                    {
                        id: `conn-${Date.now()}`,
                        from: connectingFromId,
                        to: targetId
                    }
                ]);
            }
        }
        setConnectingFromId(null);
    };

    // Open Add Custom Node Modal
    const handleOpenAddNodeModal = () => {
        setCustomTitle("");
        setCustomSubtitle("");
        setCustomIcon("zap");
        setIsAddModalOpen(true);
    };

    // Submit Custom Node Creation
    const handleConfirmAddNode = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const title = customTitle.trim() || "Custom Step";
        const subtitle = customSubtitle.trim() || "Automation Workflow";
        const id = `custom-node-${Date.now()}`;

        // Calculate clear placement spot on canvas
        const newNode: WorkflowNode = {
            id,
            title,
            subtitle,
            category: "action",
            icon: customIcon,
            x: 300,
            y: 700
        };

        setNodes((prev) => [...prev, newNode]);
        setConnections((prev) => [
            ...prev,
            { id: `c-${Date.now()}`, from: "obi-core", to: id }
        ]);

        setSelectedNodeId(id);
        setIsAddModalOpen(false);
    };

    const handleDeleteNode = (id: string) => {
        if (id === "trigger-call" || id === "obi-core") return;
        setNodes((prev) => prev.filter((n) => n.id !== id));
        setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
        if (selectedNodeId === id) setSelectedNodeId(null);
    };

    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleResetWorkflow = () => {
        triggerTimeoutRef.current.forEach(clearTimeout);
        setIsTriggering(false);
        setActiveNodeIds([]);
        setActiveConnIds([]);
        setZoomLevel(100);
        setPan({ x: 0, y: 0 });
        setNodes(INITIAL_NODES);
        setConnections(INITIAL_CONNECTIONS);
        setSelectedNodeId(null);
        setHoveredNodeId(null);
        setExecutionLogs([
            { id: "trigger-call", text: "Call received", time: "10:02:31 AM" },
            { id: "obi-core", text: "Intent identified", time: "10:02:32 AM" },
            { id: "check-avail", text: "Availability found", time: "10:02:33 AM" },
            { id: "book-appt", text: "Appointment booked", time: "10:02:34 AM" },
            { id: "send-confirm", text: "Confirmation sent", time: "10:02:35 AM" }
        ]);
    };

    const handleToggleFullscreen = () => {
        if (!canvasRef.current) return;
        if (!document.fullscreenElement) {
            if (canvasRef.current.requestFullscreen) {
                canvasRef.current.requestFullscreen().catch(() => {
                    setIsFullscreen((prev) => !prev);
                });
            } else {
                setIsFullscreen((prev) => !prev);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {
                    setIsFullscreen(false);
                });
            } else {
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFsChange);
        document.addEventListener("webkitfullscreenchange", handleFsChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFsChange);
            document.removeEventListener("webkitfullscreenchange", handleFsChange);
        };
    }, []);

    // Intercept trackpad / wheel on canvas:
    // 2-finger scroll (up/down/left/right) -> Pan workflow up/down/left/right
    // Pinch gesture (Ctrl + wheel) -> Zoom workflow in/out
    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            if (e.ctrlKey || e.metaKey) {
                // Pinch-to-zoom gesture
                const zoomFactor = e.deltaY < 0 ? 4 : -4;
                setZoomLevel((z) => Math.min(160, Math.max(40, z + zoomFactor)));
            } else {
                // 2-finger trackpad scroll / wheel move up, down, left, right
                setPan((p) => ({
                    x: p.x - e.deltaX * 0.9,
                    y: p.y - e.deltaY * 0.9
                }));
            }
        };

        canvasEl.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            canvasEl.removeEventListener("wheel", handleWheel);
        };
    }, []);

    const handleFitView = () => {
        setZoomLevel(100);
        setPan({ x: 0, y: 0 });
        setNodes(INITIAL_NODES);
        setConnections(INITIAL_CONNECTIONS);
    };

    const nodeMap = useMemo(() => {
        const map = new Map<string, WorkflowNode>();
        nodes.forEach((n) => map.set(n.id, n));
        return map;
    }, [nodes]);

    const renderNodeIcon = (icon: string) => {
        switch (icon) {
            case "phone":
                return <Phone className="text-[#10B981]" size={13} />;
            case "obi":
                return (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#E8B84A] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E8B84A]" />
                    </div>
                );
            case "calendar":
                return <Calendar className="text-[#3B82F6]" size={13} />;
            case "check-calendar":
                return <CheckCircle2 className="text-[#10B981]" size={13} />;
            case "user":
                return <User className="text-[#10B981]" size={13} />;
            case "mail":
                return <Mail className="text-[#F59E0B]" size={13} />;
            case "clock":
                return <Clock className="text-[#10B981]" size={13} />;
            case "message":
                return <MessageSquare className="text-[#10B981]" size={13} />;
            case "globe":
                return <Globe className="text-[#3B82F6]" size={13} />;
            case "payment":
                return <CreditCard className="text-[#D97706]" size={13} />;
            case "bell":
                return <Bell className="text-[#8B5CF6]" size={13} />;
            default:
                return <Zap className="text-[#8B5CF6]" size={13} />;
        }
    };

    // Render Connection Path using Measured Port Positions + Signal Animation
    const renderConnectionPath = (conn: WorkflowConnection) => {
        const from = nodeMap.get(conn.from);
        const to = nodeMap.get(conn.to);
        const fromPos = portPositions[conn.from];
        const toPos = portPositions[conn.to];
        if (!from || !to) return null;

        const fromX = fromPos ? fromPos.outX : from.x + 165;
        const fromY = fromPos ? fromPos.outY : from.y + 22;
        const toX = toPos ? toPos.inX : to.x - 2;
        const toY = toPos ? toPos.inY : to.y + 22;

        const isHighlighted =
            selectedNodeId === from.id ||
            selectedNodeId === to.id ||
            hoveredNodeId === from.id ||
            hoveredNodeId === to.id;

        const isSignalActive = activeConnIds.includes(conn.id);

        const dx = Math.max(35, Math.abs(toX - fromX) * 0.45);
        const pathData = `M ${fromX} ${fromY} C ${fromX + dx} ${fromY}, ${toX - dx} ${toY}, ${toX} ${toY}`;

        return (
            <g key={conn.id}>
                {/* Outer Glow */}
                <path
                    d={pathData}
                    stroke={isSignalActive ? "#E8B84A" : "#E8DEC8"}
                    strokeWidth={isSignalActive ? 6 : isHighlighted ? 5 : 3.5}
                    fill="none"
                    opacity={isSignalActive ? 0.9 : isHighlighted ? 0.8 : 0.45}
                />
                {/* Core Dotted Line */}
                <path
                    d={pathData}
                    stroke={isSignalActive ? "#E8B84A" : isHighlighted ? "#D97706" : "#B8B2A4"}
                    strokeWidth={isSignalActive ? 2.5 : isHighlighted ? 2 : 1.5}
                    strokeDasharray={isSignalActive ? "none" : "5 4"}
                    fill="none"
                />

                {/* Animated Traveling Pulse Signal during Trigger Flow */}
                {isSignalActive && (
                    <circle r="4.5" fill="#E8B84A" className="drop-shadow-[0_0_8px_rgba(232,184,74,0.9)]">
                        <animateMotion dur="0.8s" repeatCount="indefinite" path={pathData} />
                    </circle>
                )}
            </g>
        );
    };

    return (
        <section
            id="how-it-works"
            ref={sectionRef}
            className="relative min-h-[720px] h-screen max-h-[960px] pt-2 sm:pt-3 lg:pt-4 pb-2 sm:pb-3 lg:pb-4 bg-[#FBF9F5] text-[#171717] border-b border-[#DDDAD2]/80 flex flex-col justify-between overflow-hidden"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.15]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #DDDAD2 1px, transparent 1px),
                        linear-gradient(to bottom, #DDDAD2 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] h-full flex flex-col justify-center">
                <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start min-h-[580px] sm:min-h-[620px] lg:min-h-[660px]">

                    {/* LEFT COLUMN: INTERACTIVE WORKFLOW BUILDER CANVAS */}
                    <div
                        ref={canvasRef}
                        className={`w-full bg-[#FAF8F3] border border-[#DDD9CE] relative flex flex-col overflow-hidden select-none transition-all ${isFullscreen
                                ? "fixed inset-0 z-50 w-screen h-screen rounded-none border-none shadow-none"
                                : "lg:col-span-8 h-[540px] sm:h-[580px] lg:h-[620px] rounded-xl shadow-[0_12px_40px_rgba(25,25,25,0.06)]"
                            }`}
                    >
                        {/* Clean Medium n8n/Stitch Canvas Background Grid Dots (pans & zooms dynamically with canvas) */}
                        <div
                            className="absolute inset-0 pointer-events-none z-0 opacity-75"
                            style={{
                                backgroundImage: `radial-gradient(#C4BFB0 ${Math.max(0.8, (1.75 * zoomLevel) / 100)}px, transparent ${Math.max(0.8, (1.75 * zoomLevel) / 100)}px)`,
                                backgroundSize: `${(24 * zoomLevel) / 100}px ${(24 * zoomLevel) / 100}px`,
                                backgroundPosition: `calc(50% + ${pan.x}px) calc(50% + ${pan.y}px)`
                            }}
                        />

                        {/* A. WORKFLOW TOP TOOLBAR */}
                        <div className="w-full h-11 bg-[#F5F2EA] border-b border-[#E2DDD0] px-3.5 flex items-center justify-between z-20 shrink-0">
                            {/* Prominent TRIGGER Workflow Button & Reset Icon Button */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleRunTriggerSimulation}
                                    disabled={isTriggering}
                                    className={`px-3 py-1 rounded-md text-[10.5px] font-['IBM_Plex_Mono',monospace] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${isTriggering
                                            ? "bg-[#FFFBF0] text-[#D97706] border border-[#E8B84A] ring-2 ring-[#E8B84A]/30"
                                            : "bg-white hover:bg-[#FFFDF8] active:scale-95 text-[#171717] border border-[#DDD9CE]"
                                        }`}
                                >
                                    {isTriggering ? (
                                        <>
                                            <Loader2 size={11} className="text-[#E8B84A] animate-spin" /> RUNNING WORKFLOW...
                                        </>
                                    ) : (
                                        <>
                                            <Play size={11} className="text-[#10B981] fill-[#10B981]" /> TRIGGER
                                        </>
                                    )}
                                </button>

                                {/* Icon-only Reset Button beside TRIGGER button */}
                                <button
                                    onClick={handleResetWorkflow}
                                    title="Reset Workflow"
                                    aria-label="Reset Workflow"
                                    className="p-1.5 rounded-md bg-white hover:bg-[#FFFDF8] active:scale-95 text-[#777770] hover:text-[#171717] border border-[#DDD9CE] shadow-2xs transition-all cursor-pointer flex items-center justify-center"
                                >
                                    <RotateCcw size={12} />
                                </button>
                            </div>

                            {/* Node Actions */}
                            <div className="flex items-center gap-2">
                                {selectedNodeId && selectedNodeId !== "trigger-call" && selectedNodeId !== "obi-core" && (
                                    <button
                                        onClick={() => handleDeleteNode(selectedNodeId)}
                                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md text-[10px] font-['IBM_Plex_Mono',monospace] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                        <Trash2 size={11} /> DELETE
                                    </button>
                                )}

                                <button
                                    onClick={handleOpenAddNodeModal}
                                    className="px-3 py-1 bg-white hover:bg-[#FFFDF8] active:scale-95 border border-[#DDD9CE] text-[#171717] rounded-md text-[10.5px] font-['IBM_Plex_Mono',monospace] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                                >
                                    <Plus className="text-[#E8B84A]" size={12} /> ADD NODE
                                </button>
                            </div>
                        </div>

                        {/* B. INNER CANVAS TRACK (ZOOMED & PANNED GRAPH CONTENT) */}
                        <div
                            ref={trackRef}
                            className="relative flex-1 w-full h-full overflow-hidden cursor-default z-10"
                            style={{
                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel / 100})`,
                                transformOrigin: "center center"
                            }}
                        >
                            <svg
                                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                                viewBox="0 0 1000 1000"
                                preserveAspectRatio="none"
                            >
                                {connections.map((conn) => renderConnectionPath(conn))}

                                {/* Active connection wire following cursor */}
                                {connectingFromId && (() => {
                                    const sourcePos = portPositions[connectingFromId];
                                    const sourceNode = nodeMap.get(connectingFromId);
                                    const sX = sourcePos ? sourcePos.outX : sourceNode ? sourceNode.x + 165 : 0;
                                    const sY = sourcePos ? sourcePos.outY : sourceNode ? sourceNode.y + 22 : 0;
                                    return (
                                        <path
                                            d={`M ${sX} ${sY} C ${sX + 60} ${sY}, ${mouseCanvasPos.x - 60} ${mouseCanvasPos.y}, ${mouseCanvasPos.x} ${mouseCanvasPos.y}`}
                                            stroke="#D97706"
                                            strokeWidth={2}
                                            strokeDasharray="5 4"
                                            fill="none"
                                        />
                                    );
                                })()}
                            </svg>

                            {nodes.map((node) => {
                                const isSelected = selectedNodeId === node.id;
                                const isDragging = draggingNodeId === node.id;
                                const isSimActive = activeNodeIds.includes(node.id);

                                return (
                                    <div
                                        key={node.id}
                                        onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                                        onMouseUp={(e) => {
                                            if (connectingFromId) handlePortEndConnect(node.id, e);
                                        }}
                                        onMouseEnter={() => setHoveredNodeId(node.id)}
                                        onMouseLeave={() => setHoveredNodeId(null)}
                                        style={{
                                            left: `${node.x / 10}%`,
                                            top: `${node.y / 10}%`,
                                            zIndex: isDragging ? 40 : isSelected ? 30 : 10
                                        }}
                                        className={`absolute cursor-grab active:cursor-grabbing ${isDragging ? "" : "transition-opacity duration-200"}`}
                                    >
                                        <div
                                            className={`relative bg-[#FFFDF8] border rounded-lg px-3 py-2 sm:px-3.5 sm:py-2.5 min-w-[145px] sm:min-w-[160px] shadow-[0_3px_12px_rgba(25,25,25,0.04)] transition-all ${isSimActive
                                                    ? "border-[#E8B84A] bg-[#FFFDF0] shadow-[0_0_20px_rgba(232,184,74,0.35)] ring-2 ring-[#E8B84A] scale-105"
                                                    : node.isAccent
                                                        ? "border-[#E8B84A] bg-[#FFFBF0] shadow-[0_4px_16px_rgba(232,184,74,0.15)] ring-1 ring-[#E8B84A]/40"
                                                        : isSelected
                                                            ? "border-[#171717] shadow-md ring-1 ring-[#171717]"
                                                            : "border-[#DDD9CE] hover:border-[#B5B0A2]"
                                                }`}
                                        >
                                            {/* Left Input Port Handle (Drag to detach & rewire, or drop to connect) */}
                                            <div
                                                ref={(el) => {
                                                    if (!portRefs.current[node.id]) {
                                                        portRefs.current[node.id] = { input: null, output: null };
                                                    }
                                                    portRefs.current[node.id].input = el;
                                                }}
                                                onMouseDown={(e) => handlePortStartRewire(node.id, e)}
                                                onMouseUp={(e) => handlePortEndConnect(node.id, e)}
                                                className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer z-30 group"
                                                title="Drag to rewire existing connection, or drop to connect"
                                            >
                                                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#DDD9CE] group-hover:border-[#10B981] group-hover:scale-125 transition-all flex items-center justify-center">
                                                    <div className="w-1 h-1 rounded-full bg-[#DDD9CE] group-hover:bg-[#10B981]" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    {renderNodeIcon(node.icon)}
                                                    <span className="font-['Manrope',sans-serif] text-[11px] sm:text-[12px] font-bold text-[#171717] leading-tight truncate max-w-[110px]">
                                                        {node.title}
                                                    </span>
                                                </div>
                                                <CheckCircle2 className={`shrink-0 transition-colors ${isSimActive ? "text-[#E8B84A]" : "text-[#10B981]"}`} size={11.5} />
                                            </div>

                                            <div className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#777770] pl-5 uppercase tracking-wide truncate">
                                                {node.subtitle}
                                            </div>

                                            {/* Right Output Port Handle (Drag to create new wire) */}
                                            <div
                                                ref={(el) => {
                                                    if (!portRefs.current[node.id]) {
                                                        portRefs.current[node.id] = { input: null, output: null };
                                                    }
                                                    portRefs.current[node.id].output = el;
                                                }}
                                                onMouseDown={(e) => handlePortStartConnect(node.id, e)}
                                                onMouseUp={(e) => e.stopPropagation()}
                                                className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer z-30 group"
                                                title="Drag to connect"
                                            >
                                                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#DDD9CE] group-hover:border-[#E8B84A] group-hover:scale-125 transition-all flex items-center justify-center">
                                                    <div className="w-1 h-1 rounded-full bg-[#DDD9CE] group-hover:bg-[#E8B84A]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* FIXED CANVAS VIEWPORT OVERLAY CONTROLS (STATIONARY ON ZOOM) */}
                        {/* 1. Execution Log */}
                        <div className="absolute bottom-3 right-3 bg-[#FFFDF8]/95 backdrop-blur-xs border border-[#DDD9CE] rounded-lg p-2.5 shadow-sm max-w-[200px] z-30 select-none pointer-events-auto">
                            <div className="flex items-center justify-between border-b border-[#EFECE1] pb-1 mb-1.5 font-['IBM_Plex_Mono',monospace] text-[8px] uppercase tracking-wider font-bold text-[#888882]">
                                <span>EXECUTION LOG</span>
                                <span className="flex items-center gap-1 text-[#10B981]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Live
                                </span>
                            </div>

                            <div className="space-y-1 font-['IBM_Plex_Mono',monospace] text-[8px] text-[#444440]">
                                {executionLogs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedNodeId(log.id)}
                                        className="flex items-center justify-between gap-1 px-1 py-0.5 rounded hover:bg-[#F5F2EA] cursor-pointer"
                                    >
                                        <span className="flex items-center gap-1 truncate">
                                            <Check className="text-[#10B981] shrink-0" size={9} />
                                            <span className="truncate">{log.text}</span>
                                        </span>
                                        <span className="text-[#888882] shrink-0">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Zoom & Fit Controls */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#FFFDF8] border border-[#DDD9CE] rounded-lg p-1 shadow-2xs z-30 select-none pointer-events-auto">
                            <button
                                onClick={() => setZoomLevel((z) => Math.max(40, z - 10))}
                                className="p-1 hover:bg-[#F5F2EA] rounded text-[#777770] hover:text-[#171717] cursor-pointer"
                                title="Zoom Out"
                            >
                                <Minus size={11} />
                            </button>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[9px] font-bold text-[#444440] px-1.5">
                                {zoomLevel}%
                            </span>
                            <button
                                onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
                                className="p-1 hover:bg-[#F5F2EA] rounded text-[#777770] hover:text-[#171717] cursor-pointer"
                                title="Zoom In"
                            >
                                <Plus size={11} />
                            </button>
                            <div className="h-3 w-[1px] bg-[#DDD9CE] mx-0.5" />
                            <button
                                onClick={handleToggleFullscreen}
                                className="px-1.5 py-0.5 hover:bg-[#F5F2EA] rounded text-[8.5px] font-['IBM_Plex_Mono',monospace] font-bold uppercase text-[#444440] hover:text-[#171717] flex items-center gap-1 cursor-pointer"
                                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                            >
                                {isFullscreen ? <Minimize2 size={9} /> : <Maximize2 size={9} />}
                                <span>{isFullscreen ? "EXIT FULLSCREEN" : "FIT VIEW"}</span>
                            </button>
                        </div>

                        {/* C. ADD CUSTOM NODE MODAL / DIALOG */}
                        {isAddModalOpen && (
                            <div className="absolute inset-0 bg-[#171717]/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                                <div className="bg-[#FFFDF8] border border-[#DDD9CE] rounded-xl shadow-[0_16px_50px_rgba(25,25,25,0.15)] w-full max-w-sm p-4 text-[#171717] animate-in fade-in zoom-in-95 duration-150">
                                    <div className="flex items-center justify-between border-b border-[#EAE6DB] pb-2 mb-3">
                                        <div className="font-['Manrope',sans-serif] font-bold text-[13px] flex items-center gap-1.5">
                                            <Plus size={13} className="text-[#E8B84A]" /> Add Custom Workflow Node
                                        </div>
                                        <button
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="text-[#888882] hover:text-[#171717] p-1 rounded-md transition-colors cursor-pointer"
                                        >
                                            <X size={13} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleConfirmAddNode} className="space-y-3 font-['Manrope',sans-serif]">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block text-[10.5px] font-['IBM_Plex_Mono',monospace] font-bold text-[#666660] uppercase mb-1">
                                                Node Name / Action
                                            </label>
                                            <input
                                                type="text"
                                                autoFocus
                                                required
                                                placeholder="e.g. Send WhatsApp Alert"
                                                value={customTitle}
                                                onChange={(e) => setCustomTitle(e.target.value)}
                                                className="w-full bg-[#FAF8F3] border border-[#DDD9CE] focus:border-[#E8B84A] focus:ring-1 focus:ring-[#E8B84A] rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium outline-hidden transition-all text-[#171717]"
                                            />
                                        </div>

                                        {/* Subtitle / Use Field */}
                                        <div>
                                            <label className="block text-[10.5px] font-['IBM_Plex_Mono',monospace] font-bold text-[#666660] uppercase mb-1">
                                                System / Integration / Use
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. WhatsApp Cloud API, Make.com"
                                                value={customSubtitle}
                                                onChange={(e) => setCustomSubtitle(e.target.value)}
                                                className="w-full bg-[#FAF8F3] border border-[#DDD9CE] focus:border-[#E8B84A] focus:ring-1 focus:ring-[#E8B84A] rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium outline-hidden transition-all text-[#171717]"
                                            />
                                        </div>

                                        {/* Quick Presets */}
                                        <div>
                                            <span className="block text-[9.5px] font-['IBM_Plex_Mono',monospace] text-[#888882] uppercase mb-1">
                                                Quick presets:
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCustomTitle("WhatsApp Notification");
                                                        setCustomSubtitle("WhatsApp Cloud API");
                                                        setCustomIcon("message");
                                                    }}
                                                    className="px-2 py-0.5 bg-[#F4EFE6] hover:bg-[#EAE4D8] rounded text-[9.5px] font-medium text-[#444440] transition-colors cursor-pointer"
                                                >
                                                    💬 WhatsApp
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCustomTitle("Webhook Dispatch");
                                                        setCustomSubtitle("Zapier / Make.com");
                                                        setCustomIcon("globe");
                                                    }}
                                                    className="px-2 py-0.5 bg-[#F4EFE6] hover:bg-[#EAE4D8] rounded text-[9.5px] font-medium text-[#444440] transition-colors cursor-pointer"
                                                >
                                                    🌐 Webhook
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCustomTitle("Generate Payment Link");
                                                        setCustomSubtitle("Stripe / Razorpay");
                                                        setCustomIcon("payment");
                                                    }}
                                                    className="px-2 py-0.5 bg-[#F4EFE6] hover:bg-[#EAE4D8] rounded text-[9.5px] font-medium text-[#444440] transition-colors cursor-pointer"
                                                >
                                                    💳 Payment
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCustomTitle("Team Slack Alert");
                                                        setCustomSubtitle("Slack Channel");
                                                        setCustomIcon("bell");
                                                    }}
                                                    className="px-2 py-0.5 bg-[#F4EFE6] hover:bg-[#EAE4D8] rounded text-[9.5px] font-medium text-[#444440] transition-colors cursor-pointer"
                                                >
                                                    🔔 Slack
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE6DB]">
                                            <button
                                                type="button"
                                                onClick={() => setIsAddModalOpen(false)}
                                                className="px-3 py-1 text-[10.5px] font-['IBM_Plex_Mono',monospace] font-bold text-[#777770] hover:text-[#171717] rounded-md transition-colors cursor-pointer"
                                            >
                                                CANCEL
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-3.5 py-1.5 bg-[#171717] hover:bg-[#333330] text-white rounded-lg text-[10.5px] font-['IBM_Plex_Mono',monospace] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                            >
                                                <Plus size={11} /> ADD TO WORKFLOW
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: EDITORIAL CONTENT & CAPABILITY CARDS */}
                    <div ref={rightContentRef} className="lg:col-span-4 flex flex-col justify-start gap-4 sm:gap-5 h-full pl-0 lg:pl-2">
                        <div>

                            <h2 className="text-[2.2rem] sm:text-[2.5rem] lg:text-[2.7rem] font-['Manrope',sans-serif] font-black tracking-tight text-[#171717] leading-[1.05] mb-2">
                                Design your<br />
                                conversation<br />
                                workflow.
                            </h2>

                            <p className="font-['Manrope',sans-serif] text-[12px] sm:text-[12.5px] text-[#555550] leading-relaxed mb-2">
                                OBI adapts to how your business works. Connect, configure, and automate with a flexible node-based builder.
                            </p>

                            <div className="font-['Caveat',cursive] text-[1.2rem] text-[#171717] flex items-center gap-2 mb-2">
                                <svg className="w-5 h-4 text-[#171717] shrink-0" viewBox="0 0 35 25" fill="none">
                                    <path d="M28,18 C18,12 12,6 6,5 M6,5 L14,9 M6,5 L10,13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>
                                    Drag, connect, <span className="underline decoration-[#E8B84A] decoration-2 underline-offset-2 font-bold">and customize.</span>
                                </span>
                            </div>
                        </div>

                        {/* REALISTIC WORKFLOW CONFIGURATION INSPECTION PANEL */}
                        <div className="bg-[#FFFDF8] border border-[#DDD9CE] rounded-xl p-4 sm:p-4.5 shadow-[0_4px_16px_rgba(25,25,25,0.04)] mt-2 sm:mt-3 font-['Manrope',sans-serif]">
                            {/* Panel Header */}
                            <div className="border-b border-[#EFECE1] pb-2.5 mb-3">
                                <div className="font-['IBM_Plex_Mono',monospace] text-[10px] font-bold text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84A]" /> WORKFLOW CONFIGURATION
                                </div>
                            </div>

                            <div className="space-y-2.5 font-['Manrope',sans-serif]">
                                {/* 1. TRIGGER */}
                                <div className="border-b border-[#F2EEE4] pb-2">
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[9px] font-semibold text-[#888882] uppercase tracking-wider mb-0.5">
                                        TRIGGER
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-semibold text-[#171717]">Incoming Call</span>
                                        <span className="font-['IBM_Plex_Mono',monospace] text-[9.5px] text-[#888882]">Twilio</span>
                                    </div>
                                </div>

                                {/* 2. UNDERSTAND */}
                                <div className="border-b border-[#F2EEE4] pb-2">
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[9px] font-semibold text-[#888882] uppercase tracking-wider mb-0.5">
                                        UNDERSTAND
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-semibold text-[#171717]">Intent Detection</span>
                                        <span className="font-['IBM_Plex_Mono',monospace] text-[9.5px] text-[#888882]">OBI Core</span>
                                    </div>
                                </div>

                                {/* 3. CONDITION */}
                                <div className="border-b border-[#F2EEE4] pb-2">
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[9px] font-semibold text-[#888882] uppercase tracking-wider mb-0.5">
                                        CONDITION
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-semibold text-[#171717]">Availability found</span>
                                        <span className="font-['IBM_Plex_Mono',monospace] text-[9.5px] text-[#888882]">Calendar API</span>
                                    </div>
                                </div>

                                {/* 4. ACTIONS */}
                                <div>
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[9px] font-semibold text-[#888882] uppercase tracking-wider mb-1.5">
                                        ACTIONS
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[#10B981] font-bold text-[10.5px]">→</span>
                                                <span className="text-[12px] font-medium text-[#171717]">Book Appointment</span>
                                            </div>
                                            <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#888882]">Calendar</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[#10B981] font-bold text-[10.5px]">→</span>
                                                <span className="text-[12px] font-medium text-[#171717]">Create / Update Lead</span>
                                            </div>
                                            <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#888882]">Your CRM</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[#10B981] font-bold text-[10.5px]">→</span>
                                                <span className="text-[12px] font-medium text-[#171717]">Send Confirmation</span>
                                            </div>
                                            <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#888882]">Email / SMS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
