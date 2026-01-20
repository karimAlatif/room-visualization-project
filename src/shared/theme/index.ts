import { createTheme, responsiveFontSizes, ThemeOptions, alpha } from "@mui/material/styles";

// iOS Liquid Glass Theme Configuration
const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#4ade80",
      light: "#86efac",
      dark: "#22c55e",
      contrastText: "#0a0a0a",
    },
    secondary: {
      main: "#fbbf24",
      light: "#fcd34d",
      dark: "#f59e0b",
      contrastText: "#0a0a0a",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#0a0a0a",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
      disabled: "#64748b",
    },
    divider: "rgba(148, 163, 184, 0.12)",
    action: {
      active: "#4ade80",
      hover: "rgba(74, 222, 128, 0.08)",
      selected: "rgba(74, 222, 128, 0.16)",
      disabled: "rgba(148, 163, 184, 0.26)",
      disabledBackground: "rgba(148, 163, 184, 0.12)",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "SF Pro Display",
      "SF Pro Text",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    "none",
    "0 2px 8px 0 rgba(0, 0, 0, 0.15)",
    "0 4px 12px 0 rgba(0, 0, 0, 0.15)",
    "0 8px 24px 0 rgba(0, 0, 0, 0.2)",
    "0 12px 32px 0 rgba(0, 0, 0, 0.2)",
    "0 16px 40px 0 rgba(0, 0, 0, 0.25)",
    "0 20px 48px 0 rgba(0, 0, 0, 0.25)",
    "0 24px 56px 0 rgba(0, 0, 0, 0.3)",
    "0 28px 64px 0 rgba(0, 0, 0, 0.3)",
    "0 32px 72px 0 rgba(0, 0, 0, 0.3)",
    "0 36px 80px 0 rgba(0, 0, 0, 0.3)",
    "0 40px 88px 0 rgba(0, 0, 0, 0.3)",
    "0 44px 96px 0 rgba(0, 0, 0, 0.3)",
    "0 48px 104px 0 rgba(0, 0, 0, 0.3)",
    "0 52px 112px 0 rgba(0, 0, 0, 0.3)",
    "0 56px 120px 0 rgba(0, 0, 0, 0.3)",
    "0 60px 128px 0 rgba(0, 0, 0, 0.3)",
    "0 64px 136px 0 rgba(0, 0, 0, 0.3)",
    "0 68px 144px 0 rgba(0, 0, 0, 0.3)",
    "0 72px 152px 0 rgba(0, 0, 0, 0.3)",
    "0 76px 160px 0 rgba(0, 0, 0, 0.3)",
    "0 80px 168px 0 rgba(0, 0, 0, 0.3)",
    "0 84px 176px 0 rgba(0, 0, 0, 0.3)",
    "0 88px 184px 0 rgba(0, 0, 0, 0.3)",
    "0 92px 192px 0 rgba(0, 0, 0, 0.3)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: 6,
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 3,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
          borderRadius: 20,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.05)}`,
          borderRadius: 22,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.background.paper, 0.65),
            boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.2)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}`,
            transform: "translateY(-2px)",
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "0.9375rem",
          fontWeight: 600,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:active": {
            transform: "scale(0.97)",
          },
        }),
        contained: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.primary.main, 0.85),
          boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
          border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.95),
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
          },
        }),
        outlined: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.4),
          borderColor: alpha(theme.palette.divider, 0.8),
          "&:hover": {
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            borderColor: alpha(theme.palette.primary.main, 0.5),
          },
        }),
        text: ({ theme }) => ({
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            borderRadius: 14,
            backgroundColor: alpha(theme.palette.background.paper, 0.4),
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.divider, 0.6),
              borderWidth: 1,
            },
            "&:hover": {
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.primary.main, 0.4),
              },
            },
            "&.Mui-focused": {
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.primary.main, 0.6),
                borderWidth: 1,
              },
            },
          },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.divider, 0.6),
          },
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 24,
          backgroundImage: "none",
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: `0 24px 80px ${alpha(theme.palette.common.black, 0.4)}`,
        }),
        backdrop: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.common.black, 0.5),
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundImage: "none",
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: `0 16px 64px ${alpha(theme.palette.common.black, 0.3)}`,
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 16,
          backgroundImage: "none",
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.25)}`,
          marginTop: 8,
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          margin: "4px 8px",
          padding: "10px 16px",
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.18),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.24),
            },
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          backgroundColor: alpha(theme.palette.background.paper, 0.4),
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: 4,
          minHeight: 44,
        }),
        indicator: ({ theme }) => ({
          height: "100%",
          borderRadius: 10,
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
          zIndex: 0,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          minHeight: 36,
          padding: "8px 16px",
          zIndex: 1,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&.Mui-selected": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          borderRadius: 10,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`,
          color: theme.palette.text.primary,
          fontSize: "0.8125rem",
          padding: "8px 14px",
        }),
        arrow: ({ theme }) => ({
          color: alpha(theme.palette.background.paper, 0.9),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          fontWeight: 500,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
          },
        }),
        filled: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
          },
        }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          height: 6,
          backgroundColor: alpha(theme.palette.background.paper, 0.4),
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }),
        bar: ({ theme }) => ({
          borderRadius: 999,
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: alpha(theme.palette.divider, 0.6),
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.1)}`,
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          margin: "2px 0",
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            },
          },
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          margin: "2px 0",
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            },
          },
        }),
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: 8,
        }),
        track: ({ theme }) => ({
          borderRadius: 999,
          backgroundColor: alpha(theme.palette.text.disabled, 0.3),
        }),
        thumb: ({ theme }) => ({
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
        }),
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiSlider-track": {
            border: "none",
          },
          "& .MuiSlider-thumb": {
            backgroundColor: theme.palette.common.white,
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`,
            },
          },
          "& .MuiSlider-rail": {
            backgroundColor: alpha(theme.palette.text.disabled, 0.2),
          },
        }),
      },
    },
  },
};

// Create and export the theme
export const farmIoTTheme = responsiveFontSizes(createTheme(themeOptions));

export default farmIoTTheme;
