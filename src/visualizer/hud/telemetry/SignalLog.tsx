/**
 * @file SignalLog.tsx
 * @description Displays the recent task logs along with the current signal strength.
 *              The signal strength is visually represented by a colored icon and percentage.
 */
import { Box, Typography } from "@mui/material";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useMemo } from "react";

const SignalLog: React.FC<{width: string, height: string, textAlign?: string }> = ({width, height, textAlign}) => {
  const align = textAlign || "left";
  const signalStrength = useSelector((state: RootState) => state.telemetry.signal.strength);
  const taskLog = useSelector((state: RootState) => state.telemetry.task.log);

  const recentLogs = useMemo(() => [...taskLog].reverse().slice(0, 10), [taskLog]);

  const getSignalColor = () => {
    if (signalStrength > 75) return "#10b981";
    if (signalStrength > 50) return "#eab308";
    if (signalStrength > 25) return "#f97316";
    return "#ef4444";
  };

  return (
    <Box sx={{ width, height, display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1 }}>
        <Typography variant="subtitle2" sx={{ color: "#9ca3af", fontWeight: 700 }}>
          Log
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SignalCellularAltIcon sx={{ color: getSignalColor(), fontSize: 20 }} />
          <Typography variant="caption" sx={{ color: getSignalColor(), fontWeight: 700}}>
            {Math.round(signalStrength)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", px: 1 }}>
        {recentLogs.length > 0 ? (
          recentLogs.map((log, idx) => (
            <Typography key={idx} variant="body2" sx={{ color: "#e6eef8", fontSize: 12, mb: 0.5, textAlign: align }}>
              • {log}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: 12 }}>
            No log entries
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default SignalLog;