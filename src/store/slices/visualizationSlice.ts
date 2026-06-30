/**
 * @file visualizationSlice.ts
 * @description Redux slice for visual rendering preferences: show/hide toggles for
 * grid layers, axes, legend, compass, and fog of war. Renamed from visualizerSlice;
 * simulation fields (fineGrid, heading, speed, simMode) live in simulationSlice.
 *
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface VisualizationState {
    showGlobalGrid: boolean;
    showGlobalAxes: boolean;
    showLegend: boolean;
    showCompass: boolean;
    showControls: boolean;
    showLocalAxes: boolean;
    showLocalGrid: boolean;
    showCourseTrail: boolean;
    showFogOfWar: boolean;
}

const initialState: VisualizationState = {
    showGlobalGrid: true,
    showGlobalAxes: true,
    showLegend: true,
    showCompass: true,
    showControls: true,
    showLocalAxes: true,
    showLocalGrid: true,
    showCourseTrail: true,
    showFogOfWar: true,
};

export const visualizationSlice = createSlice({
    name: 'visualization',
    initialState,
    reducers: {
        setShowGlobalGrid:  (state, action: PayloadAction<boolean>) => { state.showGlobalGrid  = action.payload; },
        setShowGlobalAxes:  (state, action: PayloadAction<boolean>) => { state.showGlobalAxes  = action.payload; },
        setShowLegend:      (state, action: PayloadAction<boolean>) => { state.showLegend      = action.payload; },
        setShowCompass:     (state, action: PayloadAction<boolean>) => { state.showCompass      = action.payload; },
        setShowControls:    (state, action: PayloadAction<boolean>) => { state.showControls    = action.payload; },
        setShowLocalAxes:   (state, action: PayloadAction<boolean>) => { state.showLocalAxes   = action.payload; },
        setShowLocalGrid:   (state, action: PayloadAction<boolean>) => { state.showLocalGrid   = action.payload; },
        setShowCourseTrail: (state, action: PayloadAction<boolean>) => { state.showCourseTrail = action.payload; },
        setShowFogOfWar:    (state, action: PayloadAction<boolean>) => { state.showFogOfWar    = action.payload; },
        resetVisualization: () => initialState,
    },
});

export const {
    setShowGlobalGrid, setShowGlobalAxes, setShowLegend,
    setShowCompass, setShowControls, setShowLocalAxes,
    setShowLocalGrid, setShowCourseTrail, setShowFogOfWar,
    resetVisualization,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;
