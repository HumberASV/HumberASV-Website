import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SpeedIcon from '@mui/icons-material/Speed';
import { useAppSelector, useAppDispatch } from '../../../store';
import { setActiveTab } from '../../../store/slices/visualizerSlice';

export const MobileBottomNav: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const activeTab = useAppSelector(state => state.controls.activeTab);

    return (
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
                onChange={(_, v) => dispatch(setActiveTab(v))}
                sx={{
                    bgcolor: theme.palette.scene.skyDark,
                    '& .Mui-selected': { color: `${theme.palette.water.highlight} !important` },
                    '& .MuiBottomNavigationAction-root': { color: theme.palette.gui.muted },
                }}
            >
                <BottomNavigationAction label="Mapping" icon={<MapIcon />} />
                <BottomNavigationAction label="Forces" icon={<SpeedIcon />} />
            </BottomNavigation>
        </Paper>
    );
};
