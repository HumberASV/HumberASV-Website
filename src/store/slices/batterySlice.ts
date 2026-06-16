/**
 * @file Power.ts
 * @description Implements the Redux slice for managing the ASV telemetry power status in the application.
 * This slice includes actions and reducers for updating the power status of the ASV
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice } from '@reduxjs/toolkit';
import { initialBatteryPower } from '../../utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

const batterySlice = createSlice({
    name: 'power',
    initialState: initialBatteryPower,
    reducers: {
        setPowerMotors: (state, action: PayloadAction<number>) => { state.motors = action.payload; },
        setPowerPrimary: (state, action: PayloadAction<number>) => { state.primary = action.payload; },
    },
    // extraReducers: (builder) => {
    //     builder.addCase(FETCH_TELEMETRY_SUCCESS, (state, action) => {
           
    //     });
    // },
});

export const {
    setPowerMotors,
    setPowerPrimary,
} = batterySlice.actions;

export default batterySlice.reducer;