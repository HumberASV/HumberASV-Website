
/**
 * @file telemetrySlice.ts
 * @description Redux slice for all ASV telemetry data received from the basestation.
 * Renamed from statusSlice.ts; slice name kept as 'status' to preserve DevTools history.
 *
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice } from '@reduxjs/toolkit';
import { InitialStatus } from '../../utils/types';
import type { Status, Path, Grid, TaskLocation, TaskData, CourseTrailPoint, ZedPosition, ZedOrientation } from '../../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FETCH_TELEMETRY_SUCCESS } from '../../utils/types/telemetryInterfaces';
import type { DetectedObject } from '../../utils/types';

const telemetrySlice = createSlice({
    name: 'status',
    initialState: InitialStatus as Status,
    reducers: {
        SET_STATUS: (state, action: PayloadAction<Partial<Status>>) => {
            const { map: incomingMap, ...rest } = action.payload;
            Object.assign(state, rest);
            if (incomingMap) {
                if ('occupancyGrid'  in incomingMap) state.map.occupancyGrid  = incomingMap.occupancyGrid!;
                if ('navigationGrid' in incomingMap) state.map.navigationGrid = incomingMap.navigationGrid!;
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
        setZedOdomPosition: (state, action: PayloadAction<ZedPosition>) => { state.zed.odom.position = action.payload; },
        setZedOdomOrientation: (state, action: PayloadAction<ZedOrientation>) => { state.zed.odom.orientation = action.payload; },
        setZedObjects: (state, action: PayloadAction<DetectedObject[]>) => { state.zed.objects = action.payload; },
        setZedCameraActive: (state, action: PayloadAction<boolean>) => { state.zed.camera.active = action.payload; },
        setZedCameraInfo: (state, action: PayloadAction<{ width: number; height: number; encoding: string }>) => {
            state.zed.camera.width = action.payload.width;
            state.zed.camera.height = action.payload.height;
            state.zed.camera.encoding = action.payload.encoding;
        },
        appendCourseTrailPoint: (state, action: PayloadAction<CourseTrailPoint>) => {
            if (state.map.courseTrail.length >= 500) {
                state.map.courseTrail.shift();
            }
            state.map.courseTrail.push(action.payload);
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
            }
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
    appendCourseTrailPoint,
    clearCourseTrail,
    setZedOdomPosition,
    setZedOdomOrientation,
    setZedObjects,
    setZedCameraActive,
    setZedCameraInfo,
} = telemetrySlice.actions;

export default telemetrySlice.reducer;
