import React from "react";
import { Box } from "@mui/material";

type ConnectLayoutProps = {
  children: React.ReactNode;
};

const ConnectLayout = ({ children }: ConnectLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ConnectLayout;
