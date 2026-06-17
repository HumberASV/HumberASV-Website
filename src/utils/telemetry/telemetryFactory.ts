/**
 * @file telemetryFactory.ts
 * 
 * @description
 * Factory functions for generating random telemetry data for testing and development purposes. 
 * This includes functions to create random telemetry states, as well as utilities for generating random values within specified ranges.
 * @author Carson Fujita
 * @license MIT 
 * @remarks
 * - The `generateRandomTelemetry` function creates a complete telemetry state with random values for all parameters, including speed, heading, battery levels, task data, and more.
 * - The `generateMockTelemetryUpdate` function takes a previous telemetry state and generates a new state with small random variations to simulate real-time updates.
 * - These factory functions are useful for testing the application's UI and functionality without needing a live connection to the basestation or actual telemetry data.
 *
 * @example
 * ```typescript
 * import { generateRandomTelemetry } from './telemetryFactory';
 * 
 * const randomTelemetry = generateRandomTelemetry();
 * console.log(randomTelemetry);
 * ```
 * 
 * @example
 * ```typescript
 * import { generateMockTelemetryUpdate } from './telemetryFactory';
 * 
 * let currentTelemetry = generateRandomTelemetry();
 * setInterval(() => {
 *     currentTelemetry = generateMockTelemetryUpdate(currentTelemetry);
 *     console.log(currentTelemetry);
 * }, 1000);
 * ```
 * 
 */

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
import type { Status, Grid, Path, TaskData, TaskLocation } from "../types";
import { CellTypes, InitialCell, TaskValues, GLOBAL_CELL_SIZE, GLOBAL_GRID_SIZE, LOCAL_CELL_SIZE } from "../types";
 
// clamp a value between a minimum and maximum
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Generate a random number between min and max
const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

// Generate a random integer between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(randomBetween(min, max + 1));

// Select a random item from an array
const randomChoice = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

// Generate a random step value for telemetry updates, which can be positive or negative
const randomStep = (minStep: number, maxStep: number) => randomBetween(minStep, maxStep) * (Math.random() < 0.5 ? -1 : 1);


/**
 * creates a random TaskData object with random values for testing purposes.
 * @returns randomly generated TaskData object containing an id, name, status, latitude, and longitude.
 */
const createTaskData = (): TaskData => ({
    id: randomInt(1, 9999),
    name: `Task ${randomInt(1, 99)}`,
    status: randomChoice(Object.values(TaskValues)),
    latitude: randomBetween(-90, 90),
    longitude: randomBetween(-180, 180),
});

/**
 * creates a TaskLocation object with random values for testing purposes.
 * @returns randomly generated TaskLocation object.
 */
const createTaskLocation = (): TaskLocation => ({
    id: `loc-${randomInt(100, 999)}`,
    latitude: randomBetween(-90, 90),
    longitude: randomBetween(-180, 180),
});

/**
 * Creates an array of random log entries for testing purposes.
 * @param count the number of log entries to generate.
 * @returns an array of randomly generated log entries.
 */
const createLogEntries = (count: number) =>
    Array.from({ length: count }, () => randomChoice(exampleLogData));

// Example log data to generate random logs
const exampleLogData = [
    "Wowzers, this is a log entry!",
    "Jinkies, Scooby-Doo, where are you?",
    "Yippie!",
    "Zoinks!",
    "Ruh-roh!",
    "Jeepers, this is a spooky log entry!",
];


// ---------------------------------------------------------------------------
// Grid generation helpers
// Convention throughout: x = column (left→right), y = row (top→down).
// Grid is stored as grid[row][col] = grid[y][x].
// ---------------------------------------------------------------------------

/** Build a normalised 1-D Gaussian kernel. */
function gaussianKernel1D(sigma: number): number[] {
    const radius = Math.ceil(sigma * 3);
    let sum = 0;
    const kernel: number[] = [];
    for (let k = -radius; k <= radius; k++) {
        const v = Math.exp(-(k * k) / (2 * sigma * sigma));
        kernel.push(v);
        sum += v;
    }
    return kernel.map(v => v / sum);
}

/**
 * Separable Gaussian blur — horizontal pass then vertical pass.
 * Much faster than a full 2-D convolution for large grids.
 */
function applyGaussianBlurSeparable(noise: number[][], sigma: number): number[][] {
    const h = noise.length;
    const w = noise[0].length;
    const kernel = gaussianKernel1D(sigma);
    const r = Math.floor(kernel.length / 2);

    // Horizontal pass
    const temp = Array.from({ length: h }, (_, row) =>
        Array.from({ length: w }, (_, col) => {
            let acc = 0, wSum = 0;
            for (let k = 0; k < kernel.length; k++) {
                const nc = col + k - r;
                if (nc >= 0 && nc < w) { acc += noise[row][nc] * kernel[k]; wSum += kernel[k]; }
            }
            return wSum > 0 ? acc / wSum : 0;
        })
    );

    // Vertical pass
    return Array.from({ length: h }, (_, row) =>
        Array.from({ length: w }, (_, col) => {
            let acc = 0, wSum = 0;
            for (let k = 0; k < kernel.length; k++) {
                const nr = row + k - r;
                if (nr >= 0 && nr < h) { acc += temp[nr][col] * kernel[k]; wSum += kernel[k]; }
            }
            return wSum > 0 ? acc / wSum : 0;
        })
    );
}

// Fine-grid dimensions derived from global constants
const FINE_SCALE = GLOBAL_CELL_SIZE / LOCAL_CELL_SIZE;         // 5 fine cells per global cell
const FINE_GRID_SIZE = GLOBAL_GRID_SIZE * FINE_SCALE;          // 100×100 total
const FINE_SIGMA = FINE_SCALE * 2.0;                           // visually equivalent to sigma=2 on the 20×20 grid

/**
 * Generates a high-resolution occupancy grid at LOCAL_CELL_SIZE precision spanning the full
 * global world. Obstacle islands have the same visual footprint as the old coarse grid.
 */
function createFineGrid(): Grid {
    const size = FINE_GRID_SIZE;
    const noise: number[][] = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => Math.random())
    );
    const blurred = applyGaussianBlurSeparable(noise, FINE_SIGMA);

    let min = Infinity, max = -Infinity;
    for (const row of blurred) for (const v of row) {
        if (v < min) min = v;
        if (v > max) max = v;
    }
    const range = max - min || 1;
    const threshold = 0.75;

    return Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, col) => {
            const normalized = (blurred[row][col] - min) / range;
            return {
                ...InitialCell,
                x: col,
                y: row,
                z: normalized,
                type: normalized > threshold ? CellTypes.occupied : CellTypes.empty,
            };
        })
    );
}

/**
 * Downsamples the 100×100 fine grid to a GLOBAL_GRID_SIZE×GLOBAL_GRID_SIZE coarse grid.
 * A coarse cell is occupied if any of its FINE_SCALE×FINE_SCALE constituent fine cells is occupied.
 */
function deriveCoarseGrid(fineGrid: Grid): Grid {
    const coarseSize = GLOBAL_GRID_SIZE;
    return Array.from({ length: coarseSize }, (_, coarseRow) =>
        Array.from({ length: coarseSize }, (_, coarseCol) => {
            const fineRowStart = coarseRow * FINE_SCALE;
            const fineColStart = coarseCol * FINE_SCALE;
            let occupied = false;
            outer: for (let dr = 0; dr < FINE_SCALE; dr++) {
                for (let dc = 0; dc < FINE_SCALE; dc++) {
                    if (fineGrid[fineRowStart + dr]?.[fineColStart + dc]?.type === CellTypes.occupied) {
                        occupied = true;
                        break outer;
                    }
                }
            }
            return { ...InitialCell, x: coarseCol, y: coarseRow, type: occupied ? CellTypes.occupied : CellTypes.empty };
        })
    );
}

/**
 * 4-directional BFS from (startX, startY) to (goalX, goalY) on the occupancy grid.
 * Returns the shortest path as {x,y} pairs when reachable.
 * Always returns the closest reachable cell to the goal (used for error placement).
 */
function bfsPath(
    occupancyGrid: Grid,
    startX: number, startY: number,
    goalX: number, goalY: number,
): { path: { x: number; y: number }[] | null; closest: { x: number; y: number } } {
    const h = occupancyGrid.length;
    const w = occupancyGrid[0].length;
    const key = (x: number, y: number) => `${x},${y}`;

    // parent: null means "this is the start node"
    const parent = new Map<string, string | null>();
    const queue: { x: number; y: number }[] = [{ x: startX, y: startY }];
    parent.set(key(startX, startY), null);

    const dist = (x: number, y: number) => Math.abs(x - goalX) + Math.abs(y - goalY);
    let closest = { x: startX, y: startY };
    let closestDist = dist(startX, startY);

    const dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];

    while (queue.length > 0) {
        const { x, y } = queue.shift()!;

        const d = dist(x, y);
        if (d < closestDist) { closestDist = d; closest = { x, y }; }

        if (x === goalX && y === goalY) {
            // Reconstruct path by following parent pointers back to start.
            const path: { x: number; y: number }[] = [];
            let cur: string | null = key(x, y);
            while (cur !== null) {
                const [cx, cy] = cur.split(',').map(Number);
                path.unshift({ x: cx, y: cy });
                cur = parent.get(cur) ?? null;
            }
            return { path, closest };
        }

        for (const { dx, dy } of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            const nk = key(nx, ny);
            if (parent.has(nk)) continue;
            if (occupancyGrid[ny][nx].type === CellTypes.occupied) continue;
            parent.set(nk, key(x, y));
            queue.push({ x: nx, y: ny });
        }
    }

    return { path: null, closest };
}

// ---------------------------------------------------------------------------

/**
 * Builds the navigation grid using BFS to find a path from a start cell
 * (top-left quadrant) to a goal cell (bottom-right quadrant).
 * If no path exists, an error cell is placed at the closest reachable position.
 */
function createNavigationGrid(occupancyGrid: Grid): { navigationGrid: Grid; path: Path } {
    const h = occupancyGrid.length;
    const w = occupancyGrid[0].length;

    const navigationGrid: Grid = occupancyGrid.map(row =>
        row.map(cell => ({ ...InitialCell, x: cell.x, y: cell.y, type: CellTypes.empty }))
    );

    // Collect free cells in scan order (top-left → bottom-right).
    const freeCells: { x: number; y: number }[] = [];
    for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            if (occupancyGrid[row][col].type !== CellTypes.occupied) {
                freeCells.push({ x: col, y: row });
            }
        }
    }

    if (freeCells.length < 2) return { navigationGrid, path: [] };

    const q = Math.max(1, Math.floor(freeCells.length / 4));
    const start = freeCells[randomInt(0, q - 1)];
    const goal  = freeCells[randomInt(freeCells.length - q, freeCells.length - 1)];

    const { path: bfsResult, closest } = bfsPath(occupancyGrid, start.x, start.y, goal.x, goal.y);

    const path: Path = [];

    if (bfsResult) {
        for (const { x, y } of bfsResult) {
            const cell = { ...InitialCell, type: CellTypes.path, x, y };
            path.push(cell);
            navigationGrid[y][x] = { ...cell };
        }
    } else {
        // No path — mark closest reachable cell as error, start as the only path point.
        navigationGrid[closest.y][closest.x] = {
            ...InitialCell, type: CellTypes.error, x: closest.x, y: closest.y,
        };
        const startCell = { ...InitialCell, type: CellTypes.path, x: start.x, y: start.y };
        path.push(startCell);
        navigationGrid[start.y][start.x] = startCell;
    }

    return { navigationGrid, path };
}

function createPlanning(navigationGrid: Grid, path: Path): { course: Path; plan: Path } {
    const course: Path = [];
    const plan: Path = [];
    const currentIndex = 0;

    for (let i = 0; i <= currentIndex; i++) {
        course.push({ ...path[i], type: CellTypes.path });
    }
    for (let i = currentIndex; i < path.length; i++) {
        plan.push({ ...path[i], type: CellTypes.path });
    }

    const current = path[currentIndex] ?? { ...InitialCell, type: CellTypes.current, x: 0, y: 0 };
    const currentCell = { ...current, type: CellTypes.current };
    navigationGrid[current.y][current.x] = currentCell;

    const lastPathCell = path[path.length - 1] ?? current;
    if (lastPathCell.x !== current.x || lastPathCell.y !== current.y) {
        navigationGrid[lastPathCell.y][lastPathCell.x] = { ...lastPathCell, type: CellTypes.objective };
    }

    return { course, plan };
}

export function generateRandomState(): Status {
    console.log("Generating random telemetry state...");
    const fineGrid = createFineGrid();
    const occupancyGrid = deriveCoarseGrid(fineGrid);
    const { navigationGrid, path } = createNavigationGrid(occupancyGrid);
    const { course, plan } = createPlanning(navigationGrid, path);

    return {
        map: {
            occupancyGrid,
            navigationGrid,
            courseTrail: [],
        },
        planning: {
            status: randomChoice(Object.values(TaskValues)),
            course: course,
            plan: plan,
        },
        task: {
            log: createLogEntries(10),
            location: createTaskLocation(),
            data: createTaskData(),
        },
        battery: {
            motors: randomBetween(35, 100),
            primary: randomBetween(35, 100),
        },
        rudder: {
            angle: randomBetween(-30, 30),
        },
        motors: {
            left: randomBetween(35, 100),
            right: randomBetween(35, 100),
        },
        asv: {
            speed: randomBetween(0, 5),
            heading: randomBetween(0, 360),
            longitude: randomBetween(-180, 180),
            latitude: randomBetween(-90, 90),
        },
        signal: {
            strength: randomBetween(0, 100),
        },
    };
}

export function generateMockVideoUrl(): string {
    return `https://picsum.photos/640/360?random=${randomInt(1, 9999)}`;
}

/**
 * Generates a new state by applying small random variations to the previous state, simulating real-time updates.
 * @param previous the previous State to base the new state on.
 * @returns a new State object with updated values based on the previous state, 
 *  with random variations applied to simulate changes over time.
 */
export function generateMockStateUpdate(previous: Status): Status {
    const nextTaskLog = [...previous.task.log, randomChoice(exampleLogData)].slice(-10);

    return {
        ...previous,
        signal: {
            strength: clamp(previous.signal.strength + randomStep(1, 4), 0, 100),
        },
        battery: {
            motors: clamp(previous.battery.motors + randomStep(1, 6), 0, 100),
            primary: clamp(previous.battery.primary + randomStep(1, 6), 0, 100),
        },
        rudder: {
            angle: clamp(previous.rudder.angle + randomStep(2, 7), -90, 90),
        },
        motors: {
            left: clamp(previous.motors.left + randomStep(1, 6), 0, 100),
            right: clamp(previous.motors.right + randomStep(1, 6), 0, 100),
        },
        task: {
            ...previous.task,
            log: nextTaskLog,
        },
    }
}

export default generateRandomState;