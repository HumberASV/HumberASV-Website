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
import type { Status } from '../../utils/types';

// Module-level reference so the socket can be cleaned up if needed.
let socket: WebSocket | null = null;

function fallbackToMock(dispatch: AppDispatch) {
    dispatch(setConnectionStatus('mock'));
    dispatch(showToast({ message: 'Basestation unreachable — using simulation data', severity: 'warning' }));
    dispatch(startMockTelemetryUpdates());
}

/**
 * Attempts a WebSocket connection to the basestation.
 * On success: updates connection status and shows a success toast.
 * On failure/timeout: falls back to mock telemetry updates.
 */
export const initConnection = () => async (dispatch: AppDispatch) => {
    if (socket && socket.readyState <= WebSocket.OPEN) return;

    dispatch(setConnectionStatus('connecting'));

    socket = new WebSocket(TELEMETRY_WS_URL);

    const connected = await new Promise<boolean>((resolve) => {
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

    if (!connected) {
        fallbackToMock(dispatch);
        return;
    }

    dispatch(setConnectionStatus('connected'));
    dispatch(showToast({ message: 'Connected to ASV basestation', severity: 'success' }));

    socket.onmessage = (event) => {
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

    socket.onclose = () => {
        dispatch(showToast({ message: 'Connection lost — switching to simulation', severity: 'warning' }));
        fallbackToMock(dispatch);
    };

    socket.onerror = () => {
        // onclose fires immediately after onerror, so no extra dispatch needed
    };
};

/**
 * Stops any running mock interval, closes the current socket (suppressing the
 * "connection lost" toast), then re-runs initConnection from a clean slate.
 */
export const retryConnection = () => async (dispatch: AppDispatch) => {
    dispatch(stopMockTelemetryUpdates());

    if (socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
        socket = null;
    }

    await initConnection()(dispatch);
};
