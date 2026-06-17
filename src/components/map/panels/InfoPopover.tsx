import React from 'react';
import { Popover, Typography, Divider, Stack, Box } from '@mui/material';

export interface InfoPopoverProps {
    anchor: HTMLElement | null;
    onClose: () => void;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({ anchor, onClose }) => (
    <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
            paper: {
                sx: {
                    bgcolor: '#0f172a',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundImage: 'none',
                    borderRadius: 2,
                    p: 2.5,
                    maxWidth: 320,
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.6)',
                },
            },
        }}
    >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
            System Visualizer
        </Typography>

        <Stack spacing={0.5} mb={2}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', letterSpacing: '0.05em' }}>LIVE</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', pl: 2.5, display: 'block' }}>
                Connected to the ASV basestation over WebSocket. All telemetry — speed, heading, position, grid maps — streams from the vessel in real time. Simulation controls are locked.
            </Typography>
        </Stack>

        <Stack spacing={0.5} mb={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#f59e0b', letterSpacing: '0.05em' }}>SIM</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', pl: 2.5, display: 'block' }}>
                No live connection. A 20×20 map is generated procedurally using Gaussian noise blurred into obstacle islands, then BFS finds a navigable path between two free cells.
            </Typography>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />

        <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
            Simulation Modes
        </Typography>

        <Stack spacing={0.5} mb={2}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#a78bfa', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em' }}>AUTO</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', pl: 2.5, display: 'block' }}>
                The vessel follows the planned BFS path from current position to objective, looping continuously. If the objective is unreachable the vessel holds position. The course-over-ground trail marks every visited cell.
            </Typography>
        </Stack>

        <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fbbf24', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#fbbf24', letterSpacing: '0.05em' }}>MAN</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', pl: 2.5, display: 'block' }}>
                Full manual control. Use the speed and rotation sliders in the settings drawer to drive the vessel around the map. The grid wraps seamlessly at the boundary.
            </Typography>
        </Stack>
    </Popover>
);
