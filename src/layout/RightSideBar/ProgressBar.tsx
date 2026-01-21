import React from "react";
import { Box, Typography } from "@mui/material";
import { LinearProgress } from "@mui/material";
import { useStyles } from "./RightSidebar.styles";

interface ProgressBarProps {
  value: number;
  label: string;
  variant?: "default" | "healthy" | "warning" | "critical";
  icon?: React.ReactNode;
}

export const ProgressBar = ({
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
