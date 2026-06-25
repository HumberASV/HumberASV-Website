/**
 * @file VisualizerSlice.tsx
 * @description Shows control options for the Visualizers.
 * These don't control the ASV itself, but rather the visual representation of the ASV and its environment.
 * 
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Grid } from '../../utils/types';

/**
 * Represents the state of the controls for the ASV visualizer.
 * @value showGlobalGrid - Whether to show the global grid in the visualizer.
 * @value showGlobalAxes - Whether to show the global axes in the visualizer.
 * @value showLegend - Whether to show the legend in the visualizer.
 * @value showCompass - Whether to show the compass in the visualizer.
 * @value showControls - Whether to show the control panel in the visualizer.
 * @value showLocalAxes - Whether to show the local axes in the visualizer.
 * @value activeTab - The index of the currently active tab in the control panel.
 * @value simMode - The current simulation mode (automatic or manual).
 */
export interface ControlsState {
    fineGrid: Grid;
    currentHeading: number;
    currentSpeed: number;
    showGlobalGrid: boolean;
    showGlobalAxes: boolean;
    showLegend: boolean;
    showCompass: boolean;
    showControls: boolean;
    showLocalAxes: boolean;
    showLocalGrid: boolean;
    showCourseTrail: boolean;
    activeTab: number;
    simMode: 'automatic' | 'manual';
}

const initialState: ControlsState = {
    fineGrid: [],
    currentHeading: 0,
    currentSpeed: 2.5,
    showGlobalGrid: true,
    showGlobalAxes: true,
    showLegend: true,
    showCompass: true,
    showControls: true,
    showLocalAxes: true,
    showLocalGrid: true,
    showCourseTrail: true,
    activeTab: 0,
    simMode: 'automatic',
};

export const controlsSlice = createSlice({
    name: 'controls',
    initialState,
    reducers: {
        setCurrentHeading: (state, action: PayloadAction<number>) => {
            state.currentHeading = action.payload;
        },
        setCurrentSpeed: (state, action: PayloadAction<number>) => {
            state.currentSpeed = action.payload;
        },
        setFineGrid: (state, action: PayloadAction<Grid>) => {
            state.fineGrid = action.payload;
        },
        setShowGlobalGrid: (state, action: PayloadAction<boolean>) => {
            state.showGlobalGrid = action.payload;
        },
        setShowGlobalAxes: (state, action: PayloadAction<boolean>) => {
            state.showGlobalAxes = action.payload;
        },
        setShowLegend: (state, action: PayloadAction<boolean>) => {
            state.showLegend = action.payload;
        },
        setShowCompass: (state, action: PayloadAction<boolean>) => {
            state.showCompass = action.payload;
        },
        setShowControls: (state, action: PayloadAction<boolean>) => {
            state.showControls = action.payload;
        },
        setShowLocalAxes: (state, action: PayloadAction<boolean>) => {
            state.showLocalAxes = action.payload;
        },
        setShowLocalGrid: (state, action: PayloadAction<boolean>) => {
            state.showLocalGrid = action.payload;
        },
        setShowCourseTrail: (state, action: PayloadAction<boolean>) => {
            state.showCourseTrail = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<number>) => {
            state.activeTab = action.payload;
        },
        setSimMode: (state, action: PayloadAction<'automatic' | 'manual'>) => {
            state.simMode = action.payload;
        },
        /** Resets all controls and simulation parameters to their default values */
        resetControls: () => initialState,
    },
});

export const {
    setCurrentHeading, setCurrentSpeed, setFineGrid,
    setShowGlobalGrid, setShowGlobalAxes, setShowLegend,
    setShowCompass, setShowControls,
    setShowLocalAxes, setShowLocalGrid, setShowCourseTrail, setActiveTab, setSimMode, resetControls,
} = controlsSlice.actions;

export default controlsSlice.reducer;