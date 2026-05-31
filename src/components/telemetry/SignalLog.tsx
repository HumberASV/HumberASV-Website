/*
Combined Signal + Log card
*/
import { Box, Typography } from "@mui/material";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { useSelector } from "react-redux";
import type { RootState } from "../../utils/store";
import { useMemo } from "react";

export default function SignalLog() {
  const signalStrength = useSelector((state: RootState) => state.telemetry.signalStrength);
  const taskLog = useSelector((state: RootState) => state.telemetry.taskLog);

  const recentLogs = useMemo(() => [...taskLog].reverse().slice(0, 10), [taskLog]);

  const getSignalColor = () => {
    if (signalStrength > 75) return "#10b981";
    if (signalStrength > 50) return "#eab308";
    if (signalStrength > 25) return "#f97316";
    return "#ef4444";
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1 }}>
        <Typography variant="subtitle2" sx={{ color: "#9ca3af", fontWeight: 700 }}>
          Log
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SignalCellularAltIcon sx={{ color: getSignalColor(), fontSize: 20 }} />
          <Typography variant="caption" sx={{ color: getSignalColor(), fontWeight: 700 }}>
            {Math.round(signalStrength)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", px: 1 }}>
        {recentLogs.length > 0 ? (
          recentLogs.map((log, idx) => (
            <Typography key={idx} variant="body2" sx={{ color: "#e6eef8", fontSize: 12, mb: 0.5 }}>
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
