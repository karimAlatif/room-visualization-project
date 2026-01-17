import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

export const useStyles = () => {
    const theme = useTheme();
    
    return useMemo(() => {
        const baseStyles: React.CSSProperties = {
            fontWeight: 500,
            borderRadius: "12px",
            border: "none",
            padding: "14px 24px",
            fontSize: theme.typography.body1.fontSize,
            backdropFilter: "blur(10px)",
            minWidth: "280px",
            maxWidth: "500px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        };

        return {
            toaster: {
                ...baseStyles,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
            },
            success: {
                ...baseStyles,
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                color: "#fff",
                boxShadow: `0 8px 32px ${theme.palette.success.main}40, 0 2px 8px ${theme.palette.success.main}20`,
                border: `1px solid ${theme.palette.success.light}30`,
            },
            error: {
                ...baseStyles,
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                color: "#fff",
                boxShadow: `0 8px 32px ${theme.palette.error.main}40, 0 2px 8px ${theme.palette.error.main}20`,
                border: `1px solid ${theme.palette.error.light}30`,
            },
            loading: {
                ...baseStyles,
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                color: "#fff",
                boxShadow: `0 8px 32px ${theme.palette.info.main}40, 0 2px 8px ${theme.palette.info.main}20`,
                border: `1px solid ${theme.palette.info.light}30`,
            },
            info: {
                ...baseStyles,
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                color: "#fff",
                boxShadow: `0 8px 32px ${theme.palette.info.main}40, 0 2px 8px ${theme.palette.info.main}20`,
                border: `1px solid ${theme.palette.info.light}30`,
            },
            warning: {
                ...baseStyles,
                background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                color: "#fff",
                boxShadow: `0 8px 32px ${theme.palette.warning.main}40, 0 2px 8px ${theme.palette.warning.main}20`,
                border: `1px solid ${theme.palette.warning.light}30`,
            },
        };
    }, [theme]);
};
