import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";

import navLogo from "../../assets/HumberASV-Horizotal Logo.png";

const Footer = () => {
  const theme = useTheme();

  const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/team", label: "Team" },
    { to: "/vehicle", label: "Vehicle" },
    { to: "/docs", label: "Documentation" },
    { to: "/support", label: "Support" },
  ];

  const contactInfo = [
    { icon: <Email sx={{ fontSize: "1rem" }} />, text: "contact@humberasv.ca" },
    { icon: <Phone sx={{ fontSize: "1rem" }} />, text: "+1 (416) 675-6622" },
    {
      icon: <LocationOn sx={{ fontSize: "1rem" }} />,
      text: "Humber College, Toronto, ON",
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, label: "Facebook", href: "#" },
    { icon: <Twitter />, label: "Twitter", href: "#" },
    { icon: <Instagram />, label: "Instagram", href: "#" },
    { icon: <LinkedIn />, label: "LinkedIn", href: "#" },
    { icon: <YouTube />, label: "YouTube", href: "#" },
  ];

  const bottomLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Accessibility", href: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000000",
        color: "white",
        width: "100%",
        pt: { xs: 4, sm: 5, md: 6 },
        pb: { xs: 3, sm: 3.5, md: 4 },
        mt: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
        {/* Top Section - Improved responsive layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "flex-start" },
            mb: { xs: 4, sm: 5, md: 6 },
            gap: { xs: 4, sm: 3, md: 4 },
          }}
        >
          {/* Logo and Brief Description - Takes full width on xs, half on sm, quarter on md+ */}
          <Box
            sx={{
              flex: {
                xs: "0 0 100%",
                sm: "0 0 calc(50% - 24px)",
                md: "0 0 25%",
              },
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 24px)",
                md: "25%",
              },
              mb: { xs: 0, sm: 0, md: 0 },
            }}
          >
            <Box
              component="img"
              src={navLogo}
              alt="Humber ASV"
              sx={{
                height: { xs: "40px", sm: "35px", md: "35px" },
                width: "auto",
                mb: 2,
                filter: "brightness(0) invert(1)",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: alpha("#fff", 0.7),
                lineHeight: 1.6,
                fontSize: { xs: "0.9rem", sm: "0.85rem", md: "0.85rem" },
                maxWidth: { xs: "100%", sm: "90%", md: "280px" },
              }}
            >
              Humber College's Autonomous Surface Vehicle team dedicated to
              advancing maritime robotics and autonomous navigation technology.
            </Typography>
          </Box>

          {/* Navigation Links - Tablet view: second column, first row */}
          <Box
            sx={{
              flex: {
                xs: "0 0 100%",
                sm: "0 0 calc(50% - 24px)",
                md: "0 0 20%",
              },
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 24px)",
                md: "20%",
              },
              order: { xs: 1, sm: 2, md: 2 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: { xs: 1.5, sm: 2, md: 2 },
                fontSize: { xs: "1.1rem", sm: "1rem", md: "1rem" },
                color: "#ffffff",
                letterSpacing: "0.3px",
              }}
            >
              Navigation
            </Typography>
            <Stack spacing={1.25}>
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    color: alpha("#fff", 0.75),
                    textDecoration: "none",
                    fontSize: { xs: "0.95rem", sm: "0.9rem", md: "0.9rem" },
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: theme.palette.accent.main,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Contact Information - Tablet view: first column, second row */}
          <Box
            sx={{
              flex: {
                xs: "0 0 100%",
                sm: "0 0 calc(50% - 24px)",
                md: "0 0 25%",
              },
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 24px)",
                md: "25%",
              },
              order: { xs: 2, sm: 3, md: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: { xs: 1.5, sm: 2, md: 2 },
                fontSize: { xs: "1.1rem", sm: "1rem", md: "1rem" },
                color: "#ffffff",
                letterSpacing: "0.3px",
              }}
            >
              Contact Us
            </Typography>
            <Stack spacing={1.75}>
              {contactInfo.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.accent.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "24px",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: alpha("#fff", 0.75),
                      fontSize: { xs: "0.95rem", sm: "0.9rem", md: "0.9rem" },
                      fontWeight: 500,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Social Media Links - Tablet view: second column, second row */}
          <Box
            sx={{
              flex: {
                xs: "0 0 100%",
                sm: "0 0 calc(50% - 24px)",
                md: "0 0 20%",
              },
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 24px)",
                md: "20%",
              },
              order: { xs: 3, sm: 4, md: 4 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: { xs: 1.5, sm: 2, md: 2 },
                fontSize: { xs: "1.1rem", sm: "1rem", md: "1rem" },
                color: "#ffffff",
                letterSpacing: "0.3px",
              }}
            >
              Follow Us
            </Typography>
            <Stack
              direction="row"
              spacing={1.25}
              flexWrap="wrap"
              useFlexGap
              sx={{
                justifyContent: {
                  xs: "flex-start",
                  sm: "flex-start",
                  md: "flex-start",
                },
              }}
            >
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: alpha("#fff", 0.85),
                    backgroundColor: alpha("#fff", 0.08),
                    border: `1px solid ${alpha("#fff", 0.15)}`,
                    width: { xs: 44, sm: 40, md: 38 },
                    height: { xs: 44, sm: 40, md: 38 },
                    "&:hover": {
                      backgroundColor: theme.palette.accent.main,
                      color: "#000000",
                      borderColor: theme.palette.accent.main,
                      transform: "translateY(-3px) scale(1.1)",
                    },
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {React.cloneElement(social.icon, {
                    sx: {
                      fontSize: { xs: "1.2rem", sm: "1.1rem", md: "1.1rem" },
                    },
                  })}
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: alpha("#fff", 0.12),
            mb: { xs: 3, sm: 3.5, md: 4 },
          }}
        />

        {/* Bottom Section - FIXED: Proper horizontal layout for bottom links */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center", md: "center" },
            gap: { xs: 2, sm: 2, md: 0 },
          }}
        >
          {/* Copyright - Left side */}
          <Box
            sx={{
              order: { xs: 1, sm: 1, md: 1 },
              mb: { xs: 1, sm: 0, md: 0 },
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: alpha("#fff", 0.55),
                fontSize: { xs: "0.85rem", sm: "0.8rem", md: "0.8rem" },
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              © {new Date().getFullYear()} Humber ASV Team. All rights reserved.
            </Typography>
          </Box>

          {/* Middle Links - FIXED: Proper horizontal layout */}
          <Box
            sx={{
              order: { xs: 2, sm: 2, md: 2 },
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: { xs: "flex-start", sm: "center", md: "center" },
              alignItems: "center",
              gap: { xs: 1, sm: 1.5, md: 2 },
              py: { xs: 1, sm: 0, md: 0 },
              flex: { sm: 1, md: 0 },
              mx: { sm: 2, md: 0 },
              width: { xs: "100%", sm: "auto", md: "auto" },
              overflow: "hidden",
            }}
          >
            {bottomLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link
                  href={link.href}
                  sx={{
                    color: alpha("#fff", 0.6),
                    textDecoration: "none",
                    fontSize: { xs: "0.85rem", sm: "0.8rem", md: "0.8rem" },
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                    "&:hover": {
                      color: theme.palette.accent.main,
                    },
                  }}
                >
                  {link.label}
                </Link>
                {index < bottomLinks.length - 1 && (
                  <Box
                    sx={{
                      color: alpha("#fff", 0.25),
                      fontSize: { xs: "0.85rem", sm: "0.8rem", md: "0.8rem" },
                      fontWeight: 300,
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    •
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* Program Name - Right side */}
          <Box
            sx={{
              order: { xs: 3, sm: 3, md: 3 },
              mb: { xs: 1, sm: 0, md: 0 },
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: alpha("#fff", 0.55),
                fontSize: { xs: "0.85rem", sm: "0.8rem", md: "0.8rem" },
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Humber College • Graphic Design Program
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
