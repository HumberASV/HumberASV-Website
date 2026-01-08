import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";

import navLogo from "../../assets/HumberASV-Main Logo.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/team", label: "Team" },
  { to: "/vehicle", label: "Vehicle" },
  { to: "/sponsors", label: "Sponsors" },
];

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past a certain point
      setIsScrolled(currentScrollY > 50);

      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const hoverBgColor = `rgba(${theme.palette.primary.main
    .replace("#", "")
    .match(/.{2}/g)
    ?.map((c) => parseInt(c, 16))
    .join(",")}, 0.15)`;

  const drawerContent = (
    <Box
      sx={{ width: 250, bgcolor: "background.default", height: "100%" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem
          key="close"
          disablePadding
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="close menu"
          >
            <CloseIcon sx={{ color: "primary.main" }} />
          </IconButton>
        </ListItem>
        {navItems.map(({ to, label }) => (
          <ListItem key={to} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={to}
              selected={location.pathname === to}
              sx={{
                color: "text.primary",
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                },
                "&:hover": {
                  bgcolor: hoverBgColor,
                  color: "primary.main",
                },
              }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={isScrolled ? 4 : 0}
      sx={{
        backgroundColor: isScrolled
          ? alpha(theme.palette.background.default, 0.95)
          : theme.palette.background.default,
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        borderBottom: isScrolled
          ? "none"
          : `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        // Water-themed styling
        backgroundImage: isScrolled
          ? `linear-gradient(to bottom, ${alpha(
              theme.palette.primary.main,
              0.05
            )} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
          : "none",
        "&::after": isScrolled
          ? {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(to right, transparent, ${alpha(
                theme.palette.primary.main,
                0.3
              )}, transparent)`,
            }
          : {},
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: isScrolled ? 1 : 2,
          transition: "padding 0.3s ease",
        }}
      >
        {/* Project logo on the left */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src={navLogo}
            alt="Humber ASV"
            sx={{
              height: isScrolled ? 60 : 85,
              width: "auto",
              maxWidth: 100,
              objectFit: "contain",
              transition: "height 0.3s ease",
            }}
          />
        </Box>

        {/* Humber College branding in the center */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                color: "#00435c",
                fontSize: isScrolled ? "1rem" : "1.1rem",
                lineHeight: 1.1,
                textAlign: "center",
                transition: "font-size 0.3s ease",
              }}
            >
              HUMBER
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 400,
                color: "#00435c",
                fontSize: isScrolled ? "0.6rem" : "0.7rem",
                letterSpacing: "0.05em",
                textAlign: "center",
                display: "block",
                mt: 0.1,
                transition: "font-size 0.3s ease",
              }}
            >
              COLLEGE
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          {!isMobile ? (
            <>
              {navItems.map(({ to, label }) => (
                <Button
                  key={to}
                  component={RouterLink}
                  to={to}
                  variant="text"
                  sx={{
                    color:
                      location.pathname === to
                        ? "primary.main"
                        : "text.primary",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: location.pathname === to ? 700 : 600,
                    fontSize: isScrolled ? "0.9rem" : "1rem",
                    transition: "all 0.3s ease",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      width: location.pathname === to ? "80%" : "0%",
                      height: "2px",
                      backgroundColor: "primary.main",
                      transform: "translateX(-50%)",
                      transition: "width 0.3s ease",
                      borderRadius: 2,
                    },
                    "&:hover": {
                      backgroundColor: hoverBgColor,
                      color: "primary.main",
                      "&::after": {
                        width: "80%",
                      },
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </>
          ) : (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ color: "primary.main" }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                ModalProps={{ keepMounted: true }}
              >
                {drawerContent}
              </Drawer>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
