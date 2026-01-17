import React from "react";
import { useTheme } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import { useStyles } from "./styles";

export default function GlobalToast() {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 4000,
        style: classes.toaster,
        success: {
          style: classes.success,
          iconTheme: {
            primary: "#fff",
            secondary: theme.palette.success.main,
          },
        },
        error: {
          style: classes.error,
          iconTheme: {
            primary: "#fff",
            secondary: theme.palette.error.main,
          },
        },
        loading: {
          style: classes.loading,
          iconTheme: {
            primary: "#fff",
            secondary: theme.palette.info.main,
          },
        },
      }}
    />
  );
}
