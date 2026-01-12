// src/components/layout/vehicle/TechnicalSpecifications.tsx
import { Box, Typography, Card, useTheme, alpha } from "@mui/material";

const specifications = [
  { label: "Dimensions", value: "1.8m × 1.2m × 0.8m", icon: "📏" },
  { label: "Weight", value: "25kg", icon: "⚖️" },
  { label: "Max Speed", value: "4 m/s", icon: "🚀" },
  { label: "Battery Life", value: "4 hours", icon: "🔋" },
  { label: "Payload Capacity", value: "+2.5kg", icon: "📦" },
  { label: "Propulsion", value: "2× T200 Thrusters", icon: "⚙️" },
  { label: "Communication", value: "2.4Ghz/5Ghz WiFi", icon: "📡" },
  { label: "Sensors", value: "Stereoscopic Cameras, IMU", icon: "📷" },
];

const TechnicalSpecifications = () => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: { xs: 8, md: 10 } }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          textAlign: "center",
          mb: 6,
          fontSize: { xs: "2rem", md: "2.8rem" },
        }}
      >
        Technical Specifications
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          justifyContent: "center",
        }}
      >
        {specifications.map((spec, index) => (
          <Card
            key={index}
            sx={{
              textAlign: "center",
              p: 3,
              backgroundColor: "background.paper",
              borderRadius: 3,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition: "all 0.3s ease",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              "&:hover": {
                transform: "translateY(-4px)",
                borderColor: alpha(theme.palette.primary.main, 0.3),
                boxShadow: `0 16px 48px ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}`,
              },
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontSize: "2rem" }}>
              {spec.icon}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                lineHeight: 1.3,
              }}
            >
              {spec.value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
              }}
            >
              {spec.label}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TechnicalSpecifications;
