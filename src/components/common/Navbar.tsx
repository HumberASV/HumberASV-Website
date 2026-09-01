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
  Collapse,
  Menu,
  MenuItem,
  type Theme,
} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { SxProps } from "@mui/material";

import navLogo from "../../assets/HumberASV-Horizotal Logo.png";

const navItems = [
  { to: "/", label: "Home", children: null },
  { to: "/team", label: "Team", children: null },
  { to: "/vehicle", label: "Vehicle", children: 
    [
      { to: "/vehicle/software", label: "Software"},
      { to: "/vehicle/electrical", label: "Electrical"},
      { to: "/vehicle/mechanical", label: "Mechanical"},
    ]
   },
  { to: "/docs", label: "Documentation", children: null },
  { to: "/support", label: "Support", children: null },
];

const MotionAppBar = motion.create(AppBar);

const drawerItemVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, x: 40, transition: { duration: 0.15 } },
};

interface NavButtonProps {
  to: string;
  label?: string;
  children?: React.ReactNode;
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLDivElement>;
  sx?: SxProps<Theme>;
}

const NavButton = ({ to, label, children, selected, onClick, sx }: NavButtonProps) => {
  return (
     <ListItemButton
                  component={RouterLink}
                  to={to}
                  selected={selected}
                  onClick={onClick}
                  sx={sx}
                >
                  {label && <ListItemText primary={label} />}
                  {children}
    </ListItemButton>
  )
};

const Navbar = () => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
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

  const navButtonSx = (active: boolean): SxProps<Theme> => ({
    color: active ? "primary.main" : "text.primary",
    borderRadius: 2,
    textTransform: "none",
    fontWeight: active ? 700 : 600,
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
      width: active ? "80%" : "0%",
      height: "2px",
      backgroundColor: "primary.main",
      transform: "translateX(-50%)",
      transition: "width 0.3s ease",
      borderRadius: 2,
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      color: "primary.main",
      "&::after": {
        width: "80%",
      },
    },
  });

  const drawerContent = (
    <Box
      sx={{ width: 250, bgcolor: "background.default", height: "100%" }}
      role="presentation"
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
          {navItems.map(({ to, label, children }, i) => (
            <motion.div
              key={to}
              custom={i}
              variants={drawerItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ListItem disablePadding>
                {children ? 
                <Box sx={{ width: "100%" }}>
                  <ListItemButton selected={location.pathname === to  || children.some((child) => location.pathname === child.to)} onClick={handleClick}>
                    <ListItemText primary={label} />
                    {open ? <ExpandLess /> : <ExpandMore/>} 
                  </ListItemButton>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <NavButton 
                        selected={location.pathname === to} 
                        to={to} 
                        label={label + " Overview"} 
                        sx={{ color: "text.primary", pl: 4 }}
                      />
                      {children.map(({ to: childTo, label: childLabel }) => (
                        <NavButton
                          key={childTo}
                          to={childTo}
                          label={childLabel}
                          selected={location.pathname === childTo}
                          sx={{ color: "text.primary", pl: 4 }}
                        >
                        </NavButton>
                      ))}
                    </List>
                  </Collapse>
                  </Box>
                :
                <NavButton
                  to={to}
                  label={label}
                  selected={location.pathname === to}
                  onClick={() => setDrawerOpen(false)}
                  sx={{ color: "text.primary" }}
                />
                }
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
            initial={{ height: 60, maxWidth: 140 }}
            animate={{
              height: isScrolled ? 48 : 60,
              maxWidth: isScrolled ? 120 : 140,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ width: "auto", objectFit: "contain" }}
          />
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {!isMobile ? (
            <>
              {navItems.map(({ to, label, children }) => {
                const active = children
                  ? location.pathname === to ||
                    children.some((child) => location.pathname === child.to)
                  : location.pathname === to;

                if (children) {
                  const menuOpen = Boolean(menuAnchor) && menuFor === to;
                  const closeMenu = () => {
                    setMenuAnchor(null);
                    setMenuFor(null);
                  };

                  return (
                    <React.Fragment key={to}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 2,
                        }}
                      >
                        <Button
                          component={RouterLink}
                          to={to}
                          variant="text"
                          sx={{
                            ...navButtonSx(active),
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            pr: 0.75,
                          }}
                        >
                          {label}
                        </Button>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setMenuAnchor(e.currentTarget);
                            setMenuFor(to);
                          }}
                          aria-label={`${label} submenu`}
                          aria-haspopup="true"
                          aria-expanded={menuOpen}
                          sx={{
                            color: active ? "primary.main" : "text.primary",
                            borderRadius: 2,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            ml: -0.5,
                            mr: 0.5,
                            transition: "color 0.2s ease, background-color 0.2s ease",
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.15),
                              color: "primary.main",
                            },
                          }}
                        >
                          {menuOpen ? (
                            <ExpandLess fontSize="small" />
                          ) : (
                            <ExpandMore fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                      <Menu
                        anchorEl={menuAnchor}
                        open={menuOpen}
                        onClose={closeMenu}
                      >
                        {children.map((child) => (
                          <MenuItem
                            key={child.to}
                            component={RouterLink}
                            to={child.to}
                            selected={location.pathname === child.to}
                            onClick={closeMenu}
                          >
                            {child.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </React.Fragment>
                  );
                }

                return (
                  <Button
                    key={to}
                    component={RouterLink}
                    to={to}
                    variant="text"
                    sx={navButtonSx(active)}
                  >
                    {label}
                  </Button>
                );
              })}
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
                onClose={() => setDrawerOpen(false)}
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
