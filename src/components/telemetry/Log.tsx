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
import type { RootState } from "../../store";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";

export default function Log() {
	const taskLog = useSelector((state: RootState) => state.telemetry.task.log);

	// Get the last 5 log entries in reverse order (newest first)
	const recentLogs = useMemo(() => {
		return [...taskLog].reverse().slice(0, 5);
	}, [taskLog]);

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
				position: "relative",
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
				Log
			</Typography>

			{/* Log Entries */}
			<Box
				sx={{
					flex: 1,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					gap: "4px",
				}}
			>
				{recentLogs.length > 0 ? (
					recentLogs.map((log, index) => (
						<Typography
							key={index}
							variant="caption"
							sx={{
								fontSize: "11px",
								color: "#374151",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							• {log}
						</Typography>
					))
				) : (
					<Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "10px" }}>
						No log entries
					</Typography>
				)}
			</Box>
		</Box>
	);
}