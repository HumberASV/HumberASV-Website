/**
 * @file videoSlice.ts
 * @description Redux slice for managing the video stream URL for the ASV telemetry.
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * @interface VideoState
 * @description Represents the state of the video stream in the Redux store.
 * @property {string} streamUrl - The URL of the video stream for the ASV telemetry.
 */
export interface VideoState {
    streamUrl: string;
}

/**
 * @constant initialState
 * @description Initial state of the video slice.
 * @type {VideoState}
 */
const initialState: VideoState = {
    streamUrl: '',
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideoStreamUrl: (state, action: PayloadAction<string>) => {
            state.streamUrl = action.payload;
        },
    },
});

export const { setVideoStreamUrl } = videoSlice.actions;
export default videoSlice.reducer;