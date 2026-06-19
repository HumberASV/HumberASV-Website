/**
 * @file connectionActions.ts
 * @description Redux actions for managing the WebSocket connection to the ASV basestation.
 * This includes initializing the connection, handling incoming telemetry data, and managing connection status.
 *
 * @author Carson Fujita
 */

import { TELEMETRY_WS_URL, CONNECTION_TIMEOUT_MS } from '../../config/connection';

// Derives the HTTP base URL from the WebSocket URL.
// e.g. "ws://192.168.1.10:8080/telemetry" → "http://192.168.1.10:8080"
//      "wss://example.com/telemetry"       → "https://example.com"
const _httpBase = TELEMETRY_WS_URL
    .replace(/^ws:/, 'http:')
    .replace(/^wss:/, 'https:')
    .replace(/\/[^/]*$/, '');

import { setConnectionStatus, showToast } from '../slices/connectionSlice';
import { fetchTelemetrySuccess, startMockTelemetryUpdates, stopMockTelemetryUpdates } from './fetchTelemetry';
import { setVideoStreamUrl } from '../slices/videoSlice';
import type { AppDispatch } from '../store';
import type { RootState } from '../store';
import type { Status } from '../../utils/types';

// Module-level reference so the socket can be cleaned up if needed.
let socket: WebSocket | null = null;

function fallbackToMock(dispatch: AppDispatch) {
    dispatch(setConnectionStatus('mock'));
    dispatch(showToast({ message: 'Basestation unreachable — using simulation data', severity: 'warning' }));
    dispatch(startMockTelemetryUpdates());
}

/**
 * Attempts a WebSocket connection to the basestation using the token stored in Redux state.
 *
 * Requires a token — if absent, shows an error toast and aborts.
 * The token is sent as a query parameter so the server can validate it before streaming.
 *
 * On success: updates connection status and shows a success toast after the first data frame.
 * On 1008 close (invalid/expired token): shows an auth-specific error, stays idle.
 * On timeout or network failure: falls back to mock telemetry updates.
 */
export const initConnection = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    if (socket && socket.readyState <= WebSocket.OPEN) return;

    const token = getState().token.token;
    if (!token) {
        dispatch(showToast({ message: 'No token set — visit /connect to authenticate', severity: 'error' }));
        return;
    }

    dispatch(setConnectionStatus('connecting'));

    const wsUrl = `${TELEMETRY_WS_URL}?token=${encodeURIComponent(token)}`;
    socket = new WebSocket(wsUrl);

    const opened = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
            socket?.close();
            resolve(false);
        }, CONNECTION_TIMEOUT_MS);

        socket!.onopen = () => {
            clearTimeout(timeout);
            resolve(true);
        };

        socket!.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
        };
    });

    if (!opened) {
        fallbackToMock(dispatch);
        return;
    }

    // Socket is open — wait for first data frame before declaring connected.
    // If the server rejects the token it closes with code 1008 before any data arrives.
    let connected = false;

    socket.onmessage = (event) => {
        if (!connected) {
            connected = true;
            dispatch(setConnectionStatus('connected'));
            dispatch(showToast({ message: 'Connected to ASV basestation', severity: 'success' }));
        }
        try {
            const rawData = JSON.parse(event.data as string);

            if (rawData.video?.streamUrl) {
                // Server sends a relative path ("/video_feed"); make it absolute.
                const streamUrl = (rawData.video.streamUrl as string).startsWith('/')
                    ? `${_httpBase}${rawData.video.streamUrl}`
                    : rawData.video.streamUrl as string;
                dispatch(setVideoStreamUrl(streamUrl));
            }

            dispatch(fetchTelemetrySuccess(rawData as Status));
        } catch {
            // ignore malformed frames
        }
    };

    socket.onclose = (event) => {
        if (event.code === 1008) {
            dispatch(setConnectionStatus('idle'));
            dispatch(showToast({
                message: 'Token invalid or expired — visit /connect to re-authenticate',
                severity: 'error',
            }));
            return;
        }
        if (!connected) {
            // Closed before receiving any data — treat as unreachable.
            fallbackToMock(dispatch);
            return;
        }
        dispatch(showToast({ message: 'Connection lost — switching to simulation', severity: 'warning' }));
        fallbackToMock(dispatch);
    };

    socket.onerror = () => {
        // onclose fires immediately after onerror, so no extra dispatch needed.
    };
};

/**
 * Stops any running mock interval, closes the current socket (suppressing the
 * "connection lost" toast), then re-runs initConnection from a clean slate.
 */
export const retryConnection = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(stopMockTelemetryUpdates());

    if (socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
        socket = null;
    }

    await initConnection()(dispatch, getState);
};
