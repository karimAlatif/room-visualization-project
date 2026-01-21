import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import {
  X as CloseIcon,
  Calendar as CalendarIcon,
  Zap as BotIcon,
  Send as SendIcon,
  FileText as DescriptionIcon,
  Droplets as HydrationIcon,
  Leaf as NutrientIcon,
  Clock as HarvestIcon,
  AlertTriangle as PestIcon,
} from "lucide-react";
import { useStyles } from "./RightSidebar.styles";
import { useFarmStore } from "src/shared/store";
import { Palm } from "src/types";
import { ProgressBar } from "./ProgressBar";

interface PalmDetailsProps {
  palm: Palm;
}

export const PalmDetails = ({ palm }: PalmDetailsProps) => {
  const [showRobotSelect, setShowRobotSelect] = useState<boolean>(false);
  const { robots, assignRobotToPalm, addActivityLog } = useFarmStore();
  const classes = useStyles();
  const theme = useTheme();

  const availableRobots = robots.filter(
    (r) => r.status === "idle" && r.battery > 20,
  );

  const handleSendRobot = (robotId: string): void => {
    assignRobotToPalm(robotId, palm.id);
    setShowRobotSelect(false);
  };

  const handleLogActivity = (): void => {
    addActivityLog({
      action: "Manual Inspection",
      details: `Manual inspection logged for ${palm.id}`,
      entityType: "palm",
      entityId: palm.id,
    });
  };

  return (
    <Box className={classes.detailsContainer}>
      {/* Stats */}
      <Box className={classes.statsContainer}>
        <Paper className={classes.glassCard}>
          <ProgressBar
            value={palm.hydration}
            label="Hydration"
            icon={
              <HydrationIcon
                size={18}
                strokeWidth={2.5}
                color={theme.palette.primary.main}
              />
            }
            variant={
              palm.hydration > 70
                ? "healthy"
                : palm.hydration > 40
                  ? "warning"
                  : "critical"
            }
          />
        </Paper>

        <Paper className={classes.glassCard}>
          <ProgressBar
            value={palm.nutrientLevel}
            label="Nutrients"
            icon={
              <NutrientIcon
                size={18}
                strokeWidth={2.5}
                color={theme.palette.secondary.main}
              />
            }
            variant={
              palm.nutrientLevel > 70
                ? "healthy"
                : palm.nutrientLevel > 40
                  ? "warning"
                  : "critical"
            }
          />
        </Paper>

        <Paper className={classes.glassCard}>
          <Box className={classes.cardHeader}>
            <CalendarIcon
              size={16}
              strokeWidth={2.5}
              className={classes.icon}
            />
            <Typography variant="caption" className={classes.cardTitle}>
              Schedule & Risk
            </Typography>
          </Box>

          <Box className={classes.infoGrid}>
            <Box className={classes.infoCard}>
              <HarvestIcon size={24} className={classes.infoCardIcon} />
              <Typography variant="caption" className={classes.infoLabel}>
                Est. Harvest
              </Typography>
              <Typography variant="body2" className={classes.infoValue}>
                {palm.estimatedHarvest}
              </Typography>
            </Box>

            <Box className={classes.infoDivider} />

            <Box className={classes.infoCard}>
              <PestIcon
                size={24}
                className={classes.infoCardIcon}
                style={{
                  color:
                    palm.pestProbability > 30
                      ? "#ef4444"
                      : palm.pestProbability > 10
                        ? "#f59e0b"
                        : "#10b981",
                }}
              />
              <Typography variant="caption" className={classes.infoLabel}>
                Pest Risk
              </Typography>
              <Typography
                variant="body2"
                className={classes.infoValue}
                style={{
                  color:
                    palm.pestProbability > 30
                      ? "#ef4444"
                      : palm.pestProbability > 10
                        ? "#f59e0b"
                        : "#10b981",
                }}
              >
                {palm.pestProbability}%
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Actions */}
      <Box className={classes.actionsContainer}>
        {showRobotSelect ? (
          <Paper className={classes.glassCard}>
            <Box className={classes.robotSelectHeader}>
              <Typography variant="body2">Select Robot</Typography>
              <IconButton
                size="small"
                onClick={() => setShowRobotSelect(false)}
              >
                <CloseIcon size={20} strokeWidth={2.5} />
              </IconButton>
            </Box>
            {availableRobots.length > 0 ? (
              <Box className={classes.robotList}>
                {availableRobots.map((robot) => (
                  <Button
                    key={robot.id}
                    fullWidth
                    onClick={() => handleSendRobot(robot.id)}
                    className={classes.robotButton}
                  >
                    <Box className={classes.robotButtonContent}>
                      <Box className={classes.robotInfo}>
                        <BotIcon
                          size={18}
                          strokeWidth={2.5}
                          style={{ color: "inherit" }}
                        />
                        <Typography variant="body2">{robot.id}</Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {robot.battery}%
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No robots available
              </Typography>
            )}
          </Paper>
        ) : (
          <Box className={classes.actionButtons}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SendIcon size={18} strokeWidth={2.5} />}
              onClick={() => setShowRobotSelect(true)}
              className={classes.primaryButton}
            >
              Send Robot
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DescriptionIcon size={18} strokeWidth={2.5} />}
              onClick={handleLogActivity}
              className={classes.defaultButton}
            >
              Log Activity
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
