// src\components\layout\MainLayout.tsx
import React from "react";
import { Box } from "@mui/material";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
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
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
