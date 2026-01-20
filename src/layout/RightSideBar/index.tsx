import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  LinearProgress,
  Chip,
  Paper,
  Divider,
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
  TreePine as PalmIcon,
  Clock as HarvestIcon,
  AlertTriangle as PestIcon,
} from "lucide-react";
// import { useFarmStore, Palm, Robot } from "@/store/farmStore";
import { useStyles } from "./RightSidebar.styles";
import { useFarmStore } from "src/shared/store";
import { Palm, Robot } from "src/types";

interface ProgressBarProps {
  value: number;
  label: string;
  variant?: "default" | "healthy" | "warning" | "critical";
  icon?: React.ReactNode;
}

interface PalmDetailsProps {
  palm: Palm;
}

interface RobotDetailsProps {
  robot: Robot;
}

const ProgressBar = ({
  value,
  label,
  variant = "default",
  icon,
}: ProgressBarProps) => {
  const classes = useStyles();

  const getColor = (): "primary" | "success" | "warning" | "error" => {
    if (variant === "healthy") return "success";
    if (variant === "warning") return "warning";
    if (variant === "critical") return "error";
    return "primary";
  };

  return (
    <Box className={classes.progressContainer}>
      <Box className={classes.progressHeader}>
        <Box className={classes.progressLabelWrapper}>
          {icon && <span className={classes.progressIcon}>{icon}</span>}
          <Typography variant="caption" className={classes.progressLabel}>
            {label}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          className={classes.progressValue}
          style={{ color: `var(--progress-color-${getColor()})` }}
        >
          {value}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        color={getColor()}
        className={`${classes.progressBar} ${classes[`progressBar-${variant}`]}`}
      />
    </Box>
  );
};

const PalmDetails = ({ palm }: PalmDetailsProps) => {
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

  // const handleRequestDrone = (): void => {
  //   addActivityLog({
  //     action: "Drone Requested",
  //     details: `Aerial inspection requested for ${palm.id}`,
  //     entityType: "palm",
  //     entityId: palm.id,
  //   });
  // };

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

const RobotDetails = ({ robot }: RobotDetailsProps) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { returnRobotToBase, addActivityLog } = useFarmStore();

  const handleReturnToBase = (): void => {
    returnRobotToBase(robot.id);
    addActivityLog({
      action: "Return Initiated",
      details: `${robot.id} returning to base`,
      entityType: "robot",
      entityId: robot.id,
    });
  };

  const getStatusConfig = (
    status: Robot["status"],
  ): { label: string; color: "default" | "info" | "secondary" | "warning" } => {
    const configs = {
      idle: { label: "Idle", color: "default" as const },
      moving: { label: "Moving", color: "info" as const },
      scanning: { label: "Scanning", color: "secondary" as const },
      returning: { label: "Returning", color: "warning" as const },
    };
    return configs[status] || configs.idle;
  };

  const statusConfig = getStatusConfig(robot.status);

  return (
    <Box className={classes.detailsContainer}>
      {/* Header */}
      <Box className={classes.header}>
        <Box>
          <Typography variant="h6" className={classes.title}>
            {robot.id}
          </Typography>
          <Typography variant="body2" className={classes.subtitle}>
            Patrol Unit
          </Typography>
        </Box>
        <Chip
          label={statusConfig.label}
          color={statusConfig.color}
          size="small"
        />
      </Box>

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
            onClick={handleReturnToBase}
            disabled={robot.status === "returning" || robot.status === "idle"}
          >
            Return to Base
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const RightPanel = () => {
  const { selectedRobotId, palms, robots, activityLogs } = useFarmStore();
  const theme = useTheme();
  console.log("theme theme theme", theme);
  const classes = useStyles();

  const selectedPalm = palms[0];
  const selectedRobot = robots.find((r) => r.id === selectedRobotId);

  const hasSelection = selectedPalm || selectedRobot;

  const getStatusConfig = (
    status: Palm["status"],
  ): { label: string; color: "success" | "warning" | "error" } => {
    const configs = {
      healthy: { label: "Healthy", color: "success" as const },
      warning: { label: "Warning", color: "warning" as const },
      critical: { label: "Critical", color: "error" as const },
    };
    return configs[status] || configs.healthy;
  };

  const statusConfig = getStatusConfig(selectedPalm && selectedPalm.status);

  if (!hasSelection) {
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
  }

  return (
    <Box className={classes.panelWithSelection}>
      {/* Header with close button */}
      <Box className={classes.panelHeader}>
        {selectedPalm && (
          <Box className={classes.headerWithIcon}>
            <Box className={classes.headerIconWrapper}>
              <PalmIcon
                size={32}
                strokeWidth={2}
                className={classes.headerIcon}
              />
            </Box>
            <Box className={classes.headerContent}>
              <Typography variant="h6" className={classes.title}>
                {selectedPalm.id}
              </Typography>
              <Typography variant="body2" className={classes.subtitle}>
                {selectedPalm.variety}
              </Typography>
            </Box>
            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              className={classes.statusChip}
            />
          </Box>
        )}

        <IconButton
          size="small"
          onClick={() => {
            // selectPalm(null);
            // selectRobot(null);
          }}
        >
          <CloseIcon size={20} color="white" strokeWidth={2.5} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box className={classes.panelContent}>
        {selectedPalm && <PalmDetails palm={selectedPalm} />}
        {selectedRobot && <RobotDetails robot={selectedRobot} />}
      </Box>
    </Box>
  );
};
