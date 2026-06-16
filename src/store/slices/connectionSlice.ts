import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TELEMETRY_WS_URL } from '../../config/connection';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'mock';

interface ToastState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

interface ConnectionState {
    status: ConnectionStatus;
    url: string;
    toast: ToastState;
}

const initialState: ConnectionState = {
    status: 'idle',
    url: TELEMETRY_WS_URL,
    toast: { open: false, message: '', severity: 'info' },
};

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setConnectionStatus(state, action: PayloadAction<ConnectionStatus>) {
            state.status = action.payload;
        },
        showToast(state, action: PayloadAction<Pick<ToastState, 'message' | 'severity'>>) {
            state.toast = { open: true, ...action.payload };
        },
        dismissToast(state) {
            state.toast.open = false;
        },
    },
});

export const { setConnectionStatus, showToast, dismissToast } = connectionSlice.actions;
export default connectionSlice.reducer;
