import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  useTheme,
  alpha,
} from "@mui/material";

const LatestUpdates = () => {
  const theme = useTheme();

  const posts = [
    {
      title: "Successful Prototype Launch",
      description:
        "Our team tested the first prototype of our autonomous surface vehicle, achieving key milestones in navigation and stability.",
      image:
        "https://placehold.co/600x400/00435c/ffffff/png?text=Prototype+Launch",
      date: "Sep 2025",
    },
    {
      title: "Collaboration with Industry Leaders",
      description:
        "We are excited to announce a new collaboration with TechCorp and OceanTech, providing expertise and resources to boost our project.",
      image:
        "https://placehold.co/600x400/006687/ffffff/png?text=Collaboration+News",
      date: "Aug 2025",
    },
    {
      title: "Winning Engineering Award",
      description:
        "Our project won the Humber Polytechnic Innovation Award, recognizing our dedication to advancing maritime technologies.",
      image:
        "https://placehold.co/600x400/003349/ffffff/png?text=Award+Recognition",
      date: "Jul 2025",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 3,
        // Responsive max width per card, changing by breakpoint
        "& > div": {
          flexBasis: {
            xs: "100%", // 1 column on mobile
            sm: "48%", // 2 columns on tablet
            md: "31%", // 3 columns on desktop
          },
          flexGrow: 1,
        },
      }}
    >
      {posts.map((post, index) => (
        <Box key={index}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: `0 6px 24px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={post.image}
              alt={post.title}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="overline"
                display="block"
                gutterBottom
                sx={{
                  color: alpha(theme.palette.primary.main, 0.9),
                  fontWeight: 600,
                }}
              >
                {post.date}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
              >
                {post.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                {post.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                size="small"
                variant="outlined"
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                Read More
              </Button>
            </CardActions>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default LatestUpdates;
