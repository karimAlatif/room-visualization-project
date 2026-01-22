/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, createRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme, Box } from "@mui/material";
import * as BABYLON from "babylonjs";
import babylonManager from "./Babylon/babylonManager.js";
import { exportedStudioSceneMethods } from "./Babylon/StudioScene/studioSceneManager.js";
import DesertAmbientAudio from "./shared/components/DesertAmbientAudio.js";
import LoadingScreen from "./shared/components/LoadingScreen";
import GlobalToast from "shared/components/Toaster";
import NotFound from "shared/pages/NotFound";
import ThemeProvider from "shared/theme/ThemeProvider";
import { useFarmStore } from "./shared/store/index.js";
import { LeftSidebar } from "./layout/LefSideBar/LeftSidebar";
import { useAppStyles } from "./App.styles";
import { RightPanel } from "./layout/RightSideBar/index.js";

const gmRef = createRef<HTMLCanvasElement>();

export interface GameManager {
  engine: BABYLON.Engine;
  studioSceneManager: any;
}

const queryClient = new QueryClient();

function AppContent() {
  const theme = useTheme();
  const classes = useAppStyles();
  const [isSceneLoading, setIsSceneLoading] = useState(true);
  const { palms, robots, setStudioSceneMethods } = useFarmStore();

  useEffect(() => {
    if (!gmRef.current) return;

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
      },
    ); //Create Babylonjs Ref

    // Store the exported studio scene methods in the global state
    setStudioSceneMethods(
      exportedStudioSceneMethods(GManger.studioSceneManager),
    );

    return () => {
      if (GManger) {
        GManger.engine.dispose();
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // useEffect(() => {
  //   exportedStudioSceneMethods().moveRobotToPalm("robot-1", "palm-1");
  // }, []);
  setTimeout(() => {}, 2000);
  console.log("theme", theme);
  return (
    <Box className={classes.appContainer}>
      {/* Sidebar Container */}

      <Box className={classes.sidebarWrapper}>
        <LeftSidebar />
      </Box>

      {/* Main Content Area */}
      {/* <Box className={classes.mainContent}> */}
      {isSceneLoading && (
        <Box className={classes.loadingOverlay}>
          <LoadingScreen open={isSceneLoading} />
        </Box>
      )}
      {/* Main 3D Canvas */}
      <canvas className={classes.canvas} id="canvas-container" ref={gmRef} />

      {/* Ambient Audio Component */}
      <Box className={classes.ambientAudioContainer}>
        <DesertAmbientAudio />
      </Box>

      {/* Loading Screen Overlay */}

      {/* </Box> */}

      <Box>
        <RightPanel />
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
