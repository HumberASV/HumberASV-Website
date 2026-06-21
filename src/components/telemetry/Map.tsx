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
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Typography, CircularProgress, Button, Box } from "@mui/material";
import boatSVG from "../../assets/boat.svg";
import warningSVG from "../../assets/warning.svg";
import arrowSVG from "../../assets/arrow.svg";
import ZoomOutIcon from '@mui/icons-material/Remove';
import ZoomInIcon from '@mui/icons-material/Add';
import ChangeZoomTargetIcon from '@mui/icons-material/Search';
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { CellTypes, type Cell, type TaskStatus } from "../../utils/types";
import { useTheme } from "@mui/material/styles"

/**
 * Prints a svg map
 * @param zoomLevel - The current zoom level of the map, which determines how much of the map is visible and how detailed it appears. Higher zoom levels show a smaller area with more detail, while lower zoom levels show a larger area with less detail.
 * @param width - The width of the map component, which defines how much horizontal space the map will occupy in the layout. This can be specified in pixels, percentages, or other CSS units.
 * @param height - The height of the map component, which defines how much vertical space the map will occupy in the layout. Similar to width, this can be specified in pixels, percentages, or other CSS units.
 * @param center - The x and column coordinates that represent the center point of the map. This determines the initial focus of the map when it is rendered.
 * @param onZoom - callback function that is triggered when the user scrolls within the map. This function updates the zoom level state in the parent component.
 * @param onCenterChange - callback function that is triggered when the user drags the map. This function updates the center state in the parent component, allowing for dynamic panning.
 * @returns 
 */
const MapSVG: React.FC<{ zoomLevel: number; width: string; height: string; center: { x: number; y: number }; onCenterChange: (newCenter: { x: number; y: number }) => void; onZoom: (newZoomLevel: number) => void; }> = ({ zoomLevel, width, height, center, onCenterChange, onZoom }) => {
    const theme = useTheme();

    const mapData = useSelector((state: RootState) => state.telemetry.map); 
    const occupancyGrid = mapData.occupancyGrid;
    const navigationGrid = mapData.navigationGrid;

    const planningData = useSelector((state: RootState) => state.telemetry.planning);
    const status = planningData.status;
    const course = planningData.course;
    const plan = planningData.plan;

    const hasMapData = occupancyGrid.length > 0 && navigationGrid.length > 0;
    const hasPlanningData = course.length > 0 || plan.length > 0;
    
    const cellSize = 20 * Math.pow(2, zoomLevel - 1); // Base size of 20 units, doubling with each zoom level
    const iconPadding = 1;
    const iconSize = Math.max(0, cellSize - iconPadding * 2);
    const iconRadius = Math.max(0, iconSize / 2);
    const pathStrokeWidth = Math.max(1, cellSize / 10);
    const gridWidth = occupancyGrid[0]?.length ?? 0;
    const gridHeight = occupancyGrid.length;
    const viewBoxSize = 400 / Math.pow(2, zoomLevel - 1); // Base viewBox size of 400 units, halving with each zoom level
    // const maxViewBoxX = Math.max(gridWidth * cellSize - viewBoxSize, 0);
    // const maxViewBoxY = Math.max(gridHeight * cellSize - viewBoxSize, 0);
    const viewBoxX = center.y * cellSize - viewBoxSize / 2;
    const viewBoxY = center.x * cellSize - viewBoxSize / 2;

    const getCellColor = (cell: Cell | undefined) => {
        const safeType = cell?.type ?? CellTypes.empty;
        switch (safeType) {
            case CellTypes.empty:
                return theme.palette.occupancyMap.empty;
            case CellTypes.occupied:
                return theme.palette.occupancyMap.occupied;
            case CellTypes.path:
                return theme.palette.occupancyMap.path;
            case CellTypes.current:
                return theme.palette.occupancyMap.current;
            case CellTypes.objective:
                return theme.palette.occupancyMap.objective;
            case CellTypes.error:
                return theme.palette.occupancyMap.error;
            default:
                return theme.palette.occupancyMap.empty;
        }
    };

    const arrowMarkerId = useId();

    const renderMarkerSymbol = (cell: Cell | undefined) => {
        const safeType = cell?.type ?? CellTypes.empty;
        switch (safeType) {
            case CellTypes.current:
                return (
                    <g>
                        <rect
                            x={iconPadding / 2}
                            y={iconPadding / 2}
                            width={cellSize - iconPadding}
                            height={cellSize - iconPadding}
                            rx={Math.max(1, cellSize * 0.1)}
                            fill="#fbbf24"
                            opacity={1}
                        />
                        <image
                            href={boatSVG}
                            x={iconPadding}
                            y={iconPadding}
                            width={iconSize}
                            height={iconSize}
                            preserveAspectRatio="xMidYMid meet"
                            className="boat-icon"
                            style={{ filter: 'brightness(0) saturate(100%)' }}
                        />
                    </g>
                );
            case CellTypes.objective:
                return (
                    <g>
                        <circle
                            cx={cellSize / 2}
                            cy={cellSize / 2}
                            r={iconRadius}
                            fill="transparent"
                            stroke={theme.palette.occupancyMap.objectiveIcon}
                            strokeWidth={Math.max(1, cellSize * 0.1)}
                        />
                        <circle
                            cx={cellSize / 2}
                            cy={cellSize / 2}
                            r={Math.max(0, iconRadius * 0.6)}
                            fill={theme.palette.occupancyMap.objectiveIcon}
                        />
                    </g>
                );
            case CellTypes.error:
                return (
                    <g>
                        <circle
                            cx={cellSize / 2}
                            cy={cellSize / 2}
                            r={iconRadius}
                            fill={theme.palette.occupancyMap.errorIcon}
                            opacity={0.2}
                        />
                        <line
                            x1={iconPadding}
                            y1={iconPadding}
                            x2={cellSize - iconPadding}
                            y2={cellSize - iconPadding}
                            stroke={theme.palette.occupancyMap.errorIcon}
                            strokeWidth={Math.max(2, cellSize * 0.12)}
                            strokeLinecap="round"
                        />
                        <line
                            x1={iconPadding}
                            y1={cellSize - iconPadding}
                            x2={cellSize - iconPadding}
                            y2={iconPadding}
                            stroke={theme.palette.occupancyMap.errorIcon}
                            strokeWidth={Math.max(2, cellSize * 0.12)}
                            strokeLinecap="round"
                        />
                    </g>
                );
            default:
                return null;
        }
    };

    const getMapPathPoints = (path: Cell[]) =>
        path
            .map((cell) => `${cell.y * cellSize + cellSize / 2},${cell.x * cellSize + cellSize / 2}`)
            .join(" ");

    const renderPlanningPath = (path: Cell[], color: string, dashArray?: string, arrow?: boolean) => {
        if (path.length < 2) {
            return null;
        }

        const arrowSize = Math.max(6, cellSize * 0.5);
        const arrowSpacing = Math.max(2, Math.floor(path.length / 8));

        return (
            <g>
                <polyline
                    points={getMapPathPoints(path)}
                    fill="none"
                    stroke={color}
                    strokeWidth={pathStrokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={dashArray}
                    markerEnd={arrow ? `url(#${arrowMarkerId})` : undefined}
                    opacity={0.9}
                />
                {path.map(( _, index) => {
                    if (index === 0 || index % arrowSpacing !== 0 || index === path.length - 1) {
                        return null;
                    }
                    const current = path[index];
                    const next = path[Math.min(index + 1, path.length - 1)];
                    const dx = (next.y - current.y) * cellSize;
                    const dy = (next.x - current.x) * cellSize;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    const x = current.y * cellSize + cellSize / 2;
                    const y = current.x * cellSize + cellSize / 2;

                    if (dist === 0) return null;

                    return (
                        <g key={`arrow-${index}`} transform={`translate(${x}, ${y}) rotate(${angle})`}>
                            <image
                                href={arrowSVG}
                                x={-arrowSize / 2}
                                y={-arrowSize / 2}
                                width={arrowSize}
                                height={arrowSize}
                                preserveAspectRatio="xMidYMid meet"
                                style={{ 
                                    fill: color,
                                    mixBlendMode: "lighten"
                                }}
                            />
                        </g>
                    );
                })}
            </g>
        );
    };

    const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
        event.preventDefault();
        const delta = event.deltaY;
        const nextZoom = delta > 0 ? zoomLevel - 1 : zoomLevel + 1;
        onZoom(nextZoom);
    };

    const [dragging, setDragging] = useState(false);
    const dragStartRef = useRef<{ x: number; y: number; center: { x: number; y: number } } | null>(null);

    const clampCenter = (next: { x: number; y: number }) => {
        const halfViewCells = viewBoxSize / (2 * cellSize);
        const rowMin = Math.min(gridHeight - halfViewCells, halfViewCells);
        const rowMax = Math.max(gridHeight - halfViewCells, halfViewCells);
        const colMin = Math.min(gridWidth - halfViewCells, halfViewCells);
        const colMax = Math.max(gridWidth - halfViewCells, halfViewCells);

        return {
            x: Math.min(Math.max(next.x, rowMin), rowMax),
            y: Math.min(Math.max(next.y, colMin), colMax),
        };
    };

    const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
        if (event.button !== 0) {
            return;
        }

        const currentTarget = event.currentTarget;
        currentTarget.setPointerCapture(event.pointerId);
        dragStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            center: { ...center },
        };
        setDragging(true);
        event.preventDefault();
    };

    const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
        if (!dragging || !dragStartRef.current) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            return;
        }

        const deltaX = event.clientX - dragStartRef.current.x;
        const deltaY = event.clientY - dragStartRef.current.y;
        const deltaViewX = (deltaX * viewBoxSize) / rect.width;
        const deltaViewY = (deltaY * viewBoxSize) / rect.height;
        const nextCenter = clampCenter({
            x: dragStartRef.current.center.x - deltaViewY / cellSize,
            y: dragStartRef.current.center.y - deltaViewX / cellSize,
        });

        onCenterChange(nextCenter);
    };

    const endDrag = (event: React.PointerEvent<SVGSVGElement>) => {
        if (!dragging) {
            return;
        }

        event.currentTarget.releasePointerCapture(event.pointerId);
        dragStartRef.current = null;
        setDragging(false);
    };

    return (
        <svg
            width={width}
            height={height}
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxSize} ${viewBoxSize}`}
            preserveAspectRatio="xMidYMid meet"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            style={{
                border: `2px solid ${theme.palette.status.primary[status as TaskStatus]}`,
                borderRadius: "50%",
                overflow: "hidden",
                cursor: dragging ? "grabbing" : "grab",
                touchAction: "none",
            }}
        >
            {hasMapData ? (
                <>
                    <defs>
                        <marker
                            id={arrowMarkerId}
                            viewBox="0 0 10 10"
                            refX="10"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.palette.occupancyMap.plan} />
                        </marker>
                    </defs>
                    <rect x={-5000} y={-5000} width={gridWidth * cellSize + 10000} height={gridHeight * cellSize + 10000} fill={theme.palette.occupancyMap.empty} />
                    {occupancyGrid.map((x, rowIndex) =>
                        x.map((cell, colIndex) => {
                            const safeCell = cell ?? { type: CellTypes.empty, x: rowIndex, y: colIndex };
                            return (
                                <g key={`${rowIndex}-${colIndex}`} transform={`translate(${colIndex * cellSize}, ${rowIndex * cellSize})`}>
                                    <rect width={cellSize} height={cellSize} fill={getCellColor(safeCell)} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={0.5} />
                                </g>
                            );
                        })
                    )}
                    {hasPlanningData && renderPlanningPath(course, theme.palette.occupancyMap.course)}
                    {hasPlanningData && renderPlanningPath(plan, theme.palette.occupancyMap.plan, "4 3", true)}
                    {navigationGrid.map((x, rowIndex) =>
                        x.map((cell, colIndex) => {
                            if (![CellTypes.current, CellTypes.objective, CellTypes.error].includes(cell?.type ?? CellTypes.empty)) {
                                return null;
                            }
                            return (
                                <g key={`nav-${rowIndex}-${colIndex}`} transform={`translate(${colIndex * cellSize}, ${rowIndex * cellSize})`}>
                                    <rect width={cellSize} height={cellSize} fill="transparent" />
                                    {renderMarkerSymbol(cell)}
                                </g>
                            );
                        })
                    )}
                    {occupancyGrid.map((x, rowIndex) =>
                        x.map((cell, colIndex) => {
                            const safeCell = cell ?? { type: CellTypes.empty, x: rowIndex, y: colIndex };
                            if (safeCell.type !== CellTypes.occupied) {
                                return null;
                            }
                            const isOnPath = course.some(c => c.x === rowIndex && c.y === colIndex) || 
                                           plan.some(c => c.x === rowIndex && c.y === colIndex);
                            if (!isOnPath) {
                                return null;
                            }
                            return (
                                <g key={`warning-${rowIndex}-${colIndex}`} transform={`translate(${colIndex * cellSize}, ${rowIndex * cellSize})`}>
                                    <image
                                        href={warningSVG}
                                        x={iconPadding}
                                        y={iconPadding}
                                        width={iconSize}
                                        height={iconSize}
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                </g>
                            );
                        })
                    )}
                </>
            ) : (
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill={theme.palette.text.secondary}
                    fontSize="12px"
                    fontWeight="bold"
                >
                    No Map Data
                </text>
            )}
        </svg>
    );
};

const MapComponent: React.FC = () => {
    const theme = useTheme();
    const [zoomLevel, setZoomLevel] = useState(1);
    const [center, setCenter] = useState({ x: 0, y: 0 });
    const [centerInitialized, setCenterInitialized] = useState(false);

    const occupancyGrid = useSelector((state: RootState) => state.telemetry.map.occupancyGrid);
    const navigationGrid = useSelector((state: RootState) => state.telemetry.map.navigationGrid);
    const hasGridData = occupancyGrid.length > 0 && navigationGrid.length > 0;

    const currentCell = navigationGrid
        .flat()
        .find((cell) => cell?.type === CellTypes.current);

    const objectiveCell = navigationGrid
        .flat()
        .find((cell) => cell?.type === CellTypes.objective);

    const mapCenter = useMemo(
        () => ({
            x: Math.floor(occupancyGrid.length / 2),
            y: Math.floor((occupancyGrid[0]?.length ?? 0) / 2),
        }),
        [occupancyGrid]
    );

    const focusSequence = useMemo(() => {
        const targets = [] as Array<{ x: number; y: number }>;
        if (objectiveCell) targets.push({ x: objectiveCell.x, y: objectiveCell.y });
        if (currentCell) targets.push({ x: currentCell.x, y: currentCell.y });
        targets.push(mapCenter);
        return targets;
    }, [objectiveCell, currentCell, mapCenter]);

    const [focusIndex, setFocusIndex] = useState(0);

    useEffect(() => {
        if (focusSequence.length === 0) {
            return;
        }
        setFocusIndex((index) => Math.min(index, focusSequence.length - 1));
    }, [focusSequence]);

    const resetCenter = useMemo(() => {
        return currentCell
            ? { x: currentCell.x, y: currentCell.y }
            : mapCenter;
    }, [currentCell, mapCenter]);

    useEffect(() => {
        if (hasGridData && !centerInitialized) {
            setCenter(resetCenter);
            setCenterInitialized(true);
        }
    }, [hasGridData, centerInitialized, resetCenter]);

    const onZoom = (newZoomLevel: number) => {
        setZoomLevel(Math.max(0, Math.min(newZoomLevel, 5)));
    };

    const shiftFocus = () => {
        if (focusSequence.length === 0) {
            return;
        }

        const nextIndex = (focusIndex + 1) % focusSequence.length;
        setFocusIndex(nextIndex);
        setCenter(focusSequence[nextIndex]);
    };

    if (!hasGridData) {
        return (
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Loading map data...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative", width: "100%", maxWidth: 400, aspectRatio: "1 / 1", mx: "auto" }}>
            <MapSVG zoomLevel={zoomLevel} width="100%" height="100%" center={center} onCenterChange={setCenter} onZoom={onZoom} />

            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onZoom(zoomLevel + 1)}
                sx={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", minWidth: 0, width: 42, height: 42, borderRadius: "50%" }}
            >
                <ZoomInIcon fontSize="small" />
            </Button>

            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onZoom(zoomLevel - 1)}
                sx={{ position: "absolute", bottom: 12, left: "16%", transform: "translateX(-50%)", minWidth: 0, width: 42, height: 42, borderRadius: "50%" }}
            >
                <ZoomOutIcon fontSize="small" />
            </Button>

            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={shiftFocus}
                sx={{ position: "absolute", bottom: 12, right: "16%", transform: "translateX(50%)", minWidth: 0, width: 42, height: 42, borderRadius: "50%" }}
            >
                <ChangeZoomTargetIcon fontSize="small" />
            </Button>
        </Box>
    );
}

export default MapComponent;
   