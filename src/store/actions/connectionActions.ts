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
import { setSensorDriven, resetFog } from '../slices/fogOfWarSlice';
import type { AppDispatch } from '../store';
import type { Status } from '../../utils/types';
import { isBasestationOnline } from '../../utils/basestation';

// Module-level reference so the socket can be cleaned up if needed.
let socket: WebSocket | null = null;

function fallbackToMock(dispatch: AppDispatch) {
    dispatch(setSensorDriven(false));
    dispatch(resetFog());
    dispatch(setConnectionStatus('mock'));
    dispatch(showToast({ message: 'Basestation unreachable — using simulation data', severity: 'warning' }));
    dispatch(startMockTelemetryUpdates());
}

function failedToConnect(dispatch: AppDispatch) {
    dispatch(setSensorDriven(false));
    dispatch(setConnectionStatus('failed'));
    // Pre-populate the map with simulation data so the visualizer has something to show.
    // retryConnection calls stopMockTelemetryUpdates first, so this is safe to re-run on retry.
    dispatch(startMockTelemetryUpdates());
}

/**
 * Attempts a WebSocket connection to the basestation.
 *
 * @param options.silentFail - When true (auto-retry from mock mode), failures stay in mock
 *   rather than transitioning to 'failed'. This prevents the dashboard from being replaced
 *   by the connection interstitial during background retries.
 *
 * Flow:
 *  1. Health-check the HTTP server.
 *  2. If online, open WebSocket.
 *  3. On first data frame: mark connected and show success toast.
 *  4. On failure: silentFail → stay in mock; else → 'failed' (interstitial in Connect.tsx).
 */
export const initConnection = (options: { silentFail?: boolean } = {}) => async (dispatch: AppDispatch) => {
    const { silentFail = false } = options;

    if (socket && socket.readyState <= WebSocket.OPEN) return;

    if (!silentFail) {
        dispatch(setConnectionStatus('connecting'));
    }

    const online = await isBasestationOnline();

    if (!online) {
        if (silentFail) {
            // Reset from 'connecting' (set by retryConnection) back to mock.
            dispatch(setConnectionStatus('mock'));
            dispatch(startMockTelemetryUpdates());
        } else {
            failedToConnect(dispatch);
        }
        return;
    }

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
        silentFail ? fallbackToMock(dispatch) : failedToConnect(dispatch);
        return;
    }

    // Defer "connected" toast until the first data frame arrives.
    let connected = false;

    socket.onmessage = (event) => {
        if (!connected) {
            connected = true;
            dispatch(setConnectionStatus('connected'));
            dispatch(setSensorDriven(true));
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
            // Socket closed before any data — treat same as failed-to-open.
            silentFail ? fallbackToMock(dispatch) : failedToConnect(dispatch);
            return;
        }
        // Mid-session disconnect: stay on dashboard in mock mode.
        dispatch(showToast({ message: 'Connection lost — switching to simulation', severity: 'warning' }));
        fallbackToMock(dispatch);
    };

    socket.onerror = () => {
        // onclose fires immediately after onerror, no extra dispatch needed.
    };
};

/**
 * Auto-retry used by Telemetry.tsx while in mock mode. Failures stay in mock
 * so the dashboard remains visible.
 */
export const retryConnection = () => async (dispatch: AppDispatch) => {
    dispatch(stopMockTelemetryUpdates());
    dispatch(setConnectionStatus('connecting'));

    if (socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
        socket = null;
    }

    await initConnection({ silentFail: true })(dispatch);
};

/**
 * User-initiated reconnect from the 'failed' interstitial. Failures return to
 * 'failed' so the interstitial is shown again.
 */
export const reconnect = () => async (dispatch: AppDispatch) => {
    dispatch(stopMockTelemetryUpdates());

    if (socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
        socket = null;
    }

    await initConnection()(dispatch);
};

/**
 * Transitions from 'failed' to 'mock', starting simulation data.
 * Called when the user clicks "Use Simulation Data" on the failed interstitial.
 */
export const startSimulation = () => (dispatch: AppDispatch) => {
    dispatch(setConnectionStatus('mock'));
    dispatch(startMockTelemetryUpdates());
};
