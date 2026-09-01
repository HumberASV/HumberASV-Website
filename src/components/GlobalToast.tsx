import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch, dismissToast } from 'visualizer-components/store';

/**
 * Global toast notification driven by the Redux connection slice.
 * Mount once at the app root — fires on any page when the connection state changes.
 */
export const GlobalToast: React.FC = () => {
    const dispatch = useAppDispatch();
    const { open, message, severity } = useAppSelector((state) => state.connection.toast);

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        dispatch(dismissToast());
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};
