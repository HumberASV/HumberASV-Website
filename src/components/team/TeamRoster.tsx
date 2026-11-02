// src/components/team/TeamRoster.tsx
import { useState, memo, lazy, Suspense, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  CircularProgress,
  Fade,
  Button,
  Stack,
} from "@mui/material";
import type { TeamMember, TeamYear } from "../../data/team";

// Lazy load modal
const TeamModal = lazy(() => import("./TeamModal"));

const HQAvatar = memo(({ member }: { member: TeamMember }) => {
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  // Members without a photo go straight to the initial fallback.
  const [hasError, setHasError] = useState(!member.image);

  return (
    <Box
      sx={{
        width: 140,
        height: 140,
        borderRadius: "50%",
        overflow: "hidden",
        border: `4px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        boxShadow: `
          0 0 0 1px ${alpha("#fff", 0.1)},
          0 8px 32px ${alpha(theme.palette.primary.main, 0.2)},
          inset 0 0 20px ${alpha(theme.palette.primary.main, 0.05)}
        `,
        position: "relative",
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
      }}
    >
      {!isLoaded && !hasError && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      {hasError && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.primary.main,
            fontWeight: 700,
            fontSize: "2rem",
          }}
        >
          {member.name.charAt(0)}
        </Box>
      )}

      {member.image && (
        <Box
          component="img"
          src={member.image}
          alt={member.name}
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
            opacity: isLoaded && !hasError ? 1 : 0,
            transition: "opacity 0.3s ease",
            "&:hover": {
              transform: "scale(1.08)",
            },
          }}
        />
      )}
    </Box>
  );
});

interface TeamRosterProps {
  team: TeamYear;
  /** Past years label their banners with the year instead of presenting as the current team. */
  archived?: boolean;
}

/** Splits leads into rows of three; a shorter last row is centred by the caller. */
const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size)
  );

const TeamRoster = ({ team, archived = false }: TeamRosterProps) => {
  const theme = useTheme();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const { leads: teamLeads, members: restTeamMembers, banners } = team;
  const teamLeadsBanner = banners.leads;
  const fullTeamBanner = banners.team;

  // Preload all images in high quality
  useEffect(() => {
    const preloadImage = (src: string, id: number) => {
      if (!src) {
        setLoadedImages((prev) => new Set([...prev, id]));
        return;
      }
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, id]));
      };
      img.onerror = () => {
        console.warn(`Failed to load image for ID ${id}: ${src}`);
        setLoadedImages((prev) => new Set([...prev, id]));
      };
    };

    // Preload banner images
    preloadImage(teamLeadsBanner, -999);
    preloadImage(fullTeamBanner, -998);

    // Preload team lead images
    teamLeads.forEach((member) => {
      preloadImage(member.image, member.id);
    });

    // Preload team member images
    restTeamMembers.forEach((member) => {
      preloadImage(member.image, member.id);
    });
  }, [teamLeads, restTeamMembers, teamLeadsBanner, fullTeamBanner]);

  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const renderTeamCard = (member: TeamMember) => (
    <Fade key={member.id} in={loadedImages.has(member.id)} timeout={500}>
      <Box
        sx={{
          display: "flex",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: loadedImages.has(member.id) ? 1 : 0,
          transform: loadedImages.has(member.id)
            ? "translateY(0)"
            : "translateY(20px)",
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow: `0 24px 64px ${alpha(theme.palette.primary.main, 0.25)}`,
          },
        }}
        onClick={() => handleCardClick(member)}
      >
        <Card
          sx={{
            width: "100%",
            height: 360,
            backgroundColor: "background.paper",
            borderRadius: 3,
            boxShadow: `
              0 0 0 1px ${alpha(theme.palette.primary.main, 0.05)},
              0 12px 48px ${alpha(theme.palette.primary.main, 0.12)}
            `,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
            position: "relative",
            "&:hover": {
              borderColor: alpha(theme.palette.primary.main, 0.4),
              boxShadow: `
                0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)},
                0 24px 72px ${alpha(theme.palette.primary.main, 0.2)}
              `,
            },
          }}
        >
          <CardContent
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <HQAvatar member={member} />

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  mb: 0.5,
                  fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.35rem" },
                  lineHeight: 1.3,
                }}
              >
                {member.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                  lineHeight: 1.4,
                  opacity: 0.9,
                  mb: 1,
                }}
              >
                {member.role}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  opacity: 0.8,
                  fontStyle: "italic",
                }}
              >
                {member.program}
              </Typography>

              {member.graduationYear && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    opacity: 0.75,
                    mt: 0.5,
                  }}
                >
                  Class of {member.graduationYear}
                </Typography>
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                mt: 1,
                opacity: 0.7,
              }}
            >
              Click for details
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100vw",
      }}
    >
      {/* Team Leads Banner */}
      <Box
        sx={{
          width: "100%",
          position: "relative",
          mb: { xs: 6, md: 8 },
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        {teamLeadsBanner ? (
          <Box
            component="img"
            src={teamLeadsBanner}
            alt={`${team.year} Team Leads`}
            loading="eager"
            decoding="async"
            sx={{
              width: "100%",
              height: { xs: "auto", sm: "auto", md: "80vh" },
              maxHeight: { xs: "60vh", sm: "70vh", md: "80vh" },
              objectFit: { xs: "contain", sm: "contain", md: "cover" },
              objectPosition: "center center",
              display: "block",
            }}
          />
        ) : (
          // No leadership photo for this year yet: keep the band so the title still has a backdrop.
          <Box sx={{ width: "100%", height: { xs: "30vh", md: "45vh" } }} />
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 15, sm: 30, md: 40 },
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "white",
            background: alpha("#000", 0.7),
            backdropFilter: "blur(4px)",
            borderRadius: 2,
            py: { xs: 1, sm: 2 },
            px: { xs: 2, sm: 4 },
            width: { xs: "90%", sm: "auto" },
            maxWidth: { xs: "90%", sm: "90%", md: "800px" },
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: { xs: 0.5, sm: 2 },
              textShadow: "0 4px 20px rgba(0,0,0,0.7)",
              fontSize: {
                xs: "1.4rem",
                sm: "2.5rem",
                md: "3.5rem",
                lg: "4rem",
              },
              wordWrap: "break-word",
              lineHeight: 1.1,
            }}
          >
            {archived ? `The ${team.year} Team` : "Our Team"}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              fontSize: {
                xs: "0.85rem",
                sm: "1.2rem",
                md: "1.5rem",
                lg: "1.6rem",
              },
              maxWidth: "600px",
              mx: "auto",
              wordWrap: "break-word",
              lineHeight: 1.2,
              display: { xs: "none", sm: "block" },
            }}
          >
            {archived
              ? `The team members who steered our mission in ${team.year}`
              : "Meet the team members steering our mission towards success"}
          </Typography>
        </Box>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          overflowX: "hidden",
        }}
      >
        {/* Who We Are Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              wordWrap: "break-word",
            }}
          >
            Who We Are
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
              wordWrap: "break-word",
            }}
          >
            We're a multidisciplinary team of passionate Humber Polytechnic
            students and professionals dedicated to advancing autonomous
            maritime technology. From mechanical design to AI algorithms, our
            diverse expertise comes together to build innovative solutions for
            the future of autonomous surface vehicles.
          </Typography>
        </Box>

        {/* Full Team Banner */}
        <Box
          sx={{
            width: "100%",
            position: "relative",
            mb: 8,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
          }}
        >
          {fullTeamBanner ? (
            <Box
              component="img"
              src={fullTeamBanner}
              alt={`${team.year} Full Team`}
              loading="lazy"
              decoding="async"
              sx={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: {
                  xs: "70vh",
                  sm: "75vh",
                  md: "80vh",
                },
                objectFit: "contain",
                objectPosition: "center center",
                display: "block",
              }}
            />
          ) : (
            <Box sx={{ width: "100%", height: { xs: "25vh", md: "35vh" } }} />
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 15, sm: 25, md: 32 },
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              color: "white",
              background: alpha("#000", 0.7),
              backdropFilter: "blur(4px)",
              borderRadius: 2,
              py: { xs: 0.8, sm: 1.5 },
              px: { xs: 2, sm: 3 },
              width: { xs: "90%", sm: "auto" },
              maxWidth: { xs: "90%", sm: "90%", md: "700px" },
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: { xs: 0.3, sm: 1 },
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                fontSize: {
                  xs: "1.2rem",
                  sm: "2rem",
                  md: "2.5rem",
                },
                wordWrap: "break-word",
                lineHeight: 1.1,
              }}
            >
              {archived ? `Meet the ${team.year} Team` : "Meet Our Team"}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                textShadow: "0 1px 5px rgba(0,0,0,0.5)",
                fontSize: {
                  xs: "0.75rem",
                  sm: "1.1rem",
                  md: "1.3rem",
                },
                wordWrap: "break-word",
                lineHeight: 1.2,
                display: { xs: "none", sm: "block" },
              }}
            >
              Every member contributes to our success
            </Typography>
          </Box>
        </Box>

        {/* TEAM LEADS SECTION */}
        <Box
          sx={{
            mb: { xs: 8, md: 12 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              textAlign: "center",
              mb: 6,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
              wordWrap: "break-word",
            }}
          >
            Leadership Team
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              width: "100%",
            }}
          >
            {chunk(teamLeads, 3).map((row, i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: row.length === 1 ? "1fr" : "repeat(2, 1fr)",
                    md: `repeat(${row.length}, 1fr)`,
                  },
                  gap: 3,
                  width: "100%",
                  maxWidth: {
                    xs: "100%",
                    sm: row.length === 1 ? "350px" : "100%",
                    md: ["300px", "600px", "900px"][row.length - 1],
                    lg: ["350px", "700px", "100%"][row.length - 1],
                  },
                }}
              >
                {row.map(renderTeamCard)}
              </Box>
            ))}
          </Box>
        </Box>

        {/* REST OF TEAM SECTION */}
        <Box
          sx={{
            mb: { xs: 6, md: 8 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              textAlign: "center",
              mb: 6,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
              wordWrap: "break-word",
            }}
          >
            Our Team
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
              width: "100%",
            }}
          >
            {restTeamMembers.map(renderTeamCard)}
          </Box>
        </Box>

        {/* Join Section */}
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 8, md: 12 },
            px: { xs: 2, sm: 3 },
            mb: { xs: 4, md: 6 },
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.primary.main, 0.03),
            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: "primary.main",
              mb: 3,
              fontSize: { xs: "2rem", md: "3rem" },
              wordWrap: "break-word",
            }}
          >
            Join Our Team
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              mb: 5,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              lineHeight: 1.6,
              wordWrap: "break-word",
            }}
          >
            Passionate about autonomous vehicles, robotics, or marine
            technology? We're always looking for talented students to join our
            multidisciplinary team.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                window.location.href = "mailto:mechatronicsclub@humber.ca";
              }}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 48px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                },
                transition: "all 0.3s ease",
              }}
            >
              Apply Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                window.location.href = "/support";
              }}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 2,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Box>

        {/* Team Modal */}
        <Suspense fallback={<CircularProgress />}>
          <TeamModal
            open={!!selectedMember}
            member={selectedMember}
            onClose={handleCloseModal}
          />
        </Suspense>
      </Container>
    </Box>
  );
};

export default TeamRoster;
