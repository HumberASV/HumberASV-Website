/**
 * @file utils/math/vectors.ts
 * @description Lightweight 2D and 3D vector types and operations.
 */

export type Vector2 = { x: number; y: number };
export type Vector3 = { x: number; y: number; z: number };

export const vec2Add     = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x + b.x, y: a.y + b.y });
export const vec2Sub     = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x - b.x, y: a.y - b.y });
export const vec2Scale   = (v: Vector2, s: number):  Vector2 => ({ x: v.x * s,   y: v.y * s });
export const vec2Length  = (v: Vector2): number => Math.sqrt(v.x ** 2 + v.y ** 2);
export const vec2Normalize = (v: Vector2): Vector2 => {
    const l = vec2Length(v) || 1;
    return vec2Scale(v, 1 / l);
};
export const vec2Dot     = (a: Vector2, b: Vector2): number => a.x * b.x + a.y * b.y;

export const vec3Add     = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const vec3Sub     = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const vec3Scale   = (v: Vector3, s: number):  Vector3 => ({ x: v.x * s,   y: v.y * s,   z: v.z * s });
export const vec3Length  = (v: Vector3): number => Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
export const vec3Normalize = (v: Vector3): Vector3 => {
    const l = vec3Length(v) || 1;
    return vec3Scale(v, 1 / l);
};
export const vec3Dot     = (a: Vector3, b: Vector3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const vec3Cross   = (a: Vector3, b: Vector3): Vector3 => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
});
