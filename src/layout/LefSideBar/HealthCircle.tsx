import React from "react";
import { Box, CardContent, Stack, Typography } from "@mui/material";
import { useLeftSidebarStyles } from "./LeftSidebar.styles";

interface HealthCircleProps {
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  totalPalms: number;
}

export const HealthCircle: React.FC<HealthCircleProps> = ({
  healthyCount,
  warningCount,
  criticalCount,
  totalPalms,
}) => {
  const classes = useLeftSidebarStyles();

  const healthyRatio = totalPalms > 0 ? healthyCount / totalPalms : 0;
  const circumference = 263.9;

  return (
    <CardContent className={classes.healthCardContent}>
      <Box className={classes.healthCircleContainer}>
        <Box className={classes.healthCircle}>
          <svg
            width="140"
            height="140"
            viewBox="0 0 100 100"
            className={classes.healthCircleSvg}
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(147, 197, 253, 0.2)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#healthGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${healthyRatio * circumference} ${circumference}`}
            />
            <defs>
              <linearGradient
                id="healthGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e3a5f" />
              </linearGradient>
            </defs>
          </svg>
          <Box className={classes.healthCircleCenter}>
            <Typography variant="h3" className={classes.healthCircleTitle}>
              {healthyCount}
            </Typography>
            <Typography variant="body2" className={classes.healthCircleLabel}>
              Healthy
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Status Breakdown */}
      <Stack direction="row" spacing={2.5} justifyContent="center" gap={0.5}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box className={classes.statusDotHealthy} />
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            {healthyCount}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box className={classes.statusDotWarning} />
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            {warningCount}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box className={classes.statusDotCritical} />
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            {criticalCount}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box className={classes.statusDotWarning} />
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            {warningCount}
          </Typography>
        </Stack>
      </Stack>
    </CardContent>
  );
};
