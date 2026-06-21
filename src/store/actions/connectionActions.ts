/**
 * @file connectionActions.ts
 * @description Redux actions for managing the WebSocket connection to the ASV basestation.
 *
 * @author Carson Fujita
 */

import { TELEMETRY_WS_URL, TELEMETRY_HTTP_BASE, CONNECTION_TIMEOUT_MS } from '../../config/connection';
import { setConnectionStatus, showToast } from '../slices/connectionSlice';
import { fetchTelemetrySuccess, startMockTelemetryUpdates, stopMockTelemetryUpdates } from './fetchTelemetry';
import { setVideoStreamUrl } from '../slices/videoSlice';
import type { AppDispatch } from '../store';
import type { Status } from '../../utils/types';
import { isBasestationOnline } from '../../utils/basestation';

// Module-level reference so the socket can be cleaned up if needed.
let socket: WebSocket | null = null;

function fallbackToMock(dispatch: AppDispatch) {
    dispatch(setConnectionStatus('mock'));
    dispatch(showToast({ message: 'Basestation unreachable — using simulation data', severity: 'warning' }));
    dispatch(startMockTelemetryUpdates());
}

/**
 * Attempts a WebSocket connection to the basestation.
 *
 * Flow:
 *  1. Health-check the HTTP server — if offline, silently start mock mode (no toast).
 *  2. If online, open WebSocket.
 *  3. On first data frame: mark connected and show success toast.
 *  4. On timeout or network failure: show warning and fall back to mock.
 */
export const initConnection = () => async (dispatch: AppDispatch) => {
    if (socket && socket.readyState <= WebSocket.OPEN) return;

    const online = await isBasestationOnline();

    if (!online) {
        dispatch(setConnectionStatus('mock'));
        dispatch(startMockTelemetryUpdates());
        return;
    }

    dispatch(setConnectionStatus('connecting'));

    socket = new WebSocket(TELEMETRY_WS_URL);

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

    // Defer "connected" toast until the first data frame arrives.
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
                const streamUrl = (rawData.video.streamUrl as string).startsWith('/')
                    ? `${TELEMETRY_HTTP_BASE}${rawData.video.streamUrl}`
                    : rawData.video.streamUrl as string;
                dispatch(setVideoStreamUrl(streamUrl));
            }

            dispatch(fetchTelemetrySuccess(rawData as Status));
        } catch {
            // ignore malformed frames
        }
    };

    socket.onclose = () => {
        if (!connected) {
            fallbackToMock(dispatch);
            return;
        }
        dispatch(showToast({ message: 'Connection lost — switching to simulation', severity: 'warning' }));
        fallbackToMock(dispatch);
    };

    socket.onerror = () => {
        // onclose fires immediately after onerror, no extra dispatch needed.
    };
};

/**
 * Stops any running mock interval, closes the current socket, then re-runs initConnection.
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
