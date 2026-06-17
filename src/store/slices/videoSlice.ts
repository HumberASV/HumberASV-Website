/**
 * @file videoSlice.ts
 * @description Redux slice for managing the video stream URL for the ASV telemetry.
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface VideoState {
    streamUrl: string;
}

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