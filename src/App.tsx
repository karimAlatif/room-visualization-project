/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, createRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme, Box, Icon } from "@mui/material";
import * as BABYLON from "babylonjs";
import babylonManager from "./Babylon/babylonManager.js";
import DesertAmbientAudio from "./shared/components/DesertAmbientAudio.js";
import LoadingScreen from "./shared/components/LoadingScreen";
import GlobalToast from "shared/components/Toaster";
import NotFound from "shared/pages/NotFound";
import ThemeProvider from "shared/theme/ThemeProvider";
import { useFarmStore } from "./shared/store/index.js";
import { LeftSidebar } from "./layout/LefSideBar/LeftSidebar";
import { useAppStyles } from "./App.styles";
import { ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';

const gmRef = createRef<HTMLCanvasElement>();
export interface GameManager {
  engine: BABYLON.Engine;
  studioSceneManager: any;
}
const queryClient = new QueryClient();

function AppContent() {
  const classes = useAppStyles();
  const [, setGameManager] = useState<GameManager>();
  const [isSceneLoading, setIsSceneLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { palms, robots } = useFarmStore();

  useEffect(() => {
    if (!gmRef.current) return;

    console.log(
      "trrrrrrrrrrrrrrrrr RRRRRRRRRRRRRRRRRRRRRRR ZZZZZZZZZZZZZZZZZZ",
      palms.length
    );
    const { GManger }: { GManger: GameManager } = babylonManager(
      gmRef.current,
      {
        palms: palms,
        robots: robots,
      },
      () => {
        setTimeout(() => {
          setIsSceneLoading(false);
        }, 1500);
      }
    ); //Create Babylonjs Ref
    setGameManager(GManger);

    return () => {
      if (GManger) {
        GManger.engine.dispose();
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <Box className={classes.appContainer}>
      {/* Sidebar Container */}
      <Box
        className={`${classes.sidebarContainer} ${isSidebarCollapsed ? 'collapsed' : ''}`}
      >
        <Box className={classes.sidebarWrapper}>
          <LeftSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        </Box>

        {/* Toggle Button */}
        <Box
          className={`${classes.toggleButton} ${isSidebarCollapsed ? 'collapsed' : ''}`}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? <ArrowCircleRight /> : <ArrowCircleLeft />}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box className={classes.mainContent}>
        {/* Main 3D Canvas */}
        <canvas
          className={classes.canvas}
          id="canvas-container"
          ref={gmRef}
        />

        {/* Ambient Audio Component */}
        <Box className={classes.ambientAudioContainer}>
          <DesertAmbientAudio />
        </Box>

        {/* Loading Screen Overlay */}
        {isSceneLoading && (
          <Box className={classes.loadingOverlay}>
            <LoadingScreen open={isSceneLoading} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppContent />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <GlobalToast />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
