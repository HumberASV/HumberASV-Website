/**
 * @file Software.tsx
 * @copyright Carson Fujita 2026
 * @license MIT
 */
import { useEffect } from "react";
import MappingVisualizer from "../components/map/MappingVisualizer";
import { Box } from "@mui/material";
import { Provider, useDispatch } from 'react-redux';
import store from '../store';
import type { AppDispatch } from '../store';
import { initConnection } from '../store/actions/connectionActions';

function SoftwareContent() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(initConnection());
    }, [dispatch]);
    return <MappingVisualizer />;
}

export default function Software() {
    return (
        <Provider store={store}>
            <Box>
                <SoftwareContent />
            </Box>
        </Provider>
    );
}