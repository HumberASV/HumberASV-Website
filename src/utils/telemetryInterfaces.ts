/*

All interfaces related to telemetry data and components are defined in this file. This includes the structure of telemetry data, as well as any props that telemetry components may require.

MIT License

Copyright (c) 2026 HumberASV
Copyright (c) 2026 Carson Fujita

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * Token interface for the Connect page. 
 * This is used to store the token entered by the user to connect to the basestation.
 */
type Token = {
    token: string;
};

const initialTokenState: Token = {
    token: '',
};

export const checkToken = (token: string): boolean => {
    // Check if the token is valid (for now, just check if it's not empty)
    return token.trim() !== '';
};

export { initialTokenState };
export type { Token };

// Telemetry interfaces and initial state
export type TaskLocation = {
    id?: string;
    latitude: number;
    longitude: number;

};

export type TaskData = {
    id: number;
    name: string;
    status: TaskStatus;
    latitude: number;
    longitude: number;
};

export const TaskValues = {
    Autonomous: "autonomous",
    Remote: "remote",
    Standby: "standby",
    LostConnection: "lost connection",
    OutOfControl: "out of control"
};

export type TaskStatus = typeof TaskValues[keyof typeof TaskValues];

export const GridValues = {
    empty: 0,
    occupied: 1,
    path:2,
    current: 3,
    objective: 4
}
export type GridItem = typeof GridValues[keyof typeof GridValues];

export type GridPoint = {
    row: number;
    col: number;
};

export type TelemetryState = {
    token: string;
    speed: number;
    heading: number;
    taskData: TaskData | null;
    status: string;
    latitude: number;
    longitude: number;
    signalStrength: number;
    motorBatteries: number[];
    powerBatteries: number[];
    motor1Power: number;
    motor2Power: number;
    rudderAngle: number;
    taskLog: string[];
    taskLocations: TaskLocation[];
    occupancyGrid: GridItem[][];
    navigationGrid: GridItem[][];
    plannedPath: GridPoint[];
    imageStream: string;
};



export const initialTelemetryState: TelemetryState = {
    token: '',
    speed: 0,
    heading: 0,
    taskData: null,
    status: '',
    latitude: 0,
    longitude: 0,
    signalStrength: 0,
    motorBatteries: [],
    powerBatteries: [],
    motor1Power: 0,
    motor2Power: 0,
    rudderAngle: 0,
    taskLog: [],
    taskLocations: [],
    occupancyGrid: [],
    navigationGrid: [],
    plannedPath: [],
    imageStream: '',
};

export const FETCH_TELEMETRY_SUCCESS = 'FETCH_TELEMETRY_SUCCESS';
export const FETCH_TELEMETRY_FAILURE = 'FETCH_TELEMETRY_FAILURE';

interface FetchTelemetrySuccessAction {
    [extraProps: string]: unknown;
    type: typeof FETCH_TELEMETRY_SUCCESS;
    payload: TelemetryState;
}

interface FetchTelemetryFailureAction {
    [extraProps: string]: unknown;
    type: typeof FETCH_TELEMETRY_FAILURE;
    payload: string; // error message
}

export type TelemetryActionTypes = FetchTelemetrySuccessAction | FetchTelemetryFailureAction;