/**
 * @file useEngineCoordinates.ts
 * @description Memoized isometric coordinate calculations for the engine.
 * Renamed from useIsometricCoordinates.ts.
 */
import { useMemo } from 'react';
import { type Cell, GLOBAL_CELL_SIZE } from '../utils/types';

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
