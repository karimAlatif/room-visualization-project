import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Zap as BotIcon } from "lucide-react";
import { useStyles } from "./RightSidebar.styles";
import { useFarmStore } from "src/shared/store";

export const EmptyState = () => {
  const classes = useStyles();
  const { activityLogs } = useFarmStore();

  return (
    <Box className={classes.panel}>
      <Box className={classes.emptyState}>
        <Box className={classes.emptyIcon}>
          <BotIcon
            size={32}
            strokeWidth={2.5}
            className={classes.emptyIconSvg}
          />
        </Box>
        <Typography variant="h6" className={classes.emptyTitle}>
          No Selection
        </Typography>
        <Typography variant="body2" className={classes.emptyDescription}>
          Click on a palm tree or robot in the 3D view to see details
        </Typography>
      </Box>

      {/* Recent Activity */}
      {activityLogs.length > 0 && (
        <Box className={classes.activitySection}>
          <Typography variant="caption" className={classes.activityTitle}>
            Recent Activity
          </Typography>
          <Box className={classes.activityList}>
            {activityLogs.slice(0, 5).map((log) => (
              <Paper key={log.id} className={classes.activityItem}>
                <Box className={classes.activityHeader}>
                  <Typography
                    variant="caption"
                    className={classes.activityAction}
                  >
                    {log.action}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(log.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {log.details}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
