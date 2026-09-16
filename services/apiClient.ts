import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authUrl } from '@/lib/authUrls';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Safely converts a DRF error value to a human-readable string.
 * Handles plain strings, arrays (["msg1","msg2"]), and field-error objects
 * ({"website": ["Enter a valid URL."], "name": ["Required."]}).
 */
export function errToString(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string') return v || null;
  if (Array.isArray(v)) return v.map(String).join(', ');
  if (typeof v === 'object') {
    return Object.entries(v as Record<string, unknown>)
      .map(([k, e]) => `${k}: ${Array.isArray(e) ? e.join(', ') : String(e)}`)
      .join('; ');
  }
  return String(v);
}

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For httpOnly cookies in production
});

// Token getter - will be set by the session provider
let getAccessToken: (() => string | null) | null = null;

/**
 * Set the token getter function (called from session provider)
 */
export function setTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

/**
 * Manually set token for API calls (used during SSR or when session not available)
 */
export function setApiToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try to get token from getter if available
    const token = getAccessToken?.();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Singleton refresh promise (prevents concurrent token refreshes) ──
let _refreshPromise: Promise<string | null> | null = null;

async function _silentRefreshToken(): Promise<string | null> {
  if (_refreshPromise) return _refreshPromise; // reuse in-flight refresh
  _refreshPromise = fetch('/api/auth/session', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
    credentials: 'same-origin',
  })
    .then(async (response) => {
      if (!response.ok) return null;

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.warn('Silent auth refresh returned non-JSON session payload.');
        return null;
      }

      const session = await response.json() as {
        accessToken?: string;
        error?: string;
      } | null;

      if (!session?.accessToken || session.error) {
        return null;
      }

      return session.accessToken;
    })
    .finally(() => { _refreshPromise = null; });
  return _refreshPromise;
}

// Response interceptor - unwrap envelope and handle errors
api.interceptors.response.use(
  (response) => {
    // Unwrap the backend envelope: {success: true, data: {...}} → {...}
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success) {
        // For paginated responses, reconstruct the DRF pagination format
        // Backend sends: {success: true, data: [...results], meta: {count, next, previous, ...stats}}
        if (body.meta && Array.isArray(body.data)) {
          response.data = {
            results: body.data,
            ...body.meta, // Spread all meta fields (count, next, previous AND extra stats)
          };
        } else {
          response.data = body.data;
        }
      } else {
        // Error envelope: {success: false, error: {status_code, detail}}
        const errorDetail = body.error?.detail || body.error || 'API request failed';
        const err = new Error(
          typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail)
        );
        (err as any).response = {
          ...response,
          data: body.error || { detail: errorDetail },
        };
        return Promise.reject(err);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    // Unwrap error envelope if present
    if (error.response?.data && typeof error.response.data === 'object') {
      const body = error.response.data as any;
      if ('success' in body && !body.success && body.error) {
        error.response.data = body.error;
      }
    }

    // Handle 401 errors — attempt silent token refresh before hard sign-out
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (process.env.NODE_ENV !== 'production') {
        return Promise.reject(error);
      }
      // Skip retry if this request was itself a retry (prevent infinite loop)
      const originalConfig = error.config as any;
      if (!originalConfig?._retry) {
        originalConfig._retry = true;
        try {
          const newToken = await _silentRefreshToken();
          if (newToken && originalConfig) {
            // Propagate the fresh token globally so all subsequent requests also use it,
            // not just this retry. Without this, concurrent requests still fire with the
            // stale token until AuthSync's useEffect re-runs.
            setApiToken(newToken);
            originalConfig.headers['Authorization'] = `Bearer ${newToken}`;
            return api.request(originalConfig); // retry original request
          }
        } catch {
          // Refresh failed — fall through to sign-out
        }
      }

      // Token is truly expired or refresh failed — force sign out once.
      // Clear the stale token immediately so the request interceptor cannot
      // read it and accidentally reset the _isSigningOut guard.
      console.warn('API returned 401 — signing out.');
      if (!(window as any)._isSigningOut) {
        (window as any)._isSigningOut = true;
        setApiToken(null);
        import('next-auth/react').then(({ signOut }) => {
          // redirect: false avoids a hard window.location redirect which would
          // abort all in-flight XHR requests and trigger "Network error" toasts.
          signOut({ redirect: false }).then(() => {
            window.location.replace(authUrl('/login'));
          }).catch(() => {
            window.location.replace(authUrl('/login'));
          });
        }).catch(() => {
          window.location.replace(authUrl('/login'));
        });
      }
    }

    // Show user-facing error toast for all non-401 server errors
    if (error.response && error.response.status !== 401) {
      const body = error.response.data as any;
      const raw = body?.message || body?.detail || body?.error?.message || body?.error?.detail;
      const msg = errToString(raw) ?? (typeof body === 'string' ? body : `Request failed (${error.response.status})`);
      if (typeof window !== 'undefined') {
        import('sonner').then(({ toast }) => toast.error(msg)).catch(() => {});
      }
    }

    // No response received — DNS failure, network down, CORS preflight blocked.
    // Suppress during sign-out: navigation aborts in-flight requests which also
    // have no response, but that's expected and not a real network failure.
    if (!error.response && error.request && typeof window !== 'undefined') {
      if (!(window as any)._isSigningOut) {
        import('sonner').then(({ toast }) =>
          toast.error('Network error — check your connection and try again.')
        ).catch(() => {});
      }
    }

    return Promise.reject(error);
  }
);

// WebSocket client with secure token handshake, heartbeat, and message queuing
class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string = '';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private pendingQueue: Array<string> = [];
  private authenticated = false;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(token: string) {
    // Do not connect without a token — server will reject and we'd get a spurious onerror.
    if (!token) {
      console.warn('[WebSocket] Skipping connection — no token available:', this.url);
      return;
    }
    this.token = token;
    this.authenticated = false;

    // No token in URL — will be sent as first message after open
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      if (process.env.NODE_ENV === 'development') console.log('WebSocket connected, sending auth handshake');
      this.reconnectAttempts = 0;

      // Send auth handshake as first message (secure: token never in URL/logs)
      this.ws!.send(JSON.stringify({ type: 'authenticate', token: this.token }));
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Handle auth acknowledgment
        if (message.type === 'authenticated') {
          this.authenticated = true;
          this.emit('connected', null);
          this._startHeartbeat();
          // Flush any messages that were queued while connecting
          this._flushQueue();
          return;
        }

        // Handle auth failure (server rejected our JWT token)
        if (message.type === 'auth_failed') {
          console.error('WebSocket authentication rejected by server', { url: this.url });
          this.ws?.close(4001, 'Authentication failed');
          return;
        }

        // Handle server-side heartbeat ping
        if (message.type === 'ping') {
          this.ws?.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        // Handle pong (response to our client-side ping — no action needed)
        if (message.type === 'pong') {
          return;
        }

        this.emit(message.type, message.data);
      } catch (e) {
        console.error('WebSocket message parse error:', e);
      }
    };

    this.ws.onclose = (event) => {
      if (process.env.NODE_ENV === 'development') console.log('WebSocket disconnected', event.code, event.reason);
      this._stopHeartbeat();
      this.authenticated = false;
      this.emit('disconnected', null);

      // Do not reconnect on auth failures (4001) — token is invalid or expired;
      // the app's session refresh will trigger a new connection once auth is restored.
      if (event.code === 4001) {
        console.warn('WebSocket auth rejected, halting reconnect:', this.url);
        return;
      }

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        // Exponential backoff capped at 30 seconds
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        setTimeout(() => {
          this.reconnectAttempts++;
          // Always prefer a fresh token on reconnect — avoids reconnecting with
          // an expired token when NextAuth has already rotated it.
          const freshToken = getAccessToken?.() || this.token;
          if (!freshToken) {
            console.warn('[WebSocket] Token unavailable — cancelling reconnect:', this.url);
            return;
          }
          this.connect(freshToken);
        }, delay);
      }
    };

    this.ws.onerror = () => {
      // The WebSocket ErrorEvent carries no useful detail — actual failure info
      // arrives via onclose with a numeric code. In dev, log at debug level so
      // transient connection failures (e.g. Django runserver lacking Channels)
      // don't pollute the browser console overlay. REST fallback polling handles it.
      if (process.env.NODE_ENV === 'development') {
        const state = this.ws?.readyState ?? -1;
        const stateLabel = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][state] ?? state;
        console.debug(
          `[WebSocket] Connection unavailable`,
          `url=${this.url}  readyState=${stateLabel}  retries=${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
        );
      }
    };
  }

  private _startHeartbeat() {
    this._stopHeartbeat();
    // Send client-side ping every 25s to keep connection alive through proxies
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 25_000);
  }

  private _stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private _flushQueue() {
    const queue = this.pendingQueue.splice(0);
    queue.forEach((msg) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(msg);
      }
    });
  }

  private emit(type: string, data: any) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  on(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  off(eventType: string, callback: (data: any) => void) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  send(type: string, data?: any) {
    const msg = JSON.stringify({ type, ...data });
    if (this.authenticated && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(msg);
    } else {
      // Buffer while connecting/reconnecting — will be flushed on auth
      this.pendingQueue.push(msg);
    }
  }

  disconnect() {
    this._stopHeartbeat();
    this.authenticated = false;
    this.reconnectAttempts = this.maxReconnectAttempts; // prevent reconnect
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.pendingQueue = [];
  }
}

// Singleton instances
export const apiClient = {
  // We could add more here if needed
};

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

export const createDashboardWebSocket = () =>
  new WebSocketClient(`${WS_BASE_URL}/dashboard/`);

export const createCallWebSocket = (callId: string) =>
  new WebSocketClient(`${WS_BASE_URL}/call/${callId}/`);

export const createAgentWebSocket = (agentId: string) =>
  new WebSocketClient(`${WS_BASE_URL}/agent/${agentId}/`);

export const createNotificationWebSocket = () =>
  new WebSocketClient(`${WS_BASE_URL}/notifications/`);

export default api;
