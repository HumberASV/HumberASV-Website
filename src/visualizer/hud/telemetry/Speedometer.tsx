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
import type { RootState } from "../../../`store/store";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
export default function Speedometer() {
	const theme = useTheme();
	const speed = useSelector((state: RootState) => state.telemetry.asv.speed);
	const [displaySpeed, setDisplaySpeed] = useState(speed);

	useEffect(() => {
		setDisplaySpeed(speed);
	}, [speed]);

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
				// Width is 5 characters 
				width: "8rem",
				borderRadius: 2,
				height: "100%",
				backgroundColor: theme.palette.telemetry?.background.primary,
				border: `1px solid ${theme.palette.telemetry?.border.light}`,
				padding: "10px",
				display: "flex",
				flexDirection: "column",
				gap: "3px",
				minHeight: "100px",
			}}
		>
			{/* speed */}
			<Typography
				variant="h4"
				sx={{
					textAlign: "center",
					fontWeight: "bold",
					color: getGaugeColor(),
					fontSize: "45px",
				}}
			>
				{displaySpeed.toFixed(2)}
			</Typography>

			{/* Units */}
			<Box sx={{ textAlign: "center", 
				flex: 1, 
				display: "flex", 
				alignItems: "center", 
				justifyContent: "center" 
			}}>

				<Typography
					sx={{
						color: theme.palette.text.primary,
						fontSize: "17px",
						marginLeft: "4px",
					}}
				>
					m/s
				</Typography>
			</Box>
		</Box>
	);
}