/**
 * @file src/utils/store/index.ts\
 * @description
 * This file sets up the Redux store for the ASV telemetry application. 
 * 
 * 
 * @author Carson Fujita
 * @license MIT
 * 
 * @remarks
 * - It configures the store with the state reducer and exports the necessary types for use throughout the application.
 */
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
import { useSelector, useDispatch, type TypedUseSelectorHook } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import statusReducer from "./slices/statusSlice";
import tokenReducer from "./slices/tokenSlice";
import controlsReducer from "./slices/controlsSlice";
import connectionReducer from "./slices/connectionSlice";
import batteryReducer from "./slices/batterySlice";
/**
 * Configures the Redux store for the ASV telemetry application.
 * @remarks
 * - The store is configured with the state reducer, 
 *  which manages the state related to telemetry data.
 * - Middleware is set up to disable serializable checks, 
 *  allowing for more flexible action payloads if needed.
 * - The store is exported for use in the application, 
 *  along with types for RootState and AppDispatch to ensure type safety 
 *  when using the store in components and actions.
 * 
 * @see {@link statusSlice} for the reducer managing the telemetry state.
 */
const store = configureStore({
    reducer: {
        telemetry: statusReducer,
        token: tokenReducer,
        controls: controlsReducer,
        connection: connectionReducer,
        battery: batteryReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});



type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppDispatch, useAppSelector };
export default store;
export type { RootState, AppDispatch };