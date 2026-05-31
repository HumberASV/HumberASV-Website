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
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";

export default function SignalStrength() {
	const signalStrength = useSelector((state: RootState) => state.telemetry.signalStrength);

	// Calculate signal bars (0-4 bars based on 0-100 strength)
	const signalBars = Math.ceil((signalStrength / 100) * 4);

	const getSignalColor = () => {
		if (signalStrength > 75) return "#10b981"; // Green
		if (signalStrength > 50) return "#eab308"; // Yellow
		if (signalStrength > 25) return "#f97316"; // Orange
		return "#ef4444"; // Red
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
				alignItems: "center",
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
				Signal
			</Typography>

			{/* Signal Icon and Value */}
			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1, justifyContent: "center" }}>
				<SignalCellularAltIcon
					sx={{
						color: getSignalColor(),
						fontSize: "32px",
					}}
				/>
				<Typography
					variant="h6"
					sx={{
						fontWeight: "bold",
						color: getSignalColor(),
						fontSize: "18px",
					}}
				>
					{Math.round(signalStrength)}%
				</Typography>
			</Box>

			{/* Signal Bars */}
			<Box sx={{ display: "flex", gap: "2px", justifyContent: "center" }}>
				{[1, 2, 3, 4].map((bar) => (
					<Box
						key={bar}
						sx={{
							width: "4px",
							height: `${bar * 4}px`,
							backgroundColor: bar <= signalBars ? getSignalColor() : "#d1d5db",
							borderRadius: "2px",
						}}
					/>
				))}
			</Box>
		</Box>
	);
}