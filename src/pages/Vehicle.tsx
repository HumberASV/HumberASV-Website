// src\pages\Vehicle.tsx
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Chip,
  Divider,
  IconButton,
  Modal,
} from "@mui/material";
import {
  PlayArrow,
  ZoomIn,
  Engineering,
  DesignServices,
  Timeline,
  Science,
} from "@mui/icons-material";

// Define types for our data
interface MediaItem {
  type: string;
  src: string;
  title: string;
  description: string;
}

interface DiagramItem {
  src: string;
  title: string;
  description: string;
}

const Vehicle = () => {
  const theme = useTheme();
  const [activeTab] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramItem | null>(
    null
  );

  // Vehicle specifications
  const specifications = [
    { label: "Length", value: "1.8m", icon: "📏" },
    { label: "Width", value: "1.2m", icon: "📐" },
    { label: "Weight", value: "25kg", icon: "⚖️" },
    { label: "Max Speed", value: "4 m/s", icon: "🚀" },
    { label: "Battery Life", value: "4 hours", icon: "🔋" },
    { label: "Payload Capacity", value: "10kg", icon: "📦" },
    { label: "Communication", value: "WiFi/4G", icon: "📡" },
    { label: "Sensors", value: "LiDAR, Camera, IMU", icon: "📷" },
  ];

  // Design features
  const features = [
    {
      title: "Modular Hull Design",
      description:
        "Interchangeable components for different mission requirements",
      icon: "🔧",
    },
    {
      title: "Advanced Propulsion",
      description:
        "Dual thrusters with independent control for precise maneuvering",
      icon: "⚙️",
    },
    {
      title: "Solar Integration",
      description: "Supplementary solar panels for extended mission duration",
      icon: "☀️",
    },
    {
      title: "Waterproof Electronics",
      description: "IP67 rated enclosures for all critical components",
      icon: "💧",
    },
  ];

  // Media gallery
  const mediaGallery: MediaItem[] = [
    {
      type: "image",
      src: "https://placehold.co/600x400/00435c/white/png?text=SeaForge+Prototype",
      title: "SeaForge Prototype V2",
      description: "Current generation prototype during lake testing",
    },
    {
      type: "image",
      src: "https://placehold.co/600x400/00435c/white/png?text=Hull+Design",
      title: "Carbon Fiber Hull",
      description: "Lightweight yet durable carbon fiber construction",
    },
    {
      type: "image",
      src: "https://placehold.co/600x400/00435c/white/png?text=Electronics",
      title: "Electronics Bay",
      description: "Waterproof compartment with control systems",
    },
    {
      type: "video",
      src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "Testing Session",
      description: "SeaForge during autonomous navigation tests",
    },
  ];

  // Technical diagrams
  const technicalDiagrams: DiagramItem[] = [
    {
      src: "https://placehold.co/600x400/00435c/white/png?text=System+Architecture",
      title: "System Architecture",
      description: "Complete electrical and software architecture diagram",
    },
    {
      src: "https://placehold.co/600x400/00435c/white/png?text=Control+Flow",
      title: "Control Flow",
      description: "Autonomous decision-making process flow",
    },
    {
      src: "https://placehold.co/600x400/00435c/white/png?text=Mechanical+Design",
      title: "Mechanical Design",
      description: "CAD drawings and mechanical specifications",
    },
  ];

  // Development timeline
  const developmentTimeline = [
    {
      phase: "Concept Design",
      date: "Jan 2023",
      description: "Initial concept development and requirements gathering",
      milestones: [
        "Market Research",
        "Concept Sketches",
        "Requirements Analysis",
      ],
    },
    {
      phase: "Prototyping",
      date: "Mar 2023",
      description: "First physical prototype construction and testing",
      milestones: ["3D Printing", "Component Selection", "Initial Water Tests"],
    },
    {
      phase: "Electronics Integration",
      date: "Jun 2023",
      description:
        "Integration of sensors, controllers, and communication systems",
      milestones: ["PCB Design", "Sensor Calibration", "Waterproofing"],
    },
    {
      phase: "Software Development",
      date: "Sep 2023",
      description: "Autonomy algorithms and control software implementation",
      milestones: [
        "Navigation Algorithms",
        "Computer Vision",
        "User Interface",
      ],
    },
    {
      phase: "Testing & Validation",
      date: "Dec 2023",
      description: "Rigorous testing and performance validation",
      milestones: ["Lake Trials", "Performance Metrics", "Optimization"],
    },
  ];

  // Testing procedures
  const testingProcedures = [
    {
      title: "Water Integrity Testing",
      steps: [
        "Seal all electronic compartments",
        "Submerge to 1m depth for 30 minutes",
        "Inspect for moisture ingress",
        "Document results and make improvements",
      ],
    },
    {
      title: "Navigation Accuracy",
      steps: [
        "Set predefined course waypoints",
        "Execute autonomous navigation",
        "Measure deviation from course",
        "Adjust control parameters",
      ],
    },
    {
      title: "Obstacle Avoidance",
      steps: [
        "Place obstacles in test area",
        "Execute avoidance algorithms",
        "Record success rate and response time",
        "Refine detection algorithms",
      ],
    },
  ];

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
            SeaForge ASV
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
            Humber College's Autonomous Surface Vehicle
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
            Advanced autonomous maritime platform designed for research,
            competition, and real-world applications in marine technology and
            environmental monitoring.
          </Typography>
        </Box>

        {/* Specifications Grid */}
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
            Technical Specifications
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(4, 1fr)",
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
                  boxShadow: `0 4px 20px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {spec.icon}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "primary.main", fontWeight: 600, mb: 1 }}
                >
                  {spec.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {spec.label}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Features Section */}
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
            Design Features
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 3,
                  p: 3,
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                  boxShadow: `0 4px 20px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="h3">{feature.icon}</Typography>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 600, mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Tabs for different documentation sections */}
        <Box sx={{ width: "100%", mb: { xs: 6, md: 8 } }}>
          <Tabs
            value={activeTab}
            centered
            sx={{
              mb: 4,
              "& .MuiTab-root": {
                fontSize: "1.1rem",
                fontWeight: 600,
              },
            }}
          >
            <Tab icon={<DesignServices />} label="Design Documentation" />
            <Tab icon={<Timeline />} label="Development Timeline" />
            <Tab icon={<Science />} label="Testing Procedures" />
            <Tab icon={<Engineering />} label="Technical Diagrams" />
          </Tabs>

          {/* Design Documentation Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  mb: 4,
                  textAlign: "center",
                }}
              >
                Media Gallery
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {mediaGallery.map((media, index) => (
                  <Card
                    key={index}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                    onClick={() => setSelectedMedia(media)}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 250,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {media.type === "video" ? (
                        <>
                          <PlayArrow
                            sx={{
                              fontSize: 48,
                              color: "white",
                              position: "absolute",
                            }}
                          />
                          <Box
                            component="img"
                            src="https://placehold.co/600x400/00435c/white/png?text=Video+Thumbnail"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              opacity: 0.7,
                            }}
                          />
                        </>
                      ) : (
                        <Box
                          component="img"
                          src={media.src}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Box>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {media.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {media.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Development Timeline Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  mb: 4,
                  textAlign: "center",
                }}
              >
                Development Timeline
              </Typography>
              <Box sx={{ position: "relative" }}>
                <Divider
                  sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "100%",
                    backgroundColor: "primary.main",
                    opacity: 0.3,
                  }}
                />
                {developmentTimeline.map((phase, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 4,
                      flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: index % 2 === 0 ? "right" : "left",
                        pr: index % 2 === 0 ? 2 : 0,
                        pl: index % 2 === 0 ? 0 : 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: "primary.main", fontWeight: 600 }}
                      >
                        {phase.phase}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "accent.main", mb: 1 }}
                      >
                        {phase.date}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mb: 2 }}
                      >
                        {phase.description}
                      </Typography>
                      <Box>
                        {phase.milestones.map((milestone, idx) => (
                          <Chip
                            key={idx}
                            label={milestone}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              color: "primary.main",
                              m: 0.5,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        mx: 2,
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1 }}></Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Testing Procedures Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  mb: 4,
                  textAlign: "center",
                }}
              >
                Testing Procedures & Validation
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                  },
                  gap: 4,
                }}
              >
                {testingProcedures.map((procedure, index) => (
                  <Card
                    key={index}
                    sx={{
                      p: 3,
                      backgroundColor: "background.paper",
                      borderRadius: 3,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "primary.main", fontWeight: 600, mb: 2 }}
                    >
                      {procedure.title}
                    </Typography>
                    <Box component="ol" sx={{ pl: 2 }}>
                      {procedure.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", mb: 1 }}
                          >
                            {step}
                          </Typography>
                        </li>
                      ))}
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Technical Diagrams Tab */}
          {activeTab === 3 && (
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  mb: 4,
                  textAlign: "center",
                }}
              >
                Technical Diagrams & Schematics
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {technicalDiagrams.map((diagram, index) => (
                  <Card
                    key={index}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                    onClick={() => setSelectedDiagram(diagram)}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 200,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      <Box
                        component="img"
                        src={diagram.src}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: alpha("#000", 0.5),
                          color: "white",
                          "&:hover": {
                            backgroundColor: alpha("#000", 0.7),
                          },
                        }}
                      >
                        <ZoomIn />
                      </IconButton>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {diagram.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {diagram.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Media Modal */}
        <Modal
          open={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 3,
              overflow: "hidden",
              maxWidth: 800,
              width: "100%",
            }}
          >
            {selectedMedia && (
              <>
                {selectedMedia.type === "video" ? (
                  <Box
                    component="iframe"
                    width="100%"
                    height="400"
                    src={selectedMedia.src}
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  <Box
                    component="img"
                    src={selectedMedia.src}
                    sx={{
                      width: "100%",
                      maxHeight: "80vh",
                      objectFit: "contain",
                    }}
                  />
                )}
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">{selectedMedia.title}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {selectedMedia.description}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Modal>

        {/* Diagram Modal */}
        <Modal
          open={!!selectedDiagram}
          onClose={() => setSelectedDiagram(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 3,
              overflow: "hidden",
              maxWidth: 900,
              width: "100%",
            }}
          >
            {selectedDiagram && (
              <>
                <Box
                  component="img"
                  src={selectedDiagram.src}
                  sx={{
                    width: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">{selectedDiagram.title}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {selectedDiagram.description}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Modal>

        {/* Documentation Download CTA */}
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            p: { xs: 3, md: 4 },
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Engineering sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}
          >
            Complete Technical Documentation
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            Access detailed technical specifications, CAD files, and
            comprehensive documentation
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              fontWeight: 600,
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Download Technical Package
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Vehicle;
