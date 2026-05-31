// Fetch from websocket

import {
    FETCH_TELEMETRY_SUCCESS,
    FETCH_TELEMETRY_FAILURE,
} from '../../telemetryInterfaces';
import generateRandomTelemetry, { generateMockTelemetryUpdate } from '../../factory/telemetryFactory';
import type { TelemetryActionTypes, TelemetryState } from '../../telemetryInterfaces';
import type { AppDispatch } from '../index';
import { setTelemetry } from '../telemetrySlice';

export const fetchTelemetrySuccess = (data: TelemetryState): TelemetryActionTypes => ({
    type: FETCH_TELEMETRY_SUCCESS,
    payload: data
});

export const fetchTelemetryFailure = (error: string): TelemetryActionTypes => ({
    type: FETCH_TELEMETRY_FAILURE,
    payload: error
});

let mockTelemetryInterval: ReturnType<typeof setInterval> | null = null;
let mockTelemetryState: TelemetryState | null = null;

/*

This script is responsible for establishing a WebSocket connection to the basestation and dispatching actions to update the telemetry state in the Redux store based on the data received.
*/
export const startTelemetryWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8080/telemetry');
    return (dispatch: AppDispatch) => {
        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            try {
                const data: TelemetryState = JSON.parse(event.data);
                dispatch(fetchTelemetrySuccess(data));
            } catch (error) {
                dispatch(fetchTelemetryFailure('Failed to parse telemetry data'));
                const message = error instanceof Error ? error.message : String(error);
                console.error('Error parsing telemetry data:', message);
            }
        };

        ws.onerror = () => {
            dispatch(fetchTelemetryFailure('WebSocket error'));
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };
};

/*
Optional utility function to generate random telemetry data for testing purposes without needing a WebSocket connection. 
This can be used in development or testing environments to simulate receiving telemetry data.
*/
export const getMockTelemetry = () => {
    return (dispatch: AppDispatch) => {
        console.log("Generating mock telemetry data...");
        const data = generateRandomTelemetry();
        mockTelemetryState = data;
        dispatch(fetchTelemetrySuccess(data));
    };
};

export const startMockTelemetryUpdates = () => {
    return (dispatch: AppDispatch) => {
        if (mockTelemetryInterval) {
            return;
        }

        if (!mockTelemetryState) {
            mockTelemetryState = generateRandomTelemetry();
            dispatch(fetchTelemetrySuccess(mockTelemetryState));
        } else {
            dispatch(fetchTelemetrySuccess(mockTelemetryState));
        }

        mockTelemetryInterval = setInterval(() => {
            if (!mockTelemetryState) {
                return;
            }

            mockTelemetryState = generateMockTelemetryUpdate(mockTelemetryState);
            dispatch(setTelemetry({
                speed: mockTelemetryState.speed,
                heading: mockTelemetryState.heading,
                signalStrength: mockTelemetryState.signalStrength,
                motorBatteries: mockTelemetryState.motorBatteries,
                powerBatteries: mockTelemetryState.powerBatteries,
                motor1Power: mockTelemetryState.motor1Power,
                motor2Power: mockTelemetryState.motor2Power,
                rudderAngle: mockTelemetryState.rudderAngle,
                taskLog: mockTelemetryState.taskLog,
            }));
        }, 1000);
    };
};

export const stopMockTelemetryUpdates = () => {
    return () => {
        if (mockTelemetryInterval) {
            clearInterval(mockTelemetryInterval);
            mockTelemetryInterval = null;
        }
    };
};

export const TelemetryActions = {
    startTelemetryWebSocket,
    getMockTelemetry,
    startMockTelemetryUpdates,
    stopMockTelemetryUpdates,
};