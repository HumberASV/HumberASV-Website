import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { initialTelemetryState } from '../../utils/telemetryInterfaces';
import { FETCH_TELEMETRY_SUCCESS } from '../../utils/telemetryInterfaces';
import type { TelemetryState } from '../../utils/telemetryInterfaces';

const telemetrySlice = createSlice({
    name: 'telemetry',
    initialState: initialTelemetryState as TelemetryState,
    reducers: {
        setTelemetry: (state, action: PayloadAction<Partial<TelemetryState>>) => {
            Object.assign(state, action.payload);
        },
        setToken: (state, action: PayloadAction<string>) => { state.token = action.payload; },
        setSpeed: (state, action: PayloadAction<number>) => { state.speed = action.payload; },
        setHeading: (state, action: PayloadAction<number>) => { state.heading = action.payload; },
        setTaskData: (state, action: PayloadAction<any>) => { state.taskData = action.payload; },
        setSignalStrength: (state, action: PayloadAction<number>) => { state.signalStrength = action.payload; },
        setMotorBatteries: (state, action: PayloadAction<number[]>) => { state.motorBatteries = action.payload; },
        setPowerBatteries: (state, action: PayloadAction<number[]>) => { state.powerBatteries = action.payload; },
        setMotor1Power: (state, action: PayloadAction<number>) => { state.motor1Power = action.payload; },
        setMotor2Power: (state, action: PayloadAction<number>) => { state.motor2Power = action.payload; },
        setRudderAngle: (state, action: PayloadAction<number>) => { state.rudderAngle = action.payload; },
        setStatus: (state, action: PayloadAction<string>) => { state.status = action.payload; },
        setLatitude: (state, action: PayloadAction<number>) => { state.latitude = action.payload; },
        setLongitude: (state, action: PayloadAction<number>) => { state.longitude = action.payload; },
        setTaskLog: (state, action: PayloadAction<string[]>) => { state.taskLog = action.payload; },
        setTaskLocations: (state, action: PayloadAction<any[]>) => { state.taskLocations = action.payload; },
        setOccupancyGrid: (state, action: PayloadAction<number[][]>) => { state.occupancyGrid = action.payload; },
        setNavigationGrid: (state, action: PayloadAction<number[][]>) => { state.navigationGrid = action.payload; },
        setImageStream: (state, action: PayloadAction<string>) => { state.imageStream = action.payload; },
    },
    extraReducers: (builder) => {
        builder.addCase(FETCH_TELEMETRY_SUCCESS, (state, action: any) => {
            Object.assign(state, action.payload);
        });
    },
});

export const {
    setTelemetry,
    setToken,
    setSpeed,
    setHeading,
    setTaskData,
    setSignalStrength,
    setMotorBatteries,
    setPowerBatteries,
    setMotor1Power,
    setMotor2Power,
    setRudderAngle,
    setStatus,
    setLatitude,
    setLongitude,
    setTaskLog,
    setTaskLocations,
    setOccupancyGrid,
    setNavigationGrid,
    setImageStream,
} = telemetrySlice.actions;

export default telemetrySlice.reducer;
