import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import farmIoTTheme from "./index";
import { CssBaseline } from "@mui/material";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={farmIoTTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
