/*

This script is a debug/testing 
utility to generate a random telemetry data for testing purposes.

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
import type { TelemetryState } from "../telemetryInterfaces";
import type { TaskData } from "../telemetryInterfaces";
import type { GridItem } from "../telemetryInterfaces";
import type { GridPoint } from "../telemetryInterfaces";
import { GridValues } from "../telemetryInterfaces";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const randomStep = (minStep: number, maxStep: number) => randomBetween(minStep, maxStep) * (Math.random() < 0.5 ? -1 : 1);

const wrapHeading = (heading: number) => {
    const wrapped = heading % 360;
    return wrapped < 0 ? wrapped + 360 : wrapped;
};
// Example log data to generate random logs
const exampleLogData = [
    "Wowzers, this is a log entry!",
    "Jinkies, Scooby-Doo, where are you?",
    "Yippie!",
    "Zoinks!",
    "Ruh-roh!",
    "Jeepers, this is a spooky log entry!",
];

function createGrid(rows: number, cols: number): GridItem[][] {
    const grid: GridItem[][] = [];
    for (let i = 0; i < rows; i++) {
        const row: GridItem[] = [];
        for (let j = 0; j < cols; j++) {
            row.push(GridValues.empty); // Initialize all cells as empty
        }
        grid.push(row);
    }
    return grid;
}

function addPathToGrid(grid: GridItem[][]): GridPoint[] {
    const rows = grid.length;
    const cols = grid[0].length;
    let currentRow = Math.floor(Math.random() * rows);
    let currentCol = Math.floor(Math.random() * cols);
    const path: GridPoint[] = [{ row: currentRow, col: currentCol }];
    grid[currentRow][currentCol] = GridValues.path;

    for (let i = 0; i < 20; i++) { // Create a path of 20 steps
        const direction = Math.floor(Math.random() * 4);
        switch (direction) {
            case 0: // Up
                if (currentRow > 0) currentRow--;
                break;
            case 1: // Down
                if (currentRow < rows - 1) currentRow++;
                break;
            case 2: // Left
                if (currentCol > 0) currentCol--;
                break;
            case 3: // Right
                if (currentCol < cols - 1) currentCol++;
                break;
        }
        grid[currentRow][currentCol] = GridValues.path;
        path.push({ row: currentRow, col: currentCol });
    }

    return path;
}

function addCurrentMarkerToGrid(grid: GridItem[][], point: GridPoint): void {
    grid[point.row][point.col] = GridValues.current;
}

function addObstaclesToGrid(grid: GridItem[][], count: number = 8): void {
    const rows = grid.length;
    const cols = grid[0].length;

    for (let i = 0; i < count; i++) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (grid[row][col] === GridValues.empty) {
            grid[row][col] = GridValues.occupied;
        }
    }
}

export function generateRandomTelemetry(): TelemetryState {
    const occupancyGrid = createGrid(10, 10);
    addPathToGrid(occupancyGrid);
    addObstaclesToGrid(occupancyGrid);
    const navigationGrid = createGrid(10, 10);
    const plannedPath = addPathToGrid(navigationGrid);
    addCurrentMarkerToGrid(navigationGrid, plannedPath[0]);
    // Generate a random log with 10 entries
    const fakeLog = [];
    for (let i = 0; i < 10; i++) {
        fakeLog.push(exampleLogData[Math.floor(Math.random() * exampleLogData.length)]);
    }

    const fakeTaskData: TaskData = {
        id: Math.floor(Math.random() * 1000), // Random task ID
        name: `Task ${Math.floor(Math.random() * 100)}`, // Random task name
        status: ["autonomous", "remote", "standby", "lost connection", "out of control"][Math.floor(Math.random() * 5)], // Random status
        latitude: Math.random() * 180 - 90, // Random latitude between -90 and 90
        longitude: Math.random() * 360 - 180, // Random longitude between -180 and 180
    };

    const fakeTelemetry: TelemetryState = {
        token: Math.random().toString(36).substring(2, 15), // Random token
        speed: Math.random() * 5, // Random speed between 0 and 5 m/s
        heading: Math.random() * 360, // Random heading between 0 and 360 degrees
        taskData: fakeTaskData,
        status: fakeTaskData.status,
        latitude: fakeTaskData.latitude,
        longitude: fakeTaskData.longitude,
        signalStrength: Math.random() * 100, // Random signal strength between 0 and 100%
        motorBatteries: [Math.random() * 100, Math.random() * 100], // Random battery levels for two motors
        powerBatteries: [Math.random() * 100, Math.random() * 100], // Random battery levels for two power sources
        motor1Power: Math.random() * 100, // Random power level for motor 1
        motor2Power: Math.random() * 100, // Random power level for motor 2
        rudderAngle: Math.random() * 180 - 90, // Random rudder angle between -90 and 90 degrees
        taskLog: fakeLog,
        taskLocations: [
            {
                id: `loc${Math.floor(Math.random() * 1000)}`,
                latitude: Math.random() * 180 - 90,
                longitude: Math.random() * 360 - 180,
            },
            {
                id: `loc${Math.floor(Math.random() * 1000)}`,
                latitude: Math.random() * 180 - 90,
                longitude: Math.random() * 360 - 180,
            },
        ],
        occupancyGrid: occupancyGrid, // Random 10x10 occupancy grid
        navigationGrid: navigationGrid, // Random 10x10 navigation grid
        plannedPath: plannedPath,
        imageStream: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`, // Random image URL
    };

    return fakeTelemetry;  
}

export function generateMockTelemetryUpdate(previous: TelemetryState): TelemetryState {
    const nextMotorBatteries = previous.motorBatteries.map((level) => clamp(level + randomStep(0.1, 0.8), 0, 100));
    const nextPowerBatteries = previous.powerBatteries.map((level) => clamp(level + randomStep(0.1, 0.8), 0, 100));
    const nextTaskLog = [...previous.taskLog];
    nextTaskLog.push(exampleLogData[Math.floor(Math.random() * exampleLogData.length)]);

    return {
        ...previous,
        speed: clamp(previous.speed + randomStep(0.03, 0.18), 0, 5),
        heading: wrapHeading(previous.heading + randomStep(1, 4)),
        signalStrength: clamp(previous.signalStrength + randomStep(1, 4), 0, 100),
        motorBatteries: nextMotorBatteries,
        powerBatteries: nextPowerBatteries,
        motor1Power: clamp(previous.motor1Power + randomStep(1, 6), 0, 100),
        motor2Power: clamp(previous.motor2Power + randomStep(1, 6), 0, 100),
        rudderAngle: clamp(previous.rudderAngle + randomStep(2, 7), -90, 90),
        taskLog: nextTaskLog.slice(-10),
    };
}

export default generateRandomTelemetry;