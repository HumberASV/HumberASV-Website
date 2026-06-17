/**
 * @file useIsometricCoordinates.ts
 * @description Custom hook to handle coordinate calculations for the mapping visualizer.
 */
import { useMemo } from 'react';
import { type Cell, GLOBAL_CELL_SIZE } from '../utils/types';

/**
 * Hook to calculate isometric coordinates and grid lines.
 * 
 * @param globalX - Global X coordinate.
 * @param globalY - Global Y coordinate.
 * @param toScreen - Projection function to convert 3D to 2D.
 * @returns An object containing calculated points and grid lines.
 */
export const useIsometricCoordinates = (globalX: number, globalY: number, toScreen: (x: number, y: number, z: number) => Cell) => {
  const pointWorldX = globalX * GLOBAL_CELL_SIZE;
  const pointWorldY = globalY * GLOBAL_CELL_SIZE;
  
  const pointScreen = useMemo(() => toScreen(pointWorldX, pointWorldY, 0), [pointWorldX, pointWorldY, toScreen]);
  const globalOriginScreen = useMemo(() => toScreen(0, 0, 0), [toScreen]);

  return { pointScreen, globalOriginScreen };
};