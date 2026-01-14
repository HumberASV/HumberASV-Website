// src/pages/Vehicle.tsx
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  useTheme,
  alpha,
  Stack,
  Divider,
  useMediaQuery,
  IconButton,
  Modal,
} from "@mui/material";
import { Download, Engineering, Close, ZoomIn } from "@mui/icons-material";
import technicalReport from "../assets/Humber ASV - Technical Design Report RB2026-1.pdf";

// Import images
import vehicleBanner from "../assets/LoonE_Web_3_Hero.webp";
import electricalHighlightImage from "../assets/Electrical System_CAD.png";
import isaacSimHighlightImage from "../assets/Isaac Sim 1.png";
import softwareHighlightImage from "../assets/Rudder 35 Degrees.png";
import featuredMediaImage from "../assets/Web Renders - Green.16.png";

// Import modal
import HighlightModal from "../components/layout/vehicle/HighlightModal";

const Vehicle = () => {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const specifications = [
    { label: "Dimensions", value: "1.8m × 1.2m × 0.8m", icon: "📏" },
    { label: "Weight", value: "25kg", icon: "⚖️" },
    { label: "Cruising Speed", value: "1 m/s", icon: "🚀" },
    { label: "Battery Life", value: "4 hours", icon: "🔋" },
    { label: "Towing Capacity", value: "+2.5kg", icon: "📦" },
    { label: "Propulsion", value: "2× T200 Thrusters", icon: "⚙️" },
    { label: "Communication", value: "2.4Ghz/5Ghz WiFi", icon: "📡" },
    { label: "Sensors", value: "Stereoscopic Cameras, IMU", icon: "📷" },
  ];

  const highlights = [
    {
      title: "Electrical Systems",
      description:
        "Advanced power management with dual-battery redundancy and custom PCB design for reliable autonomous operations in marine environments.",
      image: electricalHighlightImage,
      modalContent: `Electrical:\n
The boat features two 20v drill batteries used to power propulsion and one 14.8V Lithium-ion battery which will be used to power the rest of the electronics.\n
A feature that we are excited to have on our boat is the capability of switching to the secondary battery and use it to power the thrusters. This will allow us to maximize test time and retrieve the boat in case the primary batteries ever run out. We achieved this through the use of four high current relays a remote relay switch that can be triggered by the operator. The relay chooses which battery will be powering the propellers. It was important retain the capability to disconnect the power from the propulsion regardless of the power supply, therefore the propellers connect to the Normally Open pole.\n
To ensure a safe discharge of the batteries, the system includes Battery Management Systems (BMS) as well as voltage sensors bound to our FlySky remote to notify the user of the status.\n
As a team we prioritized the creation of CAD for all systems which allow us to plan and arranged components around the boat before we ever physically built them, ensuring proper fit and easier cable management.\n
The team designed and manufactured custom PCBs that tackled important challenges in our boat, giving the team the opportunity to acquire and develop important skills. The PCBs address the switching between the RC and autonomous commands, as well as a light indicator that is mounted on the exterior of the boat. This circuits were simulated in software, prototyped in breadboards and finally manufactured and assembled by our team.`,
    },
    {
      title: "Mechanical Engineering",
      description:
        "Modular design with rapid component interchangeability and optimized hydrodynamic performance for competition-grade reliability.",
      reverse: true,
      image: softwareHighlightImage,
      modalContent: `Design Philosophy:\n
Our mechanical architecture prioritizes modularity, serviceability, and hydrodynamic efficiency. Every component integrates within a standardized mounting framework allowing rapid field maintenance and configuration changes.\n
Modular Component System:\n
Quick-release mechanisms enable complete subsystem replacement in under five minutes. This design philosophy ensures minimal downtime during competition events and facilitates rapid prototyping iterations.\n
Compartmentalized Architecture:\n
• Waterproof isolation separates sensitive electronics from propulsion systems\n• Dedicated drainage channels protect critical components from marine environmental challenges\n• Vibration-dampening mounts ensure system reliability\n
Hydrodynamic Optimization:\n
Computational fluid dynamics informed our hull design, balancing stability with hydrodynamic efficiency for optimal performance across varying sea states.\n
Material Selection:\n
Aerospace-grade aluminum alloys and marine-grade composites provide the ideal balance of strength, weight, and corrosion resistance for sustained marine operations.`,
    },
    {
      title: "Software Development",
      description:
        "ROS2-based architecture with real-time telemetry and advanced computer vision for autonomous navigation and obstacle avoidance.",
      image: isaacSimHighlightImage,
      modalContent: `System Architecture:\n
Our vessel operates on a sophisticated ROS2 (Robot Operating System 2) framework, implementing a distributed node architecture for perception, planning, and control subsystems.\n
Autonomous Navigation:\n
Advanced path planning algorithms process real-time sensor data to execute complex mission profiles with centimeter-level precision. Adaptive control systems compensate for environmental variables including currents, winds, and wave patterns.\n
Computer Vision Pipeline:\n
• Stereoscopic camera systems capture 30 frames per second of environmental data\n• Custom algorithms perform real-time obstacle detection, classification, and avoidance maneuvers\n• Sub-second latency ensures responsive navigation\n
Telemetry & Communications:\n
High-bandwidth 5GHz WiFi provides real-time data streaming with <50ms latency. Triple-redundancy systems ensure uninterrupted communication during critical mission phases.\n
Mission Control Interface:\n
A custom ground station provides operators with comprehensive situational awareness, including real-time sensor data visualization, mission planning and editing capabilities, system health monitoring and diagnostics, and autonomous/manual mode transition controls.\n
Safety Systems:\n
Multi-layer fail-safe protocols include geofencing, automated recovery maneuvers, and emergency stop functionality accessible from both autonomous systems and manual override controls.`,
    },
  ];

  const handleImageOpen = () => {
    setImageModalOpen(true);
  };

  const handleImageClose = () => {
    setImageModalOpen(false);
  };

  const handleLearnMore = (title: string, content: string) => {
    setSelectedHighlight({ title, content });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHighlight(null);
  };

  const handleDownloadTechnicalPackage = () => {
    const link = document.createElement("a");
    link.href = technicalReport;
    link.download = "HumberASV-Technical-Design-Report-RB2026-1.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
          overflowX: "hidden",
        }}
      >
        {/* HERO SECTION - SIMPLE RESPONSIVE BANNER */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#000",
            position: "relative",
            mb: { xs: 4, md: 6 },
          }}
        >
          {/* Image - responsive, no fixed height */}
          <Box
            component="img"
            src={vehicleBanner}
            alt="Humber ASV Vehicle"
            loading="eager"
            decoding="async"
            sx={{
              display: "block",
              width: "100%",
              height: "auto",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />

          {/* Text Overlay - HIDDEN ON MOBILE */}
          {!isMobile && (
            <Box
              sx={{
                position: "absolute",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                color: "white",
                background: alpha("#000", 0.8),
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                py: 2,
                px: 4,
                width: "auto",
                maxWidth: "800px",
                boxSizing: "border-box",
                zIndex: 10,
                border: `1px solid ${alpha("#fff", 0.2)}`,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  opacity: 0.95,
                  textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  fontSize: {
                    sm: "1.1rem",
                    md: "1.4rem",
                  },
                  maxWidth: "600px",
                  mx: "auto",
                  wordWrap: "break-word",
                  lineHeight: 1.3,
                  color: "white",
                  fontWeight: 500,
                }}
              >
                Autonomous Surface Vehicle
              </Typography>
            </Box>
          )}

          {/* MOBILE-ONLY: Simple text */}
          {isMobile && (
            <Box
              sx={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                color: "white",
                zIndex: 10,
                width: "90%",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                  fontSize: "1.5rem",
                  color: "white",
                }}
              >
                HumberASV
              </Typography>
            </Box>
          )}
        </Box>

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Mission Statement Section */}
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
              purpose-built for the demanding requirements of international
              autonomous maritime competitions. Our systems approach ensures
              reliability, performance, and innovation at every subsystem level.
            </Typography>
          </Box>

          {/* IMAGE SECTION - LARGER IMAGE */}
          <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "350px", sm: "500px", md: "600px" },
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  "& .zoom-button": {
                    opacity: 1,
                    transform: "scale(1.1)",
                  },
                  "& .featured-image": {
                    transform: "scale(1.02)",
                  },
                },
              }}
              onClick={handleImageOpen}
            >
              {/* Background container for the image */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  src={featuredMediaImage}
                  alt="Autonomous Surface Vehicle - High Resolution Render"
                  className="featured-image"
                  sx={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "95%",
                    maxHeight: "95%",
                    objectFit: "contain",
                    transition: "transform 0.5s ease",
                  }}
                />
              </Box>

              {/* Zoom Button Overlay */}
              <IconButton
                className="zoom-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageOpen();
                }}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  opacity: 0.9,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.getContrastText(
                      theme.palette.primary.main
                    ),
                  },
                  width: 64,
                  height: 64,
                }}
              >
                <ZoomIn sx={{ fontSize: 32 }} />
              </IconButton>

              <Typography
                variant="body2"
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#666666",
                  opacity: 0.8,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                Click to view high-resolution render
              </Typography>
            </Box>
          </Box>

          {/* Technical Specifications Section */}
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
                    boxShadow: `0 8px 32px ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    border: `2px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
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

          {/* Highlights Section - Removed Numbers */}
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
              Integrated Engineering Systems
            </Typography>

            <Stack spacing={8}>
              {highlights.map((highlight) => (
                <Box
                  key={highlight.title}
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      md: highlight.reverse ? "row-reverse" : "row",
                    },
                    alignItems: "center",
                    gap: { xs: 4, md: 6 },
                    width: "100%",
                  }}
                >
                  {/* Image - Removed Number Indicator */}
                  <Box
                    sx={{
                      flex: { md: "0 0 50%" },
                      width: "100%",
                      height: { xs: "300px", md: "400px" },
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: `0 16px 48px ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,
                      border: `2px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      position: "relative",
                    }}
                  >
                    <Box
                      component="img"
                      src={highlight.image}
                      alt={highlight.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{
                      flex: { md: "0 0 50%" },
                      textAlign: { xs: "center", md: "left" },
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "primary.main",
                        mb: 3,
                        fontSize: { xs: "1.8rem", md: "2.2rem" },
                        lineHeight: 1.2,
                      }}
                    >
                      {highlight.title}
                    </Typography>
                    <Divider
                      sx={{
                        mb: 3,
                        width: { xs: "100px", md: "120px" },
                        height: "4px",
                        backgroundColor: theme.palette.accent.main,
                        mx: { xs: "auto", md: "0" },
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                        lineHeight: 1.7,
                        mb: 3,
                      }}
                    >
                      {highlight.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        handleLearnMore(highlight.title, highlight.modalContent)
                      }
                      sx={{
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        borderWidth: "2px",
                        "&:hover": {
                          borderWidth: "2px",
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                        },
                      }}
                    >
                      Technical Details
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Documentation Download CTA */}
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
            {/* Background pattern */}
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
                Access detailed technical specifications, CAD models,
                schematics, wiring diagrams, and comprehensive system
                documentation for the HumberASV platform.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Download />}
                onClick={handleDownloadTechnicalPackage}
                sx={{
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: `0 8px 32px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
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
        </Container>
      </Box>

      {/* MODAL */}
      {selectedHighlight && (
        <HighlightModal
          open={modalOpen}
          title={selectedHighlight.title}
          content={selectedHighlight.content}
          onClose={handleCloseModal}
        />
      )}

      {/* IMAGE MODAL */}
      <Modal
        open={imageModalOpen}
        onClose={handleImageClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "95%", sm: "90%", md: "85%", lg: "80%" },
            maxWidth: "1200px",
            height: { xs: "auto", sm: "auto", md: "90vh" },
            maxHeight: "90vh",
            bgcolor: "#ffffff",
            boxShadow: 24,
            borderRadius: 1,
            overflow: "hidden",
            outline: "none",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <IconButton
            onClick={handleImageClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
              },
            }}
            size={isMobile ? "medium" : "large"}
          >
            <Close fontSize={isMobile ? "medium" : "large"} />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: { xs: 2, sm: 3 },
              backgroundColor: "#ffffff",
            }}
          >
            <Box
              component="img"
              src={featuredMediaImage}
              alt="Autonomous Surface Vehicle - High Resolution Render"
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "white",
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              High-resolution render of Autonomous Surface Vehicle
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Vehicle;
