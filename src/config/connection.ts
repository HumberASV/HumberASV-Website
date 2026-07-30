/** Base HTTP URL for the ASV basestation REST endpoints. */
export const TELEMETRY_HTTP_BASE = 'http://localhost:8080';

/** WebSocket URL for the ASV basestation telemetry stream. */
export const TELEMETRY_WS_URL = 'ws://localhost:8080/telemetry';

/** Milliseconds to wait for a WebSocket handshake before falling back to simulation. */
export const CONNECTION_TIMEOUT_MS = 5000;
