/**
 * @file TelemetryProvider.tsx
 * 
 * @description
 * This file defines the TelemetryProvider component, which is responsible for providing the Redux store to the components that need access to telemetry data. 
 * It uses the React-Redux Provider component to wrap its children with the store, allowing any nested components to connect to the Redux store and access telemetry data as needed.
 *
 * @author Carson Fujita
 * @license MIT
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
import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';

/**
 * TelemetryProvider component that wraps its children with the Redux Provider to provide access to the telemetry store.
 */
interface TelemetryProviderProps {
    children: React.ReactNode;
}

/**
 * The provider component for the telemetry page, which wraps its children with the Redux Provider to give them access to the telemetry store.
 * @param children The child components that will have access to the telemetry store. 
 *  These are typically the components that display telemetry data and need to connect to the Redux store to access that data.
 * @returns the TelemetryProvider component that wraps its children with the Redux Provider, 
 *  allowing them to access the telemetry store and receive updates as the telemetry data changes.
 */
const TelemetryProvider: React.FC<TelemetryProviderProps> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
}

export default TelemetryProvider;