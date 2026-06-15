/**
 * @file ForceVectorsPanel.tsx
 * @description HTML overlay showing numerical values of force vectors using MUI.
 */
import React from 'react';
import { useTheme, Box, Typography, Paper, alpha } from '@mui/material';
import { getCardinalLabel } from '../../../utils/types';

export interface ForceVectorsPanelProps {
    /** Current heading of the object in degrees. */
    objectHeading: number;
    /** Current heading of the water in radians. */
    currentRad: number;
    /** Current speed of the water. */
    currentSpeed: number;
}

/**
 * Renders a panel containing the numerical decomposition of forces acting on the object.
 */
export const ForceVectorsPanel: React.FC<ForceVectorsPanelProps> = ({
    objectHeading,
    currentRad,
    currentSpeed
}) => {
    const theme = useTheme();

    const items = [
        { label: 'Heading:', color: '#ffffff', value: `${objectHeading}° (${getCardinalLabel(objectHeading)})` },
        { label: 'Weight:', color: theme.palette.error.main, value: '(0, 0, −mg)' },
        { label: 'Buoyancy:', color: theme.palette.success.main, value: '(0, 0, +ρVg)' },
        { 
            label: 'Current:', 
            color: theme.palette.info.main, 
            value: `(${(-Math.sin(currentRad) * currentSpeed).toFixed(1)}, ${(Math.cos(currentRad) * currentSpeed).toFixed(1)}, 0)` 
        },
        { 
            label: 'Drag:', 
            color: theme.palette.secondary.main, 
            value: `(${(Math.sin(currentRad) * currentSpeed * 0.5).toFixed(1)}, ${(-Math.cos(currentRad) * currentSpeed * 0.5).toFixed(1)}, 0)` 
        },
        { 
            label: 'Net XY:', 
            color: '#eab308', 
            value: `(${(-Math.sin(currentRad) * currentSpeed * 0.5).toFixed(1)}, ${(Math.cos(currentRad) * currentSpeed * 0.5).toFixed(1)}, 0)` 
        },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(4px)',
                borderRadius: 2,
                p: 2,
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                color: 'white'
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
                                color: '#94a3b8', 
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