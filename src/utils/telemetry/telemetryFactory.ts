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
import { CellTypes, InitialCell, TaskValues } from "../types";
 
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

// Wrap heading values to stay within 0-360 degrees
const wrapHeading = (heading: number) => {
    const wrapped = heading % 360;
    return wrapped < 0 ? wrapped + 360 : wrapped;
};

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


/**
 * Creates a random occupancy grid for testing purposes.
 */
function createOccupanyGrid(width: number, height: number): Grid {
    return Array.from({ length: height }, () =>
        Array.from({ length: width }, () => ({ 
            ...InitialCell, 
            type: Math.random() < 0.15 ? CellTypes.occupied : CellTypes.empty 
        }))
    );
}

function createNavigationGrid(occupancyGrid: Grid): { navigationGrid: Grid; path: Path } {
    // For simplicity we will just copy the occupancy grid width and size with empty
    // then create a single ordered path and assign it to the navigation grid.
    const navigationGrid = occupancyGrid.map(x => x.map(() => ({ ...InitialCell, type: CellTypes.empty })));
    const path: Path = [];
    const width = occupancyGrid[0].length;
    const height = occupancyGrid.length;

    for (let i = 0; i < Math.max(width, height); i++) {
        const x = clamp(i + randomInt(-1, 1), 0, height - 1);
        const y = clamp(i + randomInt(-1, 1), 0, width - 1);
        const cell = { ...InitialCell, type: CellTypes.path, x, y };
        path.push(cell);
        navigationGrid[x][y] = { ...cell };
    }

    return { navigationGrid, path };
}

function createPlanning(navigationGrid: Grid, path: Path): { course: Path; plan: Path } {
    const course: Path = [];
    const plan: Path = [];
    const half = Math.floor(path.length / 2);
    const currentIndex = path.length <= 1 ? 0 : Math.min(half, path.length - 2);

    for (let i = 0; i <= currentIndex; i++) {
        course.push({ ...path[i], type: CellTypes.path });
    }
    for (let i = currentIndex; i < path.length; i++) {
        plan.push({ ...path[i], type: CellTypes.path });
    }

    const current = path[currentIndex] || { ...InitialCell, type: CellTypes.current, x: 0, y: 0 };
    const currentCell = { ...current, type: CellTypes.current };
    navigationGrid[current.x][current.y] = currentCell;

    const lastPathCell = path[path.length - 1] || current;
    if (lastPathCell.x !== current.x || lastPathCell.y !== current.y) {
        navigationGrid[lastPathCell.x][lastPathCell.y] = { ...lastPathCell, type: CellTypes.objective };
    }

    return { course, plan };
}

const width = 20;
const height = 20;
export function generateRandomState(): Status {
    console.log("Generating random telemetry state...");
    const occupancyGrid = createOccupanyGrid(width, height);
    const { navigationGrid, path } = createNavigationGrid(occupancyGrid);
    const { course, plan } = createPlanning(navigationGrid, path);

    return {
        map: {
            occupancyGrid: occupancyGrid,
            navigationGrid: navigationGrid,
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
        power: {
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
        video: {
            streamUrl: `https://picsum.photos/200/300?random=${randomInt(1, 1000)}`,
        },
    };
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
        asv: {
            ...previous.asv,
            speed: clamp(previous.asv.speed + randomStep(0.03, 0.18), 0, 5),
            heading: wrapHeading(previous.asv.heading + randomStep(1, 4)),
            longitude: clamp(previous.asv.longitude + randomStep(0.01, 0.05), -180, 180),
            latitude: clamp(previous.asv.latitude + randomStep(0.01, 0.05), -90, 90),
        },
        signal: {
            strength: clamp(previous.signal.strength + randomStep(1, 4), 0, 100),
        },
        power: {
            motors: clamp(previous.power.motors + randomStep(1, 6), 0, 100),
            primary: clamp(previous.power.primary + randomStep(1, 6), 0, 100),
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