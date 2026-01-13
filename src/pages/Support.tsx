// src\pages\Support.tsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  Engineering,
  Science,
  LocalAtm,
  Groups,
  Handshake,
} from "@mui/icons-material";

import humberLogo from "../assets/Humber Logo.png";

const Support = () => {
  const theme = useTheme();

  // Our primary institutional sponsor
  const primarySponsor = {
    name: "Humber Polytechnic",
    description:
      "Our premier academic partner and institutional sponsor providing facilities, resources, and guidance for the RoboBoat competition.",
    // TODO: Add actual Humber logo image
    // logo: "../assets/humber-logo.png",
    role: "Institutional Sponsor",
    supportAreas: [
      "Laboratory Facilities",
      "Faculty Mentorship",
      "Technical Resources",
      "Competition Funding",
    ],
  };

  // Other key supporters (simplified from tiers)
  const keySupporters = [
    {
      name: "Humber School of Engineering",
      description: "Technical guidance and engineering support",
      icon: <Engineering />,
    },
    {
      name: "Faculty of Applied Science and Technology",
      description: "Research facilities and equipment access",
      icon: <Science />,
    },
    {
      name: "IEEE Humber Student Branch",
      description: "Student funding and logistics support",
      icon: <Groups />,
    },
  ];

  // Partnership opportunities for competition
  const partnershipOpportunities = [
    {
      title: "Technology Partners",
      description:
        "Provide specialized equipment, sensors, or software for our autonomous systems",
      icon: <Engineering sx={{ color: "primary.main" }} />,
    },
    {
      title: "Financial Sponsors",
      description:
        "Support competition registration, travel, and material costs",
      icon: <LocalAtm sx={{ color: "primary.main" }} />,
    },
    {
      title: "Industry Mentors",
      description:
        "Share expertise in marine robotics, AI, and autonomous systems",
      icon: <Handshake sx={{ color: "primary.main" }} />,
    },
  ];

  // Donor acknowledgements
  const donorAcknowledgements = [
    "Shaun Ghafari",
    "Carl Oliver",
    "Ali Taha",
    "Simon Heathcote",
    "Colin Buddin",
    "Kahled Ibrahim",
    "Bruce McKinnon",
    "Joseph Tombe",
    "Brigon Munkholm",
    "Vlad Porcila",
    "Wejing Ma",
    "Raji Subramaniam",
    "Eirc Forest",
    "Hanna O’Neil",
    "Hayden Knight",
    "Dave Campbell",
    "Jane Smith",
  ];

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: "background.default" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.2rem", md: "3.8rem" },
              mb: 2,
              color: "primary.main",
            }}
          >
            Support & Sponsorship
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              lineHeight: 1.6,
            }}
          >
            Building the future of autonomous maritime technology through
            strategic partnerships and community support for the RoboBoat
            competition.
          </Typography>
        </Box>

        {/* Primary Sponsor Section */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textAlign: "center",
              mb: 4,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Our Institutional Partner
          </Typography>

          <Card
            sx={{
              p: { xs: 3, md: 5 },
              backgroundColor: "background.paper",
              borderRadius: 3,
              boxShadow: `0 16px 48px ${alpha(
                theme.palette.primary.main,
                0.1
              )}`,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              maxWidth: 800,
              mx: "auto",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              spacing={{ xs: 3, md: 5 }}
            >
              {/* Logo/Icon Area */}
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: 120, md: 160 },
                  height: { xs: 120, md: 160 },
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Box
                  component="img"
                  src={humberLogo}
                  alt={primarySponsor.name}
                  sx={{
                    maxWidth: "80%",
                    maxHeight: "80%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* Sponsor Details */}
              <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    mb: 1,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                  }}
                >
                  {primarySponsor.name}
                </Typography>

                <Chip
                  label={primarySponsor.role}
                  color="primary"
                  sx={{ mb: 3, fontWeight: 600 }}
                />

                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.7,
                  }}
                >
                  {primarySponsor.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    mb: 2,
                  }}
                >
                  Support Areas:
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {primarySponsor.supportAreas.map((area, index) => (
                    <Chip
                      key={index}
                      label={area}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          </Card>
        </Box>

        {/* Key Supporters Section */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textAlign: "center",
              mb: 4,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Key Supporters
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
          >
            {keySupporters.map((supporter, index) => (
              <Card
                key={index}
                sx={{
                  flex: 1,
                  minWidth: 250,
                  maxWidth: 350,
                  p: 3,
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${alpha(
                    theme.palette.primary.main,
                    0.08
                  )}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 40px ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                  },
                }}
              >
                <CardContent sx={{ p: 0, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    {React.cloneElement(supporter.icon, {
                      sx: { fontSize: 28, color: "primary.main" },
                    })}
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 2,
                      fontSize: "1.3rem",
                    }}
                  >
                    {supporter.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {supporter.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* Partnership Opportunities */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textAlign: "center",
              mb: 4,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Partnership Opportunities
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              justifyContent: "center",
            }}
          >
            {partnershipOpportunities.map((opportunity, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  minWidth: 250,
                  maxWidth: 350,
                  p: { xs: 3, md: 4 },
                  backgroundColor: alpha(theme.palette.primary.main, 0.03),
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  textAlign: "center",
                }}
              >
                <Box sx={{ mb: 3 }}>{opportunity.icon}</Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 2,
                    fontSize: "1.3rem",
                  }}
                >
                  {opportunity.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  {opportunity.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Donor Acknowledgements */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
          <Card
            sx={{
              p: { xs: 3, md: 4 },
              backgroundColor: "background.paper",
              borderRadius: 3,
              boxShadow: `0 8px 32px ${alpha(
                theme.palette.primary.main,
                0.08
              )}`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              maxWidth: 700,
              mx: "auto",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                textAlign: "center",
                mb: 3,
              }}
            >
              We extend our sincere thanks to:
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {donorAcknowledgements.map((donor, index) => (
                <Chip
                  key={index}
                  label={donor}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          </Card>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 4, md: 5 },
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 3,
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Handshake sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Join Our RoboBoat Journey
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 3,
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: "1.1rem", md: "1.2rem" },
              lineHeight: 1.6,
            }}
          >
            Partner with us to compete in the international RoboBoat competition
            and help develop the next generation of autonomous maritime
            technology.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Handshake />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
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
            Support Our Team
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Support;
