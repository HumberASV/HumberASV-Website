import React from 'react';
import { Popover, Typography, Divider, Stack, Box, useTheme, alpha } from '@mui/material';

export interface InfoPopoverProps {
    anchor: HTMLElement | null;
    onClose: () => void;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({ anchor, onClose }) => {
    const theme = useTheme();
    return (
    <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
            paper: {
                sx: {
                    bgcolor: theme.palette.scene.skyDark,
                    color: theme.palette.common.white,
                    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    backgroundImage: 'none',
                    borderRadius: 2,
                    p: 2.5,
                    maxWidth: 320,
                    boxShadow: `0 25px 50px -12px ${alpha(theme.palette.common.black, 0.6)}`,
                },
            },
        }}
    >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.water.highlight, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
            System Visualizer
        </Typography>

        <Stack spacing={0.5} mb={2}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.status.primary.autonomous, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.status.primary.autonomous, letterSpacing: '0.05em' }}>LIVE</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: theme.palette.gui.muted, pl: 2.5, display: 'block' }}>
                Connected to the ASV basestation over WebSocket. All telemetry — speed, heading, position, grid maps — streams from the vessel in real time. Simulation controls are locked.
            </Typography>
        </Stack>

        <Stack spacing={0.5} mb={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.map.drag, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.map.drag, letterSpacing: '0.05em' }}>SIM</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: theme.palette.gui.muted, pl: 2.5, display: 'block' }}>
                No live connection. A 20×20 map is generated procedurally using Gaussian noise blurred into obstacle islands, then BFS finds a navigable path between two free cells.
            </Typography>
        </Stack>

        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.08), mb: 2 }} />

        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.gui.subtle, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
            Simulation Modes
        </Typography>

        <Stack spacing={0.5} mb={2}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.sim.auto, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.sim.auto, letterSpacing: '0.05em' }}>AUTO</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: theme.palette.gui.muted, pl: 2.5, display: 'block' }}>
                The vessel follows the planned BFS path from current position to objective, looping continuously. If the objective is unreachable the vessel holds position. The course-over-ground trail marks every visited cell.
            </Typography>
        </Stack>

        <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.sim.manual, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.sim.manual, letterSpacing: '0.05em' }}>MAN</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: theme.palette.gui.muted, pl: 2.5, display: 'block' }}>
                Full manual control. Use the speed and rotation sliders in the settings drawer to drive the vessel around the map. The grid wraps seamlessly at the boundary.
            </Typography>
        </Stack>
    </Popover>
    );
};
