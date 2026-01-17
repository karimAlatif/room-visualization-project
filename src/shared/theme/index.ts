import { createTheme, responsiveFontSizes, ThemeOptions } from "@mui/material/styles";

// Farm IoT System - Dark Theme Configuration
const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#4ade80", // Vibrant green - represents healthy crops/nature
      light: "#86efac",
      dark: "#22c55e",
      contrastText: "#0a0a0a",
    },
    secondary: {
      main: "#fbbf24", // Amber - represents harvest/golden crops
      light: "#fcd34d",
      dark: "#f59e0b",
      contrastText: "#0a0a0a",
    },
    success: {
      main: "#10b981", // Emerald green - healthy status
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b", // Amber - alerts/warnings
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#0a0a0a",
    },
    error: {
      main: "#ef4444", // Red - critical alerts
      light: "#f87171",
      dark: "#dc2626",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6", // Blue - information/water systems
      light: "#60a5fa",
      dark: "#2563eb",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a", // Deep dark blue-gray (slate-900)
      paper: "#1e293b", // Slate-800 - elevated surfaces
    },
    text: {
      primary: "#f1f5f9", // Slate-100 - high contrast text
      secondary: "#cbd5e1", // Slate-300 - secondary text
      disabled: "#64748b", // Slate-500 - disabled text
    },
    divider: "rgba(148, 163, 184, 0.12)", // Subtle dividers
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
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
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
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.24)",
    "0 3px 6px 0 rgba(0, 0, 0, 0.3), 0 2px 4px 0 rgba(0, 0, 0, 0.24)",
    "0 10px 20px 0 rgba(0, 0, 0, 0.3), 0 3px 6px 0 rgba(0, 0, 0, 0.24)",
    "0 15px 25px 0 rgba(0, 0, 0, 0.3), 0 5px 10px 0 rgba(0, 0, 0, 0.24)",
    "0 20px 40px 0 rgba(0, 0, 0, 0.3), 0 7px 13px 0 rgba(0, 0, 0, 0.24)",
    "0 25px 50px 0 rgba(0, 0, 0, 0.3), 0 10px 20px 0 rgba(0, 0, 0, 0.24)",
    "0 30px 60px 0 rgba(0, 0, 0, 0.3), 0 12px 24px 0 rgba(0, 0, 0, 0.24)",
    "0 35px 70px 0 rgba(0, 0, 0, 0.3), 0 15px 30px 0 rgba(0, 0, 0, 0.24)",
    "0 40px 80px 0 rgba(0, 0, 0, 0.3), 0 17px 40px 0 rgba(0, 0, 0, 0.24)",
    "0 45px 90px 0 rgba(0, 0, 0, 0.3), 0 20px 50px 0 rgba(0, 0, 0, 0.24)",
    "0 50px 100px 0 rgba(0, 0, 0, 0.3), 0 22px 60px 0 rgba(0, 0, 0, 0.24)",
    "0 55px 110px 0 rgba(0, 0, 0, 0.3), 0 25px 70px 0 rgba(0, 0, 0, 0.24)",
    "0 60px 120px 0 rgba(0, 0, 0, 0.3), 0 27px 80px 0 rgba(0, 0, 0, 0.24)",
    "0 65px 130px 0 rgba(0, 0, 0, 0.3), 0 30px 90px 0 rgba(0, 0, 0, 0.24)",
    "0 70px 140px 0 rgba(0, 0, 0, 0.3), 0 32px 100px 0 rgba(0, 0, 0, 0.24)",
    "0 75px 150px 0 rgba(0, 0, 0, 0.3), 0 35px 110px 0 rgba(0, 0, 0, 0.24)",
    "0 80px 160px 0 rgba(0, 0, 0, 0.3), 0 37px 120px 0 rgba(0, 0, 0, 0.24)",
    "0 85px 170px 0 rgba(0, 0, 0, 0.3), 0 40px 130px 0 rgba(0, 0, 0, 0.24)",
    "0 90px 180px 0 rgba(0, 0, 0, 0.3), 0 42px 140px 0 rgba(0, 0, 0, 0.24)",
    "0 95px 190px 0 rgba(0, 0, 0, 0.3), 0 45px 150px 0 rgba(0, 0, 0, 0.24)",
    "0 100px 200px 0 rgba(0, 0, 0, 0.3), 0 47px 160px 0 rgba(0, 0, 0, 0.24)",
    "0 105px 210px 0 rgba(0, 0, 0, 0.3), 0 50px 170px 0 rgba(0, 0, 0, 0.24)",
    "0 110px 220px 0 rgba(0, 0, 0, 0.3), 0 52px 180px 0 rgba(0, 0, 0, 0.24)",
    "0 115px 230px 0 rgba(0, 0, 0, 0.3), 0 55px 190px 0 rgba(0, 0, 0, 0.24)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "0.9375rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 6px 16px rgba(74, 222, 128, 0.4)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
          border: "1px solid rgba(148, 163, 184, 0.12)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.24)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(148, 163, 184, 0.12)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(74, 222, 128, 0.5)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4ade80",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
};

// Create and export the theme
export const farmIoTTheme = responsiveFontSizes(createTheme(themeOptions));

export default farmIoTTheme;
