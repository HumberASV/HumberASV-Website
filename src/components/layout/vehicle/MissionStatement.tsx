// src/components/layout/vehicle/MissionStatement.tsx
import { Box, Typography } from "@mui/material";

const MissionStatement = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: { xs: 8, md: 10 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          mb: 3,
          fontSize: { xs: "2rem", md: "3rem" },
          wordWrap: "break-word",
          lineHeight: 1.2,
        }}
      >
        Engineering Excellence for Autonomous Maritime Operations
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "text.secondary",
          maxWidth: 800,
          mx: "auto",
          fontWeight: 400,
          fontSize: { xs: "1.1rem", md: "1.3rem" },
          lineHeight: 1.7,
          px: { xs: 1, sm: 0 },
        }}
      >
        The HumberASV platform represents a comprehensive integration of
        electrical, mechanical, and software engineering disciplines,
        purpose-built for the demanding requirements of international autonomous
        maritime competitions. Our systems approach ensures reliability,
        performance, and innovation at every subsystem level.
      </Typography>
    </Box>
  );
};

export default MissionStatement;
