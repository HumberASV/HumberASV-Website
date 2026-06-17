
/**
 * @file statusSlice.ts
 * @description Implements the Redux slice for managing the ASV telemetry status in the application.
 * This slice includes actions and reducers for updating the status of the ASV, including map data, planning information, task details, power levels, rudder angle, ASV state, and signal strength.
 * It also handles the FETCH_TELEMETRY_SUCCESS action to update the entire status state when new telemetry data is received.
 * 
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice } from '@reduxjs/toolkit';
import { InitialStatus } from '../../utils/types';
import type { Status, Path, Grid, TaskLocation, TaskData, CourseTrailEntry } from '../../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FETCH_TELEMETRY_SUCCESS } from '../../utils/types/telemetryInterfaces';

const statusSlice = createSlice({
    name: 'status',
    initialState: InitialStatus as Status,
    reducers: {
        SET_STATUS: (state, action: PayloadAction<Partial<Status>>) => {
            // Destructure map out so we never replace state.map wholesale.
            // Replacing the whole object would wipe courseTrail (a client-only field
            // that factory/server payloads never include).
            const { map: incomingMap, ...rest } = action.payload;
            Object.assign(state, rest);
            if (incomingMap) {
                if ('occupancyGrid'  in incomingMap) state.map.occupancyGrid  = incomingMap.occupancyGrid!;
                if ('navigationGrid' in incomingMap) state.map.navigationGrid = incomingMap.navigationGrid!;
                if ('fineGrid'       in incomingMap) state.map.fineGrid       = incomingMap.fineGrid!;
            }
        },
        setMapOccupancyGrid: (state, action: PayloadAction<Grid>) => { state.map.occupancyGrid = action.payload; },
        setMapNavigationGrid: (state, action: PayloadAction<Grid>) => { state.map.navigationGrid = action.payload; },
        setPlanningStatus: (state, action: PayloadAction<string>) => { state.planning.status = action.payload; },
        setPlanningCourse: (state, action: PayloadAction<Path>) => { state.planning.course = action.payload; },
        setPlanningPlan: (state, action: PayloadAction<Path>) => { state.planning.plan = action.payload; },
        setTaskLog: (state, action: PayloadAction<string[]>) => { state.task.log = action.payload; },
        setTaskLocation: (state, action: PayloadAction<TaskLocation>) => { state.task.location = action.payload; },
        setTaskData: (state, action: PayloadAction<TaskData>) => { state.task.data = action.payload; },
        setRudderAngle: (state, action: PayloadAction<number>) => { state.rudder.angle = action.payload; },
        setPowerMotors: (state, action: PayloadAction<number>) => { state.battery.motors = action.payload; },
        setPowerPrimary: (state, action: PayloadAction<number>) => { state.battery.primary = action.payload; },
        setASVSpeed: (state, action: PayloadAction<number>) => { state.asv.speed = action.payload; },
        setLeftPower: (state, action: PayloadAction<number>) => { state.motors.left = action.payload; },
        setRightPower: (state, action: PayloadAction<number>) => { state.motors.right = action.payload; },
        setASVHeading: (state, action: PayloadAction<number>) => { state.asv.heading = action.payload; },
        setASVLongitude: (state, action: PayloadAction<number>) => { state.asv.longitude = action.payload; },
        setASVLatitude: (state, action: PayloadAction<number>) => { state.asv.latitude = action.payload; },
        setSignalStrength: (state, action: PayloadAction<number>) => { state.signal.strength = action.payload; },
        appendCourseTrailCell: (state, action: PayloadAction<CourseTrailEntry>) => {
            const { col, row } = action.payload;
            const exists = state.map.courseTrail.some(c => c.col === col && c.row === row);
            if (!exists) state.map.courseTrail.push(action.payload);
        },
        clearCourseTrail: (state) => { state.map.courseTrail = []; },
    },
    extraReducers: (builder) => {
        builder.addCase(FETCH_TELEMETRY_SUCCESS, (state, action) => {
            const payload = (action as PayloadAction<Status>).payload;
            const { map: incomingMap, ...rest } = payload;
            Object.assign(state, rest);
            if (incomingMap) {
                if ('occupancyGrid'  in incomingMap) state.map.occupancyGrid  = incomingMap.occupancyGrid;
                if ('navigationGrid' in incomingMap) state.map.navigationGrid = incomingMap.navigationGrid;
                if ('fineGrid'       in incomingMap) state.map.fineGrid       = incomingMap.fineGrid;
            }
            // courseTrail is never in server/factory payloads — initialize only if missing
            if (!state.map.courseTrail) state.map.courseTrail = [];
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
    setRudderAngle,
    setASVSpeed,
    setPowerMotors,
    setPowerPrimary,
    setASVHeading,
    setASVLongitude,
    setASVLatitude,
    setSignalStrength,
    appendCourseTrailCell,
    clearCourseTrail,
} = statusSlice.actions;

export default statusSlice.reducer;