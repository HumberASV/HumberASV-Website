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
import { Box, Typography, Chip } from "@mui/material";

export default function TaskData() {
	const taskData = useSelector((state: RootState) => state.telemetry.taskData);

	const getStatusColor = (status: string | undefined) => {
		switch (status) {
			case "autonomous":
				return "success";
			case "remote":
				return "info";
			case "standby":
				return "warning";
			case "out of control":
				return "error";
			case "lost connection":
				return "default";
			default:
				return "default";
		}
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
				Task Data
			</Typography>

			{taskData ? (
				<Box sx={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
					{/* Status */}
					<Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
						<Typography variant="caption" sx={{ fontSize: "10px", color: "#6b7280", fontWeight: "bold" }}>
							Status:
						</Typography>
						<Chip
							label={taskData.status || "Unknown"}
							size="small"
							color={getStatusColor(taskData.status)}
							variant="outlined"
							sx={{ height: "24px", fontSize: "10px" }}
						/>
					</Box>

					{/* Coordinates */}
					<Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
						<Typography variant="caption" sx={{ fontSize: "9px", color: "#6b7280" }}>
							Lat: {taskData.latitude.toFixed(4)}°
						</Typography>
						<Typography variant="caption" sx={{ fontSize: "9px", color: "#6b7280" }}>
							Lon: {taskData.longitude.toFixed(4)}°
						</Typography>
					</Box>
				</Box>
			) : (
				<Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "10px" }}>
					No task data
				</Typography>
			)}
		</Box>
	);
}