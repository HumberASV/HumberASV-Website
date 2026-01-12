// src/components/layout/vehicle/HighlightsSection.tsx
import {
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import electricalHighlightImage from "../../../assets/Electrical System_CAD.png";
import isaacSimHighlightImage from "../../../assets/Isaac Sim 1.png";
import softwareHighlightImage from "../../../assets/Rudder 35 Degrees.png";

interface HighlightsSectionProps {
  onLearnMore: (title: string, content: string) => void;
}

const highlights = [
  {
    title: "Electrical Systems",
    description:
      "Advanced power management with dual-battery redundancy and custom PCB design for reliable autonomous operations in marine environments.",
    image: electricalHighlightImage,
    modalContent: `Electrical:\n
The boat features two 20v drill batteries used to power propulsion and one 14.8V Lithium-ion battery which will be used to power the rest of the electronics.\n
A feature that we are excited to have on our boat is the capability of switching to the secondary battery and use it to power the thrusters. This will allow us to maximize test time and retrieve the boat in case the primary batteries ever run out. We achieved this through the use of four high current relays a remote relay switch that can be triggered by the operator. The relay chooses which battery will be powering the propellers. It was important retain the capability to disconnect the power from the propulsion regardless of the power supply, therefore the propellers connect to the Normally Open pole.\n
To ensure a safe discharge of the batteries, the system includes Battery Management Systems (BMS) as well as voltage sensors bound to our FlySky remote to notify the user of the status.\n
As a team we prioritized the creation of CAD for all systems which allow us to plan and arranged components around the boat before we ever physically built them, ensuring proper fit and easier cable management.\n
The team designed and manufactured custom PCBs that tackled important challenges in our boat, giving the team the opportunity to acquire and develop important skills. The PCBs address the switching between the RC and autonomous commands, as well as a light indicator that is mounted on the exterior of the boat. This circuits were simulated in software, prototyped in breadboards and finally manufactured and assembled by our team.`,
  },
  {
    title: "Mechanical Engineering",
    description:
      "Modular design with rapid component interchangeability and optimized hydrodynamic performance for competition-grade reliability.",
    reverse: true,
    image: softwareHighlightImage,
    modalContent: `Design Philosophy:\n
Our mechanical architecture prioritizes modularity, serviceability, and hydrodynamic efficiency. Every component integrates within a standardized mounting framework allowing rapid field maintenance and configuration changes.\n
Modular Component System:\n
Quick-release mechanisms enable complete subsystem replacement in under five minutes. This design philosophy ensures minimal downtime during competition events and facilitates rapid prototyping iterations.\n
Compartmentalized Architecture:\n
• Waterproof isolation separates sensitive electronics from propulsion systems\n• Dedicated drainage channels protect critical components from marine environmental challenges\n• Vibration-dampening mounts ensure system reliability\n
Hydrodynamic Optimization:\n
Computational fluid dynamics informed our hull design, balancing stability with hydrodynamic efficiency for optimal performance across varying sea states.\n
Material Selection:\n
Aerospace-grade aluminum alloys and marine-grade composites provide the ideal balance of strength, weight, and corrosion resistance for sustained marine operations.`,
  },
  {
    title: "Software Development",
    description:
      "ROS2-based architecture with real-time telemetry and advanced computer vision for autonomous navigation and obstacle avoidance.",
    image: isaacSimHighlightImage,
    modalContent: `System Architecture:\n
Our vessel operates on a sophisticated ROS2 (Robot Operating System 2) framework, implementing a distributed node architecture for perception, planning, and control subsystems.\n
Autonomous Navigation:\n
Advanced path planning algorithms process real-time sensor data to execute complex mission profiles with centimeter-level precision. Adaptive control systems compensate for environmental variables including currents, winds, and wave patterns.\n
Computer Vision Pipeline:\n
• Stereoscopic camera systems capture 30 frames per second of environmental data\n• Custom algorithms perform real-time obstacle detection, classification, and avoidance maneuvers\n• Sub-second latency ensures responsive navigation\n
Telemetry & Communications:\n
High-bandwidth 5GHz WiFi provides real-time data streaming with <50ms latency. Triple-redundancy systems ensure uninterrupted communication during critical mission phases.\n
Mission Control Interface:\n
A custom ground station provides operators with comprehensive situational awareness, including real-time sensor data visualization, mission planning and editing capabilities, system health monitoring and diagnostics, and autonomous/manual mode transition controls.\n
Safety Systems:\n
Multi-layer fail-safe protocols include geofencing, automated recovery maneuvers, and emergency stop functionality accessible from both autonomous systems and manual override controls.`,
  },
];

const HighlightsSection = ({ onLearnMore }: HighlightsSectionProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: { xs: 8, md: 10 } }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          textAlign: "center",
          mb: 6,
          fontSize: { xs: "2rem", md: "2.8rem" },
        }}
      >
        Integrated Engineering Systems
      </Typography>

      <Stack spacing={8}>
        {highlights.map((highlight) => (
          <Box
            key={highlight.title}
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: highlight.reverse ? "row-reverse" : "row",
              },
              alignItems: "center",
              gap: { xs: 4, md: 6 },
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: { md: "0 0 50%" },
                width: "100%",
                height: { xs: "300px", md: "400px" },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: `0 16px 48px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={highlight.image}
                alt={highlight.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                flex: { md: "0 0 50%" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  mb: 3,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  lineHeight: 1.2,
                }}
              >
                {highlight.title}
              </Typography>
              <Divider
                sx={{
                  mb: 3,
                  width: { xs: "100px", md: "120px" },
                  height: "4px",
                  backgroundColor: theme.palette.accent.main,
                  mx: { xs: "auto", md: "0" },
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                {highlight.description}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  onLearnMore(highlight.title, highlight.modalContent)
                }
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  borderWidth: "2px",
                  "&:hover": {
                    borderWidth: "2px",
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Technical Details
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default HighlightsSection;
