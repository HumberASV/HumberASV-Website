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
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../utils/store";
import { Box, Typography } from "@mui/material";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import { GridValues } from "../../utils/telemetryInterfaces";

const Map: React.FC = () => {
    const telemetry = useSelector((state: RootState) => state.telemetry);
    const occupancyGrid = telemetry.occupancyGrid;
    const navigationGrid = telemetry.navigationGrid;
    const plannedPath = telemetry.plannedPath ?? [];

    const hasAnyGridData = occupancyGrid.length > 0 || navigationGrid.length > 0;

    const rows = Math.max(occupancyGrid.length, navigationGrid.length);
    const cols = Math.max(
        occupancyGrid[0]?.length ?? 0,
        navigationGrid[0]?.length ?? 0,
    );

    const cellWidth = cols > 0 ? 100 / cols : 0;
    const cellHeight = rows > 0 ? 100 / rows : 0;

    const findCurrentCell = (grid: number[][]) => {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === GridValues.current) {
                    return { row: i, col: j };
                }
            }
        }
        return null;
    };

    const currentCell = findCurrentCell(navigationGrid) ?? findCurrentCell(occupancyGrid);
    const currentPoint =
        currentCell ??
        (plannedPath.length > 0
            ? plannedPath[0]
            : null);
    const destinationPoint = plannedPath.length > 0 ? plannedPath[plannedPath.length - 1] : null;

    const inset = 6;
    const insetScale = 100 - inset * 2;
    const mapX = (value: number) => inset + value * insetScale;
    const mapY = (value: number) => inset + value * insetScale;

    const pathPoints = plannedPath
        .map((point) => `${mapX(point.col * cellWidth / 100 + cellWidth / 200)},${mapY(point.row * cellHeight / 100 + cellHeight / 200)}`)
        .join(" ");

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(255,255,255,0.02)",
                borderRadius: 1,
                overflow: "hidden",
            }}
        >
            {!hasAnyGridData ? (
                <Typography variant="body2" sx={{ p: 1, color: "#9ca3af" }}>
                    No grid data
                </Typography>
            ) : (
                <Box sx={{ width: "100%", minHeight: 0, position: "relative", display: "flex", justifyContent: "center", alignItems: "center", p: 0.75, boxSizing: "border-box" }}>
                    <Box sx={{ width: "100%", position: "relative", maxWidth: "100%", aspectRatio: "1 / 1", boxSizing: "border-box" }}>
                        <svg
                            viewBox="0 0 100 100"
                            width="100%"
                            height="100%"
                            preserveAspectRatio="xMidYMid meet"
                            style={{ display: "block" }}
                        >
                        <defs>
                            <marker
                                id="routeArrow"
                                markerWidth="8"
                                markerHeight="8"
                                refX="6"
                                refY="4"
                                orient="auto"
                                markerUnits="strokeWidth"
                            >
                                <path d="M0,0 L8,4 L0,8 z" fill="#22c55e" />
                            </marker>
                        </defs>

                        {/* occupancy layer */}
                        {occupancyGrid.map((row, i) =>
                            row.map((cell, j) => {
                                const fill =
                                    cell === GridValues.occupied
                                        ? "#ef4444"
                                        : cell === GridValues.path
                                            ? "#e5e7eb"
                                            : "#ffffff";

                                return (
                                    <rect
                                        key={`occupancy-${i}-${j}`}
                                        x={mapX(j * cellWidth / 100)}
                                        y={mapY(i * cellHeight / 100)}
                                        width={(cellWidth * insetScale) / 100}
                                        height={(cellHeight * insetScale) / 100}
                                        fill={fill}
                                        stroke="#9ca3af"
                                        strokeWidth={0.35}
                                    />
                                );
                            }),
                        )}

                        {/* navigation / planned route layer */}
                        {plannedPath.length > 1 ? (
                            <polyline
                                points={pathPoints}
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth={1.2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                markerEnd="url(#routeArrow)"
                                opacity={0.95}
                            />
                        ) : null}

                        {plannedPath.map((point, index) => (
                            <circle
                                key={`route-${index}`}
                                cx={mapX(point.col * cellWidth / 100 + cellWidth / 200)}
                                cy={mapY(point.row * cellHeight / 100 + cellHeight / 200)}
                                r={Math.min(cellWidth, cellHeight) * (index === plannedPath.length - 1 ? 0.12 : 0.08)}
                                fill="#22c55e"
                                opacity={0.9}
                            />
                        ))}

                        {destinationPoint ? (
                            <circle
                                cx={mapX(destinationPoint.col * cellWidth / 100 + cellWidth / 200)}
                                cy={mapY(destinationPoint.row * cellHeight / 100 + cellHeight / 200)}
                                r={Math.min(cellWidth, cellHeight) * 0.18}
                                fill="none"
                                stroke="#16a34a"
                                strokeWidth={0.45}
                                opacity={0.9}
                            />
                        ) : null}

                        {/* subtle grid outline */}
                        {Array.from({ length: rows + 1 }, (_, i) => (
                            <line
                                key={`h-${i}`}
                                x1={inset}
                                y1={mapY(i * cellHeight / 100)}
                                x2={100 - inset}
                                y2={mapY(i * cellHeight / 100)}
                                stroke="#d1d5db"
                                strokeWidth={0.2}
                            />
                        ))}
                        {Array.from({ length: cols + 1 }, (_, i) => (
                            <line
                                key={`v-${i}`}
                                x1={mapX(i * cellWidth / 100)}
                                y1={inset}
                                x2={mapX(i * cellWidth / 100)}
                                y2={100 - inset}
                                stroke="#d1d5db"
                                strokeWidth={0.2}
                            />
                        ))}

                    </svg>

                        {currentPoint ? (
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: `${mapX(currentPoint.col * cellWidth / 100 + cellWidth / 200)}%`,
                                    top: `${mapY(currentPoint.row * cellHeight / 100 + cellHeight / 200)}%`,
                                    transform: "translate(-50%, -50%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    pointerEvents: "none",
                                    color: "#2563eb",
                                    zIndex: 2,
                                    textShadow: "0 0 2px rgba(255,255,255,0.9)",
                                }}
                            >
                                <DirectionsBoatIcon sx={{ fontSize: 28 }} />
                            </Box>
                        ) : null}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Map;