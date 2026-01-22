import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
// import { Zap as BotIcon } from "lucide-react";
import { useStyles } from "./RightSidebar.styles";
// import { useFarmStore } from "src/shared/store";
import { Robot } from "src/types";
import { ProgressBar } from "./ProgressBar";

interface RobotDetailsProps {
  robot: Robot;
}

export const RobotDetails = ({ robot }: RobotDetailsProps) => {
  const classes = useStyles();
  // const { returnRobotToBase, addActivityLog } = useFarmStore();

  // const handleReturnToBase = (): void => {
  //   returnRobotToBase(robot.id);
  //   addActivityLog({
  //     action: "Return Initiated",
  //     details: `${robot.id} returning to base`,
  //     entityType: "robot",
  //     entityId: robot.id,
  //   });
  // };

  // const statusConfig = getRobotStatusConfig(robot.status);

  return (
    <Box className={classes.detailsContainer}>
      {/* Stats */}
      <Box className={classes.statsContainer}>
        <Paper className={classes.glassCard}>
          <ProgressBar value={robot.battery} label="Battery" />

          {robot.currentMission && (
            <>
              <Divider className={classes.divider} />
              <Box>
                <Typography variant="caption" className={classes.cardTitle}>
                  Current Mission
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  className={classes.missionText}
                >
                  {robot.currentMission}
                </Typography>
              </Box>
            </>
          )}
        </Paper>

        <Paper className={classes.glassCard}>
          <Typography variant="caption" className={classes.cardTitle}>
            Position
          </Typography>
          <Typography variant="body2" className={classes.positionText}>
            X: {robot.position.x.toFixed(1)} | Z: {robot.position.z.toFixed(1)}
          </Typography>
        </Paper>
      </Box>

      {/* Actions */}
      {/* <Box className={classes.actionsContainer}>
        <Typography variant="caption" className={classes.actionsTitle}>
          Actions
        </Typography>
        <Box className={classes.actionButtons}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<BotIcon size={18} strokeWidth={2.5} />}
            onClick={handleReturnToBase}
            disabled={robot.status === "returning" || robot.status === "idle"}
          >
            Return to Base
          </Button>
        </Box>
      </Box> */}
    </Box>
  );
};
