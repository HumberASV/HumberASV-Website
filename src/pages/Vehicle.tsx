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
} from "@mui/material";
import { Download, Engineering, PlayArrow } from "@mui/icons-material";

// Import images
import vehicleBanner from "../assets/LoonE_Web_3_Hero.webp";
import electricalHighlightImage from "../assets/Electrical System_CAD.png";

// Import modal
import HighlightModal from "../components/layout/vehicle/HighlightModal";

const Vehicle = () => {
  const theme = useTheme();
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const highlights = [
    {
      id: 1,
      title: "Electrical Systems",
      description:
        "Our proprietary navigation system combines sensor fusion and machine learning algorithms to enable precise autonomous control in dynamic marine environments.",
      image: electricalHighlightImage,
      modalContent:
        "Electrical:\n\nThe boat features two 20v drill batteries used to power propulsion and one 14.8V Lithium-ion battery which will be used to power the rest of the electronics.\n\nA feature that we are excited to have on our boat is the capability of switching to the secondary battery and use it to power the thrusters. This will allow us to maximize test time and retrieve the boat in case the primary batteries ever run out. We achieved this through the use of four high current relays a remote relay switch that can be triggered by the operator. The relay chooses which battery will be powering the propellers. It was important retain the capability to disconnect the power from the propulsion regardless of the power supply, therefore the propellers connect to the Normally Open pole.\n\nTo ensure a safe discharge of the batteries, the system includes Battery Management Systems (BMS) as well as voltage sensors bound to our FlySky remote to notify the user of the status.\n\nAs a team we prioritized the creation of CAD for all systems which allow us to plan and arranged components around the boat before we ever physically built them, ensuring proper fit and easier cable management.\n\nThe team designed and manufactured custom PCBs that tackled important challenges in our boat, giving the team the opportunity to acquire and develop important skills. The PCBs address the switching between the RC and autonomous commands, as well as a light indicator that is mounted on the exterior of the boat. This circuits were simulated in software, prototyped in breadboards and finally manufactured and assembled by our team.",
    },
    {
      id: 2,
      title: "Mechanical Engineering",
      description:
        "Quick-swap components and accessible internal layout allow for rapid maintenance and configuration changes between missions.",
      reverse: true,
      image: vehicleBanner,
      modalContent:
        "Mechanical Engineering:\n\nOur mechanical design prioritizes modularity with quick-release mechanisms and standardized mounting rails. All major components can be field-replaced in under 5 minutes. Waterproof compartments separate electronics from propulsion with dedicated drainage channels and vibration isolation.",
    },
    {
      id: 3,
      title: "Software Development",
      description:
        "High-bandwidth telemetry streams sensor data and video feeds in real-time to shore stations for remote monitoring.",
      image: vehicleBanner,
      modalContent:
        "Software Development:\n\nROS2 architecture with nodes for perception, planning, and control. Computer vision processes 30fps stereoscopic feeds with obstacle detection. Real-time telemetry over 5GHz WiFi with 50ms latency and triple-redundancy safety systems.",
    },
  ];

  const vehicleVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  const handleVideoPlay = () => {
    setVideoPlaying(true);
  };

  const handleLearnMore = (title: string, content: string) => {
    setSelectedHighlight({ title, content });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHighlight(null);
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
                variant="h1"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                  fontSize: {
                    sm: "2.5rem",
                    md: "3.5rem",
                    lg: "4rem",
                  },
                  wordWrap: "break-word",
                  lineHeight: 1.1,
                  letterSpacing: { sm: "-0.5px", md: "-1px" },
                  color: "white",
                }}
              >
                HumberASV
              </Typography>
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
              Streamlined performance, designed to win.
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
              The HumberASV represents our commitment to excellence in
              autonomous maritime technology. Engineered with precision and
              built for competition, our vehicle combines cutting-edge
              navigation systems with robust mechanical design to excel in
              demanding aquatic environments.
            </Typography>
          </Box>

          {/* Video Section */}
          <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "300px", sm: "400px", md: "500px" },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: `0 16px 48px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                backgroundColor: "#000",
              }}
            >
              {!videoPlaying && (
                <>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `linear-gradient(45deg, ${alpha(
                        theme.palette.primary.main,
                        0.4
                      )} 0%, ${alpha(theme.palette.primary.dark, 0.4)} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "opacity 0.3s ease",
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                    onClick={handleVideoPlay}
                  >
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      sx={{
                        backgroundColor: "white",
                        color: "primary.main",
                        py: 1.5,
                        px: 4,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        borderRadius: 50,
                        boxShadow: `0 8px 32px ${alpha("#000", 0.3)}`,
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Watch Demo Video
                    </Button>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "white",
                      opacity: 0.8,
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    Click to play video demonstration
                  </Typography>
                </>
              )}

              {videoPlaying && (
                <Box
                  component="iframe"
                  src={`${vehicleVideoUrl}?autoplay=1&rel=0`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{
                    border: "none",
                  }}
                />
              )}
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

          {/* Highlights Section */}
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
              Key Highlights
            </Typography>

            <Stack spacing={8}>
              {highlights.map((highlight) => (
                <Box
                  key={highlight.id}
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
                  {/* Image */}
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
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        backgroundColor: theme.palette.accent.main,
                        color: theme.palette.primary.main,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "1.2rem",
                        boxShadow: `0 4px 12px ${alpha("#000", 0.3)}`,
                      }}
                    >
                      {highlight.id}
                    </Box>
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
                      Learn More
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
                Access detailed technical specifications, CAD files, schematics,
                and comprehensive documentation for the HumberASV platform.
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

      {/* MODAL - renders on top of everything */}
      {selectedHighlight && (
        <HighlightModal
          open={modalOpen}
          title={selectedHighlight.title}
          content={selectedHighlight.content}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Vehicle;
