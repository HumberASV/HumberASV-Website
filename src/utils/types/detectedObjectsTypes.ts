/**
 * @file detectedObjectsTypes.ts
 * @description
 * This file defines TypeScript types for detected objects in the ASV telemetry application. 
 * These types are used to represent the data structure of objects detected by the ASV's sensors,
 */


export type DetectedObject = {
    label: string;
    label_id: number;
    confidence: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
};

export type DetectedObjects = DetectedObject[];