import React, { useState } from "react";
import { Box, Paper, Tabs, Tab, Stack, Divider } from "@mui/material";
import { useFarmStore } from "src/shared/store";
import { useLeftSidebarStyles } from "./LeftSidebar.styles";
import { SidebarHeader } from "./SidebarHeader";
import { StatsCards } from "./StatsCards";
import { HealthCircle } from "./HealthCircle";
import { RobotFleet } from "./RobotFleet";
import { TreeList } from "./TreeList";

export const LeftSidebar = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "trees">("overview");
  const classes = useLeftSidebarStyles();

  const { palms, robots, temperature, selectedPalmId, selectPalm } =
    useFarmStore();

  const healthyCount = palms.filter((p) => p.status === "healthy").length;
  const warningCount = palms.filter((p) => p.status === "warning").length;
  const criticalCount = palms.filter((p) => p.status === "critical").length;
  const activeRobots = robots.filter((r) => r.status !== "idle").length;
  const healthyPercent =
    palms.length > 0 ? Math.round((healthyCount / palms.length) * 100) : 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue === 0 ? "overview" : "trees");
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
            value={activeTab === "overview" ? 0 : 1}
            onChange={handleTabChange}
            variant="fullWidth"
            className={classes.tabsWrapper}
          >
            <Tab label="Overview" className={classes.tab} />
            <Tab label="Trees" className={classes.tab} />
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
              <RobotFleet robots={robots} />
            </Stack>
          )}

          {activeTab === "trees" && (
            <TreeList
              palms={palms}
              selectedPalmId={selectedPalmId}
              onSelectPalm={selectPalm}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};
