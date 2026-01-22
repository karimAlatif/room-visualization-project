import React, { useCallback } from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { Zap as BotIcon } from "lucide-react";
import { useStyles } from "./RightSidebar.styles";
import { useFarmStore } from "src/shared/store";
import { Robot } from "src/types";
import { ProgressBar } from "./ProgressBar";

interface RobotDetailsProps {
  robot: Robot;
}

export const RobotDetails = ({ robot }: RobotDetailsProps) => {
  const classes = useStyles();
  const { addActivityLog, studioSceneMethods } = useFarmStore();

  // const handleReturnToBase = (): void => {
  //   returnRobotToBase(robot.id);
  //   addActivityLog({
  //     action: "Return Initiated",
  //     details: `${robot.id} returning to base`,
  //     entityType: "robot",
  //     entityId: robot.id,
  //   });
  // };

  const handleOnFarmTour = useCallback((): void => {
    if (!studioSceneMethods) {
      return;
    }
    addActivityLog({
      action: `FARM TOUR`,
      details: `${robot.id} starting farm tour`,
      entityType: "robot",
      entityId: robot.id,
    });
    studioSceneMethods.startRobotFarmTour(robot.id).then(() => {
      addActivityLog({
        action: `FARM TOUR`,
        details: `${robot.id} end from farm tour`,
        entityType: "robot",
        entityId: robot.id,
      });
    });
  }, [addActivityLog, robot, studioSceneMethods]);

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
      <Box className={classes.actionsContainer}>
        <Typography variant="caption" className={classes.actionsTitle}>
          Actions
        </Typography>
        <Box className={classes.actionButtons}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<BotIcon size={18} strokeWidth={2.5} />}
            onClick={handleOnFarmTour}
            disabled={robot.status === "returning"}
          >
            Take farm tour
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
