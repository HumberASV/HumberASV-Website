/**
 * @file DirectionButtons.tsx
 * @description Interactive directional segments for selecting a compass heading.
 */
import React from 'react';
import { DirectionalGrid, type DirectionalGridProps } from './DirectionalGrid';

/**
 * Props for the DirectionButtons component.
 */
export type DirectionButtonsProps = DirectionalGridProps;

/**
 * Renders a ring of interactive arc segments representing cardinal and intercardinal directions.
 * 
 * @param props - The properties for the DirectionButtons component.
 */
export const DirectionButtons: React.FC<DirectionButtonsProps> = (props) => {
    return <DirectionalGrid {...props} />;
};