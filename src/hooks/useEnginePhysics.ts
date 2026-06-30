/**
 * @file useEnginePhysics.ts
 * @description Physics animation loop for the mapping visualizer engine.
 * Drives vessel position from velocity and rotation at 60fps via requestAnimationFrame.
 * Renamed from useMapAnimation.ts.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { GLOBAL_GRID_SIZE } from '../utils/types';

/**
 * @function useEnginePhysics
 * @description Custom React hook that animates the vessel's position based on its velocity and local rotation.
 * @param {number} velocity - The current velocity of the vessel in units per second.
 * @param {number} localRotation - The current local rotation of the vessel in degrees (0 = north, 90 = east).
 * @returns {{ globalX: number, globalY: number, setGlobalX: (x: number) => void, setGlobalY: (y: number) => void }} An object containing the current global X and Y positions of the vessel, along with setter functions to update them.
 * @remarks
 * This hook uses requestAnimationFrame to create a smooth animation loop that updates the vessel's position based on its velocity and rotation. 
 * It ensures that the position wraps around when exceeding the defined grid limits. 
 * The hook also provides setter functions to allow external components to directly modify the global X and Y positions if needed.
 * @example
 * const { globalX, globalY, setGlobalX, setGlobalY } = useEnginePhysics(velocity, localRotation);
 */
export const useEnginePhysics = (velocity: number, localRotation: number) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Refs updated synchronously each render so the stable RAF loop always reads
  // the latest values without needing to restart when they change.
  const velocityRef = useRef(velocity);
  const rotationRef = useRef(localRotation);
  velocityRef.current = velocity;
  rotationRef.current = localRotation;

  const limit = GLOBAL_GRID_SIZE / 2;
  const lastTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      const vel = velocityRef.current;
      if (vel !== 0) {
        const rad = (-rotationRef.current * Math.PI) / 180;
        const dx = -vel * Math.sin(rad) * deltaTime;
        const dy = -vel * Math.cos(rad) * deltaTime;

        setPos(prev => {
          let newX = prev.x + dx;
          let newY = prev.y + dy;
          if (newX >  limit) newX -= GLOBAL_GRID_SIZE;
          if (newX < -limit) newX += GLOBAL_GRID_SIZE;
          if (newY >  limit) newY -= GLOBAL_GRID_SIZE;
          if (newY < -limit) newY += GLOBAL_GRID_SIZE;
          return { x: newX, y: newY };
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = null;
    };
  }, []); // stable loop — velocity and rotation read from refs above

  const setGlobalX = useCallback((x: number) => setPos(prev => ({ ...prev, x })), []);
  const setGlobalY = useCallback((y: number) => setPos(prev => ({ ...prev, y })), []);

  return { globalX: pos.x, globalY: pos.y, setGlobalX, setGlobalY };
};
