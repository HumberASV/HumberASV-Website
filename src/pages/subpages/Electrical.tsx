/**
 * @file Electrical.tsx
 * @description This is the page that describes the Electrical system of the LoonE ASV. 
 * It provides an overview of the electrical components, wiring, and functionality of the vehicle's electrical system.
 */

import { Container, Grid, Typography } from "@mui/material";
export default function Electrical() {
    return (
        <Container>
            {/* Image */}
            

             <Grid container spacing={2}>
                <Grid size={8}>

                </Grid>
                <Grid size={4}>

                </Grid>
                <Grid size={12}>

                </Grid>

                <Grid size={2}>

                </Grid>
            </Grid>
        
            <Typography variant="h1" component="h1" gutterBottom>
            Electrical System
            </Typography>
            <Typography variant="body1" gutterBottom>
            This page provides an overview of the electrical components, wiring, and functionality of the LoonE ASV's electrical system.
            </Typography>
        </Container>
    );
}