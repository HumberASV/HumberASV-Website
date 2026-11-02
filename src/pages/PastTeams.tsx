// src\pages\PastTeams.tsx
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { teamYears, currentYear } from "../data/team";

/** Lists every archived team year, newest first, each linking to /team/:year. */
const PastTeams = () => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: "background.default", width: "100%" }}>
      <Container
        maxWidth="md"
        sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 6, md: 10 } }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            textAlign: "center",
            mb: 2,
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
          }}
        >
          Past Teams
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            fontWeight: 400,
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            mb: { xs: 5, md: 7 },
          }}
        >
          Every HumberASV crew, by competition year
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(220px, 260px))" },
            justifyContent: "center",
            gap: 3,
          }}
        >
          {teamYears.map(({ year, leads, members }) => (
            <Card
              key={year}
              sx={{
                borderRadius: 3,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.12)}`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                },
              }}
            >
              <CardActionArea component={RouterLink} to={`/team/${year}`}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "primary.main",
                      fontSize: { xs: "2.2rem", md: "2.6rem" },
                      lineHeight: 1.1,
                    }}
                  >
                    {year}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1, fontWeight: 500 }}
                  >
                    {leads.length + members.length} members
                  </Typography>
                  {year === currentYear && (
                    <Chip label="Current" color="primary" size="small" sx={{ mt: 1.5 }} />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default PastTeams;
