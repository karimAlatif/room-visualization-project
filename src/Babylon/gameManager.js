import { createStudioSceneManager } from './StudioScene/studioSceneManager';

export default class GameManager {
  constructor(canvas, engine, onReady) {
    // Define Canvas
    this.canvas = canvas;

    // Define Engine
    this.engine = engine;
    this.engine.enableOfflineSupport = true;

    // Create progress callback
    const onLoadProgress = (progress) => {
      console.log(`Loading progress: ${progress.toFixed(1)}%`);
    };

    // Create StudioScene Instance (StudioScene Manager)
    this.studioSceneManager = createStudioSceneManager({ 
      canvas, 
      engine, 
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

        // Force hide any remaining loaders after scene is ready
        setTimeout(() => {
          if (this.studioSceneManager && this.studioSceneManager.forceHideLoader) {
            this.studioSceneManager.forceHideLoader();
          }
        }, 100);
      })
      .catch((err) => {
        // handle scene creation errors
        console.error('Failed to create scene:', err);
      });
  }
}
