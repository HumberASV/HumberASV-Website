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
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import navLogo from "../../assets/HumberASV-Horizotal Logo.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/team", label: "Team" },
  { to: "/vehicle", label: "Vehicle" },
  { to: "/docs", label: "Documentation" },
  { to: "/support", label: "Support" },
];

const MotionAppBar = motion(AppBar);

const drawerItemVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, x: 40, transition: { duration: 0.15 } },
};

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hysteresis: enter scrolled state at >30px, leave it only below 10px
      setIsScrolled((prev) => {
        if (!prev && currentScrollY > 30) return true;
        if (prev && currentScrollY < 10) return false;
        return prev;
      });

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <AnimatePresence>
          {navItems.map(({ to, label }, i) => (
            <motion.div
              key={to}
              custom={i}
              variants={drawerItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ListItem disablePadding>
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
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    </Box>
  );

  return (
    <MotionAppBar
      position="sticky"
      color="default"
      elevation={isScrolled ? 4 : 0}
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      sx={{
        backgroundColor: isScrolled
          ? alpha(theme.palette.background.default, 0.95)
          : theme.palette.background.default,
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        borderBottom: isScrolled
          ? "none"
          : `1px solid ${theme.palette.divider}`,
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
          py: isScrolled ? 0.75 : 1,
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: "64px !important",
        }}
      >
        {/* Logo */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <motion.img
            src={navLogo}
            alt="Humber ASV"
            animate={{
              height: isScrolled ? 48 : 60,
              maxWidth: isScrolled ? 120 : 140,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ width: "auto", objectFit: "contain" }}
          />
        </Box>

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
                    fontSize: isScrolled ? "0.85rem" : "0.9rem",
                    transition: "color 0.2s ease, background-color 0.2s ease, font-size 0.3s ease",
                    position: "relative",
                    px: 1.5,
                    py: 0.75,
                    minWidth: "auto",
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
                sx={{ color: "primary.main", p: 0.75 }}
              >
                <MenuIcon fontSize={isScrolled ? "medium" : "large"} />
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
    </MotionAppBar>
  );
};

export default Navbar;
