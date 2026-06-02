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
import rudderImg from "../../assets/Rudder.svg";

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

	const Panel = ({label, content, value, width}: {label: string, content: React.ReactNode, value?: number, width?: string}) => (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 0.5,
				width: width || "100%",
			}}
		>
			<Typography variant="caption" sx={{ color: theme.palette.text.primary, fontSize: "10px", fontWeight: 600 }}>
				{label}
			</Typography>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
			{content}
			</Box>
			
			{value !== undefined && (
				<Typography variant="caption" sx={{ color: getPowerColor(value), fontSize: "14px", fontWeight: 600 }}>
					{Math.round(value)}%
				</Typography>
			)}
		</Box>
	);

	const PowerBar = ({value }: {value: number }) => (
		<Box sx={{ width: "50%", height: "100%", flex:1, flexShrink:1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 0.5 }}>

			<Box
				sx={{
					flex: 0,
					flexGrow: 1,
					height: "100%",
					width: "100%",
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
		
		</Box>
	);

	// height is focal point of the rudder image, so it should be 50% when the rudder is at center of box
	// 100 when at top, 0 when at bottom
	const RudderDisplay = ({height}: {height: number}) => (
		<Box
					sx={{
						flex: 2,
						flexGrow: 1,
						backgroundColor: "#d7ebff",
						border: "2px solid #86bff2",
						overflow: "hidden",
						borderRadius: 2,
						width: "100%",
						minHeight: 130,
						position: "relative",
					}}
				>
					{/* lines */}
					<Box // vertical line
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							width: "2px",
							height: "100%",
							backgroundColor: "#86bff2",
							transform: "translate(-50%, -50%)",
						}}
					/>
					<Box // horizontal line 
						sx={{
							position: "absolute",
							top: `${height-5}%`, //offset from top based on rudder angle
							left: "50%",
							width: "100%",
							height: "2px",
							backgroundColor: "#86bff2",
							transform: `translate(-50%, -${height-5}%)`,
						}}
					/>
					{/* Rudder Image 
						image is twice the height of the container, so it can rotate fully without being cut off
					*/}
					<Box
						component="img"
						src={rudderImg}
						alt="Rudder Angle"
						sx={{
							position: "absolute",
							top: `${height-55}%`, //offset by 55% to center the image on the vertical line at 50%
							left: "50%",
							width: "auto",

							// height is technically 200% to allow for full rotation without clipping
							height: "100%",

							// transform to match horizontal line
							transformOrigin: "center center",
							transform: `translate(-50%, 0) rotate(${displayAngle}deg)`,
							
							transition: "transform 0.25s ease-out",
						}}
					 />
				</Box>
	);


	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				backgroundColor: theme.palette.telemetry?.background.primary,
				border: `2px solid ${theme.palette.telemetry?.border.light}`,
				borderRadius: "8px",
				padding: "12px",
				display: "flex",
				flexDirection: "column",
				gap: "12px",
				minHeight: "120px",
			}}
		>
			<Typography
				variant="caption"
				sx={{
					fontWeight: 700,
					color: "#6b7280",
					fontSize: "10px",
					textTransform: "uppercase",
					textAlign: "center",
				}}
			>
				Propulsion
			</Typography>

			<Box sx={{
				display: "flex",
				flexDirection: "row",
				gap: 1,
				height: "100%",
			}}>
				<Panel label="L" content={<PowerBar value={motor1Power} />} value={motor1Power} width="40%" />
				<Panel label="R" content={<PowerBar value={motor2Power} />} value={motor2Power} width="40%" />
				<Panel label="Rudder Angle" content={<RudderDisplay height={40} />} value={displayAngle} width="100%" />
			</Box>
			
		</Box>
	);
}