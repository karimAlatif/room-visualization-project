import { createStudioSceneManager, StudioSceneManager } from './StudioScene/studioSceneManager';
import * as BABYLON from 'babylonjs';
import { DefaultData } from './types';

export default class GameManager {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  studioSceneManager: StudioSceneManager;
  currentScene: BABYLON.Scene | null = null;

  constructor(canvas: HTMLCanvasElement, engine: BABYLON.Engine, defaultData: DefaultData, onReady: () => void) {
    // Define Canvas
    this.canvas = canvas;
    // Define Engine
    this.engine = engine;
    this.engine.enableOfflineSupport = true;
    // Create StudioScene Instance (StudioScene Manager)
    this.studioSceneManager = createStudioSceneManager({ 
      canvas, 
      engine, 
      defaultData,
      onReady
    });
    
    this.studioSceneManager.createScene()
      .then((scene) => {
        this.currentScene = scene;

        // The render function - ensure we pass a valid function to requestAnimationFrame
        this.engine.runRenderLoop(() => {
          if (this.currentScene && typeof this.currentScene.render === 'function') {
            this.currentScene.render();
          }
        });

        // Resize the babylon engine when the window is resized
        window.addEventListener(
          'resize',
          () => {
            this.engine.resize();
          },
          false,
        );

      })
      .catch((err) => {
        // handle scene creation errors
        console.error('Failed to create scene:', err);
      });
  }
}
