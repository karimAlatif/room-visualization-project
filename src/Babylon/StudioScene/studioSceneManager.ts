/* eslint-disable @typescript-eslint/no-explicit-any */
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { CustomLoadingScreen } from './CustomLoadingScreen';


class StudioSceneManager  {
  engine: BABYLON.Engine;
  canvas: HTMLCanvasElement;
  scene: BABYLON.Scene;
  camera: BABYLON.ArcRotateCamera | null = null;
  shadowGenerator: BABYLON.ShadowGenerator | null = null;
  mirror: BABYLON.MirrorTexture | null = null;
  loadedMeshes: BABYLON.Mesh[] = [];
  customLoadingScreen: CustomLoadingScreen | null = null;
  onLoadProgress?: (progress: number) => void;

  constructor(props: any) {
    this.engine = props.engine;
    this.canvas = props.canvas;
    this.scene = new BABYLON.Scene(this.engine);
    this.onLoadProgress = props.onLoadProgress;
    
    // Initialize loading UI
    this.initializeLoader();
  }

  //#region  MainSceneProperties
  async createScene() {
    try {
      // Show loading screen
      this.showLoader();
      
      //Create Scene
      this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000000001);
      this.scene.imageProcessingConfiguration.contrast = 1.35;
      this.scene.imageProcessingConfiguration.vignetteEnabled = true;

    //Installation
    this.camera = this.createCamera(); //create Camera
    this.setupMobileOptimizations(); //setup mobile optimizations
    this.setUpEnvironMent(); //set up the environment      // Load the room with progress tracking
      await this.loadRoom();

      // this.scene.debugLayer.show();
      // Remove the test box since we're loading a room
      // BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, this.scene);

      return this.scene;
    } catch (error) {
      console.error("Error creating scene:", error);
      // Ensure loader is hidden even if there's an error
      this.hideLoader();
      throw error;
    }
  }

  initializeLoader() {
    // Create a custom loading screen
    this.customLoadingScreen = new CustomLoadingScreen(this.canvas);
  }

  showLoader() {
    if (this.customLoadingScreen) {
      this.customLoadingScreen.displayLoadingUI();
    }
  }

  hideLoader() {
    console.log("hideLoader called, customLoadingScreen exists:", !!this.customLoadingScreen);
    if (this.customLoadingScreen) {
      this.customLoadingScreen.hideLoadingUI();
    } else {
      console.log("No custom loading screen to hide");
    }
  }

  updateLoadingProgress(progress: number) {
    if (this.customLoadingScreen) {
      this.customLoadingScreen.updateProgress(progress);
    }
  }

  forceHideLoader() {
    console.log("Force hiding loader");
    // Remove any loading screens from the DOM
    const existingLoaders = document.querySelectorAll('.babylon-loading-screen');
    existingLoaders.forEach(loader => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
        console.log("Force removed loading screen from DOM");
      }
    });
    
    // Reset the custom loading screen
    if (this.customLoadingScreen) {
      this.customLoadingScreen = null;
    }
  }

  createCamera(): any {
    const camera = new BABYLON.ArcRotateCamera(
      "RoomCamera",
      0, // Alpha (horizontal rotation)
      Math.PI / 2, // Beta (vertical rotation) - looking straight ahead
      0.1, // Radius - very small to position camera inside room
      new BABYLON.Vector3(0, 1.7, 0), // Target position (eye level inside room)
      this.scene
    );
    
    // Enable touch controls for mobile devices
    camera.attachControl(this.canvas, true);

    // Lock the radius to prevent moving closer/farther
    camera.lowerRadiusLimit = 0.1;
    camera.upperRadiusLimit = 0.1;

    // Allow full vertical rotation but limit to reasonable angles
    camera.lowerBetaLimit = 0.1; // Can look up
    camera.upperBetaLimit = Math.PI - 0.1; // Can look down

    // Allow full horizontal rotation (360 degrees)
    camera.lowerAlphaLimit = null;
    camera.upperAlphaLimit = null;

    // Disable zoom and pinch gestures
    camera.wheelPrecision = 0;
    camera.pinchPrecision = 0;
    
    // Disable panning
    camera.panningSensibility = 0;
    
    // Smooth camera movements
    camera.useBouncingBehavior = false;
    camera.useAutoRotationBehavior = false;
    
    // Mobile-optimized sensitivity settings
    const isMobile = this.detectMobileDevice();
    if (isMobile) {
      // Lower sensitivity for smoother mobile touch controls
      camera.angularSensibilityX = 2000;  // Higher number = less sensitive
      camera.angularSensibilityY = 2000;
      
      // Configure pointer input for touch devices
      if (camera.inputs.attached.pointers) {
        const pointerInput = camera.inputs.attached.pointers as any;
        pointerInput.angularSensibilityX = 2000;
        pointerInput.angularSensibilityY = 2000;
      }
    } else {
      // Desktop sensitivity
      camera.angularSensibilityX = 1000;
      camera.angularSensibilityY = 1000;
    }
    
    // Ensure touch events are properly handled
    camera.setTarget(new BABYLON.Vector3(0, 1.7, 0));
    
    // Add mobile-specific optimizations
    if (isMobile) {
      // Prevent context menu on long touch
      this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
      
      // Ensure the canvas captures all touch events
      this.canvas.style.touchAction = 'none';
      
      // Add viewport meta tag for mobile if not present
      this.ensureMobileViewport();
    }
    
    this.scene.activeCamera = camera;

    console.log(`Camera initialized for ${isMobile ? 'mobile' : 'desktop'} device`);
    return camera;
  }

  ensureMobileViewport() {
    // Check if viewport meta tag exists
    let viewport = document.querySelector('meta[name=viewport]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    
    // Set mobile-friendly viewport
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }

  detectMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Check for mobile devices
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    // Also check for touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobile || hasTouch;
  }

  setupMobileOptimizations() {
    if (this.detectMobileDevice() && this.camera) {
      // Handle orientation changes
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.engine.resize();
        }, 100);
      });

      // Handle window resize for mobile browsers
      window.addEventListener('resize', () => {
        this.engine.resize();
      });

      // Disable pull-to-refresh on mobile
      document.body.style.overscrollBehavior = 'none';
      
      console.log('Mobile optimizations applied');
    }
  }

  setUpEnvironMent() {
    const dirLight = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(0, -1, 0.3),
      this.scene
    );
    dirLight.position = new BABYLON.Vector3(3, 9, 3);
    const alphaMaterial = new BABYLON.StandardMaterial("alphaMat", this.scene);
    alphaMaterial.alpha = 0;

    // ShadowGenerator
    this.shadowGenerator = new BABYLON.ShadowGenerator(512, dirLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.filteringQuality =
      BABYLON.ShadowGenerator.QUALITY_HIGH;
    dirLight.intensity = 0.8;
    dirLight.shadowMinZ = 0;
    dirLight.shadowMaxZ = 500;
    dirLight.intensity = 0

    //Create CubicTexture
    const skyboxCubecTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      "./environment/skyEnvironment.env",
      this.scene
    );
    this.scene.environmentTexture = skyboxCubecTexture;

    // Ground disabled since we're inside a room
    // const flatGorund = BABYLON.MeshBuilder.CreateGround(
    //   "flatGround",
    //   {
    //     width: 800, // Width of the flat ground
    //     height: 800, // Height of the flat ground
    //     subdivisions: 2,
    //   },
    //   this.scene
    // );
    // flatGorund.position.y = -0.2; // Slightly elevate the flat ground to avoid z-fighting
    // flatGorund.isPickable = false;
    // flatGorund.setEnabled(false);

    // // Create a material for the grounds
    // const groundMaterial = new BABYLON.StandardMaterial(
    //   "groundMaterial",
    //   this.scene
    // );
    // const groundTexture = new BABYLON.Texture(
    //   `${window.location.origin}/Textuers/scene/grass_color.jpg`,
    //   this.scene
    // );

    // groundMaterial.diffuseTexture = groundTexture;
    // groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // groundTexture.uScale = 10; // Scale the texture horizontally
    // groundTexture.vScale = 10; // Scale the texture vertically
    // // Apply the material to both grounds
    // flatGorund.material = groundMaterial;
    this.scene.registerBeforeRender(() => {});
  }

  async loadRoom() {
    try {
      // Initial progress update
      this.updateLoadingProgress(10);
      if (this.onLoadProgress) {
        this.onLoadProgress(10);
      }

      // Set up progress callback for the loader
      const progressCallback = (event: BABYLON.ISceneLoaderProgressEvent) => {
        if (event.lengthComputable) {
          const progress = 10 + (event.loaded / event.total) * 80; // 10-90% for loading
          this.updateLoadingProgress(progress);
          if (this.onLoadProgress) {
            this.onLoadProgress(progress);
          }
        }
      };

      // Load the room with progress tracking
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        "", 
        "models/", 
        "Treatment_Room.glb", 
        this.scene,
        progressCallback
      );
      
      if (result.meshes && result.meshes.length > 0) {
        // Update progress for post-processing
        this.updateLoadingProgress(90);
        if (this.onLoadProgress) {
          this.onLoadProgress(90);
        }

        // Store the loaded room meshes
        this.loadedMeshes = result.meshes as BABYLON.Mesh[];
        
        if(this.loadedMeshes[0]){
          this.loadedMeshes[0].scaling = new BABYLON.Vector3(1,1,1);
        }
        
        // Position camera inside the room
        (this.camera as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0.3, 0);
        (this.camera as BABYLON.ArcRotateCamera).fov = 1.5;
        (this.camera as BABYLON.ArcRotateCamera).minZ = 0.1;

        // Final progress update
        this.updateLoadingProgress(100);
        if (this.onLoadProgress) {
          this.onLoadProgress(100);
        }

        console.log("Room loaded successfully");
        
        // Ensure loader is hidden after successful loading
                    this.forceHideLoader();

        // setTimeout(() => {
        //   this.hideLoader();
        //   // Backup force hide after another second
        //   setTimeout(() => {
        //     this.forceHideLoader();
        //   }, 1000);
        // }, 500);
      }
    } catch (error) {
      console.error("Error loading room:", error);
      // Hide loader even on error
      this.hideLoader();
    }
  }

 

}
// Exporting a factory function for creating the BabylonManager instance
export const createStudioSceneManager = (
  props: any
): any => {
  return new StudioSceneManager(props);
};
