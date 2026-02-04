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
  clearSelectionUI: () => void;
  takeFarmTour: (robotId: string) => void;
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

  // Selection properties (for both palms and robots)
  private selectedEntityId?: string;
  private selectedEntityType?: "palm" | "robot";
  private selectionCircle?: BABYLON.Mesh;
  private selectionAnimationGroup?: BABYLON.AnimationGroup;
  private onEntitySelectedCallback?: (
    entityId: string | null,
    entityType: "palm" | "robot" | null,
  ) => void;
  private clearSelectionUI: () => void;
  private takeFarmTour: (robotId: string) => void;

  // Farm tour tracking for cancellation
  private activeFarmTours: Map<string, AbortController> = new Map();

  constructor(props: IStudioSceneManagerProps) {
    this.engine = props.engine;
    this.canvas = props.canvas;
    this.scene = new BABYLON.Scene(this.engine);
    this.palms = props.defaultData.palms;
    this.robots = props.defaultData.robots;
    this.onReady = props.onReady;
    this.clearSelectionUI = props.clearSelectionUI;
    this.takeFarmTour = props.takeFarmTour;
  }

  //#region  MainSceneProperties
  async createScene() {
    try {
      //Create Scene
      this.scene.clearColor = new BABYLON.Color4(0.68, 0.78, 0.88, 1); // Lighter sky for better fog blend
      // Add linear fog for distant mountains (not affecting near farm area)
      // this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
      // this.scene.fogStart = 2000; // Fog begins at distance (beyond farm)
      // this.scene.fogEnd = 9500; // Full fog at far mountains
      // this.scene.fogColor = new BABYLON.Color3(0.75, 0.82, 0.92); // Lighter atmospheric fog
      this.scene.useRightHandedSystem = true; // optional

      // PERFORMANCE: Scene optimization flags
      this.scene.autoClear = false; // Disable auto-clearing for better performance
      this.scene.autoClearDepthAndStencil = true; // But still clear depth
      this.scene.blockMaterialDirtyMechanism = true; // Block material dirty for performance
      
      // PERFORMANCE: Enable frustum culling
      this.scene.skipFrustumClipping = false;

      // PERFORMANCE: Reduce physics update frequency if needed
      this.scene.useConstantAnimationDeltaTime = true;
      
      // PERFORMANCE: Additional optimizations
      this.scene.skipPointerMovePicking = true; // Skip picking on pointer move
      this.scene.constantlyUpdateMeshUnderPointer = false;

      //Installation
      this.camera = this.createCamera(); //create Camera
      this.setUpEnvironMent(); //set up the environment      // Load the room with progress tracking
      await this.initFarmEnvironment();

      // Setup click handlers for palm selection
      this.setupSceneClickHandlers();

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
    // Create orbit camera (ArcRotateCamera)
    const camera = new BABYLON.ArcRotateCamera(
      "FarmCamera",
      -Math.PI / 2, // Alpha (horizontal rotation)
      Math.PI / 3, // Beta (vertical rotation) - angled view of farm
      250, // Radius - distance from center
      new BABYLON.Vector3(0, 0, 0), // Target center of farm
      this.scene,
    );

    // Enable touch controls for mobile devices
    camera.attachControl(this.canvas, true);

    // Limit camera movement to focus on central farm area
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 1500;

    // Limit vertical rotation to keep farm in view
    camera.lowerBetaLimit = 0.2;
    camera.upperBetaLimit = Math.PI / 2.05;

    // Allow full horizontal rotation (360 degrees)
    camera.lowerAlphaLimit = null;
    camera.upperAlphaLimit = null;

    // Enable zoom with mouse wheel
    camera.wheelPrecision = 10;
    camera.pinchPrecision = 75;

    // Disable panning to keep focus on center
    camera.panningSensibility = 20;

    // Smooth camera movements - PERFORMANCE: disable bouncing
    camera.useBouncingBehavior = false;
    camera.useAutoRotationBehavior = false;

    // PERFORMANCE: Reduce inertia for snappier response
    camera.inertia = 0.7;

    // Set target to center of farm
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));

    this.scene.activeCamera = camera;

    return camera;
  }

  setUpEnvironMent() {
    // Load local environment texture
    const environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      "environment/skyEnvironment.env",
      this.scene,
    );
    this.scene.environmentTexture = environmentTexture;
    this.scene.environmentIntensity = 1.4;

    // Simple directional light - positioned to match environment sun
    const sunLight = new BABYLON.DirectionalLight(
      "SunLight",
      new BABYLON.Vector3(0.5, -0.8, 0.2), // Direction pointing down from sky
      this.scene,
    );
    // Position the light far away in the direction the sun appears
    sunLight.position = new BABYLON.Vector3(-500, 800, -200);
    sunLight.intensity = 2;
    sunLight.diffuse = new BABYLON.Color3(0.99, 0.75, 0.45); // Warm sand tint
    sunLight.specular = new BABYLON.Color3(0.99, 0.78, 0.50); // Warm sand specular
    sunLight.direction.normalize();
    sunLight.autoCalcShadowZBounds = true;

    // Simple ambient light
    const ambientLight = new BABYLON.HemisphericLight(
      "AmbientLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene,
    );
    ambientLight.intensity = 0.55;
    ambientLight.diffuse = new BABYLON.Color3(0.988, 0.75, 0.45); // Sand shade diffuse
    ambientLight.specular = new BABYLON.Color3(0.95, 0.70, 0.40); // Sand shade specular
    ambientLight.groundColor = new BABYLON.Color3(0.85, 0.55, 0.30); // Warm sand ground color

    // PERFORMANCE: Optimized shadow generator
    this.shadowGenerator = new BABYLON.ShadowGenerator(512, sunLight); // Reduced resolution
    this.shadowGenerator.usePercentageCloserFiltering = true;
    this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW; // Lower quality for performance
    this.shadowGenerator.darkness = 0.35;
    this.shadowGenerator.bias = 0.001;
    this.shadowGenerator.normalBias = 0.01;

    // Create simple skybox
    this.createSkybox();

    // Setup advanced post-processing effects
    this.setupPostProcessing();

    // Add elegant lens flares
    // this.createLensFlares(sunLight);
  }

  createSkybox() {
    // Create default skybox like in Babylon.js sandbox
    if (this.scene.environmentTexture) {
      const skybox = this.scene.createDefaultSkybox(
        this.scene.environmentTexture,
        true, // Create PBR skybox
        10000, // Size
        0.08,
      );
      return skybox;
    }
    return null;
  }

  /**
   * Create elegant lens flares for the sun light
   */
  createLensFlares(light: BABYLON.DirectionalLight) {
    // Create lens flare system attached to the sun light
    const lensFlareSystem = new BABYLON.LensFlareSystem(
      "sunLensFlares",
      light,
      this.scene,
    );

    // Load flare textures from Babylon.js assets
    const flareTexture = "https://assets.babylonjs.com/textures/flare.png";

    // Main sun glow - large, soft, warm
    new BABYLON.LensFlare(
      100, // Size
      0, // Position (0 = at light source)
      new BABYLON.Color3(0.99, 0.75, 0.45), // Sand shade glow
      flareTexture,
      lensFlareSystem,
    );

    // Secondary warm glow
    new BABYLON.LensFlare(
      0.3,
      0,
      new BABYLON.Color3(0.988, 0.647, 0.310), // #FCA54F sand
      flareTexture,
      lensFlareSystem,
    );

    // Subtle rainbow streak
    new BABYLON.LensFlare(
      0.1,
      0.3,
      new BABYLON.Color3(0.9, 0.6, 0.4), // Orange tint
      flareTexture,
      lensFlareSystem,
    );

    // Green ghost flare
    new BABYLON.LensFlare(
      0.08,
      0.5,
      new BABYLON.Color3(0.5, 0.8, 0.5), // Soft green
      flareTexture,
      lensFlareSystem,
    );

    // Blue ghost flare
    new BABYLON.LensFlare(
      0.12,
      0.7,
      new BABYLON.Color3(0.4, 0.6, 0.9), // Soft blue
      flareTexture,
      lensFlareSystem,
    );

    // Small bright flare
    new BABYLON.LensFlare(
      0.05,
      0.9,
      new BABYLON.Color3(0.99, 0.78, 0.50), // Warm sand
      flareTexture,
      lensFlareSystem,
    );

    // Distant small warm flare
    new BABYLON.LensFlare(
      0.06,
      1.2,
      new BABYLON.Color3(0.95, 0.65, 0.35), // Sand shade
      flareTexture,
      lensFlareSystem,
    );

    // Final distant glow
    new BABYLON.LensFlare(
      0.15,
      1.5,
      new BABYLON.Color3(0.8, 0.7, 0.9), // Subtle purple
      flareTexture,
      lensFlareSystem,
    );

    return lensFlareSystem;
  }

  setupPostProcessing() {
    if (!this.camera) return;

    // PERFORMANCE: Optimized HDR rendering pipeline
    const pipeline = new BABYLON.DefaultRenderingPipeline(
      "professionalPipeline",
      true, // HDR enabled
      this.scene,
      [this.camera],
    );

    // ===== BLOOM - DISABLED FOR PERFORMANCE =====
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.35; // Higher threshold to limit bloom
    pipeline.bloomWeight = 0.2; // Reduced intensity
    pipeline.bloomKernel = 32; // Smaller kernel for performance

    // ===== DEPTH OF FIELD - DISABLED =====
    pipeline.depthOfFieldEnabled = false;

    // ===== CHROMATIC ABERRATION - DISABLED =====
    pipeline.chromaticAberrationEnabled = false;

    // ===== FILM GRAIN - DISABLED =====
    pipeline.grainEnabled = false;

    // ===== IMAGE PROCESSING - OPTIMIZED =====
    pipeline.imageProcessingEnabled = true;

    // Exposure and contrast
    pipeline.imageProcessing.contrast = 1.4; // Reduced for performance
    pipeline.imageProcessing.exposure = 1.1;

    // Tone mapping - use ACES for better quality/performance balance
    pipeline.imageProcessing.toneMappingEnabled = true;
    pipeline.imageProcessing.toneMappingType =
      BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;

    // Disable color processing for performance
    pipeline.imageProcessing.colorCurvesEnabled = false;
    pipeline.imageProcessing.colorGradingEnabled = false;

    // Vignette - simplified
    pipeline.imageProcessing.vignetteEnabled = true;
    pipeline.imageProcessing.vignetteWeight = 1.2;
    pipeline.imageProcessing.vignetteStretch = 0.5;

    // ===== SHARPENING - DISABLED =====
    pipeline.sharpenEnabled = false;

    // ===== ANTI-ALIASING - OPTIMIZED =====
    // Use FXAA only (cheaper than MSAA)
    pipeline.samples = 2; // Disable MSAA for performance
    pipeline.fxaaEnabled = true; // FXAA is cheaper

    // ===== GLOW LAYER - OPTIMIZED =====
    const glowLayer = new BABYLON.GlowLayer("professionalGlow", this.scene, {
      mainTextureFixedSize: 256, // PERFORMANCE: Smaller glow texture
      blurKernelSize: 32, // PERFORMANCE: Smaller blur kernel
    });
    glowLayer.intensity = 1;
    // Set glow color to sand shade (#FCA54F) instead of white
    // glowLayer.neutralColor = new BABYLON.Color4(0.988, 0.647, 0.310, 0); // Sand shade neutral color

    // Disable glow layer in pipeline (we manage it manually)
    pipeline.glowLayerEnabled = false;

    // Store pipeline reference for potential updates
    (this as any)._renderingPipeline = pipeline;
    (this as any)._glowLayer = glowLayer;
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

    // 0. Load terrain ground mesh
    await this.loadTerrainGround();

    // 1. Create background environment (larger surrounding area)
    // this.createBackgroundEnvironment();

    // 2. Load and place palm trees in the central farm
    await this.loadAndPlacePalmTrees();

    // 3. Load and place robots in zone 2
    await this.loadAndPlaceRobots().then(() => {
      setTimeout(() => {
        this.robots.forEach((robot) => {
          this.takeFarmTour(robot.id);
        });
      }, 5000);
    });

    // setTimeout(() => {
    //   this.scene.debugLayer.show();
    // }, 5000);

    // 4. Add visual boundary indicator
    this.createFarmBoundary();

    // Add atmospheric effects
    // this.addAtmosphericEffects();
  }


  /**
   * Adds custom glitter/sparkle effect to sand material using shader customization
   * Creates view-dependent sparkles that simulate individual sand grain reflections
   */
  addSandGlitterEffect(
    material: BABYLON.PBRMaterial,
    glitterTexture: BABYLON.Texture,
  ): void {
    // Custom shader code for sand glitter sparkles
    material.customShaderNameResolve = (
      shaderName,
      uniforms,
      _uniformBuffers,
      samplers,
    ) => {
      // Add custom uniforms
      uniforms.push("glitterIntensity");
      uniforms.push("glitterDensity");
      uniforms.push("glitterThreshold");
      uniforms.push("time");
      uniforms.push("sunDirection");
      
      // Add glitter texture sampler
      samplers.push("glitterNoiseSampler");

      return shaderName;
    };

    // Store glitter texture for shader
    material.onBindObservable.add(() => {
      const effect = material.getEffect();
      if (effect) {
        // Set glitter uniforms
        effect.setFloat("glitterIntensity", 0.8);
        effect.setFloat("glitterDensity", 150.0);
        effect.setFloat("glitterThreshold", 0.92);
        effect.setFloat("time", performance.now() / 1000.0);
        
        // Sun direction for sparkle alignment
        const sunDir = new BABYLON.Vector3(0.5, -0.8, 0.2).normalize();
        effect.setVector3("sunDirection", sunDir);

        // Bind glitter texture
        effect.setTexture("glitterNoiseSampler", glitterTexture);
      }
    });

    // Inject custom shader code for glitter effect
    BABYLON.Effect.ShadersStore["pbrCustomGlitterPixelShader"] = `
      // Sand Glitter Sparkle Effect
      // Simulates light catching individual sand grains
      
      float calculateGlitter(vec2 uv, vec3 viewDir, vec3 normal, float time) {
        // Sample noise at multiple frequencies for natural variation
        vec2 glitterUV1 = uv * 50.0;
        vec2 glitterUV2 = uv * 120.0 + vec2(time * 0.01, 0.0);
        vec2 glitterUV3 = uv * 200.0 - vec2(0.0, time * 0.005);
        
        // Pseudo-random based on UV
        float noise1 = fract(sin(dot(glitterUV1, vec2(12.9898, 78.233))) * 43758.5453);
        float noise2 = fract(sin(dot(glitterUV2, vec2(39.346, 11.135))) * 43758.5453);
        float noise3 = fract(sin(dot(glitterUV3, vec2(73.156, 52.235))) * 43758.5453);
        
        // Combine noise layers
        float combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
        
        // View-dependent sparkle (Fresnel-like)
        float NdotV = max(dot(normal, viewDir), 0.0);
        float fresnelSparkle = pow(1.0 - NdotV, 3.0);
        
        // Threshold for discrete sparkles
        float sparkle = step(0.97, combinedNoise) * fresnelSparkle;
        
        // Add subtle shimmer
        float shimmer = pow(combinedNoise, 8.0) * 0.3;
        
        return sparkle + shimmer;
      }
    `;

    // Add to PBR shader using built-in customization points
    material.customShaderNameResolve = (
      shaderName,
    ) => {
      return shaderName;
    };

    // Use material plugin for proper shader injection
    this.createSandGlitterPlugin(material, glitterTexture);
  }

  /**
   * Creates a material plugin for sand glitter effect
   * This properly integrates with Babylon.js PBR pipeline
   */
  createSandGlitterPlugin(
    material: BABYLON.PBRMaterial,
    glitterTexture: BABYLON.Texture,
  ): void {
    // Create custom material plugin for glitter
    const glitterPlugin = new SandGlitterPluginMaterial(material, glitterTexture, this.scene);
    
    // Store reference for potential updates
    (material as any)._sandGlitterPlugin = glitterPlugin;
  }

  /**
   * Creates an advanced terrain sand material using all available World Creator maps
   * This is specifically designed for the loaded terrain mesh with full texture support
   */
  createAdvancedTerrainSandMaterial(
    texturePath: string,
    filePrefix: string,
  ): BABYLON.Material {
    const sandMat = new BABYLON.PBRMaterial("terrainSandMaterial", this.scene);

    // ============ LOAD ALL TEXTURES FROM terain/models/test/ (kok_* schema) ============
    
    // Primary colormap/albedo from World Creator
    const colorMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Colormap_0_0.png`,
      this.scene,
    );

    // Normal map for surface detail
    const normalMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Normal Map_0_0.png`,
      this.scene,
    );

    // Roughness map
    const roughnessMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Roughness Map_0_0.png`,
      this.scene,
    );

    // Metalness map
    const metalnessMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Metalness Map_0_0.png`,
      this.scene,
    );

    // Ambient occlusion map
    const aoMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_AmbientOcclusionMap_0_0.png`,
      this.scene,
    );

    // Relief map for parallax depth effect
    const reliefMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Reliefmap_0_0.png`,
      this.scene,
    );

    // Height map for displacement effects
    const heightMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Height Map_3072x3072_0_0.png`,
      this.scene,
    );

    // Sand simulation map for erosion patterns
    const sandSimulationMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Simulation_Sand_3072x3072_0_0.png`,
      this.scene,
    );

    // Heatmap for detail variation
    const heatMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Heatmap__0_0.png`,
      this.scene,
    );

    // Splat map for texture blending
    const splatMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Splat Map_0_0_0.png`,
      this.scene,
    );

    // Topo map for contours
    const topoMap = new BABYLON.Texture(
      `${texturePath}${filePrefix}_Topo Map_0_0.png`,
      this.scene,
    );

    // ============ MATERIAL CONFIGURATION ============

    // Albedo with warm orange sand color (#FF3800)
    sandMat.albedoTexture = colorMap;
    sandMat.albedoColor = BABYLON.Color3.FromHexString("#ffffff"); // #f7a189 orange-red sand

    // Primary normal map
    sandMat.bumpTexture = normalMap;
    sandMat.invertNormalMapY = true;
    sandMat.bumpTexture.level = 1;

    // Roughness configuration - use roughness map directly
    sandMat.metallicTexture = roughnessMap;
    sandMat.useRoughnessFromMetallicTextureGreen = true;
    sandMat.useRoughnessFromMetallicTextureAlpha = false;
    sandMat.roughness = 0.75; // Base roughness for sand

    // Metallic - very low for sand (silica has minimal metallic property)
    sandMat.metallic = 0.0; // Sand is non-metallic
    sandMat.useMetallnessFromMetallicTextureBlue = false;

    // Ambient occlusion for shadows in dunes
    sandMat.ambientTexture = aoMap;
    sandMat.ambientTextureStrength = 1.2;
    sandMat.useAmbientInGrayScale = true;

    // Detail map using relief map for dune patterns
    sandMat.detailMap.texture = reliefMap;
    sandMat.detailMap.isEnabled = true;
    sandMat.detailMap.diffuseBlendLevel = 0.1;
    sandMat.detailMap.roughnessBlendLevel = 0.2;

    // ============ SUBSURFACE SCATTERING ============
    // Creates warm glow as light penetrates sand grains
    sandMat.subSurface.isTranslucencyEnabled = true;
    sandMat.subSurface.translucencyIntensity = 0.35;
    sandMat.subSurface.tintColor = BABYLON.Color3.FromHexString("#FCA54F"); // #FCA54F
    sandMat.subSurface.isScatteringEnabled = false; // Disable to fix black issue
    sandMat.subSurface.indexOfRefraction = 1; // Index of refraction = 1

    // ============ SHEEN LAYER ============
    // Velvet-like appearance for fine sand
    sandMat.sheen.isEnabled = true;
    sandMat.sheen.intensity = 0.2;
    sandMat.sheen.color = new BABYLON.Color3(0.988, 0.647, 0.310); // #FCA54F warm orange highlight
    sandMat.sheen.roughness = 0.6;
    sandMat.sheen.albedoScaling = true;

    // ============ ANISOTROPY ============
    // Creates directional highlights like wind-swept sand
    sandMat.anisotropy.isEnabled = false; // Disable to fix black specular

    // ============ MICRO SURFACE ============
    sandMat.microSurface = 0.9;

    // ============ ENVIRONMENT & LIGHTING - FIXED FOR WARM ORANGE ============
    sandMat.environmentIntensity = 1.0; // Increased for better reflections
    sandMat.directIntensity = 2.5; // Strong direct sunlight - warm orange appearance
    sandMat.specularIntensity = 0.15; // Low specular to avoid black spots
    sandMat.usePhysicalLightFalloff = true;
    sandMat.useRadianceOverAlpha = false; // Prevent alpha issues

    // ============ REFLECTION - WARM ORANGE TONES ============
    sandMat.reflectionColor = new BABYLON.Color3(0.988, 0.647, 0.310); // #FCA54F warm orange
    sandMat.reflectivityColor = new BABYLON.Color3(0.988, 0.647, 0.310); // Match albedo

    // ============ EMISSIVE - DISABLED FOR PERFORMANCE ============
    // sandMat.emissiveTexture = heatMap;
    // sandMat.emissiveColor = new BABYLON.Color3(0.988, 0.647, 0.310); // #FCA54F
    // sandMat.emissiveIntensity = 0.0;

    // ============ LIGHTMAP USING HEIGHT MAP ============
    sandMat.lightmapTexture = heightMap;
    // sandMat.useLightmapAsShadowmap = true;

    // ============ USE REMAINING TEXTURES ============
    // Use metalness map for reflectivity
    sandMat.reflectivityTexture = metalnessMap;
    
    // Use topo map for secondary bump detail
    sandMat.detailMap.texture = topoMap;
    sandMat.detailMap.bumpLevel =1;
    
    // Store sand simulation map reference (can be used for other effects)
    (sandMat as any)._sandSimulationMap = sandSimulationMap;

    // IMPORTANT: Do NOT use opacity texture - it makes mesh invisible
    // sandMat.opacityTexture = null;
    sandMat.alpha = 1.0; // Full opacity
    sandMat.transparencyMode = BABYLON.Material.MATERIAL_OPAQUE;

    // Back face culling
    sandMat.backFaceCulling = true;

    // Disable clear coat (can cause dark spots)
    sandMat.clearCoat.isEnabled = false;

    // ============ APPLY GLITTER PLUGIN USING SPLAT MAP ============
    // Use splat map as glitter noise source
    splatMap.uScale = 8;
    splatMap.vScale = 8;
    this.createSandGlitterPlugin(sandMat, splatMap);

    console.log("🏜️ Advanced terrain sand material created with kok_* textures:");
    console.log("  - Colormap, Normal, Roughness, Metalness, AO");
    console.log("  - Relief, Height, Heatmap, Splat, Topo, Sand Simulation maps");
    console.log("  - Subsurface scattering for warm #FCA54F glow");
    console.log("  - Sheen layer for velvet appearance");
    console.log("  - Fixed direct/specular lighting for warm orange color");

    return sandMat;
  }

  /**
   * Loads the World Creator terrain GLB mesh with advanced sand material
   * Uses ALL available texture maps for maximum visual quality
   */
  async loadTerrainGround(): Promise<BABYLON.AbstractMesh | null> {
    try {
      // Base path for World Creator terrain files
      const texturePath = "terain/models/test/";
      const filePrefix = "kok";

      // Load the terrain GLB mesh from World Creator export
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        "",
        texturePath,
        `${filePrefix}_Mesh_0_0.glb`,
        this.scene,
      );

      if (result.meshes.length === 0) {
        console.error("No meshes found in terrain GLB file");
        return null;
      }

      // Get the main terrain mesh (first mesh or root)
      const terrainMesh =
        result.meshes.find((mesh) => mesh.name !== "__root__") ||
        result.meshes[0];

      if (!terrainMesh) {
        console.error("Terrain mesh not found in loaded meshes");
        return null;
      }

      terrainMesh.name = "terrainGround";
      terrainMesh.scaling = new BABYLON.Vector3(1, 1, 1);
      terrainMesh.position = new BABYLON.Vector3(-500, -1, -500);
      
      // Ensure mesh is visible
      terrainMesh.isVisible = true;
      terrainMesh.setEnabled(true);

      // Apply the advanced sand material to the terrain mesh
      const advancedSandMaterial = this.createAdvancedTerrainSandMaterial(texturePath, filePrefix);
      (terrainMesh as BABYLON.Mesh).material = advancedSandMaterial;


      terrainMesh.receiveShadows = true;
      if (this.shadowGenerator) {
        this.shadowGenerator.addShadowCaster(terrainMesh);
      }
      // Store reference
      this.terrainMesh = terrainMesh as BABYLON.GroundMesh;

      // // PERFORMANCE: Freeze material after setup
      // advancedSandMaterial.freeze();

      // // PERFORMANCE: Freeze world matrix for static meshes
      // result.meshes.forEach((mesh) => {
      //   if (mesh.name !== "__root__" && mesh instanceof BABYLON.Mesh) {
      //     mesh.freezeWorldMatrix();
      //     mesh.doNotSyncBoundingInfo = true;
      //   }
      // });

      console.log("✅ World Creator terrain loaded with advanced sand material");
      console.log(
        "🏜️ Features: Glitter sparkles, subsurface scattering, anisotropic highlights, parallax depth",
      );
      console.log("⚡ Performance: Material frozen, world matrices frozen");

      return terrainMesh;
    } catch (error) {
      console.error("Error loading World Creator terrain:", error);
      return null;
    }
  }

  /**
   * Configuration interface for random obstacle placement
   */
  private obstacleConfig = {
    modelPaths: [] as string[],
    count: 50,
    minRadius: 500,
    maxRadius: 1500,
  };

  /**
   * Generate positions using Poisson-disk-like sampling for natural distribution
   * Ensures objects don't overlap and are spread realistically
   */
  private generatePoissonDiskPositions(
    count: number,
    minRadius: number,
    maxRadius: number,
  ): BABYLON.Vector3[] {
    const positions: BABYLON.Vector3[] = [];
    const minDistance = ((maxRadius - minRadius) / Math.sqrt(count)) * 0.8; // Minimum spacing between objects
    const maxAttempts = count * 10; // Prevent infinite loops
    let attempts = 0;

    while (positions.length < count && attempts < maxAttempts) {
      attempts++;

      // Generate random angle
      const angle = Math.random() * Math.PI * 2;

      // Generate random radius with bias towards outer edges (more natural distribution)
      // Using square root for uniform area distribution
      const radiusT = Math.random();
      const radius = Math.sqrt(
        minRadius * minRadius +
          radiusT * (maxRadius * maxRadius - minRadius * minRadius),
      );

      // Convert to Cartesian coordinates
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const newPos = new BABYLON.Vector3(x, 0, z);

      // Check distance from existing positions
      let tooClose = false;
      for (const existingPos of positions) {
        const distance = BABYLON.Vector3.Distance(newPos, existingPos);
        if (distance < minDistance) {
          tooClose = true;
          break;
        }
      }

      // Also add some clustering for natural rock formations
      const clusterChance = 0.15; // 15% chance to cluster
      if (
        !tooClose ||
        (Math.random() < clusterChance && positions.length > 0)
      ) {
        // For clustering, slightly offset from an existing position
        if (tooClose && Math.random() < clusterChance && positions.length > 0) {
          const clusterBase =
            positions[Math.floor(Math.random() * positions.length)];
          const clusterOffset = new BABYLON.Vector3(
            (Math.random() - 0.5) * minDistance * 0.5,
            0,
            (Math.random() - 0.5) * minDistance * 0.5,
          );
          const clusteredPos = clusterBase.add(clusterOffset);

          // Verify it's still within radius bounds
          const distFromCenter = Math.sqrt(
            clusteredPos.x * clusteredPos.x + clusteredPos.z * clusteredPos.z,
          );
          if (distFromCenter >= minRadius && distFromCenter <= maxRadius) {
            positions.push(clusteredPos);
          }
        } else if (!tooClose) {
          positions.push(newPos);
        }
      }
    }

    console.log(
      `Generated ${positions.length} obstacle positions in ${attempts} attempts`,
    );
    return positions;
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
    isTour: boolean = false,
  ): Promise<{ robotId: string }> {
    // Cancel any active farm tour for this robot
    if (!isTour) {
      this.cancelRobotFarmTour(robotId);
    }

    // Find the robot and palm
    const robot = this.robots.find((r) => r.id === robotId);
    const palm = this.palms.find((p) => p.id === palmId);
    const speed = 10; // units per second

    if (!robot || !palm) {
      console.error(`Robot ${robotId} or Palm ${palmId} not found`);
      return { robotId };
    }

    if (!robot.robotNode) {
      console.error(`Robot ${robotId} has no node`);
      return { robotId };
    }

    // Find scanning animation
    const scanAnimation = robot.animationGroups?.find((ag) =>
      ag.name.includes("Playing"),
    );

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

    // Wait and "scan" the palm
    if (scanAnimation) {
      scanAnimation.start(true);
    }

    // Create scanning visual effect
    await this.performPalmScan(palm, 3);

    if (scanAnimation) {
      scanAnimation.stop();
    }

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

    // console.log(`Robot ${robotId} reached palm ${palmId}`);
    return { robotId };
  }

  /**
   * Start a robot on a full tour of all palms in the farm
   * The robot visits each palm, waits to scan, then moves to the next
   * Palms are visited in an optimized order (nearest neighbor algorithm)
   * @param robotId - The ID of the robot to send on tour
   * @param waitTimePerPalm - Time in seconds to wait at each palm (default: 3)
   * @param onProgress - Optional callback for progress updates
   */
  async startRobotFarmTour(
    robotId: string,
    waitTimePerPalm: number = 3,
    onProgress?: (current: number, total: number, palmId: string) => void,
  ): Promise<{ robotId: string; visited: string[]; cancelled: boolean }> {
    // Cancel any previous farm tour for this robot
    this.cancelRobotFarmTour(robotId);

    const robot = this.robots.find((r) => r.id === robotId);

    if (!robot) {
      console.error(`Robot ${robotId} not found`);
      return { robotId, visited: [], cancelled: true };
    }

    if (!robot.robotNode) {
      console.error(`Robot ${robotId} has no node`);
      return { robotId, visited: [], cancelled: true };
    }

    if (robot.isMoving) {
      console.warn(`Robot ${robotId} is already moving`);
      return { robotId, visited: [], cancelled: true };
    }

    // Create abort controller for this farm tour
    const abortController = new AbortController();
    this.activeFarmTours.set(robotId, abortController);

    // Get optimized palm visiting order using nearest neighbor algorithm
    const orderedPalms = this.getOptimizedPalmOrder(
      robot.robotNode.position.clone(),
    );
    const visited: string[] = [];
    const totalPalms = orderedPalms.length;

    // console.log(`🤖 Robot ${robotId} starting farm tour - ${totalPalms} palms to visit`);

    // Find scanning animation
    const scanAnimation = robot.animationGroups?.find((ag) =>
      ag.name.includes("Playing"),
    );

    try {
      for (let i = 0; i < orderedPalms.length; i++) {
        // Check if tour was cancelled
        if (abortController.signal.aborted) {
          console.log(`🛑 Robot ${robotId} farm tour was cancelled`);
          return { robotId, visited, cancelled: true };
        }

        const palm = orderedPalms[i];

        // Report progress
        if (onProgress) {
          onProgress(i + 1, totalPalms, palm.id);
        }

        // console.log(`📍 Robot ${robotId} heading to palm ${i + 1}/${totalPalms}: ${palm.id}`);

        // Select the current palm for visual feedback
        // this.selectEntity(palm.id, "palm");

        // Move to the palm
        await this.moveRobotToPalm(robotId, palm.id, true);
        visited.push(palm.id);

        // Check again after movement
        if (abortController.signal.aborted) {
          console.log(
            `🛑 Robot ${robotId} farm tour was cancelled during movement`,
          );
          return { robotId, visited, cancelled: true };
        }

        // Wait and "scan" the palm
        if (scanAnimation) {
          scanAnimation.start(true);
        }

        // Create scanning visual effect
        await this.performPalmScan(palm, waitTimePerPalm);

        if (scanAnimation) {
          scanAnimation.stop();
        }

        // console.log(`✅ Robot ${robotId} completed scan of palm ${palm.id}`);
      }

      // Clear selection at the end
      this.clearSelection();

      // Remove from active tours on success
      this.activeFarmTours.delete(robotId);

      // console.log(`🎉 Robot ${robotId} completed farm tour! Visited ${visited.length} palms`);
      return { robotId, visited, cancelled: false };
    } catch (error) {
      // Clean up on error
      this.activeFarmTours.delete(robotId);
      console.error(`Error during robot ${robotId} farm tour:`, error);
      return { robotId, visited, cancelled: true };
    }
  }

  /**
   * Cancel an active farm tour for a specific robot
   * This will stop the tour gracefully and clean up resources
   * @param robotId - The ID of the robot whose tour should be cancelled
   */
  private cancelRobotFarmTour(robotId: string): void {
    const abortController = this.activeFarmTours.get(robotId);
    if (abortController) {
      abortController.abort();
      this.activeFarmTours.delete(robotId);
      console.log(`🛑 Cancelled farm tour for robot ${robotId}`);
    }
  }

  /**
   * Get palms in optimized visiting order using nearest neighbor algorithm
   * This minimizes total travel distance
   */
  private getOptimizedPalmOrder(
    startPosition: BABYLON.Vector3,
  ): (Palm & { palmNode?: BABYLON.TransformNode })[] {
    const remaining = [...this.palms];
    const ordered: (Palm & { palmNode?: BABYLON.TransformNode })[] = [];
    let currentPos = startPosition.clone();

    while (remaining.length > 0) {
      // Find nearest palm
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const palm = remaining[i];
        const palmPos =
          palm.palmNode?.position ||
          new BABYLON.Vector3(palm.position.x, 0, palm.position.z);
        const distance = BABYLON.Vector3.Distance(currentPos, palmPos);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      // Add nearest palm to ordered list
      const nearest = remaining.splice(nearestIndex, 1)[0];
      ordered.push(nearest);
      currentPos =
        nearest.palmNode?.position.clone() ||
        new BABYLON.Vector3(nearest.position.x, 0, nearest.position.z);
    }

    return ordered;
  }

  /**
   * Perform a scanning effect at a palm
   * Shows a visual scanning ring animation
   */
  private async performPalmScan(
    palm: Palm & { palmNode?: BABYLON.TransformNode },
    duration: number,
  ): Promise<void> {
    if (!palm.palmNode) {
      await this.delay(duration * 1000);
      return;
    }

    const position = palm.palmNode.position.clone();

    // Create scanning ring
    const scanRing = BABYLON.MeshBuilder.CreateTorus(
      "scanRing",
      {
        diameter: 1,
        thickness: 0.1,
        tessellation: 32,
      },
      this.scene,
    );
    scanRing.position = new BABYLON.Vector3(position.x, 0.2, position.z);
    scanRing.rotation.x = Math.PI / 2;

    // Scanning material
    const scanMat = new BABYLON.StandardMaterial("scanMat", this.scene);
    scanMat.emissiveColor = new BABYLON.Color3(0.2, 0.8, 1.0);
    scanMat.alpha = 0.8;
    scanMat.disableLighting = true;
    scanRing.material = scanMat;

    // Expand and fade animation
    const expandAnim = new BABYLON.Animation(
      "expand",
      "scaling",
      30,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    expandAnim.setKeys([
      { frame: 0, value: new BABYLON.Vector3(1, 1, 1) },
      { frame: 30, value: new BABYLON.Vector3(8, 8, 1) },
      { frame: 60, value: new BABYLON.Vector3(1, 1, 1) },
    ]);

    const fadeAnim = new BABYLON.Animation(
      "fade",
      "material.alpha",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    fadeAnim.setKeys([
      { frame: 0, value: 0.8 },
      { frame: 30, value: 0.1 },
      { frame: 60, value: 0.8 },
    ]);

    // Run animations for the duration
    const animatable = this.scene.beginDirectAnimation(
      scanRing,
      [expandAnim, fadeAnim],
      0,
      60,
      true,
      1,
    );

    // Wait for scan duration
    await this.delay(duration * 1000);

    // Stop and cleanup
    animatable.stop();
    scanRing.dispose();
    scanMat.dispose();
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
      return 0;
      console.log("Getting terrain height at:", x, z);
      // Use getHeightAtCoordinates for GroundMesh (accurate for heightmap)
      // const height = this.terrainMesh.getHeightAtCoordinates(x, z);
      // if (height !== undefined && !isNaN(height)) {
      //   return height;
      // }
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

  /**
   * Setup click handlers for entity selection (palms and robots)
   */
  private setupSceneClickHandlers(): void {
    // Make all palm meshes pickable
    this.palms.forEach((palm) => {
      if (palm.palmNode) {
        const meshes = palm.palmNode.getChildMeshes();
        meshes.forEach((mesh) => {
          mesh.isPickable = true;
          mesh.metadata = {
            ...mesh.metadata,
            palmId: palm.id,
            entityType: "palm",
          };
        });
      }
    });

    // Make all robot meshes pickable
    this.robots.forEach((robot) => {
      if (robot.robotNode) {
        const meshes = robot.robotNode.getChildMeshes();
        meshes.forEach((mesh) => {
          mesh.isPickable = true;
          mesh.metadata = {
            ...mesh.metadata,
            robotId: robot.id,
            entityType: "robot",
          };
        });
      }
    });

    // Single unified pointer handler for both click and hover
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERPICK: {
          const pickResult = pointerInfo.pickInfo;
          if (pickResult?.hit && pickResult.pickedMesh) {
            const entity = this.findEntityFromMesh(pickResult.pickedMesh);
            if (entity) {
              this.selectEntity(entity.id, entity.type);
            } else {
              this.clearSelection();
            }
          }
          break;
        }
        case BABYLON.PointerEventTypes.POINTERMOVE: {
          const pickResult = this.scene.pick(
            this.scene.pointerX,
            this.scene.pointerY,
          );
          if (pickResult?.hit && pickResult.pickedMesh) {
            const entity = this.findEntityFromMesh(pickResult.pickedMesh);
            this.canvas.style.cursor = entity ? "pointer" : "default";
          } else {
            this.canvas.style.cursor = "default";
          }
          break;
        }
      }
    });
  }

  /**
   * Find entity (palm or robot) from a picked mesh
   */
  private findEntityFromMesh(
    mesh: BABYLON.AbstractMesh,
  ): { id: string; type: "palm" | "robot" } | null {
    // Check mesh metadata first
    if (mesh.metadata?.palmId) {
      return { id: mesh.metadata.palmId, type: "palm" };
    }
    if (mesh.metadata?.robotId) {
      return { id: mesh.metadata.robotId, type: "robot" };
    }
    return null;
  }

  /**
   * Set callback for when an entity is selected
   */
  onEntitySelected(
    callback: (
      entityId: string | null,
      entityType: "palm" | "robot" | null,
    ) => void,
  ): void {
    this.onEntitySelectedCallback = callback;
  }

  /**
   * Legacy callback for palm selection (for backward compatibility)
   */
  onPalmSelected(callback: (palmId: string | null) => void): void {
    this.onEntitySelectedCallback = (entityId, entityType) => {
      if (entityType === "palm" || entityType === null) {
        callback(entityId);
      }
    };
  }

  /**
   * Select an entity (palm or robot) with animated circle
   */
  selectEntity(
    entityId: string | null,
    entityType: "palm" | "robot",
  ): { success: boolean; entityId: string | null } {
    // If same entity is selected, deselect it
    if (
      entityId === this.selectedEntityId &&
      entityType === this.selectedEntityType
    ) {
      this.clearSelection();
      if (this.onEntitySelectedCallback) {
        this.onEntitySelectedCallback(null, null);
      }
      return { success: true, entityId: null };
    }

    // Clear previous selection
    this.clearSelection();

    if (!entityId) {
      if (this.onEntitySelectedCallback) {
        this.onEntitySelectedCallback(null, null);
      }
      return { success: true, entityId: null };
    }

    // Find entity position
    let position: BABYLON.Vector3 | null = null;

    // Create selection visualization with entity-specific color
    const color =
      entityType === "palm"
        ? new BABYLON.Color3(0.07, 0.3, 0.15) // Green for palms
        : new BABYLON.Color3(0.07, 0.16, 0.27); // Blue for robots

    if (entityType === "palm") {
      const palm = this.palms.find((p) => p.id === entityId);
      if (palm?.palmNode) {
        position = palm.palmNode.position.clone();
        this.createSelectionCircle(position, color, 5);
        this.animateCameraToTarget(position);
      }
    } else if (entityType === "robot") {
      const robot = this.robots.find((r) => r.id === entityId);
      if (robot?.robotNode) {
        position = robot.robotNode.position.clone();
        this.createSelectionCircle(position, color, 0.6, robot.robotNode);
        this.animateCameraToTarget(position);
        // Lock camera to follow robot
        setTimeout(() => {
          if (this.camera) {
            this.camera.targetHost = robot.robotNode as BABYLON.AbstractMesh;
          }
        }, 1000);
      }
    }

    if (!position) {
      console.warn(`Entity ${entityId} not found`);
      return { success: false, entityId: null };
    }

    this.selectedEntityId = entityId;
    this.selectedEntityType = entityType;

    // Notify callback
    if (this.onEntitySelectedCallback) {
      this.onEntitySelectedCallback(entityId, entityType);
    }

    return { success: true, entityId };
  }

  /**
   * Select a palm (wrapper for selectEntity for backward compatibility)
   */
  selectPalm(palmId: string | null): {
    success: boolean;
    palmId: string | null;
  } {
    if (!palmId) {
      this.clearSelection();
      return { success: true, palmId: null };
    }
    const result = this.selectEntity(palmId, "palm");
    return { success: result.success, palmId: result.entityId };
  }

  /**
   * Select a robot (wrapper for selectEntity)
   */
  selectRobot(robotId: string | null): {
    success: boolean;
    robotId: string | null;
  } {
    if (!robotId) {
      this.clearSelection();
      return { success: true, robotId: null };
    }
    const result = this.selectEntity(robotId, "robot");
    return { success: result.success, robotId: result.entityId };
  }

  /**
   * Get the currently selected palm ID
   */
  getSelectedPalmId(): string | undefined {
    return this.selectedEntityType === "palm"
      ? this.selectedEntityId
      : undefined;
  }

  /**
   * Get the currently selected robot ID
   */
  getSelectedRobotId(): string | undefined {
    return this.selectedEntityType === "robot"
      ? this.selectedEntityId
      : undefined;
  }

  /**
   * Clear the current selection
   */
  clearSelection(): void {
    if (this.clearSelectionUI) {
      this.clearSelectionUI();
    }
    // Unlock camera from any tracked target
    if (this.camera) {
      this.camera.lockedTarget = null;
    }

    // Stop and dispose animation group
    if (this.selectionAnimationGroup) {
      this.selectionAnimationGroup.stop();
      this.selectionAnimationGroup.dispose();
      this.selectionAnimationGroup = undefined;
    }

    // Dispose selection circle with fade out
    if (this.selectionCircle) {
      const circle = this.selectionCircle;
      const fadeOut = new BABYLON.Animation(
        "fadeOut",
        "visibility",
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      );
      fadeOut.setKeys([
        { frame: 0, value: 1 },
        { frame: 12, value: 0 },
      ]);
      this.scene.beginDirectAnimation(
        circle,
        [fadeOut],
        0,
        12,
        false,
        1,
        () => {
          circle.material?.dispose();
          circle.dispose();
        },
      );
      this.selectionCircle = undefined;
    }

    this.selectedEntityId = undefined;
    this.selectedEntityType = undefined;
  }

  /**
   * Create a simple animated selection circle on the ground
   * @param parentNode Optional parent node to attach circle to (for robots)
   */
  private createSelectionCircle(
    position: BABYLON.Vector3,
    color: BABYLON.Color3,
    radius: number = 5,
    parentNode?: BABYLON.TransformNode,
  ): void {
    // Create a horizontal disc on the ground
    this.selectionCircle = BABYLON.MeshBuilder.CreateDisc(
      "selectionCircle",
      {
        radius: radius,
        tessellation: 64,
      },
      this.scene,
    );

    // If parent node provided (robot), attach circle as child at ground level
    if (parentNode) {
      this.selectionCircle.parent = parentNode;
      // Position at ground level relative to parent (robot is scaled, so adjust y)
      this.selectionCircle.position = new BABYLON.Vector3(0, 0.02, 0); // Slight offset above ground
      this.selectionCircle.rotation.x = Math.PI / 2; // Lay flat on ground
    } else {
      // Position flat on ground (horizontal) - for palms
      this.selectionCircle.position = new BABYLON.Vector3(
        position.x,
        this.terrainMesh && 0 + 0.1,
        position.z,
      );
      this.selectionCircle.rotation.x = Math.PI / 2; // Lay flat on ground
    }

    // Glowing material
    const material = new BABYLON.StandardMaterial("selectionMat", this.scene);
    material.emissiveColor = color;
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.alpha = 0.6;
    material.disableLighting = true;
    material.backFaceCulling = false;
    this.selectionCircle.material = material;

    // Animation group
    this.selectionAnimationGroup = new BABYLON.AnimationGroup(
      "selectionAnim",
      this.scene,
    );

    // Radius pulse animation (scaling X and Z for horizontal disc)
    const radiusPulse = new BABYLON.Animation(
      "radiusPulse",
      "scaling",
      30,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    const ease = new BABYLON.SineEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    radiusPulse.setEasingFunction(ease);
    radiusPulse.setKeys([
      { frame: 0, value: new BABYLON.Vector3(1, 1, 1) },
      { frame: 40, value: new BABYLON.Vector3(1.25, 1.25, 1) },
      { frame: 80, value: new BABYLON.Vector3(1, 1, 1) },
    ]);
    this.selectionAnimationGroup.addTargetedAnimation(
      radiusPulse,
      this.selectionCircle,
    );

    // Alpha pulse for breathing effect
    const alphaPulse = new BABYLON.Animation(
      "alphaPulse",
      "material.alpha",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    alphaPulse.setEasingFunction(ease);
    alphaPulse.setKeys([
      { frame: 0, value: 0.5 },
      { frame: 40, value: 0.3 },
      { frame: 80, value: 0.5 },
    ]);
    this.selectionAnimationGroup.addTargetedAnimation(
      alphaPulse,
      this.selectionCircle,
    );

    // Entrance animation - scale from 0
    this.selectionCircle.scaling = new BABYLON.Vector3(0.01, 0.01, 1);
    const entranceAnim = new BABYLON.Animation(
      "entrance",
      "scaling",
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
    const bounceEase = new BABYLON.BackEase(0.3);
    bounceEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    entranceAnim.setEasingFunction(bounceEase);
    entranceAnim.setKeys([
      { frame: 0, value: new BABYLON.Vector3(0.01, 0.01, 1) },
      { frame: 18, value: new BABYLON.Vector3(1, 1, 1) },
    ]);

    // Run entrance then start loop
    this.scene.beginDirectAnimation(
      this.selectionCircle,
      [entranceAnim],
      0,
      18,
      false,
      1,
      () => {
        this.selectionAnimationGroup?.start(true);
      },
    );
  }

  /**
   * Smoothly animate camera to look at the selected entity
   */
  private animateCameraToTarget(targetPosition: BABYLON.Vector3): void {
    if (!this.camera) return;

    const targetAnim = new BABYLON.Animation(
      "cameraTarget",
      "target",
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );
    const easeFunction = new BABYLON.CubicEase();
    easeFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    targetAnim.setEasingFunction(easeFunction);
    targetAnim.setKeys([
      { frame: 0, value: this.camera.target.clone() },
      {
        frame: 45,
        value: new BABYLON.Vector3(targetPosition.x, 2, targetPosition.z),
      },
    ]);

    this.scene.beginDirectAnimation(this.camera, [targetAnim], 0, 45, false);
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
    startRobotFarmTour: async (
      robotId: string,
      waitTimePerPalm?: number,
      onProgress?: (current: number, total: number, palmId: string) => void,
    ) => {
      return sceneManager.startRobotFarmTour(
        robotId,
        waitTimePerPalm,
        onProgress,
      );
    },
    selectPalm: (palmId: string | null) => {
      return sceneManager.selectPalm(palmId);
    },
    selectRobot: (robotId: string | null) => {
      return sceneManager.selectRobot(robotId);
    },
    selectEntity: (entityId: string | null, entityType: "palm" | "robot") => {
      return sceneManager.selectEntity(entityId, entityType);
    },
    getSelectedPalmId: () => {
      return sceneManager.getSelectedPalmId();
    },
    getSelectedRobotId: () => {
      return sceneManager.getSelectedRobotId();
    },
    onPalmSelected: (callback: (palmId: string | null) => void) => {
      sceneManager.onPalmSelected(callback);
    },
    onEntitySelected: (
      callback: (
        entityId: string | null,
        entityType: "palm" | "robot" | null,
      ) => void,
    ) => {
      sceneManager.onEntitySelected(callback);
    },
    clearSelection: () => {
      sceneManager.clearSelection();
    },
  };
};

export type StudioSceneExports = {
  moveRobotToPalm: (
    robotId: string,
    palmId: string,
  ) => Promise<{ robotId: string }>;
  startRobotFarmTour: (
    robotId: string,
    waitTimePerPalm?: number,
    onProgress?: (current: number, total: number, palmId: string) => void,
  ) => Promise<{ robotId: string; visited: string[]; cancelled: boolean }>;
  selectPalm: (palmId: string | null) => {
    success: boolean;
    palmId: string | null;
  };
  selectRobot: (robotId: string | null) => {
    success: boolean;
    robotId: string | null;
  };
  selectEntity: (
    entityId: string | null,
    entityType: "palm" | "robot",
  ) => { success: boolean; entityId: string | null };
  clearSelection: () => void;
  getSelectedPalmId: () => string | undefined;
  getSelectedRobotId: () => string | undefined;
  onPalmSelected: (callback: (palmId: string | null) => void) => void;
  onEntitySelected: (
    callback: (
      entityId: string | null,
      entityType: "palm" | "robot" | null,
    ) => void,
  ) => void;
};

/**
 * Custom Material Plugin for Sand Glitter/Sparkle Effect
 * Integrates with Babylon.js PBR pipeline to add view-dependent sparkles
 * that simulate individual sand grains catching sunlight
 */
class SandGlitterPluginMaterial extends BABYLON.MaterialPluginBase {
  private _glitterTexture: BABYLON.Texture;
  private _scene: BABYLON.Scene;
  private _pluginEnabled = true;
  
  // Glitter parameters
  public glitterIntensity = 0.6;
  public glitterDensity = 100.0;
  public glitterThreshold = 0.94;
  public glitterColor = new BABYLON.Color3(0.988, 0.647, 0.310); // #FCA54F warm orange glitter
  public sparkleSpeed = 0.02;

  constructor(
    material: BABYLON.PBRMaterial,
    glitterTexture: BABYLON.Texture,
    scene: BABYLON.Scene,
  ) {
    super(material, "SandGlitter", 200, { SAND_GLITTER: false });
    this._glitterTexture = glitterTexture;
    this._scene = scene;
    this._enable(true);
  }

  get pluginEnabled(): boolean {
    return this._pluginEnabled;
  }

  set pluginEnabled(value: boolean) {
    if (this._pluginEnabled === value) {
      return;
    }
    this._pluginEnabled = value;
    this.markAllDefinesAsDirty();
    this._enable(value);
  }

  override prepareDefines(
    defines: BABYLON.MaterialDefines,
  ): void {
    defines["SAND_GLITTER"] = this._pluginEnabled;
  }

  override getClassName(): string {
    return "SandGlitterPluginMaterial";
  }

  override getSamplers(samplers: string[]): void {
    samplers.push("glitterNoiseSampler");
    samplers.push("sandDetailSampler");
  }

  override getUniforms(): {
    ubo?: { name: string; size: number; type: string }[];
    vertex?: string;
    fragment?: string;
  } {
    return {
      ubo: [
        { name: "glitterIntensity", size: 1, type: "float" },
        { name: "glitterDensity", size: 1, type: "float" },
        { name: "glitterThreshold", size: 1, type: "float" },
        { name: "glitterTime", size: 1, type: "float" },
        { name: "glitterColor", size: 3, type: "vec3" },
        { name: "sparkleSpeed", size: 1, type: "float" },
        { name: "sunDirection", size: 3, type: "vec3" },
        { name: "cameraPosition", size: 3, type: "vec3" },
      ],
      fragment: `
        #ifdef SAND_GLITTER
          uniform float glitterIntensity;
          uniform float glitterDensity;
          uniform float glitterThreshold;
          uniform float glitterTime;
          uniform vec3 glitterColor;
          uniform float sparkleSpeed;
          uniform vec3 sunDirection;
          uniform vec3 cameraPosition;
          uniform sampler2D glitterNoiseSampler;
        #endif
      `,
    };
  }

  override bindForSubMesh(
    uniformBuffer: BABYLON.UniformBuffer,
    scene: BABYLON.Scene,
    _engine: BABYLON.Engine,
    subMesh: BABYLON.SubMesh,
  ): void {
    if (!this._pluginEnabled) {
      return;
    }

    const effect = subMesh.effect;
    if (!effect) {
      return;
    }

    // Bind uniforms
    uniformBuffer.updateFloat("glitterIntensity", this.glitterIntensity);
    uniformBuffer.updateFloat("glitterDensity", this.glitterDensity);
    uniformBuffer.updateFloat("glitterThreshold", this.glitterThreshold);
    uniformBuffer.updateFloat("glitterTime", performance.now() / 1000.0);
    uniformBuffer.updateFloat("sparkleSpeed", this.sparkleSpeed);
    uniformBuffer.updateColor3("glitterColor", this.glitterColor);
    
    // Sun direction (normalized)
    const sunDir = new BABYLON.Vector3(0.5, -0.8, 0.2).normalize();
    uniformBuffer.updateVector3("sunDirection", sunDir);
    
    // Camera position
    if (scene.activeCamera) {
      uniformBuffer.updateVector3("cameraPosition", scene.activeCamera.position);
    }

    // Bind glitter texture
    if (this._glitterTexture && this._glitterTexture.isReady()) {
      effect.setTexture("glitterNoiseSampler", this._glitterTexture);
    }
  }

  override getCustomCode(shaderType: string): { [point: string]: string } | null {
    if (shaderType === "fragment") {
      return {
        // Inject after lighting calculations, before final color output
        "!baseColor.rgb;": `
          baseColor.rgb;
          
          #ifdef SAND_GLITTER
            // === SAND GLITTER SPARKLE EFFECT ===
            
            // Get world position and view direction
            vec3 worldPos = vPositionW;
            vec3 viewDir = normalize(cameraPosition - worldPos);
            vec3 normalDir = normalize(vNormalW);
            
            // Multi-frequency UV sampling for natural variation
            vec2 glitterUV1 = vMainUV1 * glitterDensity;
            vec2 glitterUV2 = vMainUV1 * glitterDensity * 2.3 + vec2(glitterTime * sparkleSpeed, 0.0);
            vec2 glitterUV3 = vMainUV1 * glitterDensity * 0.7 - vec2(0.0, glitterTime * sparkleSpeed * 0.5);
            
            // Generate pseudo-random sparkle pattern
            float noise1 = fract(sin(dot(glitterUV1, vec2(12.9898, 78.233))) * 43758.5453);
            float noise2 = fract(sin(dot(glitterUV2, vec2(39.346, 11.135))) * 43758.5453);
            float noise3 = fract(sin(dot(glitterUV3, vec2(73.156, 52.235))) * 43758.5453);
            
            // Sample noise texture for additional variation
            vec4 noiseSample = texture2D(glitterNoiseSampler, vMainUV1 * 15.0 + vec2(glitterTime * 0.01, 0.0));
            
            // Combine noise sources
            float combinedNoise = noise1 * 0.4 + noise2 * 0.35 + noise3 * 0.25;
            combinedNoise = combinedNoise * 0.7 + noiseSample.r * 0.3;
            
            // View-dependent reflection (simulate micro-facets on sand grains)
            float NdotV = max(dot(normalDir, viewDir), 0.0);
            float NdotL = max(dot(normalDir, -normalize(sunDirection)), 0.0);
            
            // Half-vector for specular-like sparkle
            vec3 halfVec = normalize(viewDir - normalize(sunDirection));
            float NdotH = max(dot(normalDir, halfVec), 0.0);
            
            // Fresnel term - sparkles more visible at grazing angles
            float fresnel = pow(1.0 - NdotV, 3.0);
            
            // Sparkle threshold with view dependency
            float sparkleThreshold = glitterThreshold - fresnel * 0.08 - NdotH * 0.05;
            
            // Discrete sparkles (high threshold)
            float sparkle = step(sparkleThreshold, combinedNoise);
            sparkle *= pow(NdotH, 4.0) * 2.0; // Concentrate sparkles toward sun reflection
            
            // Subtle shimmer (lower threshold, softer)
            float shimmer = pow(max(combinedNoise - 0.7, 0.0) / 0.3, 3.0) * 0.15;
            shimmer *= (0.5 + 0.5 * NdotL); // Shimmer in lit areas
            
            // Combine sparkle and shimmer
            float totalGlitter = (sparkle + shimmer) * glitterIntensity;
            
            // Color the glitter with warm golden tones (reduced fresnel boost to avoid white edges)
            vec3 sparkleColor = glitterColor * (1.0 + fresnel * 0.1);
            
            // Add glitter to base color
            baseColor.rgb += sparkleColor * totalGlitter * NdotL;
          #endif
        `,
        
        // Add subtle sand color variation
        "!surfaceAlbedo.rgb;": `
          surfaceAlbedo.rgb;
          
          #ifdef SAND_GLITTER
            // Subtle color variation based on position (#FCA54F base)
            float colorVar = fract(sin(dot(vMainUV1 * 20.0, vec2(12.9898, 78.233))) * 43758.5453);
            vec3 sandVariation = mix(
              vec3(0.988, 0.70, 0.38), // Lighter #FCA54F shade
              vec3(0.95, 0.60, 0.28), // Darker #FCA54F shade
              colorVar * 0.3
            );
            surfaceAlbedo.rgb *= sandVariation;
          #endif
        `,
      };
    }
    
    return null;
  }
}
