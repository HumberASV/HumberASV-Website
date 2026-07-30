/**
 * @file telemetryInterfaces.ts
 * @description This module defines the TypeScript interfaces and types used in the telemetry slice of the Redux store for the ASV dashboard.
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
import type { Status } from "./statusTypes";

/**
 * Action type for fetching telemetry data
 * 
 * @remarks
 * - These constants represent the action types for fetching telemetry data from the basestation.
 * - They are used in the Redux actions and reducers to handle the state changes related to telemetry data fetching.
 * - The FETCH_TELEMETRY_SUCCESS action is dispatched when telemetry data is successfully received, 
 *  while the FETCH_TELEMETRY_FAILURE action is dispatched when there is an error in fetching telemetry data.
 * 
 * @value FETCH_TELEMETRY_SUCCESS - Action type for successful telemetry data fetch
 * @value FETCH_TELEMETRY_FAILURE - Action type for failed telemetry data fetch
 * 
 * @author Carson Fujita
 */
const FETCH_TELEMETRY_SUCCESS = 'FETCH_TELEMETRY_SUCCESS';

/**
 * Action type for handling errors when fetching telemetry data
 * 
 * @author Carson Fujita
 */
const FETCH_TELEMETRY_FAILURE = 'FETCH_TELEMETRY_FAILURE';

/**
 * Action interfaces for fetching telemetry data
 * 
 * @author Carson Fujita
 * 
 * @value extraProps - Allows for any additional properties that may be included in the action, 
 *  providing flexibility for future extensions of the action payload.
 * @value type - The type of the action, which can be either FETCH_TELEMETRY_SUCCESS or FETCH_TELEMETRY_FAILURE.
 * @value payload - The payload of the action, which contains the telemetry data for 
 *  success actions or an error message for failure actions.
 * 
 * @remarks
 * - Redux action
 */
interface FetchTelemetrySuccessAction {
    [extraProps: string]: unknown;
    type: typeof FETCH_TELEMETRY_SUCCESS;
    payload: Status; // telemetry data
}

/**
 * Action interface for handling errors when fetching telemetry data
 * 
 * @author Carson Fujita
 * 
 * @value extraProps - Allows for any additional properties that may be included in the action, 
 *  providing flexibility for future extensions of the action payload.
 * @value type - The type of the action, which is FETCH_TELEMETRY_FAILURE.
 * @value payload - The payload of the action, which contains an error message describing the failure.
 * 
 * @remarks
 * - Redux action
 */
interface FetchTelemetryFailureAction {
    [extraProps: string]: unknown;
    type: typeof FETCH_TELEMETRY_FAILURE;
    payload: string; // error message
}

/**
 * Union type for telemetry action types
 * 
 * @author Carson Fujita
 * @remarks
 * - This type represents the union of all possible action types related to fetching telemetry data, 
 *  including both success and failure actions.
 * - It is used in the Redux reducer to handle state changes based on the type of action dispatched.
 * - By defining this union type, we can ensure type safety and proper handling of telemetry-related actions in the Redux store.
 * @see {@link TelemetryActionTypes}
 */
type TelemetryActionTypes = FetchTelemetrySuccessAction | FetchTelemetryFailureAction;

export type { TelemetryActionTypes };
export { FETCH_TELEMETRY_SUCCESS, FETCH_TELEMETRY_FAILURE };