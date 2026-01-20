import { makeStyles } from "@mui/styles";
import { Theme, alpha } from "@mui/material/styles";

export const useStyles = makeStyles((theme: Theme) => ({
  // Main Panel Styles - Floating with Liquid Glass
  panel: {
    position: "fixed",
    right: 16,
    top: 16,
    width: 320,
    maxHeight: "calc(100vh - 32px)",
    height: "auto",
    zIndex: 40,
    backgroundColor: alpha(theme.palette.common.white, 0.08),
    backdropFilter: "blur(54px) saturate(200%) brightness(130%)",
    WebkitBackdropFilter: "blur(54px) saturate(200%) brightness(130%)",
    border: `1.5px solid ${alpha(theme.palette.common.white, 0.3)}`,
    borderRadius: 28,
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    boxShadow: `0 0 60px ${alpha(theme.palette.primary.main, 0.3)}, -12px 0 48px ${alpha(theme.palette.common.black, 0.3)}, inset 1px 1px 30px ${alpha(theme.palette.common.white, 0.2)}, inset -1px -1px 30px ${alpha(theme.palette.common.black, 0.1)}, inset 0 0 40px ${alpha(theme.palette.primary.main, 0.08)}`,
  },

  panelWithSelection: {
    position: "fixed",
    right: 16,
    top: 16,
    width: 320,
    maxHeight: "calc(100vh - 32px)",
    height: "auto",
    zIndex: 40,
    background: 'linear-gradient(180deg, rgb(137 145 166 / 70%) 0%, rgb(74 90 106) 50%, rgba(66, 89, 129, 0.9) 100%)',
    backdropFilter: "blur(54px) saturate(200%) brightness(130%)",
    WebkitBackdropFilter: "blur(54px) saturate(200%) brightness(130%)",
    border: `1.5px solid ${alpha(theme.palette.common.white, 0.3)}`,
    borderRadius: 28,
    display: "flex",
    flexDirection: "column",
    animation: "$slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: `0 0 60px ${alpha(theme.palette.primary.main, 0.3)}, -12px 0 48px ${alpha(theme.palette.common.black, 0.3)}, inset 1px 1px 30px ${alpha(theme.palette.common.white, 0.2)}, inset -1px -1px 30px ${alpha(theme.palette.common.black, 0.1)}, inset 0 0 40px ${alpha(theme.palette.primary.main, 0.08)}`,
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
    borderBottom: `1.2px solid ${alpha(theme.palette.common.white, 0.15)}`,
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
    overflowX: "hidden",
    padding: theme.spacing(2),
    maxHeight: "calc(100vh - 200px)",
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
    borderRadius: 24,
    backgroundColor: alpha(theme.palette.common.white, 0.08),
    backdropFilter: "blur(32px) saturate(200%) brightness(120%)",
    WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(120%)",
    border: `1.2px solid ${alpha(theme.palette.common.white, 0.25)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2.5),
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}, inset 0 1px 8px ${alpha(theme.palette.common.white, 0.15)}, inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.1)}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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

  headerWithIcon: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    justifyContent: "space-between",
  },

  headerIconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: 24,
    backgroundColor: alpha(theme.palette.secondary.main, 1),
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    boxShadow: `0 12px 32px ${alpha(theme.palette.secondary.main, 0.8)}, inset 0 1px 4px ${alpha(theme.palette.common.white, 0.4)}`,
  },

  headerIcon: {
    color: theme.palette.common.white,
    opacity: 0.95,
  },

  headerContent: {
    flex: 1,
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
    backgroundColor: `rgba(245, 158, 11, 0.2) !important`,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: `1.2px solid rgba(245, 158, 11, 0.5) !important`,
    boxShadow: `0 0 16px rgba(245, 158, 11, 0.3), inset 0 1px 4px ${alpha(theme.palette.common.white, 0.15)} !important`,
    "& .MuiChip-label": {
      color: "#fbbf24 !important",
      fontWeight: 700,
    },
  },

  // Stats Container
  statsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },

  // Glass Card Effect - Liquid Glass
  glassCard: {
    padding: theme.spacing(1.5), 
    backgroundColor: "#00000000 !important",
    backdropFilter: "blur(40px) saturate(200%) brightness(120%)",
    WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(120%)",
    border: `1.2px solid ${alpha(theme.palette.common.white, 0.25)}`,
    borderRadius: 24,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    boxShadow: `0 8px 40px ${alpha(theme.palette.common.black, 0.2)}, inset 0 1px 8px ${alpha(theme.palette.common.white, 0.15)}, inset 0 -1px 8px ${alpha(theme.palette.common.black, 0.05)}, inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.1)} !important`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.12),
      borderColor: alpha(theme.palette.common.white, 0.35),
      boxShadow: `0 12px 56px ${alpha(theme.palette.common.black, 0.25)}, inset 0 1px 12px ${alpha(theme.palette.common.white, 0.2)}, inset 0 -1px 12px ${alpha(theme.palette.common.black, 0.08)}, inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.15)}`,
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
    gap: theme.spacing(1.25),
    padding: `${theme.spacing(.5)} 0`,
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressLabelWrapper: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.75),
  },

  progressIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.9,
    color: "inherit",
  },

  progressLabel: {
    color: theme.palette.text.secondary,
    fontSize: "0.9375rem",
    fontWeight: 500,
  },

  progressValue: {
    fontWeight: 700,
    fontSize: "0.9375rem",
    color: theme.palette.primary.light,
    minWidth: 45,
    textAlign: "right",
  },

  progressBar: {
    height: 24,
    borderRadius: 999,
    backgroundColor: "transparent",
    backdropFilter: "blur(20px) saturate(220%)",
    WebkitBackdropFilter: "blur(20px) saturate(220%)",
    border: "none",
    boxShadow: `inset 0 2px 8px ${alpha(theme.palette.common.white, 0.25)}, inset 0 -2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
    "& .MuiLinearProgress-bar": {
      boxShadow: `0 0 32px currentColor, 0 0 16px currentColor, inset 0 1px 2px ${alpha(theme.palette.common.white, 0.4)}`,
      borderRadius: 999,
      background: `linear-gradient(90deg, currentColor 0%, currentColor 100%)`,
    },
  },

  "progressBar-default": {
    "& .MuiLinearProgress-bar": {
      boxShadow: `0 0 32px ${theme.palette.primary.main}, 0 0 16px ${theme.palette.primary.light}, inset 0 1px 2px ${alpha(theme.palette.common.white, 0.4)}`,
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
  },

  "progressBar-healthy": {
    "& .MuiLinearProgress-bar": {
      boxShadow: `0 0 32px #10b981, 0 0 16px #6ee7b7, inset 0 1px 2px ${alpha(theme.palette.common.white, 0.4)}`,
      background: `linear-gradient(90deg, #10b981 0%, #6ee7b7 100%)`,
    },
  },

  "progressBar-warning": {
    "& .MuiLinearProgress-bar": {
      boxShadow: `0 0 32px #f59e0b, 0 0 16px #fbbf24, inset 0 1px 2px ${alpha(theme.palette.common.white, 0.4)}`,
      background: `linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)`,
    },
  },

  "progressBar-critical": {
    "& .MuiLinearProgress-bar": {
      boxShadow: `0 0 32px #ef4444, 0 0 16px #f87171, inset 0 1px 2px ${alpha(theme.palette.common.white, 0.4)}`,
      background: `linear-gradient(90deg, #ef4444 0%, #f87171 100%)`,
    },
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

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    gap: theme.spacing(1.5),
    alignItems: "center",
  },

  infoDivider: {
    width: 1.5,
    height: 80,
    backgroundColor: alpha(theme.palette.common.white, 0.2),
    borderRadius: 999,
    boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.25)}, inset 0 1px 2px ${alpha(theme.palette.common.white, 0.3)}`,
  },

  infoCard: {
    padding: theme.spacing(1.75),
    // backgroundColor: alpha(theme.palette.common.white, 0.08),
    backdropFilter: "blur(32px) saturate(200%) brightness(120%)",
    WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(120%)",
    // border: `1.2px solid ${alpha(theme.palette.common.white, 0.2)}`,
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(0.75),
    // boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.18)}, inset 0 1px 8px ${alpha(theme.palette.common.white, 0.15)}, inset 0 -1px 8px ${alpha(theme.palette.common.black, 0.05)}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      // backgroundColor: alpha(theme.palette.common.white, 0.12),
      // border: `1.2px solid ${alpha(theme.palette.common.white, 0.3)}`,
      boxShadow: `0 8px 40px ${alpha(theme.palette.common.black, 0.22)}, 0 0 24px ${alpha(theme.palette.primary.main, 0.2)}, inset 0 1px 12px ${alpha(theme.palette.common.white, 0.2)}, inset 0 -1px 12px ${alpha(theme.palette.common.black, 0.08)}`,
      transform: "translateY(-3px)",
    },
  },

  infoCardIcon: {
    fontSize: 24,
    opacity: 0.85,
  },

  infoLabel: {
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },

  infoValue: {
    fontWeight: 700,
    color: theme.palette.text.primary,
    fontSize: "1rem",
  },

  // Divider
  divider: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    borderColor: alpha(theme.palette.common.white, 0.15),
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
    gap: theme.spacing(1.5),
  },

  primaryButton: {
    justifyContent: "center",
    borderRadius: "16px !important",
    padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
    background: `linear-gradient(135deg, ${"#54c3fa"} 0%, ${"#8e9df8"} 100%) !important`,
    backdropFilter: "blur(24px) saturate(200%) brightness(110%)",
    WebkitBackdropFilter: "blur(24px) saturate(200%) brightness(110%)",
    border: `1.2px solid white !important`,
    boxShadow: `0 6px 28px ${alpha(theme.palette.primary.main, 0.45)}, 0 0 12px ${alpha(theme.palette.primary.light, 0.2)}, inset 0 1px 6px ${alpha(theme.palette.common.white, 0.15)}`,
    color: theme.palette.common.white,
    fontWeight: 600,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      boxShadow: `0 8px 40px ${alpha(theme.palette.primary.main, 0.6)}, 0 0 28px ${alpha(theme.palette.primary.main, 0.3)}, inset 0 1px 8px ${alpha(theme.palette.common.white, 0.2)}`,
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "scale(0.98) translateY(-1px)",
    },
  },

  defaultButton: {
    backgroundColor: `${alpha(theme.palette.common.white, 0.08)} !important`,
    backdropFilter: "blur(28px) saturate(190%) brightness(115%)",
    WebkitBackdropFilter: "blur(28px) saturate(190%) brightness(115%)",
    border: `1.2px solid ${alpha(theme.palette.common.white, 0.25)} !important`,
    color: "white !important",
    borderRadius: "16px !important",
    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.15)}, inset 0 1px 6px ${alpha(theme.palette.common.white, 0.12)}, inset 0 -1px 6px ${alpha(theme.palette.common.black, 0.05)}`,
    fontWeight: 600,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: `${alpha(theme.palette.common.white, 0.12)} !important`,
      borderColor: `${alpha(theme.palette.common.white, 0.35)} !important`,
      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}, 0 0 20px ${alpha(theme.palette.primary.main, 0.15)}, inset 0 1px 8px ${alpha(theme.palette.common.white, 0.15)}`,
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "scale(0.98) translateY(-1px)",
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
    borderRadius: 16,
    backgroundColor: alpha(theme.palette.common.white, 0.06),
    backdropFilter: "blur(32px) saturate(200%) brightness(120%)",
    WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(120%)",
    border: `1.2px solid ${alpha(theme.palette.common.white, 0.2)}`,
    boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.12)}, inset 0 1px 6px ${alpha(theme.palette.common.white, 0.1)}, inset 0 0 0 1px ${alpha(theme.palette.common.white, 0.08)}`,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.12),
      borderColor: alpha(theme.palette.common.white, 0.35),
      boxShadow: `0 6px 24px ${alpha(theme.palette.common.black, 0.15)}, 0 0 24px ${alpha(theme.palette.primary.main, 0.15)}, inset 0 1px 8px ${alpha(theme.palette.common.white, 0.12)}`,
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
