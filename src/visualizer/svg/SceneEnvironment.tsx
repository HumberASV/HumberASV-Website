/**
 * @file SceneEnvironment.tsx
 * @description Shared SVG definitions and background elements for 3D scenes.
 * @author Carson Fujita
 * @remarks
 * This component provides shared SVG `<defs>` for gradients and filters, as well as a background rectangle for the scene.
 * It is intended to be used as a wrapper around other SVG elements in the scene.
 */
import React from 'react';
import { useTheme } from '@mui/material';

/**
 * @interface SceneEnvironmentProps
 * @description Properties for the {@link SceneEnvironment} component.
 * @see {@link SceneEnvironment}
 * @property {number} width - Width of the SVG canvas.
 * @property {number} height - Height of the SVG canvas.
 */
interface SceneEnvironmentProps {
  /** Width of the SVG canvas. */
  width: number;
  /** Height of the SVG canvas. */
  height: number;
}

/** 
 * @component SceneEnvironment
 * @description Renders shared SVG `<defs>` (gradients, glow filter) and the scene background rect. 
 * @param {SceneEnvironmentProps} props - Properties for the component.
 * @returns {JSX.Element} A React element representing the scene environment.
 * @remarks
 * The component uses the MUI theme palette to define colors for the sky and water gradients.
 * It also defines a glow filter that can be applied to other SVG elements in the scene.
 * @see {@link IsometricGrid} for rendering a grid overlay.
 * @see {@link IsometricAxes} for rendering coordinate axes.
 * @example
 * <SceneEnvironment width={800} height={600} />
 */
export const SceneEnvironment: React.FC<SceneEnvironmentProps> = ({ width, height }) => {
  const theme = useTheme();
  const { water, scene } = theme.palette;

  return (
    <>
      <defs>
        <radialGradient id="skyGlow" cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor={scene.skyLight} />
          <stop offset="100%" stopColor={scene.skyDark} />
        </radialGradient>
        <linearGradient id="waterGradient3d" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={water.surface} />
          <stop offset="50%"  stopColor={water.mid} />
          <stop offset="100%" stopColor={water.deep} />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Scene Background */}
      <rect x="0" y="0" width={width} height={height} fill="url(#skyGlow)" />
    </>
  );
};