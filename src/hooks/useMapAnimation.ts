/**
 * @file useMapAnimation.ts
 * @description Custom hook for managing the mapping visualizer's animation loop.
 */
import { useState, useEffect, useRef } from 'react';
import { GLOBAL_GRID_SIZE } from '../utils/types';

/**
 * Custom hook to handle the animation loop for movement based on 
 * velocity and rotation.
 * 
 * @param velocity - Current movement velocity.
 * @param localRotation - Current local rotation in degrees.
 * @returns An object containing the current global position and its state setters.
 */
export const useMapAnimation = (velocity: number, localRotation: number) => {
  const [globalX, setGlobalX] = useState(0);
  const [globalY, setGlobalY] = useState(0);
  
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
      
      if (velocity > 0) {
        const rad = (-localRotation * Math.PI) / 180;
        // Move forward along the local Y axis.
        // North (heading 0) = –Y world to match the grid row layout (row 0 = top = north).
        const dx = -velocity * Math.sin(rad) * deltaTime;
        const dy = -velocity * Math.cos(rad) * deltaTime;

        setGlobalX(prevX => {
          let newX = prevX + dx;
          if (newX > limit) newX -= GLOBAL_GRID_SIZE;
          if (newX < -limit) newX += GLOBAL_GRID_SIZE;
          return newX;
        });

        setGlobalY(prevY => {
          let newY = prevY + dy;
          if (newY > limit) newY -= GLOBAL_GRID_SIZE;
          if (newY < -limit) newY += GLOBAL_GRID_SIZE;
          return newY;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [velocity, localRotation]);

  return { globalX, globalY, setGlobalX, setGlobalY };
};