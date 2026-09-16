import { useState, useEffect, useRef } from 'react';
import { createDashboardWebSocket, createCallWebSocket, createAgentWebSocket } from '@/services/apiClient';
import { getAccessToken } from '@/components/auth/AuthSync';
import { DashboardMetrics, ActivityItem, Insight } from '@/types/models/dashboard';
import { Call } from '@/types/models/call';
import { Booking } from '@/types/models/booking';

export function useDashboardWebSocket() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<any>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const ws = createDashboardWebSocket();
    wsRef.current = ws;
    ws.connect(token);

    // Listen to events
    ws.on('metrics_update', (data: DashboardMetrics) => {
      setMetrics(data);
    });

    ws.on('connected', () => {
        setConnected(true);
    });

    ws.on('disconnected', () => {
        setConnected(false);
    });

    ws.on('call_update', (data: Call) => {
      setCalls(prev => [data, ...prev].slice(0, 10));
    });

    ws.on('booking_update', (data: Booking) => {
      setBookings(prev => [data, ...prev].slice(0, 10));
    });

    ws.on('insight_update', (data: Insight) => {
      setInsights(prev => [data, ...prev].slice(0, 5));
    });

    ws.on('activity_update', (data: ActivityItem) => {
      setActivity(prev => [data, ...prev].slice(0, 20));
    });

    // Cleanup
    return () => {
      ws.disconnect();
      wsRef.current = null;
      setConnected(false);
    };
  }, []);

  const refresh = () => {
    if (wsRef.current) {
      wsRef.current.send('refresh_metrics');
    }
  };

  return {
    metrics,
    calls,
    bookings,
    insights,
    activity,
    connected,
    refresh,
  };
}

export function useCallWebSocket(callId: string) {
  const [status, setStatus] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!callId) return;

    const token = getAccessToken();
    if (!token) return;

    const ws = createCallWebSocket(callId);
    ws.connect(token);

    ws.on('call_status', (data: { status: string }) => {
      setStatus(data.status);
    });

    ws.on('call_transcript', (data: { transcript: string }) => {
      setTranscript(prev => prev + '\n' + data.transcript);
    });

    ws.on('call_ended', () => {
      setEnded(true);
      setStatus('completed');
    });

    return () => {
      ws.disconnect();
    };
  }, [callId]);

  return { status, transcript, ended };
}

export function useAgentWebSocket(agentId: string) {
  const [status, setStatus] = useState<{ status: string; last_active?: string } | null>(null);
  const [metrics, setMetrics] = useState<{ total_calls?: number; success_rate?: number } | null>(null);

  useEffect(() => {
    if (!agentId) return;

    const token = getAccessToken();
    if (!token) return;

    const ws = createAgentWebSocket(agentId);
    ws.connect(token);

    ws.on('agent_status', (data: { status: string; last_active?: string }) => {
      setStatus(data);
    });

    ws.on('agent_metrics', (data: { total_calls?: number; success_rate?: number }) => {
      setMetrics(data);
    });

    return () => {
      ws.disconnect();
    };
  }, [agentId]);

  return { status, metrics };
}
