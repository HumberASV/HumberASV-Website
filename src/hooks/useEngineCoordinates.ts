/**
 * @file useEngineCoordinates.ts
 * @description Memoized isometric coordinate calculations for the engine.
 * Renamed from useIsometricCoordinates.ts.
 */
import { useMemo } from 'react';
import { type Cell, GLOBAL_CELL_SIZE } from '../utils/types';

/**
 * @function useEngineCoordinates
 * @description A custom React hook that calculates and memoizes the screen coordinates of a point in the engine's world space.
 * @param {number} globalX - The global X coordinate in world units (grid cells).
 * @param {number} globalY - The global Y coordinate in world units (grid cells).
 * @param {(x: number, y: number, z: number) => Cell} toScreen - A projection function that converts 3D coordinates to 2D screen coordinates.
 * @returns {{ pointScreen: Cell, globalOriginScreen: Cell }} An object containing the screen coordinates of the specified point and the global origin.
 * @remarks
 * This hook is useful for converting world-space coordinates into screen-space coordinates for rendering in an isometric view. It uses memoization to optimize performance by recalculating only when the input parameters change.
 * The `toScreen` function should be provided by the parent component and is responsible for projecting 3D coordinates onto a 2D plane.
 */
export const useEngineCoordinates = (
  globalX: number,
  globalY: number,
  toScreen: (x: number, y: number, z: number) => Cell,
) => {
  const pointWorldX = globalX * GLOBAL_CELL_SIZE;
  const pointWorldY = globalY * GLOBAL_CELL_SIZE;

  const pointScreen       = useMemo(() => toScreen(pointWorldX, pointWorldY, 0), [pointWorldX, pointWorldY, toScreen]);
  const globalOriginScreen = useMemo(() => toScreen(0, 0, 0), [toScreen]);

  return { pointScreen, globalOriginScreen };
};
