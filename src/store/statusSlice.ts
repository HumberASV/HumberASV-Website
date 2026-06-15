
/**
 * @file statusSlice.ts
 * @description Implements the Redux slice for managing the ASV telemetry status in the application.
 * This slice includes actions and reducers for updating the status of the ASV, including map data, planning information, task details, power levels, rudder angle, ASV state, signal strength, and video stream URL.
 * It also handles the FETCH_TELEMETRY_SUCCESS action to update the entire status state when new telemetry data is received.
 * 
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice } from '@reduxjs/toolkit';
import { InitialStatus } from '../utils/types';
import type { Status, Path, Grid, TaskLocation, TaskData } from '../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FETCH_TELEMETRY_SUCCESS } from './telemetryInterfaces';
const statusSlice = createSlice({
    name: 'status',
    initialState: InitialStatus as Status,
    reducers: {
        SET_STATUS: (state, action: PayloadAction<Partial<Status>>) => {
            Object.assign(state, action.payload);
        },
        setMapOccupancyGrid: (state, action: PayloadAction<Grid>) => { state.map.occupancyGrid = action.payload; },
        setMapNavigationGrid: (state, action: PayloadAction<Grid>) => { state.map.navigationGrid = action.payload; },
        setPlanningStatus: (state, action: PayloadAction<string>) => { state.planning.status = action.payload; },
        setPlanningCourse: (state, action: PayloadAction<Path>) => { state.planning.course = action.payload; },
        setPlanningPlan: (state, action: PayloadAction<Path>) => { state.planning.plan = action.payload; },
        setTaskLog: (state, action: PayloadAction<string[]>) => { state.task.log = action.payload; },
        setTaskLocation: (state, action: PayloadAction<TaskLocation>) => { state.task.location = action.payload; },
        setTaskData: (state, action: PayloadAction<TaskData>) => { state.task.data = action.payload; },
        setPowerMotors: (state, action: PayloadAction<number>) => { state.power.motors = action.payload; },
        setPowerPrimary: (state, action: PayloadAction<number>) => { state.power.primary = action.payload; },
        setRudderAngle: (state, action: PayloadAction<number>) => { state.rudder.angle = action.payload; },
        setASVSpeed: (state, action: PayloadAction<number>) => { state.asv.speed = action.payload; },
        setLeftPower: (state, action: PayloadAction<number>) => { state.motors.left = action.payload; },
        setRightPower: (state, action: PayloadAction<number>) => { state.motors.right = action.payload; },
        setASVHeading: (state, action: PayloadAction<number>) => { state.asv.heading = action.payload; },
        setASVLongitude: (state, action: PayloadAction<number>) => { state.asv.longitude = action.payload; },
        setASVLatitude: (state, action: PayloadAction<number>) => { state.asv.latitude = action.payload; },
        setSignalStrength: (state, action: PayloadAction<number>) => { state.signal.strength = action.payload; },
        setVideoStreamUrl: (state, action: PayloadAction<string>) => { state.video.streamUrl = action.payload; },
    },
    extraReducers: (builder) => {
        builder.addCase(FETCH_TELEMETRY_SUCCESS, (state, action: any) => {
            Object.assign(state, action.payload);
        });
    },
});

export const {
    SET_STATUS,
    setMapOccupancyGrid,
    setMapNavigationGrid,
    setPlanningStatus,
    setPlanningCourse,
    setPlanningPlan,
    setTaskLog,
    setTaskLocation,
    setTaskData,
    setLeftPower,
    setRightPower,
    setPowerMotors,
    setPowerPrimary,
    setRudderAngle,
    setASVSpeed,
    setASVHeading,
    setASVLongitude,
    setASVLatitude,
    setSignalStrength,
    setVideoStreamUrl
} = statusSlice.actions;

export default statusSlice.reducer;