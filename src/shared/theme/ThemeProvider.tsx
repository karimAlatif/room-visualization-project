import React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { StylesProvider, ThemeProvider as StylesThemeProvider } from "@mui/styles";
import { farmIoTTheme } from "./index";
import { CssBaseline } from "@mui/material";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  if (!farmIoTTheme) {
    console.error("Theme not loaded");
    return null;
  }

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={farmIoTTheme}>
        <StylesProvider injectFirst>
          <StylesThemeProvider theme={farmIoTTheme}>
            <CssBaseline />
            {children}
          </StylesThemeProvider>
        </StylesProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProvider;
