import { alpha, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const useLeftSidebarStyles = makeStyles((theme:Theme) => ({
  mainContainer: {
    position: "fixed",
    top: 16,
    left: 16,
    width: 320,
    zIndex: 10,
    height: "calc(100vh - 64px)",
    overflow: "hidden",
    borderRadius: 8,
  },

  paper: {
    height: "100%",
    background:
      "linear-gradient(180deg, rgb(137 145 166 / 70%) 0%, rgb(74 90 106) 50%, rgba(66, 89, 129, 0.9) 100%) !important",
    backdropFilter: "blur(40px) saturate(180%) !important",
    WebkitBackdropFilter: "blur(40px) saturate(180%) !important",
    border: "1px solid rgba(147, 197, 253, 0.35) !important",
    boxShadow:
      "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 1px rgba(147, 197, 253, 0.2) !important",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: 8,
  },

  headerContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },

  headerAvatar: {
    width: 56,
    height: 56,
    background: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 50%, #06b6d4 100%)",
    boxShadow:
      "0 12px 32px rgba(59, 130, 246, 0.5), 0 0 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(147, 197, 253, 0.3)",
  },

  headerTitle: {
    fontWeight: 700,
    color: "white",
    letterSpacing: "-0.02em",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    marginBottom: 2,
  },

  headerSubtitle: {
    color: "rgba(147, 197, 253, 0.95)",
    fontWeight: 500,
    fontSize: "0.8rem",
  },

  divider: {
    borderColor: "rgba(147, 197, 253, 0.2) !important",
    marginLeft: 20,
    marginRight: 20,
  },

  tabsContainer: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 12,
    paddingTop: 12,
  },

  tabsWrapper: {
    minHeight: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1) !important",
    border: "1px solid rgba(147, 197, 253, 0.2) !important",
    borderRadius: 10,
    padding: 3,
    boxShadow:
      "inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 2px 6px rgba(59, 130, 246, 0.06) !important",
    "& .MuiTabs-indicator": {
      display: "none",
    },
    "& .MuiTabs-flexContainer": {
      gap: 4,
    },
  },

  tab: {
    flex: 1,
    minWidth: 0,
    minHeight: 34,
    maxWidth: "none",
    padding: "6px 8px",
    borderRadius: 8,
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.8rem !important",
    letterSpacing: "0.01em",
    color: "rgba(255, 255, 255, 0.55) !important",
    transition: "all 0.2s ease !important",
    "&:hover": {
      color: "rgba(255, 255, 255, 0.85) !important",
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    "&.Mui-selected": {
      color: "white !important",
      backgroundColor: theme?.palette?.primary?.main,
      boxShadow:
        "0 2px 6px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important",
    },
  },

  contentContainer: {
    flex: 1,
    overflowY: "auto",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    "&::-webkit-scrollbar": {
      width: 5,
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: 12,
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(147, 197, 253, 0.3) !important",
      borderRadius: 12,
      "&:hover": {
        background: "rgba(147, 197, 253, 0.5) !important",
      },
    },
  },

  statsCard: {
    background:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 197, 253, 0.08) 100%) !important",
    backdropFilter: "blur(24px) !important",
    WebkitBackdropFilter: "blur(24px) !important",
    border: "1px solid rgba(147, 197, 253, 0.35) !important",
    overflow: "hidden",
    boxShadow:
      "0 8px 24px rgba(59, 130, 246, 0.2), 0 0 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important",
  },

  statsCardContent: {
    display: "flex",
    alignItems: "stretch",
    position: "relative",
  },

  statsBox: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  verticalDivider: {
    borderColor: "rgba(147, 197, 253, 0.2) !important",
    marginTop: 16,
    marginBottom: 16,
  },

  statLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.9rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  statValue: {
    fontWeight: 700,
    color: "white",
    letterSpacing: "-0.03em",
    fontSize: "2.5rem",
  },

  healthyStatValue: {
    textShadow: "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 197, 94, 0.4)",
  },

  robotStatValue: {
    textShadow: "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(147, 197, 253, 0.5)",
  },

  tempStatValue: {
    fontSize: "2.1rem",
    textShadow: "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(249, 115, 22, 0.5)",
  },

  healthCardContent: {
    padding: 8,
    background:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%)",
    borderRadius: 4,
    border: "1px solid rgba(147, 197, 253, 0.35)",
  },

  healthCircleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
  },

  healthCircle: {
    position: "relative",
    width: 140,
    height: 140,
  },

  healthCircleSvg: {
    transform: "rotate(-90deg)",
    background: "transparent",
  },

  healthCircleCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  healthCircleTitle: {
    fontWeight: 700,
    color: "white",
    letterSpacing: "-0.03em",
    textShadow: "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 24px rgba(34, 211, 238, 0.6)",
    fontSize: "2.5rem",
  },

  healthCircleLabel: {
    color: "rgba(147, 197, 253, 0.95)",
    fontWeight: 600,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginTop: 4,
  },

  statusDotHealthy: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    boxShadow: "0 0 12px rgba(34, 197, 94, 0.8), 0 0 24px rgba(34, 197, 94, 0.4)",
  },

  statusDotWarning: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
    boxShadow: "0 0 12px rgba(245, 158, 11, 0.8), 0 0 24px rgba(245, 158, 11, 0.4) !important",
  },

  statusDotCritical: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    boxShadow: "0 0 12px rgba(239, 68, 68, 0.8), 0 0 24px rgba(239, 68, 68, 0.4) !important",
  },

  robotFleetLabel: {
    color: "rgba(147, 197, 253, 0.8)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: 600,
    fontSize: "0.7rem",
    display: "block",
    marginBottom: 12,
    marginLeft: 4,
  },

  robotCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08) !important",
    backdropFilter: "blur(16px) !important",
    WebkitBackdropFilter: "blur(16px) !important",
    border: "1px solid rgba(147, 197, 253, 0.3) !important",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow:
      "0 4px 16px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15) !important",
      boxShadow:
        "0 8px 24px rgba(59, 130, 246, 0.35), 0 0 32px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important",
      borderColor: "rgba(147, 197, 253, 0.5) !important",
      transform: "translateY(-2px)",
    },
  },

  robotCardContent: {
    padding: "12px !important",
    "&:last-child": { paddingBottom: 12 },
  },

  robotAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#3dc0fe",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 12px rgba(59, 130, 246, 0.6), 0 0 24px rgba(59, 130, 246, 0.3)",
  },

  robotLabel: {
    color: "white",
    fontWeight: 600,
  },

  robotStatus: {
    color: "rgba(147, 197, 253, 0.8)",
    fontWeight: 500,
  },

  robotBatteryDotHealthy: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    boxShadow: "0 0 6px rgba(34, 197, 94, 0.6)",
  },

  robotBatteryDotWarning: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
    boxShadow: "0 0 6px rgba(245, 158, 11, 0.6)",
  },

  robotBatteryDotCritical: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    boxShadow: "0 0 6px rgba(239, 68, 68, 0.6)",
  },

  treeCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08) !important",
    backdropFilter: "blur(16px) !important",
    WebkitBackdropFilter: "blur(16px) !important",
    border: "1px solid rgba(147, 197, 253, 0.2) !important",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15) !important",
      boxShadow: "0 4px 16px rgba(59, 130, 246, 0.15) !important",
      borderColor: "rgba(147, 197, 253, 0.4) !important",
    },
  },

  treeCardSelected: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  },

  treeCardContent: {
    padding: "12px !important",
    "&:last-child": { paddingBottom: "12px !important" },
  },

  treePalmAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 8px rgba(59, 130, 246, 0.3)",
  },

  treePalmAvatarSelected: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    boxShadow: "0 0 8px rgba(34, 197, 94, 0.4)",
  },

  treeLabel: {
    color: "white",
    fontWeight: 600,
  },

  treeVariety: {
    color: "rgba(147, 197, 253, 0.8)",
    fontWeight: 500,
  },

  treeStatusDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },

  treeStatusDotHealthy: {
    backgroundColor: "#10b981",
    boxShadow: "0 0 10px rgba(16, 185, 129, 0.8)",
  },

  treeStatusDotWarning: {
    backgroundColor: "#f59e0b",
    boxShadow: "0 0 10px rgba(245, 158, 11, 0.8)",
  },

  treeStatusDotCritical: {
    backgroundColor: "#ef4444",
    boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
  },

   // Activity Section
  activitySection: {
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    paddingTop: theme.spacing(2.5),
    marginTop: theme.spacing(1),
  },

  activityTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    fontSize: "0.7rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1.5),
    display: "block",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    margin: `${theme.spacing(2)} 0`,
    padding: `${theme.spacing(1.5)} ${theme.spacing(1)}`,
    backgroundColor: alpha(theme.palette.common.white, 0.03),
    minHeight: 150,
    gap: theme.spacing(1),
    maxHeight: 200,
    borderRadius: 16,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: 6,
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: alpha(theme.palette.common.white, 0.15),
      borderRadius: 3,
      "&:hover": {
        background: alpha(theme.palette.common.white, 0.25),
      },
    },
  },

  activityItem: {
    padding: theme.spacing(1.5),
    borderRadius: 16,
    backgroundColor: alpha(theme.palette.common.white, 0.06),
    backdropFilter: "blur(32px) saturate(200%) brightness(120%)",
    WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(120%)",
    border: `1.2px solid ${alpha(theme.palette.common.white, 0.2)}`,
    boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.12)}, inset 0 1px 6px ${alpha(theme.palette.common.white, 0.1)}, inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.08)}`,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      borderColor: alpha(theme.palette.common.white, 0.3),
      boxShadow: `0 6px 24px ${alpha(theme.palette.common.black, 0.15)}, inset 0 1px 8px ${alpha(theme.palette.common.white, 0.12)}, inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.12)}`,
    },
  },

  activityHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(0.5),
  },

  activityAction: {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: "0.8125rem",
  },
}));
