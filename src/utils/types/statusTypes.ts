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
import type { DetectedObject } from "./detectedObjectsTypes";

type CourseTrailPoint = {
    x: number;
    y: number;
};

type ZedPosition = { x: number; y: number; z: number };
type ZedOrientation = { roll: number; pitch: number; yaw: number };

type Zed = {
    odom: {
        position: ZedPosition;
        orientation: ZedOrientation;
    };
    objects: DetectedObject[];
    camera: {
        active: boolean;
        width: number;
        height: number;
        encoding: string;
    };
};

type Status = {
    map: {
        occupancyGrid: Grid;
        navigationGrid: Grid;
        courseTrail: CourseTrailPoint[];
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
    rudder: {
        angle: number;
    };
    battery: {
        motors: number;
        primary: number;
    }
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
    zed: Zed;
}
    
const InitialStatus: Status = {
    map: {
        occupancyGrid: [],
        navigationGrid: [],
        courseTrail: [],
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
    rudder: {
        angle: 0
    },
    motors: {
        left: 100,
        right: 100
    },
    battery: {
        motors: 0,
        primary: 0
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
    zed: {
        odom: {
            position: { x: 0, y: 0, z: 0 },
            orientation: { roll: 0, pitch: 0, yaw: 0 },
        },
        objects: [],
        camera: {
            active: false,
            width: 0,
            height: 0,
            encoding: "",
        },
    },
};

export type { Status, CourseTrailPoint, Zed, ZedPosition, ZedOrientation };
export { InitialStatus };
