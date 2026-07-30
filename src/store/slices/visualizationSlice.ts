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

/**
 * @interface VisualizationState
 * @description Represents the state of visual rendering preferences in the Redux store.
 * @property {boolean} showGlobalGrid - Whether to show the global grid layer.
 * @property {boolean} showGlobalAxes - Whether to show the global axes.
 * @property {boolean} showLegend - Whether to show the legend.
 * @property {boolean} showCompass - Whether to show the compass.
 * @property {boolean} showControls - Whether to show the controls.
 * @property {boolean} showLocalAxes - Whether to show the local axes.
 * @property {boolean} showLocalGrid - Whether to show the local grid layer.
 * @property {boolean} showCourseTrail - Whether to show the course trail.
 * @property {boolean} showFogOfWar - Whether to show the fog of war effect.
 * @remarks
 * The visualization state is used to manage user preferences for visual rendering in the application. 
 * It allows toggling various visual elements on or off, providing a customizable viewing experience for the user.
 */
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

/**
 * @constant initialState
 * @description Initial state of the visualization slice.
 * @type {VisualizationState}
 * @remarks
 * The initial state sets all visual rendering preferences to true, enabling all visual elements by default. 
 * This state is used when the application first loads or when the visualization state is reset.
 * @see {@link VisualizationState} for the structure of the state.
 */
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

/**
 * @constant visualizationSlice
 * @description Redux slice for managing visual rendering preferences.
 * @see {@link VisualizationState} for the structure of the state.
 * @remarks
 * This slice provides actions and reducers to manage user preferences for visual rendering in the application. 
 * It includes actions to toggle the visibility of various visual elements and to reset the visualization state to its initial values. 
 * The slice also includes selectors to access the current visualization state from the Redux store.
 */
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
