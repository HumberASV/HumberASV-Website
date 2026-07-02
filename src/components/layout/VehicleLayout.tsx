/**
 * @file VehicleLayout.tsx
 * @description Layout component for the Vehicle section of the application, providing a consistent structure with a navbar and footer.
 * It wraps the content of the vehicle-related pages, ensuring a uniform look and feel across the vehicle subpages.
 */

import { Box } from "@mui/material";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";

export const VehicleLayout = () => {
    return (
   <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
    );
}