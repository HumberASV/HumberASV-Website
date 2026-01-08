// src/pages/Forces.tsx
import { Box, Container, Typography, useTheme, alpha } from "@mui/material";
import IsometricFloatingForces from "../components/layout/vehicle/floating_forces_compass";

const Forces = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: "background.default" }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              mb: 2,
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, #00435c 0%, #006687 100%)"
                  : "linear-gradient(135deg, #a3e7ff 0%, #80d4ff 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            3D Force Visualization
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              mb: 3,
              fontStyle: "italic",
            }}
          >
            Isometric Hydrodynamic Force Analysis
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 800,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: "1.1rem", md: "1.2rem" },
            }}
          >
            Interactive visualization of forces acting on the SeaForge ASV in 3D
            space. Understand buoyancy, current forces, drag, and their
            interactions in real-time.
          </Typography>
        </Box>

        {/* Main Visualization Component */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <IsometricFloatingForces />
        </Box>

        {/* Explanation Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textAlign: "center",
              mb: 4,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Force Dynamics Explained
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {/* Force Cards - Using Box instead of Grid to avoid the Grid item error */}
            {[
              {
                title: "Buoyancy Force",
                color: "#22c55e",
                description:
                  "The upward force exerted by water on the vessel, equal to the weight of water displaced. This keeps the ASV floating at its waterline.",
                equation: "F_b = ρ * V * g",
              },
              {
                title: "Weight Force",
                color: "#ef4444",
                description:
                  "The downward gravitational force acting on the ASV's mass. This determines the vessel's displacement and draft.",
                equation: "F_g = m * g",
              },
              {
                title: "Current Force",
                color: "#3b82f6",
                description:
                  "Hydrodynamic force from water current flow. Affects the ASV's drift and requires counter-action by thrusters.",
                equation: "F_c = 0.5 * ρ * v² * A * C_d",
              },
              {
                title: "Drag Force",
                color: "#a855f7",
                description:
                  "Resistance force opposing motion through water. Increases with speed and affects power requirements.",
                equation: "F_d = 0.5 * ρ * v² * A * C_d",
              },
            ].map((force, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 100%", md: "1 1 calc(50% - 16px)" },
                  minWidth: { xs: "100%", md: "300px" },
                  p: 3,
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                  boxShadow: `0 4px 20px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderLeft: `4px solid ${force.color}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: force.color, fontWeight: 600, mb: 2 }}
                >
                  {force.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  {force.description}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    fontFamily: "monospace",
                    color: "primary.main",
                    fontSize: "0.9rem",
                  }}
                >
                  {force.equation}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Technical Details */}
        <Box
          sx={{
            mt: 8,
            p: { xs: 3, md: 4 },
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 3,
              textAlign: "center",
            }}
          >
            ASV Force Analysis for RoboBoat Competition
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
                Competition Relevance
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                Understanding hydrodynamic forces is critical for RoboBoat
                competition success:
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: "text.secondary" }}>
                <li>
                  <Typography variant="body2">
                    Optimize hull design for reduced drag
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Calculate thrust requirements for station-keeping
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Predict drift in current for navigation
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Balance buoyancy for sensor positioning
                  </Typography>
                </li>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
                SeaForge Specifications
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                {[
                  { label: "Displacement", value: "25 kg" },
                  { label: "Waterline Length", value: "1.8 m" },
                  { label: "Beam", value: "1.2 m" },
                  { label: "Draft", value: "0.3 m" },
                  { label: "Max Current Speed", value: "2.5 m/s" },
                  { label: "Thrust per Motor", value: "150 N" },
                ].map((spec, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "primary.main", fontWeight: 600 }}
                    >
                      {spec.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {spec.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Interactive Note */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: alpha("#3b82f6", 0.1),
            borderRadius: 3,
            border: `1px solid ${alpha("#3b82f6", 0.2)}`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "primary.main", fontWeight: 600, mb: 1 }}
          >
            💡 Interactive Visualization Tip
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Adjust the current speed and direction sliders to see how different
            water conditions affect the force vectors acting on the ASV. Observe
            how drag increases with current speed and how the vessel responds to
            different flow directions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Forces;
