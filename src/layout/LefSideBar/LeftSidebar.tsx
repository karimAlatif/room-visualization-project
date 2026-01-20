import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useFarmStore } from "src/shared/store";
import { TreeListItem } from "shared/components/TreeListItem";
import { StatsRow } from "shared/components/StatsRow/StatsRow";
import { clsx } from "clsx";
import { useLeftSidebarStyles } from "./LeftSidebar.styles";
import {
  Park,
  SmartToy,
  Thermostat,
  FiberManualRecord,
} from "@mui/icons-material";

export const LeftSidebar = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "trees">("overview");
  const theme = useTheme();
  const classes = useLeftSidebarStyles();

  const { palms, robots, temperature, selectedPalmId, selectPalm } =
    useFarmStore();

  const healthyCount = palms.filter((p) => p.status === "healthy").length;
  const warningCount = palms.filter((p) => p.status === "warning").length;
  const criticalCount = palms.filter((p) => p.status === "critical").length;
  const unknownCount =
    palms.length - healthyCount - warningCount - criticalCount;
  const activeRobots = robots.filter((r) => r.status !== "idle").length;
  const healthyPercent =
    palms.length > 0 ? Math.round((healthyCount / palms.length) * 100) : 0;

  // Calculate donut chart segments
  const circumference = 2 * Math.PI * 42;
  const healthyDash =
    palms.length > 0 ? (healthyCount / palms.length) * circumference : 0;
  const warningDash =
    palms.length > 0 ? (warningCount / palms.length) * circumference : 0;
  const criticalDash =
    palms.length > 0 ? (criticalCount / palms.length) * circumference : 0;
  const unknownDash =
    palms.length > 0 ? (unknownCount / palms.length) * circumference : 0;

  return (
    <Box className={`${classes.sidebar} ${classes.sidebarExpanded}`}>
      {/* Header - PalmGuard */}
      <Box className={classes.header}>
        <Box className={`${classes.headerTitle}`}>
          <Box className={classes.headerIcon}>
            <Park />
          </Box>
          <Box>
            <Typography className={classes.titleText}>PalmGuard</Typography>
            <Typography className={classes.subtitleText}>
              Observatory Mode
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs - Overview | Trees */}
      <Box className={`${classes.tabsContainer}`}>
        <button
          onClick={() => setActiveTab("overview")}
          className={clsx(
            classes.tabButton,
            activeTab === "overview" && classes.tabButtonActive,
          )}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("trees")}
          className={clsx(
            classes.tabButton,
            activeTab === "trees" && classes.tabButtonActive,
          )}
        >
          Trees
        </button>
      </Box>

      {/* Tab Content */}
      <Box className={`${classes.tabContent} `}>
        {activeTab === "overview" && (
          <>
            {/* Stats Row 1: Trees | Robots - Combined Card */}
            <StatsRow
              leftStat={{
                icon: <Park />,
                label: "Trees",
                value: palms.length,
              }}
              rightStat={{
                icon: <SmartToy />,
                label: "Robots",
                value: `${activeRobots}/${robots.length}`,
              }}
            />

            {/* Stats Row 2: Healthy | Temp - Combined Card */}
            <StatsRow
              leftStat={{
                icon: <FiberManualRecord />,
                label: "Healthy",
                value: `${healthyPercent}%`,
                iconClassName: classes.statIconHealthy,
              }}
              rightStat={{
                icon: <Thermostat />,
                label: "Temp",
                value: `${temperature}°C`,
                iconClassName: classes.statIconTemp,
              }}
            />

            {/* Donut Chart */}
            <Box className={classes.donutSection}>
              <Box className={classes.donutWrapper}>
                <svg width="140" height="140" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={theme.palette.divider}
                    strokeWidth="10"
                    opacity={0.3}
                  />
                  {palms.length > 0 && (
                    <>
                      {/* Healthy - Green */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={theme.palette.success.main}
                        strokeWidth="10"
                        strokeDasharray={`${healthyDash} ${circumference}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      {/* Warning - Yellow */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={theme.palette.warning.main}
                        strokeWidth="10"
                        strokeDasharray={`${warningDash} ${circumference}`}
                        strokeDashoffset={`${-healthyDash}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      {/* Critical - Red */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={theme.palette.error.main}
                        strokeWidth="10"
                        strokeDasharray={`${criticalDash} ${circumference}`}
                        strokeDashoffset={`${-(healthyDash + warningDash)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      {/* Unknown - Blue */}
                      {unknownCount > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={theme.palette.info.main}
                          strokeWidth="10"
                          strokeDasharray={`${unknownDash} ${circumference}`}
                          strokeDashoffset={`${-(healthyDash + warningDash + criticalDash)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      )}
                    </>
                  )}
                </svg>
                <Box className={classes.donutCenter}>
                  <Typography className={classes.donutCenterValue}>
                    {healthyCount}
                  </Typography>
                  <Typography className={classes.donutCenterLabel}>
                    Healthy
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Status Legend - Horizontal */}
            <Box className={classes.statusLegend}>
              <Box className={classes.legendItem}>
                <Box
                  className={`${classes.legendDot} ${classes.legendDotHealthy}`}
                />
                <Typography className={classes.legendValue}>
                  {healthyCount}
                </Typography>
              </Box>
              <Box className={classes.legendItem}>
                <Box
                  className={`${classes.legendDot} ${classes.legendDotWarning}`}
                />
                <Typography className={classes.legendValue}>
                  {warningCount}
                </Typography>
              </Box>
              <Box className={classes.legendItem}>
                <Box
                  className={`${classes.legendDot} ${classes.legendDotCritical}`}
                />
                <Typography className={classes.legendValue}>
                  {criticalCount}
                </Typography>
              </Box>
              <Box className={classes.legendItem}>
                <Box
                  className={`${classes.legendDot} ${classes.legendDotUnknown}`}
                />
                <Typography className={classes.legendValue}>
                  {unknownCount > 0 ? unknownCount : palms.length}
                </Typography>
              </Box>
            </Box>

            {/* Robot Fleet Section */}
            <Box className={classes.robotFleetSection}>
              <Typography className={classes.robotFleetTitle}>
                ROBOT FLEET
              </Typography>
              <Box className={classes.robotList}>
                {robots.map((robot) => (
                  <Box key={robot.id} className={classes.robotItem}>
                    <Box className={classes.robotInfo}>
                      <SmartToy className={classes.robotIcon} />
                      <Typography className={classes.robotName}>
                        {robot.id}
                      </Typography>
                    </Box>
                    <Box className={classes.robotStatus}>
                      <Typography className={classes.robotStatusText}>
                        {robot.status === "idle" ? "idle" : robot.status}
                      </Typography>
                      <Box
                        className={`${classes.robotStatusBar} ${
                          robot.status === "idle"
                            ? classes.robotStatusIdle
                            : robot.status === "moving"
                              ? classes.robotStatusWorking
                              : classes.robotStatusCharging
                        }`}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}

        {activeTab === "trees" && (
          <Box className={classes.treesSection}>
            <Box className={classes.treesList}>
              {palms.length > 0 ? (
                palms.map((palm) => (
                  <TreeListItem
                    key={palm.id}
                    palm={palm}
                    isSelected={selectedPalmId === palm.id}
                    onClick={() => selectPalm(palm.id)}
                  />
                ))
              ) : (
                <Box className={classes.emptyState}>
                  <Park className={classes.emptyStateIcon} />
                  <Typography>No trees available</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
