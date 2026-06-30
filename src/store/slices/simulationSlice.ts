/**
 * @file simulationSlice.ts
 * @description Redux slice for simulation-specific state: the fine obstacle grid,
 * vessel heading/speed, and current simulation mode. Extracted from visualizerSlice.
 *
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Grid } from '../../utils/types';

export interface SimulationState {
    fineGrid: Grid;
    currentHeading: number;
    currentSpeed: number;
    simMode: 'automatic' | 'manual';
}

const initialState: SimulationState = {
    fineGrid: [],
    currentHeading: 0,
    currentSpeed: 2.5,
    simMode: 'automatic',
};

export const simulationSlice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {
        setFineGrid: (state, action: PayloadAction<Grid>) => {
            state.fineGrid = action.payload;
        },
        setCurrentHeading: (state, action: PayloadAction<number>) => {
            state.currentHeading = action.payload;
        },
        setCurrentSpeed: (state, action: PayloadAction<number>) => {
            state.currentSpeed = action.payload;
        },
        setSimMode: (state, action: PayloadAction<'automatic' | 'manual'>) => {
            state.simMode = action.payload;
        },
        resetSimulation: () => initialState,
    },
});

export const { setFineGrid, setCurrentHeading, setCurrentSpeed, setSimMode, resetSimulation } = simulationSlice.actions;

export default simulationSlice.reducer;
