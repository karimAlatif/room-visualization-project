import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { Bot } from "lucide-react";
import { useLeftSidebarStyles } from "./LeftSidebar.styles";

interface Robot {
  id: string;
  status: string;
  battery: number;
}

interface RobotFleetProps {
  robots: Robot[];
}

const RobotCard: React.FC<{ robot: Robot }> = ({ robot }) => {
  const classes = useLeftSidebarStyles();

  const getBatteryDotClass = () => {
    if (robot.battery > 50) return classes.robotBatteryDotHealthy;
    if (robot.battery > 20) return classes.robotBatteryDotWarning;
    return classes.robotBatteryDotCritical;
  };

  return (
    <Card className={classes.robotCard}>
      <CardContent className={classes.robotCardContent}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box className={classes.robotAvatar}>
              <Bot size={16} color="white" strokeWidth={2} />
            </Box>
            <Typography variant="body2" className={classes.robotLabel}>
              {robot.id}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="caption" className={classes.robotStatus}>
              {robot.status}
            </Typography>
            <Box className={getBatteryDotClass()} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const RobotFleet: React.FC<RobotFleetProps> = ({ robots }) => {
  const classes = useLeftSidebarStyles();

  return (
    <Box>
      <Typography variant="caption" className={classes.robotFleetLabel}>
        ROBOT FLEET
      </Typography>
      <Stack spacing={1.5}>
        {robots.map((robot) => (
          <RobotCard key={robot.id} robot={robot} />
        ))}
      </Stack>
    </Box>
  );
};
