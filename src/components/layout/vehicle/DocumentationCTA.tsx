// src/components/layout/vehicle/DocumentationCTA.tsx
import { Box, Typography, Button, useTheme, alpha } from "@mui/material";
import { Download, Engineering } from "@mui/icons-material";

const DocumentationCTA = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        mt: { xs: 8, md: 10 },
        p: { xs: 3, md: 5 },
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        borderRadius: 3,
        border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.accent.main,
            0.1
          )} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Engineering
          sx={{
            fontSize: { xs: 48, md: 60 },
            color: "primary.main",
            mb: 3,
            filter: `drop-shadow(0 4px 8px ${alpha(
              theme.palette.primary.main,
              0.2
            )})`,
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            mb: 2,
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          Complete Technical Documentation
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 4,
            fontSize: { xs: "1.1rem", md: "1.2rem" },
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Access detailed technical specifications, CAD models, schematics,
          wiring diagrams, and comprehensive system documentation for the
          HumberASV platform.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Download />}
          sx={{
            px: { xs: 4, md: 6 },
            py: { xs: 1.5, md: 2 },
            fontSize: { xs: "1rem", md: "1.1rem" },
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 12px 40px ${alpha(
                theme.palette.primary.main,
                0.4
              )}`,
            },
            transition: "all 0.3s ease",
          }}
        >
          Download Technical Package
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentationCTA;
