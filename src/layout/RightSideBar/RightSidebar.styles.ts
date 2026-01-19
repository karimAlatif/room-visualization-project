import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

export const useStyles = makeStyles((theme: Theme) => ({
  // Main Panel Styles
  panel: {
    width: 320,
    height: "100%",
    backgroundColor: theme.palette?.background?.paper || "#1a1a1a",
    borderLeft: `1px solid ${theme.palette?.divider || "rgba(255, 255, 255, 0.1)"}`,
    padding: theme?.spacing(3) || 0,
    display: "flex",
    flexDirection: "column",
  },

  panelWithSelection: {
    width: 320,
    height: "100%",
    backgroundColor: theme.palette?.background?.paper || "#1a1a1a",
    borderLeft: `1px solid ${theme.palette?.divider || "rgba(255, 255, 255, 0.1)"}`,
    display: "flex",
    flexDirection: "column",
    animation: "$slideInRight 0.3s ease-out",
  },

  "@keyframes slideInRight": {
    from: {
      transform: "translateX(100%)",
      opacity: 0,
    },
    to: {
      transform: "translateX(0)",
      opacity: 1,
    },
  },

  "@keyframes fadeIn": {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },

  // Panel Header
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette?.divider || "rgba(255, 255, 255, 0.1)"}`,
  },

  panelHeaderTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
    color: theme.palette?.text?.secondary || "#a0a0a0",
  },

  // Panel Content
  panelContent: {
    flex: 1,
    overflowY: "auto",
    padding: theme.spacing(2),
    "&::-webkit-scrollbar": {
      width: 6,
    },
    "&::-webkit-scrollbar-track": {
      background: theme.palette?.background?.default || "#0a0a0a",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette?.action?.disabled || "rgba(255, 255, 255, 0.3)",
      borderRadius: 3,
      "&:hover": {
        background:
          theme.palette?.action?.selected || "rgba(255, 255, 255, 0.1)",
      },
    },
  },

  // Empty State
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor:
      theme.palette?.action?.hover || "rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },

  emptyIconSvg: {
    width: 32,
    height: 32,
    color: theme.palette?.text?.disabled || "#666",
  },

  emptyTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },

  emptyDescription: {
    color: theme.palette?.text?.secondary || "#a0a0a0",
  },

  // Details Container
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    animation: "$fadeIn 0.3s ease-out",
  },

  // Header Section
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "monospace",
    fontWeight: 700,
  },

  subtitle: {
    color: theme.palette?.text?.secondary || "#a0a0a0",
  },

  statusChip: {
    fontWeight: 500,
  },

  // Stats Container
  statsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },

  // Glass Card Effect
  glassCard: {
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette?.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${theme.palette?.divider || "rgba(255, 255, 255, 0.1)"}`,
    borderRadius: theme.shape?.borderRadius || 8,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },

  // Card Header
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: theme.palette?.text?.secondary || "#a0a0a0",
    marginBottom: theme.spacing(1),
  },

  cardTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },

  icon: {
    width: 16,
    height: 16,
  },

  // Progress Bar
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressLabel: {
    color: theme.palette?.text?.secondary || "#a0a0a0",
  },

  progressValue: {
    fontFamily: "monospace",
    fontWeight: 600,
  },

  progressBar: {
    height: 6,
    borderRadius: 3,
  },

  // Pest Info
  pestContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing(1),
  },

  pestLabel: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },

  pestValue: {
    fontFamily: "monospace",
    fontWeight: 600,
  },

  // Info Row
  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoLabel: {
    color: theme.palette?.text?.secondary || "#a0a0a0",
  },

  infoValue: {
    fontFamily: "monospace",
  },

  // Divider
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  // Mission Text
  missionText: {
    fontFamily: "monospace",
    marginTop: theme.spacing(0.5),
  },

  // Position Text
  positionText: {
    fontFamily: "monospace",
    marginTop: theme.spacing(0.5),
  },

  // Actions Section
  actionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },

  actionsTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
    color: theme.palette?.text?.secondary || "#a0a0a0",
  },

  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },

  primaryButton: {
    justifyContent: "flex-start",
    boxShadow:
      theme.palette?.mode === "dark"
        ? "0 0 20px rgba(33, 150, 243, 0.3)"
        : "none",
  },

  // Robot Selection
  robotSelectHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  robotList: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },

  robotButton: {
    justifyContent: "flex-start",
    textTransform: "none",
    padding: theme.spacing(1.5),
    borderRadius: theme.shape?.borderRadius || 8,
    backgroundColor:
      theme.palette?.action?.hover || "rgba(255, 255, 255, 0.05)",
    "&:hover": {
      backgroundColor:
        theme.palette?.action?.selected || "rgba(255, 255, 255, 0.1)",
    },
  },

  robotButtonContent: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  robotInfo: {
    display: "flex",
    alignItems: "center",
    gap: theme?.spacing(1),
  },

  // Activity Section
  activitySection: {
    borderTop: `1px solid ${theme?.palette?.divider || "rgba(255, 255, 255, 0.1)"}`,
    paddingTop: theme?.spacing(2),
  },

  activityTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
    color: theme?.palette?.text?.secondary || "#a0a0a0",
    marginBottom: theme?.spacing(1.5),
    display: "block",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: theme?.spacing(1),
    maxHeight: 192,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: 6,
    },
    "&::-webkit-scrollbar-track": {
      background: theme?.palette?.background?.default || "#0a0a0a",
    },
    "&::-webkit-scrollbar-thumb": {
      background:
        theme?.palette?.action?.disabled || "rgba(255, 255, 255, 0.3)",
      borderRadius: 3,
      "&:hover": {
        background:
          theme?.palette?.action?.selected || "rgba(255, 255, 255, 0.1)",
      },
    },
  },

  activityItem: {
    padding: theme?.spacing(1) || 0,
    borderRadius: theme?.shape?.borderRadius || 8,
    backgroundColor:
      theme?.palette?.action?.hover || "rgba(255, 255, 255, 0.05)",
  },

  activityHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme?.spacing(0.5) || 0,
  },

  activityAction: {
    fontWeight: 500,
  },
}));
