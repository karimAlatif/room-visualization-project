import React, { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import { useFarmStore } from "src/shared/store";
import { useLeftSidebarStyles } from "./LeftSidebar.styles";
import { SidebarHeader } from "./SidebarHeader";
import { StatsCards } from "./StatsCards";
import { HealthCircle } from "./HealthCircle";
import { RobotFleet } from "./RobotFleet";
import { TreeList } from "./TreeList";

export const LeftSidebar = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "trees" | "robots">(
    "overview",
  );
  const classes = useLeftSidebarStyles();

  const {
    palms,
    robots,
    temperature,
    selectedEntity,
    activityLogs,
    selectEntity,
  } = useFarmStore();

  const healthyCount = palms.filter((p) => p.status === "healthy").length;
  const warningCount = palms.filter((p) => p.status === "warning").length;
  const criticalCount = palms.filter((p) => p.status === "critical").length;
  const activeRobots = robots.filter((r) => r.status !== "idle").length;
  const healthyPercent =
    palms.length > 0 ? Math.round((healthyCount / palms.length) * 100) : 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(
      newValue === 0 ? "overview" : newValue === 1 ? "trees" : "robots",
    );
  };

  return (
    <Box className={classes.mainContainer}>
      <Paper elevation={0} className={classes.paper}>
        {/* Header */}
        <SidebarHeader title="PalmGuard" subtitle="Observatory Mode" />

        {/* Divider */}
        <Divider className={classes.divider} />

        {/* Tabs */}
        <Box className={classes.tabsContainer}>
          <Tabs
            value={activeTab === "overview" ? 0 : activeTab === "trees" ? 1 : 2}
            onChange={handleTabChange}
            variant="fullWidth"
            className={classes.tabsWrapper}
          >
            <Tab label="Overview" className={classes.tab} />
            <Tab label="Trees" className={classes.tab} />
            <Tab label="Robots" className={classes.tab} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box className={classes.contentContainer}>
          {activeTab === "overview" && (
            <Stack spacing={2}>
              <StatsCards
                palmsCount={palms.length}
                activeRobots={activeRobots}
                totalRobots={robots.length}
                healthyPercent={healthyPercent}
                temperature={temperature}
              />
              <HealthCircle
                healthyCount={healthyCount}
                warningCount={warningCount}
                criticalCount={criticalCount}
                totalPalms={palms.length}
              />

              {/* Recent Activity */}
              {activityLogs.length > 0 && (
                <Box className={classes.activitySection}>
                  <Typography
                    variant="caption"
                    className={classes.activityTitle}
                  >
                    Recent Activity
                  </Typography>
                  <Box className={classes.activityList}>
                    {activityLogs.slice(0, 5).map((log, index) => (
                      <Paper
                        key={`activity-log-${log.id}-${index}`}
                        className={classes.activityItem}
                      >
                        <Box className={classes.activityHeader}>
                          <Typography
                            variant="caption"
                            className={classes.activityAction}
                          >
                            {log.action}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(log.timestamp).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
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
            </Stack>
          )}

          {activeTab === "trees" && (
            <TreeList
              palms={palms}
              selectedPalmId={
                selectedEntity?.type === "palm" ? selectedEntity.id : undefined
              }
              onSelectPalm={(palmId) =>
                selectEntity({ id: palmId, type: "palm" })
              }
            />
          )}

          {activeTab === "robots" && <RobotFleet robots={robots} />}
        </Box>
      </Paper>
    </Box>
  );
};
