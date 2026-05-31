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

export default function Task() {
	const taskData = useSelector((state: RootState) => state.telemetry.taskData);

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
				justifyContent: "center",
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
				Task
			</Typography>

			{/* Task Name */}
			<Typography
				variant="h6"
				sx={{
					fontWeight: "bold",
					color: "#111827",
					fontSize: "16px",
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
				}}
			>
				{taskData?.name || "No task assigned"}
			</Typography>
		</Box>
	);
}
