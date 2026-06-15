/**
 * @file Software.tsx
 * @copyright Carson Fujita 2026
 * @license MIT
 */ 
import MappingVisualizer from "../components/map/MappingVisualizer";
import { Box } from "@mui/material";
import { Provider } from 'react-redux';
import  store  from '../store';

export default function Software() {
    return (
        <Provider store={store}>
            <Box>
                    <MappingVisualizer 
                    
                    />
            </Box>
        </Provider>
  );
}