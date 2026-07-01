import { Box } from "@mui/material";
import { Wave } from "experimental-visualizer";

const BoatLoader = () => (
  <Box
    sx={{
      position: "relative",
      left: "50%",
      transform: "translateX(-50%)",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
    }}
  >
    <Wave waveHeight={30} wavePeriod={6} />
  </Box>
);

export default BoatLoader;
