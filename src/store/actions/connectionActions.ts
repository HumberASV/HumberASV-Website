import { TELEMETRY_WS_URL, CONNECTION_TIMEOUT_MS } from '../../config/connection';
import { setConnectionStatus, showToast } from '../slices/connectionSlice';
import { fetchTelemetrySuccess, startMockTelemetryUpdates, stopMockTelemetryUpdates } from './fetchTelemetry';
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
            const data: Status = JSON.parse(event.data as string);
            dispatch(fetchTelemetrySuccess(data));
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
