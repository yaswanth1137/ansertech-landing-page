'use client';

/**
 * useOrchestratorWebCall - Hook for browser-based voice calls via AnserTech Orchestrator
 *
 * Audio: Browser → PCM16 binary frames (or base64 JSON fallback) over WebSocket → Orchestrator
 *        Orchestrator → PCM16 binary frames (or base64 JSON fallback) over WebSocket → Browser
 *
 * Key fixes over v1:
 * - AudioWorklet processor (off-main-thread audio capture, eliminates cracking)
 * - Source node stored in ref (prevents GC → fixes "no voice input" bug)
 * - WebSocket ping keepalive (prevents silent disconnects)
 * - Real audio level via AnalyserNode (drives UI visualization)
 * - Agent state tracking (greeting/listening/thinking/speaking)
 * - AudioContext state verification after resume
 * - Fallback to ScriptProcessorNode for browsers without AudioWorklet
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { api, errToString } from '@/services/apiClient';
import { toast } from 'sonner';

export type AgentState = 'idle' | 'greeting' | 'listening' | 'thinking' | 'speaking';

export interface CallState {
    status: 'idle' | 'connecting' | 'connected' | 'ended' | 'error';
    callId: string | null;
    duration: number;
    transcript: TranscriptEntry[];
    error: string | null;
    agentState: AgentState;
}

export interface TranscriptEntry {
    role: 'agent' | 'user';
    content: string;
    timestamp: number;
    isInterim?: boolean;
    source?: string;
}

interface StartCallOptions {
    recognitionLanguage?: string;
    purpose?: string;
}

interface SpeechRecognitionAlternativeLike {
    transcript: string;
}

interface SpeechRecognitionResultLike {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
    resultIndex: number;
    results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
    error?: string;
}

interface BrowserSpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEventLike) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
    onend: (() => void) | null;
    onspeechend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognition;

interface CreateWebCallResponse {
    call_id: string;
    ws_url: string;
}

interface UseOrchestratorWebCallReturn {
    callState: CallState;
    startCall: (agentDbId: string, options?: StartCallOptions) => Promise<void>;
    endCall: () => Promise<void>;
    isConnecting: boolean;
    isConnected: boolean;
    toggleMute: () => void;
    audioLevel: number;
    isMuted: boolean;
}

// Audio config — must match orchestrator WebRTC bridge expectations
const SAMPLE_RATE = 16000;
const BUFFER_SIZE = 2048; // Fallback ScriptProcessorNode buffer size
const WS_BINARY_AUDIO_ENABLED = true;

// Keepalive: ping every 15s
const PING_INTERVAL_MS = 15_000;
const debugWebCall = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.debug('[WebCall]', ...args);
    }
};

const normalizeRecognitionLanguage = (raw?: string): string => {
    const value = (raw || '').trim();
    if (!value) return 'en-IN';
    const lower = value.toLowerCase();
    if (lower === 'en') return 'en-IN';
    if (lower === 'hi') return 'hi-IN';
    if (lower === 'ta') return 'ta-IN';
    if (lower === 'te') return 'te-IN';
    return value;
};

export function useOrchestratorWebCall(): UseOrchestratorWebCallReturn {
    const [callState, setCallState] = useState<CallState>({
        status: 'idle',
        callId: null,
        duration: 0,
        transcript: [],
        error: null,
        agentState: 'idle',
    });
    const [audioLevel, setAudioLevel] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    // FIX: Store source node in ref to prevent garbage collection.
    // Without this, Chrome/Safari may GC the MediaStreamSource, silently
    // stopping onaudioprocess from ever firing — the primary "no voice input" cause.
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animFrameRef = useRef<number>(0);
    const silentSinkRef = useRef<GainNode | null>(null);
    const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const playbackContextRef = useRef<AudioContext | null>(null);
    const nextPlayTimeRef = useRef<number>(0);
    const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const audioEventCountRef = useRef(0);
    const browserRecognitionRef = useRef<BrowserSpeechRecognition | null>(null);
    const browserRecognitionRestartRef = useRef(false);

    const sendWsJson = useCallback((payload: Record<string, unknown>): boolean => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return false;
        try {
            ws.send(JSON.stringify(payload));
            return true;
        } catch {
            return false;
        }
    }, []);

    const stopBrowserRecognition = useCallback(() => {
        browserRecognitionRestartRef.current = false;
        const recognition = browserRecognitionRef.current;
        browserRecognitionRef.current = null;
        if (!recognition) return;
        try {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            recognition.onspeechend = null;
            recognition.stop();
        } catch {
            // ignore browser API teardown errors
        }
    }, []);

    const startBrowserRecognition = useCallback((requestedLanguage?: string) => {
        const w = window as Window & {
            SpeechRecognition?: BrowserSpeechRecognitionCtor;
            webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
        };
        const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) {
            debugWebCall('browser STT unavailable');
            return;
        }

        stopBrowserRecognition();

        try {
            const recognition = new SpeechRecognitionCtor();
            browserRecognitionRef.current = recognition;
            browserRecognitionRestartRef.current = true;

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = normalizeRecognitionLanguage(requestedLanguage);

            recognition.onresult = (event: SpeechRecognitionEventLike) => {
                let finalText = '';
                for (let i = event.resultIndex; i < event.results.length; i += 1) {
                    const result = event.results[i];
                    const transcript = String(result?.[0]?.transcript || '').trim();
                    if (result?.isFinal && transcript) {
                        finalText += ` ${transcript}`;
                    }
                }
                const cleaned = finalText.trim();
                if (cleaned) {
                    sendWsJson({ type: 'user_text', text: cleaned });
                    sendWsJson({ type: 'flush' });
                }
            };

            recognition.onspeechend = () => {
                sendWsJson({ type: 'flush' });
            };

            recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
                const code = String(event?.error || 'unknown');
                if (code === 'not-allowed' || code === 'service-not-allowed') {
                    browserRecognitionRestartRef.current = false;
                }
                debugWebCall('browser STT error', { code });
            };

            recognition.onend = () => {
                const ws = wsRef.current;
                if (!browserRecognitionRestartRef.current || !ws || ws.readyState !== WebSocket.OPEN) {
                    return;
                }
                try {
                    recognition.start();
                } catch {
                    // browser can throw if restart is too fast
                }
            };

            recognition.start();
            debugWebCall('browser STT started', { language: recognition.lang });
        } catch (err) {
            browserRecognitionRestartRef.current = false;
            browserRecognitionRef.current = null;
            debugWebCall('browser STT init failed', err);
        }
    }, [sendWsJson, stopBrowserRecognition]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupResources();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cleanupResources = useCallback(() => {
        stopBrowserRecognition();
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
        }
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = 0;
        }
        if (wsRef.current) {
            try { wsRef.current.close(1000, 'cleanup'); } catch { /* ignore */ }
            wsRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
        }
        if (workletNodeRef.current) {
            try {
                workletNodeRef.current.port.postMessage('stop');
                workletNodeRef.current.disconnect();
            } catch { /* ignore */ }
            workletNodeRef.current = null;
        }
        if (processorRef.current) {
            try { processorRef.current.disconnect(); } catch { /* ignore */ }
            processorRef.current = null;
        }
        if (sourceNodeRef.current) {
            try { sourceNodeRef.current.disconnect(); } catch { /* ignore */ }
            sourceNodeRef.current = null;
        }
        if (silentSinkRef.current) {
            try { silentSinkRef.current.disconnect(); } catch { /* ignore */ }
            silentSinkRef.current = null;
        }
        if (analyserRef.current) {
            try { analyserRef.current.disconnect(); } catch { /* ignore */ }
            analyserRef.current = null;
        }
        if (audioContextRef.current) {
            try { audioContextRef.current.close(); } catch { /* ignore */ }
            audioContextRef.current = null;
        }
        if (playbackContextRef.current) {
            try { playbackContextRef.current.close(); } catch { /* ignore */ }
            playbackContextRef.current = null;
        }
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
        audioEventCountRef.current = 0;
        setAudioLevel(0);
    }, [stopBrowserRecognition]);

    // ── Audio helpers ──

    const resampleAudio = (input: Float32Array, fromRate: number, toRate: number): Float32Array => {
        if (fromRate === toRate) return input;
        const ratio = fromRate / toRate;
        const outputLength = Math.round(input.length / ratio);
        const output = new Float32Array(outputLength);
        for (let i = 0; i < outputLength; i++) {
            const srcIdx = i * ratio;
            const low = Math.floor(srcIdx);
            const high = Math.min(low + 1, input.length - 1);
            const frac = srcIdx - low;
            output[i] = input[low] * (1 - frac) + input[high] * frac;
        }
        return output;
    };

    const float32ToPcm16 = (float32: Float32Array): Int16Array => {
        const pcm16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return pcm16;
    };

    const pcm16ToFloat32 = (pcm16: Int16Array): Float32Array => {
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
            float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
        }
        return float32;
    };

    const int16ToBase64 = (int16: Int16Array): string => {
        const bytes = new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
        }
        return btoa(binary);
    };

    const base64ToInt16 = (b64: string): Int16Array => {
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new Int16Array(bytes.buffer);
    };

    // ── Audio level monitor ──

    const startAudioLevelMonitor = useCallback((analyser: AnalyserNode) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let lastUpdateTime = 0;
        const tick = () => {
            const now = performance.now();
            if (now - lastUpdateTime >= 100) {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                setAudioLevel(sum / dataArray.length / 255);
                lastUpdateTime = now;
            }
            animFrameRef.current = requestAnimationFrame(tick);
        };
        animFrameRef.current = requestAnimationFrame(tick);
    }, []);

    // ── Playback ──

    const playAudio = useCallback((pcm16Base64: string) => {
        if (!playbackContextRef.current) return;
        try {
            const ctx = playbackContextRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const pcm16 = base64ToInt16(pcm16Base64);
            if (pcm16.length === 0) return;

            const float32 = pcm16ToFloat32(pcm16);
            const buffer = ctx.createBuffer(1, float32.length, SAMPLE_RATE);
            buffer.getChannelData(0).set(float32);

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);

            const now = ctx.currentTime;
            const startTime = Math.max(now, nextPlayTimeRef.current);
            source.start(startTime);
            nextPlayTimeRef.current = startTime + buffer.duration;
        } catch (err) {
            console.warn('[WebCall] Playback error:', err);
        }
    }, []);

    const playAudioPcm16 = useCallback((pcm16: Int16Array) => {
        if (!playbackContextRef.current) return;
        try {
            const ctx = playbackContextRef.current;
            if (ctx.state === 'suspended') ctx.resume();
            if (pcm16.length === 0) return;

            const float32 = pcm16ToFloat32(pcm16);
            const buffer = ctx.createBuffer(1, float32.length, SAMPLE_RATE);
            buffer.getChannelData(0).set(float32);

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);

            const now = ctx.currentTime;
            const startTime = Math.max(now, nextPlayTimeRef.current);
            source.start(startTime);
            nextPlayTimeRef.current = startTime + buffer.duration;
        } catch (err) {
            console.warn('[WebCall] Playback error:', err);
        }
    }, []);

    const sendPcm16Audio = useCallback((ws: WebSocket, pcm16: Int16Array) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        if (WS_BINARY_AUDIO_ENABLED) {
            const bytes = new Uint8Array(pcm16.buffer, pcm16.byteOffset, pcm16.byteLength);
            const copy = new Uint8Array(bytes.length);
            copy.set(bytes);
            ws.send(copy.buffer);
            return;
        }
        ws.send(JSON.stringify({ type: 'audio', data: int16ToBase64(pcm16) }));
    }, []);

    // ── Start call ──

    const startCall = useCallback(async (agentDbId: string, options?: StartCallOptions) => {
        try {
            setCallState({
                status: 'connecting',
                callId: null,
                error: null,
                transcript: [],
                duration: 0,
                agentState: 'idle',
            });
            setIsMuted(false);

            // 1. Create web call via Django → orchestrator
            const response = await api.post<CreateWebCallResponse>(`/agents/${agentDbId}/create_web_call/`, {
                purpose: options?.purpose || '',
            });
            const responseData = response as CreateWebCallResponse | { data: CreateWebCallResponse };
            const { call_id, ws_url } = 'data' in responseData ? responseData.data : responseData;
            if (!call_id || !ws_url) {
                throw new Error('Failed to get web call session from server');
            }
            debugWebCall('startCall session created', { agentDbId, callId: call_id, wsUrl: ws_url });

            // 2. Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: { ideal: SAMPLE_RATE },
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            mediaStreamRef.current = stream;

            // 3. Capture audio context
            const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
            audioContextRef.current = audioContext;

            if (audioContext.state === 'suspended') await audioContext.resume();
            // Verify resume actually worked
            if (audioContext.state !== 'running') {
                console.warn('[WebCall] AudioContext still', audioContext.state, '— retrying');
                await audioContext.resume();
            }

            const actualCaptureRate = audioContext.sampleRate;

            // 4. Playback audio context (separate)
            const playbackContext = new AudioContext({ sampleRate: SAMPLE_RATE });
            playbackContextRef.current = playbackContext;
            nextPlayTimeRef.current = 0;
            if (playbackContext.state === 'suspended') await playbackContext.resume();

            // 5. Audio source + analyser for real audio levels
            const source = audioContext.createMediaStreamSource(stream);
            sourceNodeRef.current = source; // FIX: prevent GC

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.5;
            analyserRef.current = analyser;
            source.connect(analyser);

            // 6. WebSocket
            const ws = new WebSocket(ws_url);
            ws.binaryType = 'arraybuffer';
            wsRef.current = ws;

            ws.onopen = async () => {
                debugWebCall('ws open', { callId: call_id });
                ws.send(JSON.stringify({
                    type: 'config',
                    sample_rate: SAMPLE_RATE,
                    channels: 1,
                    binary_audio: WS_BINARY_AUDIO_ENABLED,
                }));
                startBrowserRecognition(options?.recognitionLanguage);

                // Try AudioWorklet first (off-thread, no cracking), fallback to ScriptProcessor
                let workletLoaded = false;
                if (typeof AudioWorkletNode !== 'undefined') {
                    try {
                        await audioContext.audioWorklet.addModule('/audio-capture-worklet.js');
                        const workletNode = new AudioWorkletNode(
                            audioContext,
                            'audio-capture-processor',
                            { processorOptions: { targetSampleRate: SAMPLE_RATE } },
                        );
                        workletNodeRef.current = workletNode;

                        workletNode.port.onmessage = (e: MessageEvent) => {
                            const pcm16 = new Int16Array(e.data);
                            sendPcm16Audio(ws, pcm16);
                        };

                        source.connect(workletNode);
                        const sink = audioContext.createGain();
                        sink.gain.value = 0;
                        sink.connect(audioContext.destination);
                        workletNode.connect(sink);
                        silentSinkRef.current = sink;
                        workletLoaded = true;
                    } catch (err) {
                        console.warn('[WebCall] AudioWorklet unavailable, using ScriptProcessor:', err);
                    }
                }

                if (!workletLoaded) {
                    const processor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
                    processorRef.current = processor;

                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const resampled = actualCaptureRate !== SAMPLE_RATE
                            ? resampleAudio(inputData, actualCaptureRate, SAMPLE_RATE)
                            : inputData;
                        sendPcm16Audio(ws, float32ToPcm16(resampled));
                    };

                    source.connect(processor);
                    const sink = audioContext.createGain();
                    sink.gain.value = 0;
                    sink.connect(audioContext.destination);
                    processor.connect(sink);
                    silentSinkRef.current = sink;
                }

                // Real audio level monitoring
                startAudioLevelMonitor(analyser);

                // Keepalive pings
                pingIntervalRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        try { ws.send(JSON.stringify({ type: 'ping' })); } catch { /* ignore */ }
                    }
                }, PING_INTERVAL_MS);

                setCallState(prev => ({
                    ...prev,
                    status: 'connected',
                    callId: call_id,
                }));

                durationIntervalRef.current = setInterval(() => {
                    setCallState(prev => ({ ...prev, duration: prev.duration + 1 }));
                }, 1000);
            };

            ws.onmessage = async (event) => {
                try {
                    if (event.data instanceof ArrayBuffer) {
                        audioEventCountRef.current += 1;
                        playAudioPcm16(new Int16Array(event.data));
                        return;
                    }
                    if (typeof Blob !== 'undefined' && event.data instanceof Blob) {
                        audioEventCountRef.current += 1;
                        const ab = await event.data.arrayBuffer();
                        playAudioPcm16(new Int16Array(ab));
                        return;
                    }
                    if (typeof event.data !== 'string') return;

                    const msg = JSON.parse(event.data);
                    if (msg.type === 'audio') {
                        audioEventCountRef.current += 1;
                        if (audioEventCountRef.current <= 5 || audioEventCountRef.current % 50 === 0) {
                            debugWebCall('audio event', {
                                callId: call_id,
                                count: audioEventCountRef.current,
                                bytesBase64: typeof msg.data === 'string' ? msg.data.length : 0,
                            });
                        }
                    } else if (msg.type === 'transcript') {
                        debugWebCall('transcript event', {
                            callId: call_id,
                            role: msg.role,
                            content: typeof msg.content === 'string' ? msg.content.slice(0, 120) : '',
                        });
                    } else if (msg.type === 'event') {
                        debugWebCall('event message', { callId: call_id, event: msg.event, data: msg.data });
                    } else if (msg.type === 'status') {
                        debugWebCall('status message', { callId: call_id, status: msg.status, message: msg.message });
                    }

                    switch (msg.type) {
                        case 'audio':
                            playAudio(msg.data);
                            break;

                        case 'transcript':
                            setCallState(prev => {
                                const nextEntry: TranscriptEntry = {
                                    role: msg.role === 'agent' ? 'agent' : 'user',
                                    content: msg.content,
                                    timestamp: Date.now(),
                                    isInterim: Boolean(msg.is_interim) && !Boolean(msg.is_final),
                                    source: typeof msg.source === 'string' ? msg.source : undefined,
                                };

                                const transcript = [...prev.transcript];
                                const last = transcript[transcript.length - 1];

                                if (last && last.role === nextEntry.role && last.content === nextEntry.content) {
                                    return prev;
                                }

                                if (nextEntry.isInterim) {
                                    if (last && last.isInterim && last.role === nextEntry.role) {
                                        transcript[transcript.length - 1] = nextEntry;
                                    } else {
                                        transcript.push(nextEntry);
                                    }
                                } else if (last && last.isInterim && last.role === nextEntry.role) {
                                    transcript[transcript.length - 1] = nextEntry;
                                } else {
                                    transcript.push(nextEntry);
                                }

                                return { ...prev, transcript };
                            });
                            break;

                        case 'event': {
                            const evt = msg.event;
                            if (evt === 'call_ended') {
                                setCallState(prev => ({ ...prev, status: 'ended', agentState: 'idle' }));
                                cleanupResources();
                            } else if (evt === 'error') {
                                setCallState(prev => ({
                                    ...prev, status: 'error', agentState: 'idle',
                                    error: msg.data?.message || 'Call error',
                                }));
                                cleanupResources();
                            } else if (evt === 'greeting_start') {
                                setCallState(prev => ({ ...prev, agentState: 'greeting' }));
                            } else if (evt === 'listening') {
                                setCallState(prev => ({ ...prev, agentState: 'listening' }));
                            } else if (evt === 'thinking') {
                                setCallState(prev => ({ ...prev, agentState: 'thinking' }));
                            } else if (evt === 'speaking') {
                                setCallState(prev => ({ ...prev, agentState: 'speaking' }));
                            }
                            break;
                        }

                        case 'status':
                            if (msg.status === 'ended') {
                                setCallState(prev => ({ ...prev, status: 'ended', agentState: 'idle' }));
                                cleanupResources();
                            } else if (msg.status === 'error') {
                                setCallState(prev => ({
                                    ...prev, status: 'error', agentState: 'idle',
                                    error: msg.message || 'Call error',
                                }));
                                cleanupResources();
                            }
                            break;

                        case 'greeting':
                            setCallState(prev => ({
                                ...prev,
                                transcript: [...prev.transcript, {
                                    role: 'agent', content: msg.content, timestamp: Date.now(),
                                }],
                            }));
                            break;

                        case 'pong':
                            break;
                    }
                } catch (err) {
                    debugWebCall('message parse error', err);
                    console.warn('[WebCall] Message parse error:', err);
                }
            };

            ws.onerror = () => {
                debugWebCall('ws error', { callId: call_id });
                setCallState(prev => ({
                    ...prev, status: 'error', agentState: 'idle',
                    error: 'WebSocket connection error',
                }));
                cleanupResources();
            };

            ws.onclose = (event) => {
                debugWebCall('ws close', { callId: call_id, code: event.code, reason: event.reason });
                if (event.code !== 1000) {
                    setCallState(prev => {
                        if (prev.status === 'connected' || prev.status === 'connecting') {
                            return { ...prev, status: 'ended', agentState: 'idle' };
                        }
                        return prev;
                    });
                }
                cleanupResources();
            };

        } catch (error: unknown) {
            const maybeError = error as {
                response?: { data?: { detail?: unknown } };
                message?: string;
            };
            const errorMessage = errToString(maybeError.response?.data?.detail) || maybeError.message || 'Failed to start call';
            setCallState(prev => ({
                ...prev, status: 'error', agentState: 'idle', error: errorMessage,
            }));
            cleanupResources();
            toast.error(errorMessage);
        }
    }, [cleanupResources, playAudio, playAudioPcm16, sendPcm16Audio, startAudioLevelMonitor, startBrowserRecognition]);

    const endCall = useCallback(async () => {
        try {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'hangup' }));
            }
            setCallState(prev => ({ ...prev, status: 'ended', agentState: 'idle' }));
            cleanupResources();
        } catch {
            cleanupResources();
        }
    }, [cleanupResources]);

    const toggleMute = useCallback(() => {
        const tracks = mediaStreamRef.current?.getAudioTracks();
        if (tracks) {
            const newMuted = !isMuted;
            tracks.forEach(track => { track.enabled = !newMuted; });
            setIsMuted(newMuted);
        }
    }, [isMuted]);

    return {
        callState,
        startCall,
        endCall,
        isConnecting: callState.status === 'connecting',
        isConnected: callState.status === 'connected',
        toggleMute,
        audioLevel,
        isMuted,
    };
}

export default useOrchestratorWebCall;
