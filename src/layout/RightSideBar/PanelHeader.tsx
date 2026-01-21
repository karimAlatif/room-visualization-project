import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { TreePine as PalmIcon } from "lucide-react";
import { useStyles } from "./RightSidebar.styles";
import { Palm } from "src/types";

interface PanelHeaderProps {
  palm?: Palm | null;
}

export const PanelHeader = ({ palm }: PanelHeaderProps) => {
  const classes = useStyles();

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

  const statusConfig = palm
    ? getStatusConfig(palm.status)
    : { label: "", color: "success" as const };

  if (!palm) return null;

  return (
    <Box className={classes.headerWithIcon}>
      <Box className={classes.headerIconWrapper}>
        <PalmIcon size={32} strokeWidth={2} className={classes.headerIcon} />
      </Box>
      <Box className={classes.headerContent}>
        <Typography variant="h6" className={classes.title}>
          {palm.id}
        </Typography>
        <Typography variant="body2" className={classes.subtitle}>
          {palm.variety}
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
