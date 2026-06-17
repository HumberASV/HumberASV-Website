/**
 * 
 */

// Battery icons from MUI
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import Battery1BarIcon from "@mui/icons-material/Battery1Bar";
import Battery2BarIcon from "@mui/icons-material/Battery2Bar";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import Battery4BarIcon from "@mui/icons-material/Battery4Bar";
import Battery5BarIcon from "@mui/icons-material/Battery5Bar";
import Battery6BarIcon from "@mui/icons-material/Battery6Bar";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";

//Not a switch statement for brevity.
const batteryIconFor = (level: number) => {
    if (level >= 95) return BatteryFullIcon;
    if (level >= 85) return Battery6BarIcon;
    if (level >= 75) return Battery5BarIcon;
    if (level >= 60) return Battery4BarIcon;
    if (level >= 45) return Battery3BarIcon;
    if (level >= 30) return Battery2BarIcon;
    if (level >= 15) return Battery1BarIcon;
    return Battery0BarIcon; 
};

export { batteryIconFor }