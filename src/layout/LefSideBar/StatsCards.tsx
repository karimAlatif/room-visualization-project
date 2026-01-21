import React from "react";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { Bot, TreePalm, Thermometer } from "lucide-react";
import { useLeftSidebarStyles } from "./LeftSidebar.styles";

interface StatsCardsProps {
  palmsCount: number;
  activeRobots: number;
  totalRobots: number;
  healthyPercent: number;
  temperature: number;
}

const StatBox: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  variant?: "default" | "healthy" | "robot" | "temp";
}> = ({ icon, label, value, variant = "default" }) => {
  const classes = useLeftSidebarStyles();

  const getStatValueClass = () => {
    switch (variant) {
      case "healthy":
        return `${classes.statValue} ${classes.healthyStatValue}`;
      case "robot":
        return `${classes.statValue} ${classes.robotStatValue}`;
      case "temp":
        return `${classes.statValue} ${classes.tempStatValue}`;
      default:
        return classes.statValue;
    }
  };

  return (
    <Box className={classes.statsBox}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        mb={0.5}
        justifyContent="center"
      >
        {icon}
        <Typography variant="body2" className={classes.statLabel}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="h3" className={getStatValueClass()}>
        {value}
      </Typography>
    </Box>
  );
};

export const StatsCards: React.FC<StatsCardsProps> = ({
  palmsCount,
  activeRobots,
  totalRobots,
  healthyPercent,
  temperature,
}) => {
  const classes = useLeftSidebarStyles();

  return (
    <Stack spacing={2}>
      {/* Trees vs Robots Card */}
      <Card className={classes.statsCard}>
        <Box className={classes.statsCardContent}>
          <StatBox
            icon={
              <TreePalm
                size={18}
                color="#22c55e"
                strokeWidth={2}
                style={{
                  filter: "drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))",
                }}
              />
            }
            label="Trees"
            value={String(palmsCount)}
          />
          <Divider orientation="vertical" className={classes.verticalDivider} />
          <StatBox
            icon={
              <Bot
                size={18}
                color="#93c5fd"
                strokeWidth={2}
                style={{
                  filter: "drop-shadow(0 0 4px rgba(147, 197, 253, 0.5))",
                }}
              />
            }
            label="Robots"
            value={`${activeRobots}/${totalRobots}`}
            variant="robot"
          />
        </Box>
      </Card>

      {/* Health & Temp Card */}
      <Card className={classes.statsCard}>
        <Box className={classes.statsCardContent}>
          <StatBox
            icon={
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  boxShadow: "0 0 8px rgba(34, 197, 94, 0.7)",
                }}
              />
            }
            label="Healthy"
            value={`${healthyPercent}%`}
            variant="healthy"
          />
          <Divider orientation="vertical" className={classes.verticalDivider} />
          <StatBox
            icon={
              <Thermometer
                size={16}
                color="#f97316"
                strokeWidth={2}
                style={{
                  filter: "drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))",
                }}
              />
            }
            label="Temp"
            value={`${temperature}°C`}
            variant="temp"
          />
        </Box>
      </Card>
    </Stack>
  );
};
