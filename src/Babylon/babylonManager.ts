import * as BABYLON from "babylonjs";
import GameManager from "./gameManager";
import { DefaultData } from "./types";

export default function BabylonManager(
  canvasRef: HTMLCanvasElement,
  defaultData: DefaultData,
  onReady: () => void
) {
  if (!canvasRef) {
    throw new Error("Canvas is not provided!");
  }

  const engine = new BABYLON.Engine(canvasRef, true);
  const GManger = new GameManager(canvasRef, engine, defaultData, onReady);

  return {
    GManger,
  };
}
