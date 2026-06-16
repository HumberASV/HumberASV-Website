/**
 * @file status.ts
 * @description Defines the Status type and its initial value for the ASV telemetry system.
 * This file is used to maintain a consistent structure for the status data across the application.
 * It includes information about the map, planning, task, power, rudder, ASV state, signal strength, and video stream.
 * 
 * @author Carson Fujita
 * @license MIT
 */
import type { Path, Grid } from "./mapTypes";
import type { TaskData, TaskLocation, TaskStatus } from "./taskTypes";

type Status = {
    map: {
        occupancyGrid: Grid;
        navigationGrid: Grid;
        fineGrid: Grid;
    };
    planning: {
        status: TaskStatus;
        course: Path;
        plan: Path;
    };
    task: {
        log: string[];
        location: TaskLocation;
        data: TaskData;
    };
    power: {
        motors: number;
        primary: number;
    };
    rudder: {
        angle: number;
    };
    motors: {
        left: number;
        right: number;
    };
    asv: {
        speed: number;
        heading: number;
        longitude: number;
        latitude: number;
    };
    signal: {
        strength: number;
    };
    video: {
        streamUrl: string;
    };
}
    
const InitialStatus: Status = {
    map: {
        occupancyGrid: [],
        navigationGrid: [],
        fineGrid: [],
    },
    planning: {
        status: "idle",
        course: [],
        plan: []
    },
    task: {
        log: [],
        location: { latitude: 0, longitude: 0 },
        data: { id: 0, name: "", status: "standby", latitude: 0, longitude: 0 }
    },
    power: {
        motors: 100,
        primary: 100
    },
    rudder: {
        angle: 0
    },
    motors: {
        left: 100,
        right: 100
    },
    asv: {
        speed: 0,
        heading: 0,
        longitude: 0,
        latitude: 0
    },
    signal: {
        strength: 100
    },
    video   : {
        streamUrl: ""
    }
};

export type { Status };
export { InitialStatus };
