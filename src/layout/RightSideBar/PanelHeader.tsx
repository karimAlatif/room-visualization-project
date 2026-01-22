import React, { useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { BotIcon, TreePine as PalmIcon } from "lucide-react";
import { useStyles } from "./RightSidebar.styles";
import { Entity, Palm, Robot } from "src/types";

interface PanelHeaderProps {
  selectedEntity: Entity;
}

const getRobotStatusConfig = (
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

const getPalmStatusConfig = (
  status: Palm["status"],
): { label: string; color: "success" | "warning" | "error" } => {
  const configs = {
    healthy: { label: "Healthy", color: "success" as const },
    warning: { label: "Warning", color: "warning" as const },
    critical: { label: "Critical", color: "error" as const },
  };
  return configs[status] || configs.healthy;
};

export const PanelHeader = ({ selectedEntity }: PanelHeaderProps) => {
  const classes = useStyles();

  const selectedEntityObject = useMemo(() => {
    if (selectedEntity.type === "palm") {
      return selectedEntity.entity as Palm;
    } else if (selectedEntity.type === "robot") {
      return selectedEntity.entity as Robot;
    }
    return null;
  }, [selectedEntity]);

  if (!selectedEntityObject) return null;

  console.log("Selected Entity Object:", selectedEntityObject);
  const statusConfig =
    selectedEntity.type === "palm"
      ? getPalmStatusConfig((selectedEntityObject as Palm).status)
      : getRobotStatusConfig((selectedEntityObject as Robot).status);

  return (
    <Box className={classes.headerWithIcon}>
      <Box className={classes.headerIconWrapper}>
        {selectedEntity.type === "palm" ? (
          <PalmIcon size={32} strokeWidth={2} className={classes.headerIcon} />
        ) : (
          <BotIcon size={32} strokeWidth={2} className={classes.headerIcon} />
        )}
      </Box>
      <Box className={classes.headerContent}>
        <Typography variant="h6" className={classes.title}>
          {selectedEntityObject.id}
        </Typography>
        <Typography variant="body2" className={classes.subtitle}>
          {selectedEntity.type === "palm"
            ? (selectedEntityObject as Palm).variety
            : "Patrol Unit"}
        </Typography>
      </Box>
      <Chip
        label={statusConfig.label}
        color={statusConfig.color}
        size="small"
        className={classes.statusChip}
      />
    </Box>
  );
};
