import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SpeedIcon from '@mui/icons-material/Speed';

export interface MobileBottomNavProps {
    activeTab: number;
    onChange: (event: React.SyntheticEvent, value: number) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onChange }) => (
    <Paper
        sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            borderRadius: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
        }}
        elevation={3}
    >
        <BottomNavigation
            showLabels
            value={activeTab}
            onChange={onChange}
            sx={{
                bgcolor: '#0f172a',
                '& .Mui-selected': { color: '#38bdf8 !important' },
                '& .MuiBottomNavigationAction-root': { color: '#94a3b8' },
            }}
        >
            <BottomNavigationAction label="Mapping" icon={<MapIcon />} />
            <BottomNavigationAction label="Forces" icon={<SpeedIcon />} />
        </BottomNavigation>
    </Paper>
);
