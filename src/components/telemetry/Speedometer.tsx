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
import type { RootState } from "../../utils/store";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function Speedometer() {
	const speed = useSelector((state: RootState) => state.telemetry.speed);
	const [displaySpeed, setDisplaySpeed] = useState(speed);

	useEffect(() => {
		setDisplaySpeed(speed);
	}, [speed]);

	// Calculate gauge fill percentage (assuming max speed of 5 m/s)
	const maxSpeed = 5;
	const gaugePercent = Math.min((displaySpeed / maxSpeed) * 100, 100);

	// Determine gauge color based on speed
	const getGaugeColor = () => {
		if (displaySpeed < 1) return "#3b82f6"; // Blue - slow
		if (displaySpeed < 3) return "#10b981"; // Green - moderate
		if (displaySpeed < 4) return "#eab308"; // Yellow - fast
		return "#ef4444"; // Red - very fast
	};

	return (
		<Box
			sx={{
				width: "100%",
				backgroundColor: "#f0f4f8",
				border: "2px solid #d1d5db",
				borderRadius: "8px",
				padding: "12px",
				display: "flex",
				flexDirection: "column",
				gap: "8px",
				minHeight: "120px",
			}}
		>
			{/* Label */}
			<Typography
				variant="caption"
				sx={{
					fontWeight: "bold",
					color: "#6b7280",
					fontSize: "10px",
					textTransform: "uppercase",
				}}
			>
				Speed
			</Typography>

			{/* Speed Display */}
			<Box sx={{ textAlign: "center", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
				<Typography
					variant="h4"
					sx={{
						fontWeight: "bold",
						color: getGaugeColor(),
						fontSize: "28px",
					}}
				>
					{displaySpeed.toFixed(2)}
				</Typography>
				<Typography
					sx={{
						color: "#6b7280",
						fontSize: "12px",
						marginLeft: "4px",
					}}
				>
					m/s
				</Typography>
			</Box>

			{/* Gauge Bar */}
			<Box
				sx={{
					width: "100%",
					height: "8px",
					backgroundColor: "#e5e7eb",
					borderRadius: "4px",
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						height: "100%",
						width: `${gaugePercent}%`,
						backgroundColor: getGaugeColor(),
						transition: "width 0.3s ease-out",
					}}
				/>
			</Box>

			{/* Max Speed Label */}
			<Typography
				variant="caption"
				sx={{
					color: "#9ca3af",
					fontSize: "9px",
					textAlign: "right",
				}}
			>
				Max: {maxSpeed} m/s
			</Typography>
		</Box>
	);
}