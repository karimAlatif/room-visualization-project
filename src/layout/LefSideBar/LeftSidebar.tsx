import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import { Bot, TreePalm, Thermometer } from "lucide-react";
import { useFarmStore } from "src/shared/store";

export const LeftSidebar = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "trees">("overview");
  // const classes = useLeftSidebarStyles();

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue === 0 ? "overview" : "trees");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        left: 16,
        width: 320,
        zIndex: 10,
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          background:
            "linear-gradient(180deg, rgb(137 145 166 / 70%) 0%, rgb(74 90 106) 50%, rgba(66, 89, 129, 0.9) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(147, 197, 253, 0.35)",
          boxShadow:
            "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 1px rgba(147, 197, 253, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 1,
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 50%, #06b6d4 100%)",
                boxShadow:
                  "0 12px 32px rgba(59, 130, 246, 0.5), 0 0 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(147, 197, 253, 0.3)",
              }}
            >
              <TreePalm size={28} strokeWidth={2} color="white" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  mb: 0.25,
                }}
              >
                PalmGuard
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(147, 197, 253, 0.95)",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                }}
              >
                Observatory Mode
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: "rgba(147, 197, 253, 0.2)", mx: 2.5 }} />

        {/* Tabs */}
        <Box sx={{ px: 2.5, pb: 2, pt: 2 }}>
          <Tabs
            value={activeTab === "overview" ? 0 : 1}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              minHeight: 44,
              bgcolor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(147, 197, 253, 0.25)",
              borderRadius: 3,
              p: 0.5,
              boxShadow:
                "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(59, 130, 246, 0.08)",
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab
              label="Overview"
              sx={{
                minHeight: 38,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.5)",
                transition: "all 0.25s ease",
                "&:hover": {
                  color: "rgba(255, 255, 255, 0.8)",
                },
                "&.Mui-selected": {
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  boxShadow:
                    "0 2px 8px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                },
              }}
            />
            <Tab
              label="Trees"
              sx={{
                minHeight: 38,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.5)",
                transition: "all 0.25s ease",
                "&:hover": {
                  color: "rgba(255, 255, 255, 0.8)",
                },
                "&.Mui-selected": {
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  boxShadow:
                    "0 2px 8px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2.5,
            pb: 2.5,
            "&::-webkit-scrollbar": {
              width: 5,
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(147, 197, 253, 0.3)",
              borderRadius: 3,
              "&:hover": {
                background: "rgba(147, 197, 253, 0.5)",
              },
            },
          }}
        >
          {activeTab === "overview" && (
            <Stack spacing={2}>
              {/* Stats Row 1 - Combined Card */}
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 197, 253, 0.08) 100%)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(147, 197, 253, 0.35)",
                  // borderRadius: 4,
                  overflow: "hidden",
                  boxShadow:
                    "0 8px 24px rgba(59, 130, 246, 0.2), 0 0 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "stretch",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={0.5}
                      justifyContent="center"
                    >
                      <TreePalm
                        size={18}
                        color="#22c55e"
                        strokeWidth={2}
                        style={{
                          filter: "drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Trees
                      </Typography>
                    </Stack>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        letterSpacing: "-0.03em",
                        textShadow:
                          "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 197, 94, 0.4)",
                        fontSize: "2.5rem",
                      }}
                    >
                      {palms.length}
                    </Typography>
                  </Box>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: "rgba(147, 197, 253, 0.2)",
                      my: 2,
                    }}
                  />

                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={0.5}
                      justifyContent="center"
                    >
                      <Bot
                        size={18}
                        color="#93c5fd"
                        strokeWidth={2}
                        style={{
                          filter:
                            "drop-shadow(0 0 4px rgba(147, 197, 253, 0.5))",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Robots
                      </Typography>
                    </Stack>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        letterSpacing: "-0.03em",
                        textShadow:
                          "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(147, 197, 253, 0.5)",
                        fontSize: "2.5rem",
                      }}
                    >
                      {activeRobots}/{robots.length}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Stats Row 2 - Combined Card */}
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 197, 253, 0.08) 100%)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(147, 197, 253, 0.35)",
                  overflow: "hidden",
                  boxShadow:
                    "0 8px 24px rgba(59, 130, 246, 0.2), 0 0 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "stretch",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={0.5}
                      justifyContent="center"
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "#22c55e",
                          boxShadow: "0 0 8px rgba(34, 197, 94, 0.7)",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Healthy
                      </Typography>
                    </Stack>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        letterSpacing: "-0.03em",
                        textShadow:
                          "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 197, 94, 0.5)",
                        fontSize: "2.5rem",
                      }}
                    >
                      {healthyPercent}%
                    </Typography>
                  </Box>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: "rgba(147, 197, 253, 0.2)",
                      my: 2,
                    }}
                  />

                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={0.5}
                      justifyContent="center"
                    >
                      <Thermometer
                        size={16}
                        color="#f97316"
                        strokeWidth={2}
                        style={{
                          filter:
                            "drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Temp
                      </Typography>
                    </Stack>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        letterSpacing: "-0.03em",
                        textShadow:
                          "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(249, 115, 22, 0.5)",
                        fontSize: "2.1rem",
                      }}
                    >
                      {temperature}°C
                    </Typography>
                  </Box>
                </Box>
              </Card>
              <CardContent
                sx={{
                  p: 1,
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%)",
                  borderRadius: 1,
                  border: "1px solid rgba(147, 197, 253, 0.35)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <Box sx={{ position: "relative", width: 140, height: 140 }}>
                    <svg
                      width="140"
                      height="140"
                      viewBox="0 0 100 100"
                      style={{
                        transform: "rotate(-90deg)",
                        background: "transparent",
                      }}
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
                        strokeDasharray={`${(healthyCount / palms.length) * 263.9} 263.9`}
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
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: "white",
                          letterSpacing: "-0.03em",
                          textShadow:
                            "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 24px rgba(34, 211, 238, 0.6)",
                          fontSize: "2.5rem",
                        }}
                      >
                        {healthyCount}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(147, 197, 253, 0.95)",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          mt: 0.5,
                        }}
                      >
                        Healthy
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Status breakdown */}
                <Stack
                  direction="row"
                  spacing={2.5}
                  justifyContent="center"
                  gap={0.5}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#22c55e",
                        boxShadow:
                          "0 0 12px rgba(34, 197, 94, 0.8), 0 0 24px rgba(34, 197, 94, 0.4)",
                      }}
                    />
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
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#f59e0b",
                        boxShadow:
                          "0 0 12px rgba(245, 158, 11, 0.8), 0 0 24px rgba(245, 158, 11, 0.4)",
                      }}
                    />
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
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#ef4444",
                        boxShadow:
                          "0 0 12px rgba(239, 68, 68, 0.8), 0 0 24px rgba(239, 68, 68, 0.4)",
                      }}
                    />
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
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#f5740bff",
                        boxShadow:
                          "0 0 12px rgba(245, 158, 11, 0.8), 0 0 24px rgba(245, 158, 11, 0.4)",
                      }}
                    />
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
              {/* </Card> */}

              {/* Robot Fleet */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(147, 197, 253, 0.8)",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    display: "block",
                    mb: 1.5,
                    ml: 0.5,
                  }}
                >
                  ROBOT FLEET
                </Typography>
                <Stack spacing={1.5}>
                  {robots.map((robot) => (
                    <Card
                      key={robot.id}
                      sx={{
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: "1px solid rgba(147, 197, 253, 0.3)",
                        borderRadius: 3,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow:
                          "0 4px 16px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.15)",
                          boxShadow:
                            "0 8px 24px rgba(59, 130, 246, 0.35), 0 0 32px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                          borderColor: "rgba(147, 197, 253, 0.5)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor: "#3dc0fe",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow:
                                  "0 0 12px rgba(59, 130, 246, 0.6), 0 0 24px rgba(59, 130, 246, 0.3)",
                              }}
                            >
                              <Bot size={16} color="white" strokeWidth={2} />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ color: "white", fontWeight: 600 }}
                            >
                              {robot.id}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(147, 197, 253, 0.8)",
                                fontWeight: 500,
                              }}
                            >
                              {robot.status}
                            </Typography>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor:
                                  robot.battery > 50
                                    ? "#22c55e"
                                    : robot.battery > 20
                                      ? "#f59e0b"
                                      : "#ef4444",
                                boxShadow:
                                  robot.battery > 50
                                    ? "0 0 6px rgba(34, 197, 94, 0.6)"
                                    : robot.battery > 20
                                      ? "0 0 6px rgba(245, 158, 11, 0.6)"
                                      : "0 0 6px rgba(239, 68, 68, 0.6)",
                              }}
                            />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}

          {activeTab === "trees" && (
            <Stack spacing={1.5}>
              {palms.map((palm) => (
                <Card
                  key={palm.id}
                  onClick={() => selectPalm(palm.id)}
                  sx={{
                    background:
                      selectedPalmId === palm.id
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border:
                      selectedPalmId === palm.id
                        ? "1px solid rgba(59, 130, 246, 0.4)"
                        : "1px solid rgba(147, 197, 253, 0.2)",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow:
                      selectedPalmId === palm.id
                        ? "0 4px 16px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                        : "0 2px 8px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.15)",
                      boxShadow: "0 4px 16px rgba(59, 130, 246, 0.15)",
                      borderColor: "rgba(147, 197, 253, 0.4)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor:
                              selectedPalmId === palm.id
                                ? "rgba(34, 197, 94, 0.2)"
                                : "rgba(59, 130, 246, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow:
                              selectedPalmId === palm.id
                                ? "0 0 8px rgba(34, 197, 94, 0.4)"
                                : "0 0 8px rgba(59, 130, 246, 0.3)",
                          }}
                        >
                          <TreePalm
                            size={16}
                            strokeWidth={2}
                            color={
                              selectedPalmId === palm.id ? "#22c55e" : "#93c5fd"
                            }
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          {palm.id}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(147, 197, 253, 0.8)",
                            fontWeight: 500,
                          }}
                        >
                          {palm.variety}
                        </Typography>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor:
                              palm.status === "healthy"
                                ? "#10b981"
                                : palm.status === "warning"
                                  ? "#f59e0b"
                                  : "#ef4444",
                            boxShadow:
                              palm.status === "healthy"
                                ? "0 0 10px rgba(16, 185, 129, 0.8)"
                                : palm.status === "warning"
                                  ? "0 0 10px rgba(245, 158, 11, 0.8)"
                                  : "0 0 10px rgba(239, 68, 68, 0.8)",
                          }}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
