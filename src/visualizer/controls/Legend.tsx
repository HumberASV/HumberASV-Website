/**
 * @file Legend.tsx
 * @description Legend component for the Mapping Visualizer explaining colors and symbols.
 */
import React from 'react';
import { useTheme, Box, Typography, Paper, alpha } from '@mui/material';

/**
 * @interface LegendProps
 * @description Properties for the {@link Legend} component.
 * @see {@link Legend}
 */
interface LegendProps {
  /** The type of legend to display. Defaults to 'mapping'. */
  variant?: 'mapping' | 'forces';
  /** If true, renders without the Paper wrapper. */
  disablePaper?: boolean;
  /** If true, hides the internal title. */
  hideTitle?: boolean;
}

/**
 * @interface LegendItem
 * @description Definition for a legend item.
 * @see {@link Legend}
 * @property {string} label - The text label for the legend item.
 * @property {string} color - The color associated with the legend item.
 * @property {'line' | 'circle'} type - The shape type for the legend item.
 * @property {number} [opacity] - Optional opacity for the legend item shape.
 * @property {number} [strokeWidth] - Optional stroke width for line shapes.
 * @property {string} [stroke] - Optional stroke color for circle shapes.
 * @property {string} [textColor] - Optional text color for the label.
 * @property {number} [radius] - Optional radius for circle shapes.
 */
interface LegendItem {
  label: string;
  color: string;
  type: 'line' | 'circle';
  opacity?: number;
  strokeWidth?: number;
  stroke?: string;
  textColor?: string;
  radius?: number;
}

/**
 * @component Legend
 * @description Renders an HTML legend panel using MUI.
 * @param {LegendProps} props - Properties for the component.
 * @remarks
 * Renders an HTML legend panel using MUI.
 * Uses the application theme for consistent styling of text and shapes.
 */
export const Legend: React.FC<LegendProps> = ({ 
  variant = 'mapping', 
  disablePaper = false, 
  hideTitle = false 
}) => {
  const theme = useTheme();

  const isForces = variant === 'forces';

  // Define legend items based on the variant
  const items: LegendItem[] = isForces
    ? [
        { label: 'Object Heading', color: theme.palette.map.heading, type: 'line', strokeWidth: 3 },
        { label: 'Weight (-Z)', color: theme.palette.map.weight, type: 'line', strokeWidth: 3, textColor: theme.palette.error.light },
        { label: 'Buoyancy (+Z)', color: theme.palette.map.buoyancy, type: 'line', strokeWidth: 3, textColor: theme.palette.success.light },
        { label: 'Current (XY plane)', color: theme.palette.map.current, type: 'line', strokeWidth: 3, textColor: theme.palette.info.light },
        { label: 'Drag (opposes current)', color: theme.palette.map.drag, type: 'line', strokeWidth: 3, textColor: theme.palette.warning.light },
      ]
    : [
        { label: 'Global Grid (Low-Res)', color: theme.palette.map.grid, type: 'line', strokeWidth: 2, opacity: 0.5 },
        { label: 'X Axis (Global & Local)', color: theme.palette.map.xAxis, type: 'line', strokeWidth: 2 },
        { label: 'Y Axis / Local YZ Plane', color: theme.palette.map.yAxis, type: 'line', strokeWidth: 2 },
        { label: 'Local XY Plane', color: theme.palette.map.localXY, type: 'line', strokeWidth: 2 },
        { label: 'Local XZ Plane', color: theme.palette.map.localXZ, type: 'line', strokeWidth: 2 },
        { label: 'Local Origin Point', color: theme.palette.map.localOrigin, type: 'circle', radius: 5 },
        { label: 'Global Origin (0,0)', color: theme.palette.map.globalOrigin, type: 'circle', stroke: theme.palette.map.grid, strokeWidth: 1, radius: 4 },
      ];

  const content = (
    <Box sx={{ width: '100%' }}>
      {!hideTitle && (
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 800, 
            mb: 1.5, 
          fontSize: '0.75rem',
          color: theme.palette.primary.light,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        {isForces ? 'Forces:' : 'Legend'}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
        {items.map((item) => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {item.type === 'line' ? (
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: item.strokeWidth || 2, 
                    bgcolor: item.color,
                    opacity: item.opacity ?? 1,
                    borderRadius: 1
                  }} 
                />
              ) : (
                <Box 
                  sx={{ 
                    width: (item.radius || 4) * 2, 
                    height: (item.radius || 4) * 2, 
                    borderRadius: '50%', 
                    bgcolor: item.color,
                    border: item.stroke ? `${item.strokeWidth || 1}px solid ${item.stroke}` : 'none'
                  }} 
                />
              )}
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.7rem', 
                fontWeight: 600,
                color: item.textColor || 'inherit',
                lineHeight: 1.2
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  if (disablePaper) return content;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        backgroundColor: alpha(theme.palette.scene.skyDark, 0.7),
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        p: 2,
        color: theme.palette.common.white,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
      }}
    >
      {content}
    </Paper>
  );
};