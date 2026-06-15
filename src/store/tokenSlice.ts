/**
 * @file tokenSlice.ts
 * 
 * @description
 * React Redux Slice for token data. 
 * This is used to store the latest token data received from the basestation, as well as the connection status and any errors that may occur.
 *
 * @author Carson Fujita
 * @license MIT 
 * @remarks
 * - This slice is responsible for managing the token data received from the basestation, including the current token value, connection status, and any errors that may occur during the connection process.
 * - The slice includes actions for setting the token value and updating the connection status, as well as reducers to handle these actions and update the state accordingly.
 * - The token data is essential for authenticating with the basestation and receiving telemetry data, so this slice plays a crucial role in the overall functionality of the application.
 * /
/*
MIT License

Copyright (c) 2026 HumberASV
Copyright (c) 2026 Carson Fujita

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { initialTokenState } from '../utils/types/tokenType';

/**
 * Redux slice for managing token data received from the basestation.
 * This slice includes the current token value, connection status, and any errors that may occur during the connection process.
 */
export const tokenSlice = createSlice({
    name: 'token',
    initialState: initialTokenState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        }
    },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;