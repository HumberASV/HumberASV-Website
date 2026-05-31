/*

Shows battery information for the ASV.

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
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import Battery1BarIcon from "@mui/icons-material/Battery1Bar";
import Battery2BarIcon from "@mui/icons-material/Battery2Bar";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import Battery4BarIcon from "@mui/icons-material/Battery4Bar";
import Battery5BarIcon from "@mui/icons-material/Battery5Bar";
import Battery6BarIcon from "@mui/icons-material/Battery6Bar";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";

export default function Batteries() {
	const theme = useTheme();
	const motorBatteries = useSelector((state: RootState) => state.telemetry.motorBatteries);
	const powerBatteries = useSelector((state: RootState) => state.telemetry.powerBatteries);

	// Calculate average battery levels
	const motorBatteryLevel = motorBatteries.length > 0 ? motorBatteries.reduce((a, b) => a + b, 0) / motorBatteries.length : 0;
	const powerBatteryLevel = powerBatteries.length > 0 ? powerBatteries.reduce((a, b) => a + b, 0) / powerBatteries.length : 0;

	const getBatteryColor = (level: number) => {
		if (level > 60) return theme.palette.success.main;
		if (level > 30) return theme.palette.warning.main;
		return theme.palette.error.main;
	};

	const batteryIconFor = (level: number) => {
		if (level >= 95) return BatteryFullIcon;
		if (level >= 85) return Battery6BarIcon;
		if (level >= 75) return Battery5BarIcon;
		if (level >= 60) return Battery4BarIcon;
		if (level >= 45) return Battery3BarIcon;
		if (level >= 30) return Battery2BarIcon;
		if (level >= 15) return Battery1BarIcon;
		return Battery0BarIcon;
	};

	type BatteryCardProps = { label: string; level: number };

	const BatteryCard = ({ label, level }: BatteryCardProps) => {
		const Icon = batteryIconFor(level);
		const color = getBatteryColor(level);

		return (
			<Box
				sx={{
					width: 86,
					height: 46,
					flexShrink: 0,
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "flex-start",
					gap: 0.1,
				}}
			>
				<Box sx={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
					<Icon
						sx={{
							fontSize: 50,
							color,
							position: "absolute",
							top: 1,
							left: 0,
							transform: "rotate(-90deg)",
							transformOrigin: "center center",
						}}
					/>
				<Typography
					variant="caption"
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						fontSize: "12px",
						fontWeight: 700,
						color: "#0f172a",
						lineHeight: 1,
						pointerEvents: "none",
					}}
				>
					{Math.round(level)}%
				</Typography>
				</Box>
				<Typography
					variant="caption"
					sx={{
						ml: 0.25,
						textAlign: "left",
						fontSize: "7px",
						fontWeight: 700,
						color,
						lineHeight: 1,
						whiteSpace: "nowrap",
					}}
				>
					{label}
				</Typography>
			</Box>
		);
	};

	return (
		<Box
			sx={{
				width: "100%",
				backgroundColor: "#f0f4f8",
				border: "2px solid #d1d5db",
				borderRadius: "8px",
					padding: "10px",
				display: "flex",
				flexDirection: "column",
					gap: 0,
					minHeight: "90px",
				position: "relative",
			}}
		>
			<Typography
				variant="caption"
				sx={{
					fontWeight: 700,
					color: "#6b7280",
						fontSize: "9px",
					textTransform: "uppercase",
					letterSpacing: "0.04em",
				}}
			>
				Batteries
			</Typography>

			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "flex-start",
					gap: 0,
					pl: 0,
				}}
			>
				<BatteryCard label="Motor" level={motorBatteryLevel} />
				<BatteryCard label="System" level={powerBatteryLevel} />
			</Box>
		</Box>
	);
}
