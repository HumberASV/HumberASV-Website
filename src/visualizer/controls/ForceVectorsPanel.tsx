/**
 * @file ForceVectorsPanel.tsx
 * @description HTML overlay showing numerical values of force vectors using MUI.
 */
import React from 'react';
import { useTheme, Box, Typography, Paper, alpha } from '@mui/material';
import { getCardinalLabel } from '../../utils/types';

/**
 * @interface ForceVectorsPanelProps
 * @description Properties for the {@link ForceVectorsPanel} component.
 * @see {@link ForceVectorsPanel}
 * @property {number} objectHeading - Current heading of the object in degrees.
 * @property {number} currentRad - Current heading of the water in radians.
 * @property {number} currentSpeed - Current speed of the water.
 */
export interface ForceVectorsPanelProps {
    /** Current heading of the object in degrees. */
    objectHeading: number;
    /** Current heading of the water in radians. */
    currentRad: number;
    /** Current speed of the water. */
    currentSpeed: number;
}

/**
 * @component ForceVectorsPanel
 * @description Renders a panel containing the numerical decomposition of forces acting on the object.
 * @param {ForceVectorsPanelProps} props - Properties for the component.
 * @remarks
 * This component displays a panel with the numerical values of various force vectors acting on the floating object, 
 * including weight, buoyancy, current, drag, and net XY forces. It uses Material-UI components for styling and layout.
 * @example
 * <ForceVectorsPanel 
 *  objectHeading={45}
 * currentRad={Math.PI / 4}
 * currentSpeed={2.5}
 * />
 */
export const ForceVectorsPanel: React.FC<ForceVectorsPanelProps> = ({
    objectHeading,
    currentRad,
    currentSpeed
}) => {
    const theme = useTheme();

    /**
     * @remarks
     * Defines the legend items for the force vectors panel, including labels, colors, and values.
     * The values are calculated based on the current heading and speed of the water.
     */
    const items = [
        { label: 'Heading:', color: theme.palette.common.white, value: `${objectHeading}° (${getCardinalLabel(objectHeading)})` },
        { label: 'Weight:', color: theme.palette.map.weight, value: '(0, 0, −mg)' },
        { label: 'Buoyancy:', color: theme.palette.map.buoyancy, value: '(0, 0, +ρVg)' },
        {
            label: 'Current:',
            color: theme.palette.map.current,
            value: `(${(-Math.sin(currentRad) * currentSpeed).toFixed(1)}, ${(Math.cos(currentRad) * currentSpeed).toFixed(1)}, 0)`
        },
        {
            label: 'Drag:',
            color: theme.palette.map.drag,
            value: `(${(Math.sin(currentRad) * currentSpeed * 0.5).toFixed(1)}, ${(-Math.cos(currentRad) * currentSpeed * 0.5).toFixed(1)}, 0)`
        },
        {
            label: 'Net XY:',
            color: theme.palette.map.xAxis,
            value: `(${(-Math.sin(currentRad) * currentSpeed * 0.5).toFixed(1)}, ${(Math.cos(currentRad) * currentSpeed * 0.5).toFixed(1)}, 0)`
        },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                backgroundColor: theme.palette.gui.primary,
                backdropFilter: 'blur(4px)',
                borderRadius: 2,
                p: 2,
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                color: theme.palette.common.white,
            }}
        >
            <Typography 
                variant="subtitle2" 
                sx={{ 
                    fontWeight: 800, 
                    mb: 1.5, 
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}
            >
                Force Vectors:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {items.map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'baseline' }}>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: item.color, 
                                fontWeight: 'bold', 
                                fontSize: '0.65rem',
                                width: '65px',
                                flexShrink: 0
                            }}
                        >
                            {item.label}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.gui.muted,
                                fontSize: '0.65rem',
                                fontFamily: 'monospace'
                            }}
                        >
                            {item.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};