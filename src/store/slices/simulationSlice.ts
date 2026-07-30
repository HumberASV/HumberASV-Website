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

/**
 * @interface SimulationState
 * @description Represents the state of the simulation in the Redux store.
 * @property {Grid} fineGrid - The fine obstacle grid used for simulation, represented as a 2D array of cell states.
 * @property {number} currentHeading - The current heading of the vessel in degrees (0 = north, 90 = east).
 * @property {number} currentSpeed - The current speed of the vessel in cells per second.
 * @property {'automatic' | 'manual'} simMode - The current simulation mode, either 'automatic' or 'manual'.
 * @remarks
 * The simulation state is used to manage the fine obstacle grid and vessel dynamics during simulation. 
 * It allows for switching between automatic and manual modes, adjusting heading and speed, and updating the fine grid based on sensor data or user input.
 */
export interface SimulationState {
    fineGrid: Grid;
    currentHeading: number;
    currentSpeed: number;
    simMode: 'automatic' | 'manual';
}

/**
 * @constant initialState
 * @description Initial state of the simulation slice.
 * @type {SimulationState}
 * @remarks
 * The initial state sets the fine grid to an empty array, the current heading to 0 degrees, 
 * the current speed to 2.5 cells per second, and the simulation mode to 'automatic'. 
 * This state is used when the application first loads or when the simulation state is reset.
 */
const initialState: SimulationState = {
    fineGrid: [],
    currentHeading: 0,
    currentSpeed: 2.5,
    simMode: 'automatic',
};

/**
 * @constant simulationSlice
 * @description Redux slice for managing simulation-specific state.
 * @see {@link SimulationState} for the structure of the state.
 * @remarks
 * This slice provides actions and reducers to manage the fine obstacle grid, vessel heading, speed, and simulation mode. 
 * It includes actions to set the fine grid, update heading and speed, switch simulation modes, and reset the simulation state. 
 * The slice also includes selectors to access the current simulation state from the Redux store.
 */
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
