import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_VELOCITY } from '../../utils/types';

export interface ControlsState {
    showGlobalGrid: boolean;
    showGlobalAxes: boolean;
    showLegend: boolean;
    showCompass: boolean;
    showControls: boolean;
    velocity: number;
    objectHeading: number;
    currentHeading: number;
    localRotation: number;
    showLocalAxes: boolean;
    activeTab: number;
}

const initialState: ControlsState = {
    showGlobalGrid: true,
    showGlobalAxes: true,
    showLegend: true,
    showCompass: true,
    showControls: true,
    velocity: DEFAULT_VELOCITY,
    objectHeading: 0,
    currentHeading: 0,
    localRotation: 0,
    showLocalAxes: true,
    activeTab: 0,
};

export const controlsSlice = createSlice({
    name: 'controls',
    initialState,
    reducers: {
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
        setVelocity: (state, action: PayloadAction<number>) => {
            state.velocity = action.payload;
        },
        setObjectHeading: (state, action: PayloadAction<number>) => {
            state.objectHeading = action.payload;
        },
        setCurrentHeading: (state, action: PayloadAction<number>) => {
            state.currentHeading = action.payload;
        },
        setLocalRotation: (state, action: PayloadAction<number>) => {
            state.localRotation = action.payload;
        },
        setShowLocalAxes: (state, action: PayloadAction<boolean>) => {
            state.showLocalAxes = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<number>) => {
            state.activeTab = action.payload;
        },
        /** Resets all controls and simulation parameters to their default values */
        resetControls: () => initialState,
    },
});

export const {
    setShowGlobalGrid, setShowGlobalAxes, setShowLegend,
    setShowCompass, setShowControls, setVelocity,
    setObjectHeading, setCurrentHeading, setLocalRotation,
    setShowLocalAxes, setActiveTab, resetControls,
} = controlsSlice.actions;

export default controlsSlice.reducer;