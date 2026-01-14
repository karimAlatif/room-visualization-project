/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, createRef } from "react";
import * as BABYLON from "babylonjs";
import babylonManager from "./Babylon/babylonManager.js";
import DesertAmbientAudio from "./components/DesertAmbientAudio";
import LoadingScreen from "./components/LoadingScreen";

const gmRef = createRef<HTMLCanvasElement>();

export interface GameManager {
  engine: BABYLON.Engine;
  studioSceneManager: any;
}
function App() {
  const [, setGameManager] = useState<GameManager>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { GManger }: { GManger: GameManager } = babylonManager(
      gmRef.current,
      () => {
        setTimeout(() => {
          setIsLoading(false);
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
    <div
      style={{
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "#282828",
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <canvas
        style={{
          width: "100%",
          height: "100%",
          touchAction: "none",
          visibility: "visible",
        }}
        id="canvas-container"
        ref={gmRef}
      />
      <DesertAmbientAudio />
      <LoadingScreen open={isLoading} />
    </div>
  );
}

export default App;
