const WAVE_PATH="M321.39, \
  56.44c58-10.79,\
  114.16-30.13, \
  172-41.86, \
  82.39-16.72, \
  168.19-17.73, \
  250.45-.39C823.78, \
  31,906.67, \
  72, \
  985.66, \
  92.83c70.05,\
  18.48, \
  146.53, \
  26.09, \
  214.34, \
  3V0H0V27.35A600.21, \
  600.21, \
  0, \
  0, \
  0, \
  321.39,\
  56.44Z \
";
import { motion } from "framer-motion";
import { theme } from "../../../theme";

const Wave = () => {

  return (
     <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: 80,
          display: "block",
        }}
      >
        <motion.path
          d={WAVE_PATH}
          fill={theme.palette.background.default}
          fillOpacity={0.4}
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 6, delay: -3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d={WAVE_PATH}
          fill={theme.palette.background.default}
          fillOpacity={0.4}
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 6, delay: -2, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d={WAVE_PATH}
          fill={theme.palette.background.default}
          fillOpacity={0.4}
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 6, delay: -4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d={WAVE_PATH}
          fill={theme.palette.background.default}
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 6, delay: -6, repeat: Infinity, ease: "linear" }}
        />
      </svg>
  )
};

export default Wave;