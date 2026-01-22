// import { generateSmartTreeDistribution } from "src/types";
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import {
  FarmSize,
  Palm,
  Robot,
  RobotModelPath,
  ZONE2_INNER_RADIUS,
  ZONE2_OUTER_RADIUS,
  PalmModelPaths,
} from "../../types";
import { cloneTransformHierarchy, createMountainRangeHeightMap } from "./uitls";
import { DefaultData } from "../types";

export interface IStudioSceneManagerProps {
  engine: BABYLON.Engine;
  canvas: HTMLCanvasElement;
  defaultData: DefaultData;
  onReady?: () => void;
}

const swayDuration = 120; // total frames
const fps = 60;

export class StudioSceneManager {
  engine: BABYLON.Engine;
  canvas: HTMLCanvasElement;
  scene: BABYLON.Scene;
  camera: BABYLON.ArcRotateCamera | null = null;
  shadowGenerator: BABYLON.ShadowGenerator | null = null;
  mirror: BABYLON.MirrorTexture | null = null;
  loadedMeshes: BABYLON.Mesh[] = [];
  palms: (Palm & { palmNode?: BABYLON.TransformNode })[];
  onReady?: () => void;
  sharedAnimations?: {
    swayX: BABYLON.Animation;
    swayZ: BABYLON.Animation;
    twistY: BABYLON.Animation;
  };
  palmWindGroup?: BABYLON.AnimationGroup;
  robots: (Robot & {
    robotNode?: BABYLON.TransformNode;
    animationGroups?: BABYLON.AnimationGroup[];
    isMoving?: boolean;
  })[];
  robotsRootNode?: BABYLON.TransformNode;
  terrainMesh?: BABYLON.GroundMesh;

  constructor(props: IStudioSceneManagerProps) {
    this.engine = props.engine;
    this.canvas = props.canvas;
    this.scene = new BABYLON.Scene(this.engine);
    this.palms = props.defaultData.palms;
    this.robots = props.defaultData.robots;
    this.onReady = props.onReady;
  }

  //#region  MainSceneProperties
  async createScene() {
    try {
      //Create Scene
      this.scene.clearColor = new BABYLON.Color4(0.68, 0.78, 0.88, 1); // Lighter sky for better fog blend
      // Add linear fog for distant mountains (not affecting near farm area)
      this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
      this.scene.fogStart = 2000; // Fog begins at distance (beyond farm)
      this.scene.fogEnd = 9500; // Full fog at far mountains
      this.scene.fogColor = new BABYLON.Color3(0.75, 0.82, 0.92); // Lighter atmospheric fog
      this.scene.useRightHandedSystem = true; // optional

      //Installation
      this.camera = this.createCamera(); //create Camera
      this.setUpEnvironMent(); //set up the environment      // Load the room with progress tracking
      await this.initFarmEnvironment();
      if (this.onReady) {
        this?.onReady();
      }
      return this.scene;
    } catch (error) {
      console.error("Error creating scene:", error);
      // Ensure loader is hidden even if there's an error
      throw error;
    }
  }

  createCamera(): any {
    const camera = new BABYLON.ArcRotateCamera(
      "FarmCamera",
      -Math.PI / 2, // Alpha (horizontal rotation)
      Math.PI / 3, // Beta (vertical rotation) - angled view of farm
      80, // Radius - distance from center
      new BABYLON.Vector3(0, 0, 0), // Target center of farm
      this.scene,
    );

    // Enable touch controls for mobile devices
    camera.attachControl(this.canvas, true);

    // Limit camera movement to focus on central farm area
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 500;

    // Limit vertical rotation to keep farm in view
    camera.lowerBetaLimit = 0.2; // Can look up slightly
    camera.upperBetaLimit = Math.PI / 2.2; // Can't go below ground

    // Allow full horizontal rotation (360 degrees)
    camera.lowerAlphaLimit = null;
    camera.upperAlphaLimit = null;

    // Enable zoom with mouse wheel
    camera.wheelPrecision = 10;
    camera.pinchPrecision = 75;

    // Disable panning to keep focus on center
    camera.panningSensibility = 0;

    // Smooth camera movements
    camera.useBouncingBehavior = true;
    camera.useAutoRotationBehavior = false;

    // Set target to center of farm
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));

    this.scene.activeCamera = camera;
    return camera;
  }

  setUpEnvironMent() {
    // Main directional light simulating the sun (mid-afternoon position)
    const sunLight = new BABYLON.DirectionalLight(
      "SunLight",
      new BABYLON.Vector3(-0.4, -1, -0.35), // Adjusted angle for better shadows
      this.scene,
    );
    sunLight.position = new BABYLON.Vector3(110, 170, 60);
    sunLight.intensity = 3; // Increased for more dramatic intensity

    // Warm sun color for natural mid-afternoon look
    sunLight.diffuse = new BABYLON.Color3(1.0, 0.96, 0.88); // Warm sunlight
    sunLight.specular = new BABYLON.Color3(1.0, 0.98, 0.92); // Warm specular highlights

    // Hemispheric light for realistic sky ambient light
    const skyLight = new BABYLON.HemisphericLight(
      "SkyAmbient",
      new BABYLON.Vector3(0, 1, 0),
      this.scene,
    );
    skyLight.intensity = 1.1; // Enhanced ambient for detail visibility
    skyLight.diffuse = new BABYLON.Color3(0.75, 0.88, 1.0); // Cool sky blue
    skyLight.groundColor = new BABYLON.Color3(0.5, 0.45, 0.4); // Earth tones
    skyLight.specular = new BABYLON.Color3(0.3, 0.35, 0.4); // Moderate specular

    // Additional fill light for realistic outdoor lighting (bounced light simulation)
    const fillLight = new BABYLON.HemisphericLight(
      "FillLight",
      new BABYLON.Vector3(0, -1, 0), // From below (ground bounce)
      this.scene,
    );
    fillLight.intensity = 0.55; // Enhanced fill light for clarity
    fillLight.diffuse = new BABYLON.Color3(0.85, 0.75, 0.65); // Warm earth bounce
    fillLight.groundColor = new BABYLON.Color3(0.65, 0.75, 0.9); // Cool sky reflection
    fillLight.specular = new BABYLON.Color3(0, 0, 0); // No specular

    // Optimized shadow generator for performance
    this.shadowGenerator = new BABYLON.ShadowGenerator(2048, sunLight); // Balanced resolution
    this.shadowGenerator.usePercentageCloserFiltering = true; // PCF for soft shadows
    this.shadowGenerator.filteringQuality =
      BABYLON.ShadowGenerator.QUALITY_MEDIUM; // Medium quality for performance
    this.shadowGenerator.darkness = 0.22; // Lighter shadows for better detail visibility
    this.shadowGenerator.bias = 0.00001; // Prevent shadow acne
    this.shadowGenerator.normalBias = 0.015; // Better shadow alignment

    // Shadow frustum for optimal shadow coverage
    sunLight.shadowMinZ = 5;
    sunLight.shadowMaxZ = 450;
    sunLight.shadowOrthoScale = 0.45; // Balanced coverage

    // this.scene.debugLayer.show();
    // Create skybox
    this.createSkybox();

    // Add realistic post-processing effects
    this.setupPostProcessing();

    this.scene.registerBeforeRender(() => {});
  }

  createSkybox() {
    // Create realistic skybox with HDR environment
    const skybox = BABYLON.MeshBuilder.CreateBox(
      "skyBox",
      { size: 2000 },
      this.scene,
    );
    const skyboxMaterial = new BABYLON.StandardMaterial(
      "skyBoxMat",
      this.scene,
    );
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;

    // Use HDR environment texture for skybox
    const hdrTexture = new BABYLON.HDRCubeTexture(
      "hdr/golden_gate_hills_4k.hdr",
      this.scene,
      1024,
    );
    skyboxMaterial.reflectionTexture = hdrTexture;
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;

    // Add fog tint to skybox for cloud integration
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.18, 0.22); // Slight fog tint

    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;

    // Environment texture for reflections
    this.scene.environmentTexture = hdrTexture;
    this.scene.environmentIntensity = 0.35; // Enhanced for atmospheric effect

    return skybox;
  }

  setupPostProcessing() {
    if (!this.camera) return;

    // Professional HDR rendering pipeline with all advanced effects
    const pipeline = new BABYLON.DefaultRenderingPipeline(
      "professionalPipeline",
      true, // HDR enabled
      this.scene,
      [this.camera],
    );

    // ===== BLOOM CONFIGURATION =====
    // Natural sun glow and highlights (optimized)
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.7; // Higher threshold for less processing
    pipeline.bloomWeight = 0.35; // Reduced intensity
    pipeline.bloomKernel = 48; // Smaller kernel for better performance
    pipeline.bloomScale = 0.5; // Scale factor

    // ===== DEPTH OF FIELD (DOF) =====
    // Disabled for performance
    pipeline.depthOfFieldEnabled = false;

    // ===== CHROMATIC ABERRATION =====
    // Disabled for performance
    pipeline.chromaticAberrationEnabled = false;

    // ===== FILM GRAIN =====
    // Disabled for performance
    pipeline.grainEnabled = false;

    // ===== IMAGE PROCESSING & COLOR GRADING =====
    pipeline.imageProcessingEnabled = true;

    // Exposure and contrast
    pipeline.imageProcessing.contrast = 3; // Increased contrast for more depth
    pipeline.imageProcessing.exposure = 1.1; // Increased brightness and intensity

    // Tone mapping for HDR to LDR conversion (simplified)
    pipeline.imageProcessing.toneMappingEnabled = true;
    pipeline.imageProcessing.toneMappingType =
      BABYLON.ImageProcessingConfiguration.TONEMAPPING_STANDARD; // Standard for better performance

    // Color curves disabled for performance
    pipeline.imageProcessing.colorCurvesEnabled = false;

    // Color grading disabled for performance
    pipeline.imageProcessing.colorGradingEnabled = false;

    // Vignette effect for focus and elegance (simplified)
    pipeline.imageProcessing.vignetteEnabled = true;
    pipeline.imageProcessing.vignetteWeight = 1.5; // Reduced strength
    pipeline.imageProcessing.vignetteStretch = 0.5;
    pipeline.imageProcessing.vignetteCameraFov = 0.9;
    pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0, 0, 0, 0);
    pipeline.imageProcessing.vignetteBlendMode =
      BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;

    // ===== SHARPENING =====
    // Disabled for performance
    pipeline.sharpenEnabled = false;

    // ===== ANTI-ALIASING =====
    // Optimized anti-aliasing
    pipeline.samples = 2; // 2x MSAA for better performance
    pipeline.fxaaEnabled = true; // FXAA for smoothness

    // ===== GLOW LAYER =====
    // Optimized glow for performance
    const glowLayer = new BABYLON.GlowLayer("professionalGlow", this.scene);
    glowLayer.intensity = 0.45; // Reduced glow strength
    glowLayer.blurKernelSize = 32; // Smaller blur for performance

    // ===== GLARE/LENS EFFECT =====
    pipeline.glowLayerEnabled = true;

    console.log(
      "Professional post-processing pipeline configured with all effects",
    );
  }

  addAtmosphericEffects() {
    // Create 4 particle layers for depth and realism
    const sandLayers: BABYLON.ParticleSystem[] = [];

    const sandTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/textures/cloud.png",
      this.scene,
    );

    // // Layer 1: Ground-level fine sand (low, dense) - REDUCED
    const groundSand = new BABYLON.ParticleSystem(
      "groundSandLayer",
      3000,
      this.scene,
    );
    groundSand.particleTexture = sandTexture;
    groundSand.emitter = new BABYLON.Vector3(0, 0, 0);
    groundSand.minEmitBox = new BABYLON.Vector3(
      -FarmSize * 1.5,
      0,
      -FarmSize * 1.5,
    );
    groundSand.maxEmitBox = new BABYLON.Vector3(
      FarmSize * 1.5,
      0.5,
      FarmSize * 1.5,
    );

    // Realistic sand colors - warm desert tones
    groundSand.color1 = new BABYLON.Color4(0.92, 0.78, 0.58, 0.15); // Light sandy beige
    groundSand.color2 = new BABYLON.Color4(0.88, 0.72, 0.52, 0.2); // Warmer sand
    groundSand.colorDead = new BABYLON.Color4(0.85, 0.7, 0.5, 0); // Fade to transparent

    // Fine sand particles
    groundSand.minSize = 0.5;
    groundSand.maxSize = 3.2;
    groundSand.minLifeTime = 10;
    groundSand.maxLifeTime = 20;
    groundSand.emitRate = 200; // Reduced from 400
    groundSand.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

    // Horizontal wind movement (low to ground)
    groundSand.direction1 = new BABYLON.Vector3(-8, 0, -3);
    groundSand.direction2 = new BABYLON.Vector3(-12, 0.5, -5);
    groundSand.minEmitPower = 2;
    groundSand.maxEmitPower = 6;
    groundSand.updateSpeed = 0.015;

    // Minimal gravity to keep sand low
    groundSand.gravity = new BABYLON.Vector3(0, -0.2, 0);
    groundSand.minAngularSpeed = -1;
    groundSand.maxAngularSpeed = 1;

    groundSand.start();
    sandLayers.push(groundSand);

    // Dynamic wind gusts for intensity variation - LESS FREQUENT
    const createSandGust = () => {
      const gustAngle = Math.random() * Math.PI * 2;
      const gustStrength = 0.8 + Math.random() * 1.2;

      const windX = Math.cos(gustAngle) * gustStrength;
      const windZ = Math.sin(gustAngle) * gustStrength;

      const gustDuration = 2000 + Math.random() * 3000;
      const intensityMultiplier = 1.3 + Math.random() * 1.2; // Reduced from 1.5-3.0

      // Temporarily increase particle emission and wind strength
      sandLayers.forEach((layer, index) => {
        const originalEmitRate = layer.emitRate;
        layer.emitRate = originalEmitRate * intensityMultiplier;

        // Adjust wind direction
        const heightFactor = index * 0.5;
        layer.direction1 = new BABYLON.Vector3(
          windX * 8 - 2,
          -0.5 + heightFactor,
          windZ * 8 - 2,
        );
        layer.direction2 = new BABYLON.Vector3(
          windX * 14 + 2,
          0.5 + heightFactor,
          windZ * 14 + 2,
        );

        // Return to normal after gust
        setTimeout(() => {
          layer.emitRate = originalEmitRate;

          // Restore original wind direction
          const baseWindX = -8 + index * 2;
          const baseWindZ = -3 + index * 0.5;
          layer.direction1 = new BABYLON.Vector3(
            baseWindX - 2,
            -0.5 + heightFactor,
            baseWindZ - 2,
          );
          layer.direction2 = new BABYLON.Vector3(
            baseWindX + 4,
            0.5 + heightFactor,
            baseWindZ + 2,
          );
        }, gustDuration);
      });

      const degrees = Math.round((gustAngle * 180) / Math.PI);
      console.log(
        `Sandstorm gust from ${degrees}° - strength: ${gustStrength.toFixed(
          2,
        )} - duration: ${(gustDuration / 1000).toFixed(1)}s`,
      );
    };

    // Schedule random wind gusts - LONGER INTERVALS
    const scheduleNextGust = () => {
      const nextInterval = 30000 + Math.random() * 50000; // 30-80 seconds (increased from 8-20)
      setTimeout(() => {
        createSandGust();
        scheduleNextGust();
      }, nextInterval);
    };

    // Initial gust after longer delay
    setTimeout(createSandGust, 30000 + Math.random() * 50000); // 30-80 seconds
    scheduleNextGust();
  }

  async initFarmEnvironment() {
    // Central farm area size

    // 1. Create background environment (larger surrounding area)
    this.createBackgroundEnvironment();

    // 2. Load and place palm trees in the central farm
    await this.loadAndPlacePalmTrees();

    // 3. Load and place robots in zone 2
    await this.loadAndPlaceRobots();

    // setTimeout(() => {
    //   this.scene.debugLayer.show();
    // }, 5000);

    // 4. Add visual boundary indicator
    this.createFarmBoundary();

    // Add atmospheric effects
    this.addAtmosphericEffects();
  }

  createBackgroundEnvironment() {
    // Create large mountain backdrop around the farm
    const terrainWidth = FarmSize * 8; // Very large terrain for mountain backdrop
    const textureScale = terrainWidth / 10; // Texture scaling factor

    // Create mountain mesh with dramatic height variation
    BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "surroundingMountains",
      createMountainRangeHeightMap(),
      {
        width: terrainWidth,
        height: terrainWidth,
        subdivisions: 80, // Reduced for better performance
        minHeight: 0,
        maxHeight: 30,
        onReady: (mesh) => {
          mesh.receiveShadows = true;
          mesh.position.y = 0;
          // Use PBR material for more realistic rendering
          mesh.material = this.createPBRTerrainMaterial(textureScale);
          // Store reference to terrain mesh
          this.terrainMesh = mesh as BABYLON.GroundMesh;
        },
      },
      this.scene,
    );

    // Add custom grass vegetation
    // this.createCustomGrass(FarmSize, terrainWidth);
  }

  createPBRTerrainMaterial(textureScale: number): BABYLON.Material {
    // Create PBR Material for realistic physically-based rendering
    const pbrMat = new BABYLON.PBRMaterial("pbrTerrain", this.scene);

    // Load high-quality textures
    const baseColor = new BABYLON.Texture(
      "Textures/ground/textures/sand/sandy_gravel_02_diff_4k.jpg",
      this.scene,
    );
    baseColor.uScale = textureScale;
    baseColor.vScale = textureScale;

    const normalTexture = new BABYLON.Texture(
      "Textures/ground/textures/sand/sandy_gravel_02_nor_gl_4k.jpg",
      this.scene,
    );
    normalTexture.uScale = textureScale;
    normalTexture.vScale = textureScale;

    const armTexture = new BABYLON.Texture(
      "Textures/ground/textures/sand/sandy_gravel_02_arm_4k.jpg",
      this.scene,
    );
    armTexture.uScale = textureScale;
    armTexture.vScale = textureScale;

    // Albedo (Base Color)
    pbrMat.albedoTexture = baseColor;

    // Normal map for surface detail
    pbrMat.bumpTexture = normalTexture;
    pbrMat.invertNormalMapX = false;
    pbrMat.invertNormalMapY = true;

    // Use ARM texture (Ambient Occlusion, Roughness, Metallic packed)
    pbrMat.metallicTexture = armTexture;
    pbrMat.useRoughnessFromMetallicTextureAlpha = false;
    pbrMat.useRoughnessFromMetallicTextureGreen = true;
    pbrMat.useMetallnessFromMetallicTextureBlue = true;
    pbrMat.useAmbientOcclusionFromMetallicTextureRed = true;

    // PBR properties for realistic sand/gravel
    pbrMat.metallic = 0.0; // Sand is non-metallic
    pbrMat.roughness = 0.9; // Sandy surface is rough

    // Ambient occlusion strength
    pbrMat.ambientTextureStrength = 1.0;

    // Subsurface scattering for more realistic sand appearance (optional)
    pbrMat.subSurface.isRefractionEnabled = false;
    pbrMat.subSurface.isTranslucencyEnabled = true;
    pbrMat.subSurface.translucencyIntensity = 0.3;
    pbrMat.subSurface.tintColor = new BABYLON.Color3(0.95, 0.85, 0.7); // Warm sand tint

    // Environment reflection for realism
    pbrMat.environmentIntensity = 0.4;

    // Directional intensity (how much the material responds to direct light)
    pbrMat.directIntensity = 1.5;

    // Enable better lighting model
    pbrMat.usePhysicalLightFalloff = true;

    // Specular intensity
    pbrMat.specularIntensity = 0.2;

    // Back face culling
    pbrMat.backFaceCulling = true;

    // Enable clear coat for wet sand effect (optional, can be adjusted)
    pbrMat.clearCoat.isEnabled = false; // Set to true for wet sand look
    pbrMat.clearCoat.intensity = 0.1;
    pbrMat.clearCoat.roughness = 0.3;

    return pbrMat;
  }

  createFarmBoundary() {
    // Create subtle visual boundary around farm area
    const boundary = BABYLON.MeshBuilder.CreateLines(
      "farmBoundary",
      {
        points: [
          new BABYLON.Vector3(-FarmSize / 2, 0.1, -FarmSize / 2),
          new BABYLON.Vector3(FarmSize / 2, 0.1, -FarmSize / 2),
          new BABYLON.Vector3(FarmSize / 2, 0.1, FarmSize / 2),
          new BABYLON.Vector3(-FarmSize / 2, 0.1, FarmSize / 2),
          new BABYLON.Vector3(-FarmSize / 2, 0.1, -FarmSize / 2),
        ],
      },
      this.scene,
    );
    boundary.color = new BABYLON.Color3(0.8, 0.8, 0.8);
    boundary.alpha = 0.3;
  }

  addGroundInteraction() {
    // Create a pickable ground plane for mouse interaction
    const groundPlane = BABYLON.MeshBuilder.CreateGround(
      "interactiveGround",
      { width: FarmSize, height: FarmSize },
      this.scene,
    );
    groundPlane.position.y = 0.01; // Slightly above terrain
    groundPlane.isVisible = false; // Invisible but pickable
    groundPlane.isPickable = true;

    // Add click interaction to show ripple effect
    this.scene.onPointerDown = (evt, pickResult) => {
      if (pickResult.hit && pickResult.pickedPoint) {
        this.createRippleEffect(pickResult.pickedPoint);
      }
    };

    // Add hover effect for cursor
    this.scene.onPointerMove = (evt, pickResult) => {
      if (pickResult.hit && pickResult.pickedMesh === groundPlane) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "default";
      }
    };
  }

  createRippleEffect(position: BABYLON.Vector3) {
    // Create expanding ring effect
    const ripple = BABYLON.MeshBuilder.CreateTorus(
      "ripple",
      { diameter: 0.5, thickness: 0.05, tessellation: 32 },
      this.scene,
    );

    ripple.position = position.clone();
    ripple.position.y = 0.1;
    ripple.rotation.x = Math.PI / 2;

    // Create material with transparency
    const rippleMat = new BABYLON.StandardMaterial("rippleMat", this.scene);
    rippleMat.emissiveColor = new BABYLON.Color3(0.8, 0.9, 1.0);
    rippleMat.alpha = 0.8;
    rippleMat.disableLighting = true;
    ripple.material = rippleMat;

    // Animate the ripple
    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds

    const animateRipple = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Expand and fade
      const scale = 1 + progress * 15;
      ripple.scaling = new BABYLON.Vector3(scale, scale, 1);
      rippleMat.alpha = 0.8 * (1 - progress);

      if (progress < 1) {
        requestAnimationFrame(animateRipple);
      } else {
        ripple.dispose();
        rippleMat.dispose();
      }
    };

    animateRipple();
  }

  async loadAndPlacePalmTrees() {
    try {
      // Load all palm tree models from the provided paths
      const loadedModels: any = [];
      const rootNode = new BABYLON.TransformNode("palmTreesRoot", this.scene);
      for (const modelPath of PalmModelPaths) {
        const model = await BABYLON.SceneLoader.ImportMeshAsync(
          "",
          "./",
          modelPath,
          this.scene,
        );

        // Hide original meshes
        model.meshes.forEach((mesh) => mesh.setEnabled(false));
        loadedModels.push(model);
      }

      console.log(`Loaded ${loadedModels.length} palm tree model(s)`);

      // Smart distribution using Poisson-like sampling with grid guidance
      // const palms = generateSmartTreeDistribution(); // Slightly larger area for edge trees
      this.palms.forEach((palm, palmIndex) => {
        // Smart model selection based on position for natural variety
        // Select from available models using modelType
        const modelIndex = palm.modelType % loadedModels.length;
        const sourceModel = loadedModels[modelIndex];
        const sourceRootMesh = sourceModel.meshes.find((mesh: any) =>
          mesh.name.includes("root"),
        );

        // Clone the tree
        // const clonedMeshes: BABYLON.AbstractMesh[] = [];
        // sourceModel.meshes.forEach((mesh: any) => {
        //   if (mesh) {
        //     const clone = mesh.clone(`tree_${palmIndex}_${mesh.name}`, null);
        //     if (clone) {
        //       clone.setEnabled(true);
        //       clonedMeshes.push(clone);
        //     }
        //   }
        // });

        // Create parent for easy manipulation
        const treeParent = cloneTransformHierarchy(sourceRootMesh, this.scene, {
          nameSuffix: `palmTree_${palmIndex}`,
        });

        const datesLow: { [key: string]: BABYLON.Mesh } = {};

        treeParent.getChildMeshes().forEach((child) => {
          // Enable shadows
          if (child instanceof BABYLON.Mesh) {
            this.shadowGenerator?.addShadowCaster(child);
            child.receiveShadows = true;

            if (child.name.includes("Palm_Dates_Low")) {
              const primitiveIndex = Number(
                child.name.match(/primitive(\d+)/)?.[1],
              );
              datesLow[primitiveIndex] = child;
            }
          }
        });

        treeParent.getChildTransformNodes().forEach((node) => {
          if (node instanceof BABYLON.TransformNode) {
            if (
              node.name.includes("Palm_Dates") &&
              !node.name.includes("Low")
            ) {
              node.getChildMeshes().forEach((mesh) => {
                if (mesh instanceof BABYLON.Mesh) {
                  const primitiveIndex = Number(
                    mesh.name.match(/primitive(\d+)/)?.[1],
                  );
                  const lowDatesMesh = datesLow[primitiveIndex];

                  mesh.addLODLevel(40, lowDatesMesh); // far
                }
              });
            }
          }
        });

        // // Position
        treeParent.position.set(palm.position.x, 0, palm.position.z);

        // Random rotation (only Y-axis for natural look)
        treeParent.rotation.y = Math.random() * Math.PI * 2;

        // Scale variation based on position (creates natural variation zones)
        const scale = 2 + Math.random() * 1.0;
        treeParent.scaling.set(scale, scale, scale);

        this.palms[palmIndex].palmNode = treeParent;
        treeParent.parent = rootNode;
        // Add wind animation for natural movement
        this.addPalmToWind(treeParent);

        palmIndex++;
      });

      if (this.palmWindGroup) {
        this.palmWindGroup.play(true); // loop infinitely
        this.palmWindGroup.speedRatio = 0.35 + Math.random() * 0.15; // optional random speed for natural variation
        this.palmWindGroup.animatables.forEach((a) => {
          const phase = Math.random() * swayDuration;
          a.goToFrame(phase);
        });
      }

      // this.windAnimations.windAnimation.enableBlending = true;
      // this.windAnimations.windAnimation.blendingSpeed = 0.015;
      // this.windAnimations.windAnimation.play(true);

      console.log(
        `Placed ${this.palms.length} palm trees using smart distribution`,
      );
    } catch (error) {
      console.error("Error loading palm trees:", error);
      // Fallback: create simple placeholder trees
      this.createPlaceholderTrees();
    }
  }

  // --- Create shared animations ---
  createSharedPalmAnimations() {
    if (this.sharedAnimations) return;

    // --- X sway ---
    const swayX = new BABYLON.Animation(
      "swayX",
      "rotation.x",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    swayX.setKeys([
      { frame: 0, value: 0 },
      { frame: swayDuration * 0.25, value: -0.015 },
      { frame: swayDuration * 0.5, value: 0 },
      { frame: swayDuration * 0.75, value: 0.015 },
      { frame: swayDuration, value: 0 },
    ]);

    // --- Z sway ---
    const swayZ = new BABYLON.Animation(
      "swayZ",
      "rotation.z",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    swayZ.setKeys([
      { frame: 0, value: 0.006 },
      { frame: swayDuration * 0.25, value: 0 },
      { frame: swayDuration * 0.5, value: -0.006 },
      { frame: swayDuration * 0.75, value: 0 },
      { frame: swayDuration, value: 0.006 },
    ]);

    // --- Y twist (0-centered, will add originalRotationY later) ---
    const twistY = new BABYLON.Animation(
      "twistY",
      "rotation.y",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    this.sharedAnimations = { swayX, swayZ, twistY };
  }
  createPalmWindGroup() {
    if (this.palmWindGroup) return;
    this.createSharedPalmAnimations();

    this.palmWindGroup = new BABYLON.AnimationGroup(
      "palmWindGroup",
      this.scene,
    );
    // Enable smooth blending
    this.palmWindGroup.enableBlending = true;
    this.palmWindGroup.blendingSpeed = 0.015;
    this.palmWindGroup.normalize(0, swayDuration);
  }
  addPalmToWind(treeParent: BABYLON.TransformNode) {
    this.createPalmWindGroup();
    const group = this.palmWindGroup!;
    const { swayX } = this.sharedAnimations!;
    // const originalRotationY = treeParent.rotation.y;
    // twistY.setKeys([
    //   { frame: 0, value: originalRotationY },
    //   { frame: swayDuration * 0.33, value: originalRotationY - 0.005 },
    //   { frame: swayDuration * 0.66, value: originalRotationY + 0.005 },
    //   { frame: swayDuration, value: originalRotationY },
    // ]);
    //// Add this palm as target to the shared animations
    group.addTargetedAnimation(swayX, treeParent);
    // group.addTargetedAnimation(swayZ, treeParent);
    // group.addTargetedAnimation(twistY.clone(), treeParent);
  }

  /**
   * Load and place 5 robots in zone 2 with cloned animations
   */
  async loadAndPlaceRobots(): Promise<void> {
    try {
      // Create root node for all robots
      this.robotsRootNode = new BABYLON.TransformNode("robotsRoot", this.scene);

      // Load the robot model
      const robotResult = await BABYLON.SceneLoader.ImportMeshAsync(
        "",
        "./",
        RobotModelPath,
        this.scene,
      );

      // Get the root mesh and animation groups
      const sourceRootMesh = robotResult.meshes[0];
      const sourceAnimationGroups = robotResult.animationGroups;

      // Hide source meshes
      robotResult.meshes.forEach((mesh) => mesh.setEnabled(false));

      // Stop all source animations
      sourceAnimationGroups.forEach((ag) => ag.stop());

      console.log(
        `Loaded robot model with ${sourceAnimationGroups.length} animation groups`,
      );
      console.log(
        "Available animations:",
        sourceAnimationGroups.map((ag) => ag.name),
      );

      // Clone and place 5 robots in zone 2
      // const robotCount = 5;
      for (let i = 0; i < this.robots.length; i++) {
        // Generate random position in zone 2 (ring between inner and outer radius)
        const position = this.getRandomPositionInZone2();

        // Clone the robot with its hierarchy
        const robotNode = cloneTransformHierarchy(
          sourceRootMesh as BABYLON.Mesh,
          this.scene,
          { nameSuffix: `robot_${i}` },
        );

        // Create an inner pivot node to fix model orientation
        // This allows us to rotate the model itself without affecting movement direction
        const modelPivot = new BABYLON.TransformNode(
          `robotPivot_${i}`,
          this.scene,
        );

        // Re-parent all children of robotNode to the pivot
        const children = robotNode.getChildren().slice(); // Clone array to avoid mutation issues
        children.forEach((child) => {
          child.parent = modelPivot;
        });

        // Parent pivot to robotNode
        modelPivot.parent = robotNode;

        // Rotate the pivot to align model's forward direction with +Z axis
        // Adjust this value based on how the model is oriented:
        // - Math.PI (180°) if model faces -Z
        // - Math.PI / 2 (90°) if model faces +X
        // - -Math.PI / 2 (-90°) if model faces -X
        // - 0 if model already faces +Z
        modelPivot.rotation.y = Math.PI * 1.5; // 180 degree rotation

        // Clone animation groups for this robot instance
        const clonedAnimationGroups = this.cloneAnimationGroupsForRobot(
          sourceAnimationGroups,
          robotNode,
          i,
        );

        // Get terrain height at robot position
        const terrainHeight = this.getTerrainHeightAt(position.x, position.z);
        position.y = terrainHeight;

        // Set position and random initial rotation
        robotNode.position = position;
        robotNode.rotation.y = Math.random() * Math.PI * 2;

        // Set scale (adjust as needed for your robot model)
        const scale = 5.0;
        robotNode.scaling.set(scale, scale, scale);

        // Enable shadows for robot meshes
        robotNode.getChildMeshes().forEach((mesh) => {
          if (mesh instanceof BABYLON.Mesh) {
            this.shadowGenerator?.addShadowCaster(mesh);
            mesh.receiveShadows = true;
          }
        });

        // Parent to root node
        robotNode.parent = this.robotsRootNode;

        // Update robot data
        if (this.robots[i]) {
          this.robots[i].robotNode = robotNode;
          this.robots[i].animationGroups = clonedAnimationGroups;
          this.robots[i].position = new BABYLON.Vector3(
            position.x,
            position.y,
            position.z,
          );
          this.robots[i].isMoving = false;
        }

        console.log(
          `Placed robot ${i} at position (${position.x.toFixed(2)}, ${position.z.toFixed(2)})`,
        );
      }

      console.log(
        `Successfully loaded and placed ${this.robots.length} robots in zone 2`,
      );
    } catch (error) {
      console.error("Error loading robots:", error);
    }
  }

  /**
   * Get a random position within zone 2 (ring around the farm)
   */
  private getRandomPositionInZone2(): BABYLON.Vector3 {
    // Generate random angle
    const angle = Math.random() * Math.PI * 2;

    // Generate random radius within zone 2
    const radius =
      ZONE2_INNER_RADIUS +
      Math.random() * (ZONE2_OUTER_RADIUS - ZONE2_INNER_RADIUS);

    // Convert polar to cartesian coordinates
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return new BABYLON.Vector3(x, 0, z);
  }

  /**
   * Clone animation groups for a specific robot instance
   */
  private cloneAnimationGroupsForRobot(
    sourceAnimationGroups: BABYLON.AnimationGroup[],
    robotNode: BABYLON.TransformNode,
    robotIndex: number,
  ): BABYLON.AnimationGroup[] {
    const clonedGroups: BABYLON.AnimationGroup[] = [];

    // Get all child transform nodes and meshes from the cloned robot
    const clonedNodes = new Map<string, BABYLON.Node>();
    robotNode.getDescendants(false).forEach((node) => {
      // Extract the original name without the suffix
      const originalName = node.name.replace(/_robot_\d+$/g, "");
      clonedNodes.set(originalName, node);
    });
    // Also map the root node
    const rootOriginalName = robotNode.name.replace(/_robot_\d+$/g, "");
    clonedNodes.set(rootOriginalName, robotNode);

    sourceAnimationGroups.forEach((sourceGroup) => {
      const clonedGroup = new BABYLON.AnimationGroup(
        `${sourceGroup.name}_robot_${robotIndex}`,
        this.scene,
      );

      let matchedTargets = 0;

      // Clone each targeted animation and retarget to cloned nodes
      sourceGroup.targetedAnimations.forEach((targetedAnim) => {
        const originalTarget = targetedAnim.target;
        const originalName = originalTarget.name;

        // Try to find the corresponding cloned node
        let clonedTarget = clonedNodes.get(originalName);

        // If not found, try partial matching using forEach
        if (!clonedTarget) {
          clonedNodes.forEach((node, key) => {
            if (
              !clonedTarget &&
              (key.includes(originalName) || originalName.includes(key))
            ) {
              clonedTarget = node;
            }
          });
        }

        if (clonedTarget) {
          // Clone the animation
          const clonedAnimation = targetedAnim.animation.clone();
          clonedGroup.addTargetedAnimation(clonedAnimation, clonedTarget);
          matchedTargets++;
        }
      });

      if (matchedTargets > 0) {
        clonedGroups.push(clonedGroup);
        console.log(
          `Cloned animation group "${sourceGroup.name}" for robot ${robotIndex} with ${matchedTargets} targets`,
        );
      }
    });

    return clonedGroups;
  }

  /**
   * Move a robot to a palm tree with smooth, realistic pathfinding movement
   * Uses the "1LYN" animation during movement
   * @param robotId - The ID of the robot to move
   * @param palmId - The ID of the target palm tree
   */
  async moveRobotToPalm(
    robotId: string,
    palmId: string,
  ): Promise<{ robotId: string }> {
    // Find the robot and palm
    const robot = this.robots.find((r) => r.id === robotId);
    const palm = this.palms.find((p) => p.id === palmId);
    const speed = 10; // units per second

    console.log(`Command received: Move Robot  `, robot);
    if (!robot || !palm) {
      console.error(`Robot ${robotId} or Palm ${palmId} not found`);
      return { robotId };
    }

    if (!robot.robotNode) {
      console.error(`Robot ${robotId} has no node`);
      return { robotId };
    }

    if (robot.isMoving) {
      console.warn(`Robot ${robotId} is already moving`);
      return { robotId };
    }

    // Mark robot as moving
    robot.isMoving = true;

    // Get positions
    const startPos = robot.robotNode.position.clone();
    const targetPos = palm.palmNode
      ? palm.palmNode.position.clone()
      : new BABYLON.Vector3(palm.position.x, 0, palm.position.z);

    // Offset target to stop near the palm, not inside it
    const approachDistance = 4.0; // Stop 4 units away from palm center
    const directionToTarget = targetPos.subtract(startPos).normalize();
    const finalTarget = targetPos.subtract(
      directionToTarget.scale(approachDistance),
    );

    // Find the "1LYN" animation (walking/movement animation)
    const walkAnimation = robot.animationGroups?.find((ag) =>
      ag.name.includes("1LYN"),
    );

    if (walkAnimation) {
      walkAnimation.start(true); // Loop the walk animation
    }

    // Calculate path avoiding palm trees
    const path = this.calculatePathAvoidingPalms(startPos, finalTarget);
    // Animate along the path with specified speed
    await this.animateRobotAlongPath(robot, path, speed);

    // Stop walking animation and mark as completed
    if (walkAnimation) {
      walkAnimation.stop();
    }

    robot.isMoving = false;
    robot.position = new BABYLON.Vector3(
      robot.robotNode.position.x,
      robot.robotNode.position.y,
      robot.robotNode.position.z,
    );

    console.log(`Robot ${robotId} reached palm ${palmId}`);
    return { robotId };
  }

  /**
   * Calculate a path from start to end that avoids palm trees
   * Uses a simple waypoint-based pathfinding approach
   */
  private calculatePathAvoidingPalms(
    start: BABYLON.Vector3,
    end: BABYLON.Vector3,
  ): BABYLON.Vector3[] {
    const path: BABYLON.Vector3[] = [start.clone()];
    const obstacleRadius = 4.0; // Minimum distance to keep from palm trees
    const stepSize = 2.0; // How far to move in each step

    let currentPos = start.clone();
    const maxIterations = 500; // Prevent infinite loops
    let iterations = 0;

    while (
      BABYLON.Vector3.Distance(currentPos, end) > stepSize &&
      iterations < maxIterations
    ) {
      iterations++;

      // Direction to target
      const dirToTarget = end.subtract(currentPos).normalize();

      // Check if direct path is blocked by any palm
      let blocked = false;
      let closestObstacle: BABYLON.Vector3 | null = null;
      let minObstacleDistance = Infinity;

      for (const palm of this.palms) {
        if (!palm.palmNode) continue;

        const palmPos = palm.palmNode.position;
        const toPalm = palmPos.subtract(currentPos);
        const distToPalm = toPalm.length();

        // Check if palm is in our way (within a cone towards target)
        const dotProduct = BABYLON.Vector3.Dot(toPalm.normalize(), dirToTarget);

        if (dotProduct > 0.3 && distToPalm < obstacleRadius * 3) {
          // Palm is roughly in front of us and close
          const perpDist = Math.sqrt(
            distToPalm * distToPalm -
              Math.pow(BABYLON.Vector3.Dot(toPalm, dirToTarget), 2),
          );

          if (perpDist < obstacleRadius && distToPalm < minObstacleDistance) {
            blocked = true;
            closestObstacle = palmPos.clone();
            minObstacleDistance = distToPalm;
          }
        }
      }

      let nextPos: BABYLON.Vector3;

      if (blocked && closestObstacle) {
        // Calculate avoidance direction (perpendicular to obstacle)
        const toObstacle = closestObstacle.subtract(currentPos);
        toObstacle.y = 0;

        // Choose left or right based on which is closer to target
        const perpLeft = new BABYLON.Vector3(-toObstacle.z, 0, toObstacle.x)
          .normalize()
          .scale(obstacleRadius * 1.2);
        const perpRight = new BABYLON.Vector3(toObstacle.z, 0, -toObstacle.x)
          .normalize()
          .scale(obstacleRadius * 1.2);

        const leftPoint = closestObstacle.add(perpLeft);
        const rightPoint = closestObstacle.add(perpRight);

        // Choose the point closer to the final destination
        const leftDist = BABYLON.Vector3.Distance(leftPoint, end);
        const rightDist = BABYLON.Vector3.Distance(rightPoint, end);

        const avoidPoint = leftDist < rightDist ? leftPoint : rightPoint;
        const avoidDir = avoidPoint.subtract(currentPos).normalize();

        nextPos = currentPos.add(avoidDir.scale(stepSize));
      } else {
        // No obstacle, move directly towards target
        nextPos = currentPos.add(dirToTarget.scale(stepSize));
      }

      nextPos.y = 0; // Keep on ground
      currentPos = nextPos.clone();
      path.push(currentPos.clone());
    }

    // Add final position
    path.push(end.clone());

    // Smooth the path using Catmull-Rom spline interpolation
    return this.smoothPath(path);
  }

  /**
   * Smooth a path using Catmull-Rom spline interpolation for natural movement
   */
  private smoothPath(path: BABYLON.Vector3[]): BABYLON.Vector3[] {
    if (path.length < 3) return path;

    const smoothedPath: BABYLON.Vector3[] = [];
    const segmentsPerPoint = 8; // More interpolation points for smoother curves

    for (let i = 0; i < path.length - 1; i++) {
      const p0 = path[Math.max(0, i - 1)];
      const p1 = path[i];
      const p2 = path[Math.min(path.length - 1, i + 1)];
      const p3 = path[Math.min(path.length - 1, i + 2)];

      for (let t = 0; t < segmentsPerPoint; t++) {
        const u = t / segmentsPerPoint;
        const point = this.catmullRomInterpolate(p0, p1, p2, p3, u);
        smoothedPath.push(point);
      }
    }

    // Add final point
    smoothedPath.push(path[path.length - 1].clone());

    return smoothedPath;
  }

  /**
   * Catmull-Rom spline interpolation
   */
  private catmullRomInterpolate(
    p0: BABYLON.Vector3,
    p1: BABYLON.Vector3,
    p2: BABYLON.Vector3,
    p3: BABYLON.Vector3,
    t: number,
  ): BABYLON.Vector3 {
    const t2 = t * t;
    const t3 = t2 * t;

    const x =
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

    const z =
      0.5 *
      (2 * p1.z +
        (-p0.z + p2.z) * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);

    return new BABYLON.Vector3(x, 0, z);
  }

  /**
   * Normalize angle to range [-PI, PI]
   */
  private normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }

  /**
   * Smoothly interpolate between two angles
   */
  private lerpAngle(from: number, to: number, t: number): number {
    const diff = this.normalizeAngle(to - from);
    return from + diff * t;
  }

  /**
   * Animate robot along a path with smooth movement and rotation
   * Completely rewritten for ultra-smooth movement
   * @param robot - The robot to animate
   * @param path - Array of waypoints to follow
   * @param speed - Movement speed in units per second
   */
  private async animateRobotAlongPath(
    robot: Robot & {
      robotNode?: BABYLON.TransformNode;
      animationGroups?: BABYLON.AnimationGroup[];
      isMoving?: boolean;
    },
    path: BABYLON.Vector3[],
    speed: number = 25,
  ): Promise<void> {
    if (!robot.robotNode || path.length < 2) return;

    const robotNode = robot.robotNode;

    // Calculate total path length
    let totalLength = 0;
    const segmentLengths: number[] = [0];
    for (let i = 1; i < path.length; i++) {
      const segLen = BABYLON.Vector3.Distance(path[i - 1], path[i]);
      totalLength += segLen;
      segmentLengths.push(totalLength);
    }

    // Calculate duration based on path length
    const duration = totalLength / speed;

    return new Promise((resolve) => {
      const startTime = performance.now();
      let lastRotation = robotNode.rotation.y;

      const animate = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        // Apply easing for smooth start/stop
        const easedProgress = this.easeInOutCubic(progress);

        // Find position along path based on progress
        const targetDistance = easedProgress * totalLength;

        // Find which segment we're on
        let segmentIndex = 0;
        for (let i = 1; i < segmentLengths.length; i++) {
          if (segmentLengths[i] >= targetDistance) {
            segmentIndex = i - 1;
            break;
          }
          segmentIndex = i - 1;
        }

        // Interpolate within segment
        const segmentStart = segmentLengths[segmentIndex];
        const segmentEnd =
          segmentLengths[Math.min(segmentIndex + 1, segmentLengths.length - 1)];
        const segmentLength = segmentEnd - segmentStart;
        const segmentProgress =
          segmentLength > 0
            ? (targetDistance - segmentStart) / segmentLength
            : 0;

        // Get interpolated position
        const p1 = path[segmentIndex];
        const p2 = path[Math.min(segmentIndex + 1, path.length - 1)];
        const newPos = BABYLON.Vector3.Lerp(p1, p2, segmentProgress);

        // Get terrain height
        const terrainHeight = this.getTerrainHeightAt(newPos.x, newPos.z);

        // Add subtle bobbing based on movement
        const bobAmount = Math.sin(elapsed * 12) * 0.02 * (1 - progress * 0.5);
        newPos.y = terrainHeight + bobAmount;

        // Calculate direction for rotation (look ahead)
        const lookAheadDist = Math.min(targetDistance + 2, totalLength);
        let lookAheadIndex = segmentIndex;
        for (let i = segmentIndex; i < segmentLengths.length; i++) {
          if (segmentLengths[i] >= lookAheadDist) {
            lookAheadIndex = i;
            break;
          }
          lookAheadIndex = i;
        }

        const lookAheadPoint = path[Math.min(lookAheadIndex, path.length - 1)];
        const direction = lookAheadPoint.subtract(newPos);
        direction.y = 0;

        if (direction.length() > 0.01) {
          const targetRotation = Math.atan2(direction.x, direction.z);

          // Very smooth rotation interpolation
          const rotationSmoothing = 0.15; // Lower = smoother
          lastRotation = this.lerpAngle(
            lastRotation,
            targetRotation,
            rotationSmoothing,
          );
          robotNode.rotation.y = lastRotation;
        }

        // Update position
        robotNode.position.copyFrom(newPos);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure final position is exact
          const finalPos = path[path.length - 1].clone();
          finalPos.y = this.getTerrainHeightAt(finalPos.x, finalPos.z);
          robotNode.position.copyFrom(finalPos);
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  /**
   * Cubic ease-in-out function for smooth acceleration/deceleration
   */
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Calculate remaining distance along the path from current position
   */
  private calculateRemainingPathDistance(
    path: BABYLON.Vector3[],
    currentIndex: number,
    currentPos: BABYLON.Vector3,
  ): number {
    let distance = 0;
    const pos = currentPos.clone();
    pos.y = 0;

    // Distance to next waypoint
    if (currentIndex + 1 < path.length) {
      const next = path[currentIndex + 1].clone();
      next.y = 0;
      distance += BABYLON.Vector3.Distance(pos, next);
    }

    // Sum remaining path segments
    for (let i = currentIndex + 1; i < path.length - 1; i++) {
      const p1 = path[i].clone();
      const p2 = path[i + 1].clone();
      p1.y = 0;
      p2.y = 0;
      distance += BABYLON.Vector3.Distance(p1, p2);
    }

    return distance;
  }

  /**
   * Get terrain height at a given world position (x, z)
   * Uses raycasting for accurate height detection on heightmap terrain
   */
  getTerrainHeightAt(x: number, z: number): number {
    // If terrain mesh is available and has getHeightAtCoordinates method
    if (this.terrainMesh) {
      // Use getHeightAtCoordinates for GroundMesh (accurate for heightmap)
      const height = this.terrainMesh.getHeightAtCoordinates(x, z);
      if (height !== undefined && !isNaN(height)) {
        return height;
      }
    }

    // // Fallback: Use raycasting to find terrain height
    // const ray = new BABYLON.Ray(
    //   new BABYLON.Vector3(x, 100, z), // Start high above
    //   new BABYLON.Vector3(0, -1, 0), // Cast downward
    //   200, // Max distance
    // );

    // const pickInfo = this.scene.pickWithRay(ray, (mesh) => {
    //   return mesh.name === "surroundingMountains" || mesh.name.includes("ground");
    // });

    // if (pickInfo?.hit && pickInfo.pickedPoint) {
    //   return pickInfo.pickedPoint.y;
    // }

    // Default fallback to ground level
    return 0;
  }

  /**
   * Get robot by ID
   */
  getRobotById(robotId: string):
    | (Robot & {
        robotNode?: BABYLON.TransformNode;
        animationGroups?: BABYLON.AnimationGroup[];
        isMoving?: boolean;
      })
    | undefined {
    return this.robots.find((r) => r.id === robotId);
  }

  /**
   * Get palm by ID
   */
  getPalmById(
    palmId: string,
  ): (Palm & { palmNode?: BABYLON.TransformNode }) | undefined {
    return this.palms.find((p) => p.id === palmId);
  }

  createPlaceholderTrees() {
    // Fallback simple trees if models fail to load
    const treeSpacing = 12;
    const treesPerRow = Math.floor(FarmSize / treeSpacing) - 1;
    const offset = -(treesPerRow * treeSpacing) / 2;

    for (let row = 0; row < treesPerRow; row++) {
      for (let col = 0; col < treesPerRow; col++) {
        const x = offset + col * treeSpacing + (Math.random() - 0.5) * 1.5;
        const z = offset + row * treeSpacing + (Math.random() - 0.5) * 1.5;

        // Simple trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder(
          `simplePalm_${row}_${col}_trunk`,
          { height: 8, diameterTop: 0.3, diameterBottom: 0.5 },
          this.scene,
        );
        trunk.position.set(x, 4, z);

        const trunkMat = new BABYLON.StandardMaterial(
          `simpleTrunkMat_${row}_${col}`,
          this.scene,
        );
        trunkMat.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
        trunk.material = trunkMat;

        // Simple palm fronds
        for (let i = 0; i < 6; i++) {
          const frond = BABYLON.MeshBuilder.CreateBox(
            `frond_${row}_${col}_${i}`,
            { width: 0.3, height: 0.1, depth: 4 },
            this.scene,
          );
          frond.position.set(x, 8, z);
          frond.rotation.y = (i / 6) * Math.PI * 2;
          frond.rotation.x = Math.PI / 6;

          const frondMat = new BABYLON.StandardMaterial(
            `frondMat_${row}_${col}_${i}`,
            this.scene,
          );
          frondMat.diffuseColor = new BABYLON.Color3(0.1, 0.4, 0.1);
          frond.material = frondMat;

          this.shadowGenerator?.addShadowCaster(frond);
        }

        this.shadowGenerator?.addShadowCaster(trunk);
        trunk.receiveShadows = true;
      }
    }
  }
}
// Exporting a factory function for creating the BabylonManager instance
export const createStudioSceneManager = (
  props: IStudioSceneManagerProps,
): StudioSceneManager => {
  return new StudioSceneManager(props);
};

export const exportedStudioSceneMethods = (
  sceneManager: StudioSceneManager,
): StudioSceneExports => {
  return {
    moveRobotToPalm: async (robotId: string, palmId: string) => {
      return sceneManager.moveRobotToPalm(robotId, palmId);
    },
  };
};

export type StudioSceneExports = {
  moveRobotToPalm: (
    robotId: string,
    palmId: string,
  ) => Promise<{ robotId: string }>;
};
