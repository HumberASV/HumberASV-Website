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
import { Box, Typography, useTheme } from "@mui/material";

export default function PowerRudderPanel() {
	const theme = useTheme();
	const motor1Power = useSelector((state: RootState) => state.telemetry.motor1Power);
	const motor2Power = useSelector((state: RootState) => state.telemetry.motor2Power);
	const rudderAngle = useSelector((state: RootState) => state.telemetry.rudderAngle);

	const getPowerColor = (power: number) => {
		if (power > 75) return "#ef4444"; // Red - high
		if (power > 50) return "#eab308"; // Yellow - medium-high
		if (power > 25) return "#10b981"; // Green - medium
		return "#3b82f6"; // Blue - low
	};

	const clampRudder = (angle: number) => Math.max(-90, Math.min(90, angle));
	const displayAngle = clampRudder(rudderAngle);

	const PowerBar = ({ label, value }: { label: string; value: number }) => (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: 28 }}>
			<Typography
				variant="caption"
				sx={{
					fontWeight: 700,
					fontSize: "9px",
					color: "#6b7280",
					textAlign: "center",
				}}
			>
				{label}
			</Typography>
			<Box
				sx={{
					height: 86,
					width: 24,
					borderRadius: 999,
					backgroundColor: "#dbe4ee",
					position: "relative",
					overflow: "hidden",
					mx: "auto",
					border: "1px solid #cbd5e1",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						left: 0,
						right: 0,
						bottom: 0,
						height: `${Math.max(0, Math.min(100, value))}%`,
						backgroundColor: getPowerColor(value),
						transition: "height 0.25s ease-out",
					}}
				/>
			</Box>
			<Typography
				variant="caption"
				sx={{
					fontSize: "9px",
					color: getPowerColor(value),
					fontWeight: 700,
					textAlign: "center",
				}}
			>
				{Math.round(value)}%
			</Typography>
		</Box>
	);

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
				gap: "12px",
				minHeight: "140px",
			}}
		>
			<Typography
				variant="caption"
				sx={{
					fontWeight: 700,
					color: "#6b7280",
					fontSize: "10px",
					textTransform: "uppercase",
				}}
			>
				Power & Rudder
			</Typography>

			<Box sx={{ display: "flex", gap: 1.5, alignItems: "stretch" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						gap: 1.25,
						alignItems: "flex-end",
						justifyContent: "center",
						py: 0.5,
						width: 78,
						flexShrink: 0,
					}}
				>
					<PowerBar label="M1" value={motor1Power} />
					<PowerBar label="M2" value={motor2Power} />
				</Box>

				<Box
					sx={{
						flex: 1,
						minWidth: 0,
						backgroundColor: "#d7ebff",
						border: "2px solid #86bff2",
						borderRadius: 2,
						position: "relative",
						overflow: "hidden",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: 150,
					}}
				>
					<Box sx={{ position: "absolute", top: 8, left: 10, right: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Box sx={{ backgroundColor: "rgba(255,255,255,0.55)", border: `2px solid ${theme.palette.primary.main}`, px: 1.5, py: 0.25, borderRadius: 0.5 }}>
							<Typography sx={{ fontSize: 16, fontWeight: 700, color: theme.palette.primary.main, lineHeight: 1 }}>
								{displayAngle.toFixed(0)}°
							</Typography>
						</Box>
						<Typography sx={{ fontSize: 10, color: theme.palette.primary.main, fontWeight: 700 }}>
							RUDDER
						</Typography>
					</Box>

					<svg viewBox="0 0 150 150" width="100%" height="100%" style={{ display: "block" }}>
						<defs>
							<linearGradient id="rudderBladeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
								<stop offset="0%" stopColor={theme.palette.primary.light} />
								<stop offset="55%" stopColor={theme.palette.primary.main} />
								<stop offset="100%" stopColor={theme.palette.primary.dark} />
							</linearGradient>
							<linearGradient id="rudderBladeGloss" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
								<stop offset="100%" stopColor="rgba(255,255,255,0)" />
							</linearGradient>
						</defs>

						{/* rudder pivot centered in the box */}
						<circle cx="75" cy="84" r="4" fill={theme.palette.primary.dark} />
						<line x1="75" y1="84" x2="75" y2="118" stroke={theme.palette.primary.main} strokeWidth="1.5" opacity={0.35} />

						<g transform={`rotate(${displayAngle} 75 84)`}>
							<path
								d="M75 84
									C78 72, 88 65, 101 63
									C114 61, 126 65, 134 72
									C138 76, 140 80, 140 84
									C140 88, 138 92, 134 96
									C126 103, 114 107, 101 105
									C88 103, 78 96, 75 84 Z"
								fill="url(#rudderBladeGrad)"
								stroke={theme.palette.primary.dark}
								strokeWidth="1.6"
								opacity="0.96"
							/>
							<path
								d="M76 84
									C79 73, 88 67, 100 65
									C112 63, 123 67, 131 73
									C135 77, 137 80, 137 84
									C137 88, 135 91, 131 95
									C123 101, 112 105, 100 103
									C88 101, 79 95, 76 84"
								fill="none"
								stroke="url(#rudderBladeGloss)"
								strokeWidth="4"
								strokeLinecap="round"
								opacity="0.65"
							/>
							<path
								d="M75 84 L140 84"
								fill="none"
								stroke="rgba(255,255,255,0.33)"
								strokeWidth="1.2"
								strokeLinecap="round"
							/>
						</g>
					</svg>
				</Box>
			</Box>
		</Box>
	);
}