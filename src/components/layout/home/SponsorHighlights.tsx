import { Box, Typography, useTheme, alpha } from "@mui/material";

const SponsorHighlights = () => {
  const theme = useTheme();

  const sponsors = [
    {
      name: "Humber Polytechnic",
      logo: "https://placehold.co/400x200/00435c/ffffff/png?text=Humber+College",
      tier: "Platinum",
      description: "Education Partner",
    },
    {
      name: "TechCorp",
      logo: "https://placehold.co/400x200/00435c/ffffff/png?text=TechCorp",
      tier: "Gold",
      description: "Technology Solutions",
    },
    {
      name: "OceanTech",
      logo: "https://placehold.co/400x200/00435c/ffffff/png?text=OceanTech",
      tier: "Gold",
      description: "Maritime Innovation",
    },
    {
      name: "InnovateFund",
      logo: "https://placehold.co/400x200/00435c/ffffff/png?text=InnovateFund",
      tier: "Silver",
      description: "Venture Capital",
    },
    {
      name: "PrecisionEng",
      logo: "https://placehold.co/400x200/00435c/ffffff/png?text=PrecisionEng",
      tier: "Silver",
      description: "Engineering Excellence",
    },
    {
      name: "FutureLabs",
      logo: "https://placehold.co/400x200/00435c/ffffff/png?text=FutureLabs",
      tier: "Bronze",
      description: "Research & Development",
    },
  ];

  return (
    <Box sx={{ mt: { xs: 4, md: 8 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: 2, sm: 3, md: 4 },
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {sponsors.map((sponsor, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "background.paper",
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 4px 12px ${alpha(
                theme.palette.primary.main,
                0.08
              )}`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 6px 24px ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}`,
              },
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                p: { xs: 2, md: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: 120, md: 160 },
              }}
            >
              <Box
                component="img"
                src={sponsor.logo}
                alt={sponsor.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: { xs: 80, md: 120 },
                  objectFit: "contain",
                  filter: "grayscale(40%)",
                  opacity: 0.85,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    filter: "grayscale(0%)",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Sponsor Info */}
            <Box
              sx={{
                flexGrow: 1,
                px: { xs: 2, md: 3 },
                pb: { xs: 2, md: 3 },
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}
              >
                {sponsor.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 1.5,
                  fontSize: { xs: "0.85rem", md: "0.9rem" },
                }}
              >
                {sponsor.description}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: alpha(theme.palette.primary.main, 0.8),
                  fontWeight: 500,
                }}
              >
                {sponsor.tier} Sponsor
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SponsorHighlights;
