import React from "react";
import { Box } from "@mui/material";
import Navbar from "../common/Navbar";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Navbar />
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          minHeight: "calc(100vh - 64px)",
          position: "relative",
          zIndex: 1, // Ensure content stays below loading page
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default MainLayout;
