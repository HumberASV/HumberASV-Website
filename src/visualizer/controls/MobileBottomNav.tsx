/**
 * @file MobileBottomNav.tsx
 * @description Bottom navigation bar for mobile view in the ASV visualizer. Allows switching between mapping and forces panels.
 * @author Carson Fujita
 * @license MIT
 */
import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SpeedIcon from '@mui/icons-material/Speed';
import { useAppSelector, useAppDispatch } from '../../store';
import { setActiveScene, selectActiveTabIndex, selectRegisteredScenes } from '../../store/slices/sceneSlice';

/**
 * @component MobileBottomNav
 * @description Fixed bottom navigation bar for mobile view that allows switching between the Mapping and Forces tabs.
 * @remarks
 * This component renders a fixed bottom navigation bar that is visible on mobile devices. It allows users to switch between the Mapping and Forces panels in the ASV visualizer. The active tab is highlighted, and clicking on a tab dispatches an action to update the active scene in the Redux store.
 * @example
 * <MobileBottomNav />
 */ 
export const MobileBottomNav: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const activeTabIndex = useAppSelector(selectActiveTabIndex);
    const scenes = useAppSelector(selectRegisteredScenes);

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
                value={activeTabIndex}
                onChange={(_, v) => {
                    const scene = scenes.find(s => s.tabIndex === v);
                    if (scene) dispatch(setActiveScene(scene.id));
                }}
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
