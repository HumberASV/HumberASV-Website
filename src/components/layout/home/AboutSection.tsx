import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  alpha,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Engineering,
  Code,
  Settings,
  Group,
  Speed,
  Visibility,
} from "@mui/icons-material";

const AboutSection = () => {
  const theme = useTheme();

  const expertiseItems = [
    {
      icon: <Engineering sx={{ fontSize: 40 }} />,
      title: "Mechanical Engineering",
      description: "Precision hull design and propulsion systems",
    },
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: "Software Development",
      description: "Advanced autonomy and navigation algorithms",
    },
    {
      icon: <Settings sx={{ fontSize: 40 }} />,
      title: "Electrical Systems",
      description: "Robust power management and sensor integration",
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />,
      title: "Project Management",
      description: "Coordinated team execution and timeline management",
    },
  ];

  // YouTube video ID extracted from the URL
  const youtubeVideoId = "Ocej88hrU2k";

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        backgroundColor: "background.default",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(to right, transparent, ${alpha(
            theme.palette.primary.main,
            0.3
          )}, transparent)`,
        },
      }}
    >
      <Container>
        <Grid container spacing={8} alignItems="center">
          {/* First grid item */}
          <div className="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6">
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h2"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                  mb: 3,
                  background:
                    theme.palette.mode === "light"
                      ? "linear-gradient(135deg, #00435c 0%, #006687 100%)"
                      : "linear-gradient(135deg, #a3e7ff 0%, #80d4ff 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Navigating the Future of Maritime Autonomy
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: "text.secondary",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                }}
              >
                The Humber Roboboat Team represents the cutting edge of
                autonomous surface vehicle technology, combining innovation with
                practical engineering excellence.
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.8,
                    color: "text.primary",
                  }}
                >
                  We are a multidisciplinary team of engineering and technology
                  students dedicated to designing and building competitive
                  autonomous surface vehicles (ASVs). Our team brings together
                  expertise across mechanical engineering, electrical systems,
                  software development, and project management to create
                  innovative solutions for modern maritime challenges.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.8,
                    color: "text.primary",
                  }}
                >
                  This year, we're pioneering advancements in vehicle autonomy,
                  enhancing navigation algorithms, and implementing
                  state-of-the-art computer vision systems for superior object
                  detection and avoidance capabilities.
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Speed sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant="body2" fontWeight={600}>
                    +40% Efficiency
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Visibility sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant="body2" fontWeight={600}>
                    Advanced Vision AI
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                component={RouterLink}
                to="/vehicle"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  background:
                    theme.palette.mode === "light"
                      ? "linear-gradient(135deg, #00435c 0%, #006687 100%)"
                      : "linear-gradient(135deg, #a3e7ff 0%, #80d4ff 100%)",
                  boxShadow: `0 4px 20px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 25px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Explore Our Vessel
              </Button>
            </Box>
          </div>

          {/* Second grid item */}
          <div className="MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6">
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {/* YouTube Video Section */}
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: `0 20px 40px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                  mb: 4,
                  backgroundColor: "#000",
                }}
              >
                {/* Responsive YouTube Embed */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 0,
                    paddingBottom: "56.25%", // 16:9 aspect ratio
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
                    title="Humber ASV Introduction Video - RoboBoat 2026"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      pointerEvents: "auto", // Ensure clicks work
                    }}
                  />
                </Box>

                {/* Video Title Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `linear-gradient(to top, ${alpha(
                      "#000",
                      0.7
                    )} 0%, transparent 100%)`,
                    color: "white",
                    p: 3,
                    zIndex: 2,
                    pointerEvents: "none", // Don't block clicks on video
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    ASV In Action
                  </Typography>
                  <Typography variant="body2">
                    Watch our autonomous surface vehicle during testing
                  </Typography>
                </Box>
              </Box>

              {/* Expertise Cards - Horizontal layout for desktop */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  overflowX: { md: "auto" },
                  pb: { md: 2 },
                  "&::-webkit-scrollbar": {
                    height: 6,
                  },
                  "&::-webkit-scrollbar-track": {
                    background: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 3,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: alpha(theme.palette.primary.main, 0.3),
                    borderRadius: 3,
                  },
                }}
              >
                {expertiseItems.map((item, index) => (
                  <Card
                    key={index}
                    sx={{
                      minWidth: { md: 200 },
                      textAlign: "center",
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                      boxShadow: `0 4px 16px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 8px 24px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: "0 !important" }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                          width: 50,
                          height: 50,
                          mx: "auto",
                          mb: 1,
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </div>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
