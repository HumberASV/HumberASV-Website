import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  Button,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  CorporateFare,
  Star,
  TrendingUp,
  EmojiEvents,
} from "@mui/icons-material";

const Support = () => {
  const theme = useTheme();

  const sponsorTiers = [
    {
      level: "Platinum",
      color: "linear-gradient(135deg, #e5e4e2 0%, #d4d4d4 100%)",
      sponsors: [
        {
          name: "Humber College",
          logo: "https://placehold.co/300x120/00435c/white/png?text=Humber+College",
          description: "Premier Education Partner",
        },
        {
          name: "TechNova Solutions",
          logo: "https://placehold.co/300x120/00435c/white/png?text=TechNova",
          description: "Technology Innovation Leader",
        },
      ],
    },
    {
      level: "Gold",
      color: "linear-gradient(135deg, #ffd700 0%, #daa520 100%)",
      sponsors: [
        {
          name: "OceanTech Marine",
          logo: "https://placehold.co/250x100/00435c/white/png?text=OceanTech",
          description: "Maritime Technology Experts",
        },
        {
          name: "Precision Engineering",
          logo: "https://placehold.co/250x100/00435c/white/png?text=Precision+Eng",
          description: "Engineering Excellence",
        },
      ],
    },
    {
      level: "Silver",
      color: "linear-gradient(135deg, #c0c0c0 0%, #a9a9a9 100%)",
      sponsors: [
        {
          name: "Innovate Capital",
          logo: "https://placehold.co/200x80/00435c/white/png?text=Innovate",
          description: "Venture Investment Partners",
        },
        {
          name: "Future Labs R&D",
          logo: "https://placehold.co/200x80/00435c/white/png?text=Future+Labs",
          description: "Research & Development",
        },
      ],
    },
    {
      level: "Bronze",
      color: "linear-gradient(135deg, #cd7f32 0%, #b87333 100%)",
      sponsors: [
        {
          name: "Local Business Association",
          logo: "https://placehold.co/150x60/00435c/white/png?text=LBA",
          description: "Community Support",
        },
        {
          name: "Tech Startups Inc.",
          logo: "https://placehold.co/150x60/00435c/white/png?text=Tech+Startups",
          description: "Innovation Partners",
        },
      ],
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp sx={{ fontSize: 32, color: "primary.main" }} />,
      title: "Brand Visibility",
      description: "Prominent logo placement across all platforms and events",
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 32, color: "primary.main" }} />,
      title: "Exclusive Access",
      description: "Early access to research, technology, and talent",
    },
    {
      icon: <CorporateFare sx={{ fontSize: 32, color: "primary.main" }} />,
      title: "Networking",
      description: "Connect with industry leaders and potential partners",
    },
    {
      icon: <Star sx={{ fontSize: 32, color: "primary.main" }} />,
      title: "Recruitment",
      description: "Direct access to top engineering and technology students",
    },
  ];

  const getTierIcon = (level: string) => {
    switch (level) {
      case "Platinum":
        return <Star sx={{ color: "#e5e4e2", fontSize: 20 }} />;
      case "Gold":
        return <TrendingUp sx={{ color: "#ffd700", fontSize: 20 }} />;
      case "Silver":
        return <EmojiEvents sx={{ color: "#c0c0c0", fontSize: 20 }} />;
      default:
        return <CorporateFare sx={{ color: "#cd7f32", fontSize: 20 }} />;
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
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
            Our Valued Sponsors
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: "1.1rem", md: "1.2rem" },
            }}
          >
            We extend our deepest gratitude to the organizations that support
            our mission to advance autonomous maritime technology and
            innovation.
          </Typography>
        </Box>

        {/* Sponsor Tiers */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
          {sponsorTiers.map((tier, tierIndex) => (
            <Box key={tierIndex} sx={{ mb: 6 }}>
              {/* Tier Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 4,
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: tier.color,
                  }}
                >
                  {getTierIcon(tier.level)}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: tier.color,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                  }}
                >
                  {tier.level} Partners
                </Typography>
              </Box>

              {/* Sponsors in this tier */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 4,
                  mx: "auto",
                  maxWidth: 1000,
                }}
              >
                {tier.sponsors.map((sponsor, sponsorIndex) => (
                  <Card
                    key={sponsorIndex}
                    sx={{
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
                      textAlign: "center",
                      minWidth: 280,
                      maxWidth: 350,
                      flex: "1 1 300px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 40px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        p: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={sponsor.logo}
                        alt={sponsor.name}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          filter: "grayscale(100%)",
                          opacity: 0.9,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            filter: "grayscale(0%)",
                            opacity: 1,
                          },
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                          mb: 1,
                        }}
                      >
                        {sponsor.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mb: 2,
                        }}
                      >
                        {sponsor.description}
                      </Typography>
                      <Chip
                        label={tier.level}
                        size="small"
                        sx={{
                          background: tier.color,
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Partnership Benefits */}
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.03),
            borderRadius: 3,
            p: { xs: 4, md: 6 },
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            mb: { xs: 6, md: 8 },
          }}
        >
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
            Partnership Benefits
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {benefits.map((benefit, index) => (
              <Box
                key={index}
                sx={{
                  flex: "1 1 250px",
                  maxWidth: 300,
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    mb: 2,
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {benefit.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Become a Sponsor CTA */}
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 4, md: 6 },
            backgroundColor: alpha(theme.palette.accent.main, 0.1),
            borderRadius: 3,
            border: `2px dashed ${alpha(theme.palette.accent.main, 0.3)}`,
          }}
        >
          <CorporateFare sx={{ fontSize: 48, color: "accent.main", mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Join Our Mission
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 3,
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
            }}
          >
            Become a sponsor and help shape the future of autonomous maritime
            technology
          </Typography>
          <Button
            variant="contained"
            color="accent"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Become a Sponsor
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Support;
