import { makeStyles } from "@mui/styles";
import { Theme, alpha } from "@mui/material/styles";

export const useStyles = makeStyles((theme: Theme) => ({
  // Main Panel Styles - Frosted Glass
  panel: {
    width: 320,
    height: "100%",
    backgroundColor: alpha(theme.palette.common.white, 0.08),
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderLeft: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    boxShadow: `-8px 0 32px ${alpha(theme.palette.common.black, 0.15)}`,
  },

  panelWithSelection: {
    width: 320,
    height: "100%",
    backgroundColor: alpha(theme.palette.common.white, 0.08),
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderLeft: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
    display: "flex",
    flexDirection: "column",
    animation: "$slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: `-8px 0 32px ${alpha(theme.palette.common.black, 0.15)}`,
  },

  "@keyframes slideInRight": {
    from: {
      transform: "translateX(20px)",
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
      transform: "translateY(8px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  // Panel Header
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  },

  panelHeaderTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
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
      background: "transparent",
      borderRadius: 3,
    },
    "&::-webkit-scrollbar-thumb": {
      background: alpha(theme.palette.common.white, 0.15),
      borderRadius: 3,
      "&:hover": {
        background: alpha(theme.palette.common.white, 0.25),
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
    padding: theme.spacing(3),
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: alpha(theme.palette.common.white, 0.08),
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2.5),
    boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
  },

  emptyIconSvg: {
    width: 32,
    height: 32,
    color: theme.palette.text.disabled,
  },

  emptyTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },

  emptyDescription: {
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
  },

  // Details Container
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2.5),
    animation: "$fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Header Section
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: 700,
    color: theme.palette.text.primary,
    letterSpacing: "-0.01em",
  },

  subtitle: {
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  },

  statusChip: {
    fontWeight: 600,
    borderRadius: 999,
  },

  // Stats Container
  statsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },

  // Glass Card Effect - Frosted Glass
  glassCard: {
    padding: theme.spacing(2.5),
    backgroundColor: alpha(theme.palette.common.white, 0.08),
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
    },
  },

  // Card Header
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },

  cardTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    fontSize: "0.7rem",
  },

  icon: {
    width: 16,
    height: 16,
    opacity: 0.8,
  },

  // Progress Bar
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.75),
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressLabel: {
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
  },

  progressValue: {
    fontWeight: 600,
    fontSize: "0.8125rem",
    color: theme.palette.text.primary,
  },

  progressBar: {
    height: 6,
    borderRadius: 999,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },

  // Pest Info
  pestContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing(1.5),
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
  },

  pestLabel: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
  },

  pestValue: {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },

  // Info Row
  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing(0.75)} 0`,
  },

  infoLabel: {
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  },

  infoValue: {
    fontWeight: 500,
    color: theme.palette.text.primary,
  },

  // Divider
  divider: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    borderColor: alpha(theme.palette.common.white, 0.1),
  },

  // Mission Text
  missionText: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.primary,
    fontWeight: 500,
  },

  // Position Text
  positionText: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  },

  // Actions Section
  actionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },

  actionsTitle: {
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    fontSize: "0.7rem",
    color: theme.palette.text.secondary,
  },

  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },

  primaryButton: {
    justifyContent: "center",
    borderRadius: 12,
    padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "none",
    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
    color: theme.palette.common.white,
    fontWeight: 600,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "scale(0.97)",
    },
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
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.06),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      borderColor: alpha(theme.palette.common.white, 0.2),
    },
    "&:active": {
      transform: "scale(0.98)",
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
    gap: theme.spacing(1.5),
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
    gap: theme.spacing(1),
    maxHeight: 200,
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
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.08),
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
