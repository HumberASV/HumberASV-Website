import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  alpha,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
} from "@mui/material";
import {
  Download,
  Description,
  Engineering,
  GitHub,
} from "@mui/icons-material";

import documentationBanner from "../assets/Website Renders.15.jpg";
import technicalReport from "../assets/Humber ASV - Technical Design Report RB2026-1.pdf";

type ActiveTab = "technical" | "drawings";
type LayoutMode = "table" | "cards";

interface TechnicalComponent {
  subsystem: string;
  component: string;
  vendor: string;
  characteristics: string;
  qty: number;
}

const technicalComponents: TechnicalComponent[] = [
  {
    subsystem: "Hull",
    component: "Custom Hull",
    vendor: "3D Printed",
    characteristics: "ABS",
    qty: 1,
  },
  {
    subsystem: "Navigation",
    component: "Jetson Orin Nano",
    vendor: "Nvidia",
    characteristics: "8GB",
    qty: 1,
  },
  {
    subsystem: "Electrical",
    component: "20V Lithium Ion Battery",
    vendor: "DeWalt",
    characteristics: "20V 3.1A 20Ah",
    qty: 2,
  },
  {
    subsystem: "Electrical",
    component: "HE FS-i6X Controller",
    vendor: "FlySky",
    characteristics: "10 Pin",
    qty: 1,
  },
  {
    subsystem: "Electrical",
    component: "HE Waterproof connectors",
    vendor: "HangTon",
    characteristics: "3,4,12 Pin",
    qty: 6,
  },
  {
    subsystem: "Propulsion",
    component: "Servo Motor",
    vendor: "Miuzei",
    characteristics: "5V 20kg",
    qty: 2,
  },
  {
    subsystem: "Navigation",
    component: "ZED Stereo Camera",
    vendor: "ZED Robotics",
    characteristics: "Polarizer 4mm",
    qty: 1,
  },
];

const Documentation = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>("technical");
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const layoutMode: LayoutMode = isSmall ? "cards" : "table";

  const reportHighlights = [
    {
      title: "System Architecture",
      description:
        "Detailed breakdown of our autonomous navigation system including sensor integration and control algorithms.",
    },
    {
      title: "Performance Metrics",
      description:
        "Comprehensive data on speed, stability, and efficiency tests conducted in real-world conditions.",
    },
    {
      title: "Innovation Highlights",
      description:
        "Showcasing our novel approaches to obstacle detection and path planning algorithms.",
    },
    {
      title: "Technical Specifications",
      description:
        "Complete list of components used in the Loon-E autonomous surface vehicle.",
    },
  ];

  const handleDownloadReport = () => {
    const link = document.createElement("a");
    link.href = technicalReport;
    link.download = "Humber-ASV-Technical-Design-Report-RB2026.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Hero Banner Section */}
      <Box
        sx={{
          width: "100%",
          position: "relative",
          mb: { xs: 4, md: 6 },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={documentationBanner}
          alt="Documentation Banner"
          sx={{
            width: "100%",
            height: { xs: "60vh", sm: "70vh", md: "80vh" },
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />

        {/* Text Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 20, md: 40 },
            left: { xs: 20, md: 40 },
            right: { xs: 20, md: "auto" },
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            maxWidth: { xs: "100%", md: "600px" },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              mb: 2,
              lineHeight: 1.1,
            }}
          >
            Documentation
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
              opacity: 0.95,
              lineHeight: 1.4,
            }}
          >
            Dive deeper into our technical report and learn how the Loon-E
            showcases the best of Humber Polytechnic&apos;s engineering team
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
        {/* Download Button Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: { xs: 8, md: 10 },
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Download />}
            onClick={handleDownloadReport}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              py: { xs: 1.5, sm: 2 },
              px: { xs: 4, sm: 6 },
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "translateY(-2px)",
                boxShadow: `0 12px 40px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
              },
              transition: "all 0.3s ease",
            }}
          >
            Download Full Report
          </Button>
        </Box>

        {/* Report Highlights Section */}
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
            Report Highlights
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
            {reportHighlights.map((highlight, index) => (
              <Card
                key={index}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    md: "1 1 calc(50% - 32px)",
                    lg: "1 1 calc(25% - 32px)",
                  },
                  minWidth: { xs: "100%", sm: "300px" },
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    boxShadow: `0 16px 48px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                }}
              >
                <CardContent sx={{ p: 3, height: "100%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 2,
                      fontSize: "1.2rem",
                    }}
                  >
                    {highlight.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {highlight.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Technical Specifications Section */}
        {activeTab === "technical" && (
          <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "primary.main",
                mb: 1,
                fontSize: { xs: "1.6rem", md: "2rem" },
              }}
            >
              Technical Specifications
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: 600,
              }}
            >
              Key components powering the Loon-E autonomous surface vehicle
            </Typography>

            {/* Desktop / Tablet: Table layout */}
            {layoutMode === "table" && (
              <TableContainer
                component={Paper}
                elevation={4}
                sx={{
                  borderRadius: 3,
                  overflowX: "auto",
                  boxShadow: `0 12px 40px ${alpha(
                    theme.palette.primary.main,
                    0.08
                  )}`,
                }}
              >
                <Table
                  size="medium"
                  sx={{
                    minWidth: 700,
                    "& th": {
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    },
                    "& td, & th": {
                      borderColor: alpha(theme.palette.divider, 0.5),
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Subsystem</TableCell>
                      <TableCell>Component</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Characteristics</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {technicalComponents.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": {
                            bgcolor: alpha(theme.palette.primary.main, 0.015),
                          },
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                          },
                          transition: "background-color 0.18s ease",
                        }}
                      >
                        <TableCell
                          sx={{ fontWeight: row.subsystem ? 700 : 400 }}
                        >
                          {row.subsystem}
                        </TableCell>
                        <TableCell>{row.component}</TableCell>
                        <TableCell>{row.vendor}</TableCell>
                        <TableCell>{row.characteristics}</TableCell>
                        <TableCell align="right">{row.qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Mobile: Card layout */}
            {layoutMode === "cards" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {technicalComponents.map((row, index) => (
                  <Box
                    key={index}
                    sx={{
                      borderRadius: 2.5,
                      p: 3,
                      backgroundColor: "background.paper",
                      boxShadow: `0 8px 28px ${alpha(
                        theme.palette.primary.main,
                        0.12
                      )}`,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.18
                      )}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        mb: 0.5,
                      }}
                    >
                      {row.subsystem}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 1,
                      }}
                    >
                      {row.component}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", mb: 0.25 }}
                        >
                          Vendor
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {row.vendor}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", mb: 0.25 }}
                        >
                          Quantity
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {row.qty}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ pt: 1, mt: "auto" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontStyle: "italic",
                        }}
                      >
                        {row.characteristics}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        <Divider
          sx={{ my: 6, borderColor: alpha(theme.palette.primary.main, 0.2) }}
        />

        {/* Additional Resources Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Description />}
              onClick={() => setActiveTab("technical")}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                py: { xs: 1.5, sm: 2 },
                px: { xs: 4, sm: 6 },
                width: { xs: "100%", sm: "auto" },
                minWidth: { xs: "100%", sm: "200px" },
                fontSize: { xs: "1rem", sm: "1.1rem" },
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "&:hover": {
                  backgroundColor: "primary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 40px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                },
                transition: "all 0.3s ease",
              }}
            >
              Technical Report
            </Button>

            <IconButton
              component="a"
              href="https://github.com/HumberASV"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: alpha("#333", 0.08),
                color: "#333",
                width: { xs: "56px", sm: "56px" },
                height: { xs: "56px", sm: "56px" },
                borderRadius: 2,
                border: `2px solid ${alpha("#333", 0.2)}`,
                "&:hover": {
                  backgroundColor: "#333",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha("#333", 0.3)}`,
                },
                transition: "all 0.3s ease",
              }}
            >
              <GitHub sx={{ fontSize: 28 }} />
            </IconButton>

            <Button
              variant="contained"
              size="large"
              startIcon={<Engineering />}
              onClick={() => setActiveTab("drawings")}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                py: { xs: 1.5, sm: 2 },
                px: { xs: 4, sm: 6 },
                width: { xs: "100%", sm: "auto" },
                minWidth: { xs: "100%", sm: "200px" },
                fontSize: { xs: "1rem", sm: "1.1rem" },
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "&:hover": {
                  backgroundColor: "primary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 40px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                },
                transition: "all 0.3s ease",
              }}
            >
              Technical Drawings
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Documentation;
