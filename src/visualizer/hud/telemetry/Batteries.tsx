/**
 * @file Batteries.tsx
 * @description Shows battery information for the ASV. It displays two battery
 * levels: one for the motors and one for the power system.
 *
 * @author Carson Fujita
 * @license MIT
 *
 * @remarks
 * - Display motor battery level as a percentage with a visual indicator
 *   (e.g., battery icon).
 * - Display power system battery level as a percentage with a visual indicator
 *   (e.g., battery icon).
 * - Use color coding to indicate battery status
 *   (green = good, yellow = warning, red = critical).
 *
 * @example
 * ```tsx
 * <Batteries />
 * ```
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

import { useSelector } from "react-redux";
import type { RootState } from "../../../`store";
import { Box, Typography, useTheme } from "@mui/material";
import { batteryIconFor } from "../../../`utils/batteryUtil";


/**
 * Displays the battery levels for the ASV's motors and power system.
 * 
 * @author Carson Fujita
 * @returns A React element that displays the battery levels for the ASV's motors and power system.
 * 
 * @remarks
 * - The component uses the `useSelector` hook to access the motor and power battery levels from the Redux store.
 * - It calculates the average battery level for both the motors and power system.
 * - The battery levels are displayed as percentages with corresponding battery icons that visually represent the charge level.
 * - Color coding is used to indicate the status of the batteries (green for good, yellow for warning, red for critical).
 * 
 * @example
 * ```tsx
 * <Batteries />
 * ```
 */
export default function Batteries() {
	const theme = useTheme();
	const motorBatteries = useSelector((state: RootState) => state.telemetry.battery.motors);
	const powerBatteries = useSelector((state: RootState) => state.telemetry.battery.primary);

	
	const getBatteryColor = (level: number) => {
		if (level > 60) return theme.palette.success.main;
		if (level > 30) return theme.palette.warning.main;
		return theme.palette.error.main;
	};
	/**
	 * The properties of {@link BatteryCard} component, which include the battery level and an 
	 * 	optional transformY for positioning the percentage text.
	 * @property level - The battery level as a percentage (0-100).
	 * @property transformY - An optional string to adjust the 
	 * 	vertical position of the percentage text for better alignment.
	 * 
	 * @remarks
	 * - The `level` property is required and should be a number between 0 and 100, representing the battery charge level.
	 * - The `transformY` property exists because the svg icons used for the battery representation are larger than expected, 
	 * 	and adjusting the vertical position of the percentage text helps to align it better (closer to another)
	 * - This interface is used to define the props for the `BatteryCard` component, 
	 * 	which visually represents the battery level with an icon and percentage text.
	 */
	type BatteryCardProps = { level: number, transformY?: string };

	/**
	 * The battery card component displays a single battery level with an icon and percentage text. 
	 * It uses absolute positioning to overlay the percentage text on top of the battery icon, 
	 * and it applies color coding based on the battery level.
	 * @param props {@link BatteryCardProps} containing the battery level and optional transformY for positioning
	 * @returns the battery card component
	 */
	const BatteryCard = (props: BatteryCardProps) => {
		const { level, transformY } = props;
		const Icon = batteryIconFor(level);
		const color = getBatteryColor(level);

		return (
			<Box sx={{
				position: "relative", 
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				//Fixed height and width to prevent layout shift
				height: "80px",
				width: "80px",
				
				backgroundColor: theme.palette.telemetry?.background.empty,
				border: theme.palette.telemetry?.border.lightest
			}}>
				<Icon
					sx={{
						fontSize: 80,
						padding: 0,
						margin: 0,
						color,
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%) rotate(90deg)" + (transformY ? ` translateX(${transformY})` : ""),
						transformOrigin: "center center",
					}}
				/>
				<Typography
					variant="caption"
					sx={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						fontSize: "15px",
						transform: transformY ? `translateY(${transformY})` : "none",
						fontWeight: 700,
						color: theme.palette.text.primary,
						lineHeight: 1,
						pointerEvents: "none",
						zIndex: 1,
					}}
				>
					{Math.round(level)}%
				</Typography>
			</Box>
		);
	};

	return (
			<Box sx={{position:"relative",  maxWidth: "80px", maxHeight: "100px", height: "100%", margin: "0 auto", padding: 1}} >
				<Box sx={{ 
					position: "relative",
					zIndex: 1,
					display:"flex", 
					flexDirection:"column", 
					gap: 0.25, 
					alignItems: "center", 
					justifyContent: "center", 
				}}>
					<BatteryCard level={motorBatteries} transformY="-25%" />
					<BatteryCard level={powerBatteries} transformY="-75%" />
				</Box>
			</Box>
	);
}