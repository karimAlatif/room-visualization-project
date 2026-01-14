import * as BABYLON from 'babylonjs';
import GameManger from './gameManager';

export default function BabylonManager(canvasRef, onReady) {
  if (!canvasRef) {
    throw new Error('Canvas is not provided!');
  }

  const engine = new BABYLON.Engine(canvasRef, true);
  const GManger = new GameManger(canvasRef, engine, onReady);

  return {
    GManger,
  };
}
