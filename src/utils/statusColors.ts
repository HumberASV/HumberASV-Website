/**
 * @file statusColors.ts
 * 
 * @description
 * Utility functions for mapping ASV status to corresponding colors for UI elements.
 * This includes functions to get the appropriate border color based on the ASV's current status, as well as a function to get a lighter version of the color for use in backgrounds or accents.
 *
 * @author Carson Fujita
 * @license MIT 
 * @remarks
 * - The `getStatusBorderColor` function maps specific ASV statuses (autonomous, remote control, standby, out of control, lost connection) to predefined colors (green, blue, yellow, red, gray).
 * - The `getStatusBorderColorAlpha` function takes a status and an optional opacity value to return an RGBA color string that can be used for backgrounds or accents in the UI.
 * - These utility functions help maintain consistent color coding across the application based on the ASV's operational status.
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

import type { TaskStatus } from "../store/telemetryInterfaces";

/**
 * Gets the border color for a given ASV status
 * @description
 * Maps ASV status to border color based on requirements:
 * - FR-14: Green for autonomous mode
 * - FR-15: Blue for remote control mode
 * - FR-16: Yellow for standby mode
 * - FR-17: Red for out of control status
 * - FR-18: Gray for lost connection status
 * 
 * @param status the current status of the ASV, which can be one of the following: "autonomous", "remote", "standby", "out of control", or "lost connection".
 * @returns a string representing the corresponding color for the given status, which can be used for styling UI elements such as borders or backgrounds.
 */
export const getStatusBorderColor = (status: TaskStatus | string): string => {
	switch (status) {
		case "autonomous":
			return "#10b981"; // Green
		case "remote":
			return "#3b82f6"; // Blue
		case "standby":
			return "#eab308"; // Yellow
		case "out of control":
			return "#ef4444"; // Red
		case "lost connection":
			return "#9ca3af"; // Gray
		default:
			return "#d1d5db"; // Default gray
	}
};

/** 
 * Gets a lighter version of the status color for backgrounds or accents
 * @param status the current status of the ASV, which can be one of the following: "autonomous", "remote", "standby", "out of control", or "lost connection".
 * @param opacity an optional number between 0 and 1 representing the desired opacity of the color (default is 0.2 for a light background effect).
 * @returns a string in RGBA format representing a lighter version of the status color, which can be used for backgrounds or accents in the UI to maintain visual consistency while providing a softer appearance.
 */
export const getStatusBorderColorAlpha = (
	status: TaskStatus | string,
	opacity: number = 0.2
): string => {
	const colorHex = getStatusBorderColor(status);
	const num = parseInt(colorHex.slice(1), 16);
	const r = (num >> 16) & 255;
	const g = (num >> 8) & 255;
	const b = num & 255;
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
