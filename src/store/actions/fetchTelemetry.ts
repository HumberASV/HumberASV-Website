/**
 * @file fetchTelemetry.ts
 * 
 * @description
 * This file contains Redux action creators for fetching telemetry data from the basestation. 
 * It includes actions for handling successful data retrieval as well as error handling for failed attempts.
 * Additionally, it provides utility functions for starting and stopping mock telemetry updates, 
 * which can be used for testing purposes without needing a live WebSocket connection.
 * 
 * @author Carson Fujita
 * @license MIT
 */
import {
    FETCH_TELEMETRY_SUCCESS,
    FETCH_TELEMETRY_FAILURE,
} from '../../utils/types/telemetryInterfaces';

import generateRandomState, { generateMockStateUpdate } from '../../utils/telemetry/telemetryFactory';
import type { TelemetryActionTypes } from '../../utils/types/telemetryInterfaces';
import type { Status as TelemetryState } from '../types/status';
import type { AppDispatch } from '../index';
import { SET_STATUS } from '../slices/statusSlice';
/**
 * This action creator is dispatched when telemetry data is successfully received from the basestation.
 * @param data data - The telemetry data received, which includes various parameters such as speed, heading, battery levels, etc.
 * @returns An action object indicating successful telemetry fetch.
 */
export const fetchTelemetrySuccess = (data: TelemetryState): TelemetryActionTypes => ({
    type: FETCH_TELEMETRY_SUCCESS,
    payload: data
});

/**
 * This action creator is dispatched when there is an error in fetching telemetry data from the basestation.
 * @param error error - A string describing the error that occurred during the telemetry data fetch attempt.
 * @returns An action object indicating failed telemetry fetch, containing the error message.
 */
export const fetchTelemetryFailure = (error: string): TelemetryActionTypes => ({
    type: FETCH_TELEMETRY_FAILURE,
    payload: error
});

// Additional action creators for starting and stopping mock telemetry updates can be added here,
let mockTelemetryInterval: ReturnType<typeof setInterval> | null = null;
let mockTelemetryState: TelemetryState | null = null;

/** 
 * Starts a WebSocket connection to the basestation to receive telemetry data in real-time.
 * @remarks
 * - This script is responsible for establishing a WebSocket connection to the basestation 
 * and dispatching actions to update the telemetry state in the Redux store based on the data received.
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

/**
 * @description
 * This function generates mock telemetry data for testing purposes without needing a WebSocket connection. 
 * It can be used in development or testing environments to simulate receiving telemetry data.
 * 
 * @author Carson Fujita
 * @returns A thunk action that dispatches the generated mock telemetry data to the Redux store.
 * @remarks
 * - Optional utility function to generate random telemetry data for testing purposes without needing a WebSocket connection. 
 * - This can be used in development or testing environments to simulate receiving telemetry data.
 */
export const getMockStatus = () => {
    return (dispatch: AppDispatch) => {
        console.log("Generating mock telemetry data...");
        const data = generateRandomState();
        mockTelemetryState = data;
        dispatch(fetchTelemetrySuccess(data));
    };
};

/**
 * Starts generating mock telemetry updates at regular intervals.
 * @returns A thunk action that initiates the mock telemetry updates.
 */
export const startMockTelemetryUpdates = () => {
    return (dispatch: AppDispatch) => {
        if (mockTelemetryInterval) {
            return;
        }

        if (!mockTelemetryState) {
            mockTelemetryState = generateRandomState();
            dispatch(fetchTelemetrySuccess(mockTelemetryState));
        } else {
            dispatch(fetchTelemetrySuccess(mockTelemetryState));
        }

        mockTelemetryInterval = setInterval(() => {
            if (!mockTelemetryState) {
                return;
            }

            mockTelemetryState = generateMockStateUpdate(mockTelemetryState);
            dispatch(SET_STATUS(mockTelemetryState));
        }, 1000);
    };
};

/**
 * Stops generating mock telemetry updates.
 * @returns A thunk action that stops the mock telemetry updates.
 */
export const stopMockTelemetryUpdates = () => {
    return () => {
        if (mockTelemetryInterval) {
            clearInterval(mockTelemetryInterval);
            mockTelemetryInterval = null;
        }
    };
};

export const TelemetryActions = {
    fetchTelemetrySuccess,
    fetchTelemetryFailure,
    startTelemetryWebSocket,
    getMockStatus,
    startMockTelemetryUpdates,
    stopMockTelemetryUpdates
};