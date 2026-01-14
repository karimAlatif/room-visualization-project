/* eslint-disable @typescript-eslint/no-explicit-any */
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";


class StudioSceneManager  {
  engine: BABYLON.Engine;
  canvas: HTMLCanvasElement;
  scene: BABYLON.Scene;
  camera: BABYLON.ArcRotateCamera | null = null;
  shadowGenerator: BABYLON.ShadowGenerator | null = null;
  mirror: BABYLON.MirrorTexture | null = null;
  loadedMeshes: BABYLON.Mesh[] = [];
  onReady?: () => void;

  constructor(props: any) {
    this.engine = props.engine;
    this.canvas = props.canvas;
    this.scene = new BABYLON.Scene(this.engine);
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

    //Installation
    this.camera = this.createCamera(); //create Camera
    this.setUpEnvironMent(); //set up the environment      // Load the room with progress tracking
      await this.initFarmEnvironment();
      if (this.onReady){
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
      this.scene
    );
    
    // Enable touch controls for mobile devices
    camera.attachControl(this.canvas, true);

    // Limit camera movement to focus on central farm area
    camera.lowerRadiusLimit = 40;
    camera.upperRadiusLimit = 120;

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
      this.scene
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
      this.scene
    );
    skyLight.intensity = 1.1; // Enhanced ambient for detail visibility
    skyLight.diffuse = new BABYLON.Color3(0.75, 0.88, 1.0); // Cool sky blue
    skyLight.groundColor = new BABYLON.Color3(0.5, 0.45, 0.4); // Earth tones
    skyLight.specular = new BABYLON.Color3(0.3, 0.35, 0.4); // Moderate specular
    
    // Additional fill light for realistic outdoor lighting (bounced light simulation)
    const fillLight = new BABYLON.HemisphericLight(
      "FillLight",
      new BABYLON.Vector3(0, -1, 0), // From below (ground bounce)
      this.scene
    );
    fillLight.intensity = 0.55; // Enhanced fill light for clarity
    fillLight.diffuse = new BABYLON.Color3(0.85, 0.75, 0.65); // Warm earth bounce
    fillLight.groundColor = new BABYLON.Color3(0.65, 0.75, 0.9); // Cool sky reflection
    fillLight.specular = new BABYLON.Color3(0, 0, 0); // No specular

    // Optimized shadow generator for performance
    this.shadowGenerator = new BABYLON.ShadowGenerator(2048, sunLight); // Balanced resolution
    this.shadowGenerator.usePercentageCloserFiltering = true; // PCF for soft shadows
    this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM; // Medium quality for performance
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
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 2000 }, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMat", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    
    // Use HDR environment texture for skybox
    const hdrTexture = new BABYLON.HDRCubeTexture(
      "hdr/golden_gate_hills_4k.hdr",
      this.scene,
      1024
    );
    skyboxMaterial.reflectionTexture = hdrTexture;
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    
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
      [this.camera]
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
    pipeline.imageProcessing.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_STANDARD; // Standard for better performance
    
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
    pipeline.imageProcessing.vignetteBlendMode = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;

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

    console.log("Professional post-processing pipeline configured with all effects");
  }

  addAtmosphericEffects(farmSize: number) {        
    // Create 4 particle layers for depth and realism
    const sandLayers: BABYLON.ParticleSystem[] = [];
    
    const sandTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/textures/cloud.png",
      this.scene
    );
    
    // // Layer 1: Ground-level fine sand (low, dense) - REDUCED
    const groundSand = new BABYLON.ParticleSystem("groundSandLayer", 3000, this.scene);
    groundSand.particleTexture = sandTexture;
    groundSand.emitter = new BABYLON.Vector3(0, 0, 0);
    groundSand.minEmitBox = new BABYLON.Vector3(-farmSize * 1.5, 0, -farmSize * 1.5);
    groundSand.maxEmitBox = new BABYLON.Vector3(farmSize * 1.5, 0.5, farmSize * 1.5);
    
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
    
    // Layer 2: Mid-level swirling sand - REDUCED
    // const midSand = new BABYLON.ParticleSystem("midSandLayer", 2000, this.scene);
    // midSand.particleTexture = sandTexture;
    // midSand.emitter = new BABYLON.Vector3(0, 1, 0);
    // midSand.minEmitBox = new BABYLON.Vector3(-farmSize * 1.2, 0, -farmSize * 1.2);
    // midSand.maxEmitBox = new BABYLON.Vector3(farmSize * 1.2, 2, farmSize * 1.2);
    
    // midSand.color1 = new BABYLON.Color4(0.90, 0.75, 0.55, 0.12); // Slightly darker
    // midSand.color2 = new BABYLON.Color4(0.86, 0.70, 0.50, 0.16);
    // midSand.colorDead = new BABYLON.Color4(0.82, 0.68, 0.48, 0);
    
    // midSand.minSize = 0.8;
    // midSand.maxSize = 1.8;
    // midSand.minLifeTime = 10;
    // midSand.maxLifeTime = 18;
    // midSand.emitRate = 100; // Reduced from 300
    // midSand.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    
    // midSand.direction1 = new BABYLON.Vector3(-6, -0.5, -2);
    // midSand.direction2 = new BABYLON.Vector3(-10, 1, -4);
    // midSand.minEmitPower = 3;
    // midSand.maxEmitPower = 5;
    // midSand.updateSpeed = 0.018;
    
    // midSand.gravity = new BABYLON.Vector3(0, -0.15, 0);
    // midSand.minAngularSpeed = -1.5;
    // midSand.maxAngularSpeed = 1.5;
    
    // midSand.start();
    // sandLayers.push(midSand);
    
    // // Layer 3: High-altitude dust - REDUCED
    // const highDust = new BABYLON.ParticleSystem("highDustLayer", 1500, this.scene);
    // highDust.particleTexture = sandTexture;
    // highDust.emitter = new BABYLON.Vector3(0, 3, 0);
    // highDust.minEmitBox = new BABYLON.Vector3(-farmSize, 0, -farmSize);
    // highDust.maxEmitBox = new BABYLON.Vector3(farmSize, 4, farmSize);
    
    // highDust.color1 = new BABYLON.Color4(0.88, 0.73, 0.53, 0.08); // More transparent
    // highDust.color2 = new BABYLON.Color4(0.84, 0.68, 0.48, 0.11);
    // highDust.colorDead = new BABYLON.Color4(0.80, 0.66, 0.46, 0);
    
    // highDust.minSize = 1.2;
    // highDust.maxSize = 2.5;
    // highDust.minLifeTime = 12;
    // highDust.maxLifeTime = 22;
    // highDust.emitRate = 70; // Reduced from 200
    // highDust.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    
    // highDust.direction1 = new BABYLON.Vector3(-5, -1, -1);
    // highDust.direction2 = new BABYLON.Vector3(-9, 0.5, -3);
    // highDust.minEmitPower = 2.5;
    // highDust.maxEmitPower = 4.5;
    // highDust.updateSpeed = 0.012;
    
    // highDust.gravity = new BABYLON.Vector3(0, -0.08, 0);
    // highDust.minAngularSpeed = -0.8;
    // highDust.maxAngularSpeed = 0.8;
    
    // highDust.start();
    // sandLayers.push(highDust);
    
    // Layer 4: Ambient haze (very fine, widespread) - REDUCED
    // const ambientHaze = new BABYLON.ParticleSystem("ambientHaze", 1000, this.scene);
    // ambientHaze.particleTexture = sandTexture;
    // ambientHaze.emitter = new BABYLON.Vector3(0, 2, 0);
    // ambientHaze.minEmitBox = new BABYLON.Vector3(-farmSize * 2, 0, -farmSize * 2);
    // ambientHaze.maxEmitBox = new BABYLON.Vector3(farmSize * 2, 6, farmSize * 2);
    
    // ambientHaze.color1 = new BABYLON.Color4(0.86, 0.71, 0.51, 0.05);
    // ambientHaze.color2 = new BABYLON.Color4(0.82, 0.66, 0.46, 0.07);
    // ambientHaze.colorDead = new BABYLON.Color4(0.78, 0.64, 0.44, 0);
    
    // ambientHaze.minSize = 2.0;
    // ambientHaze.maxSize = 4.0;
    // ambientHaze.minLifeTime = 15;
    // ambientHaze.maxLifeTime = 25;
    // ambientHaze.emitRate = 50; // Reduced from 150
    // ambientHaze.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    
    // ambientHaze.direction1 = new BABYLON.Vector3(-3, -0.5, -0.5);
    // ambientHaze.direction2 = new BABYLON.Vector3(-7, 0.5, -2);
    // ambientHaze.minEmitPower = 1.5;
    // ambientHaze.maxEmitPower = 3;
    // ambientHaze.updateSpeed = 0.008;
    
    // ambientHaze.gravity = new BABYLON.Vector3(0, -0.05, 0);
    // ambientHaze.minAngularSpeed = -0.5;
    // ambientHaze.maxAngularSpeed = 0.5;
    
    // ambientHaze.start();
    // sandLayers.push(ambientHaze);
    
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
          windZ * 8 - 2
        );
        layer.direction2 = new BABYLON.Vector3(
          windX * 14 + 2,
          0.5 + heightFactor,
          windZ * 14 + 2
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
            baseWindZ - 2
          );
          layer.direction2 = new BABYLON.Vector3(
            baseWindX + 4,
            0.5 + heightFactor,
            baseWindZ + 2
          );
        }, gustDuration);
      });
      
      const degrees = Math.round(gustAngle * 180 / Math.PI);
      console.log(`Sandstorm gust from ${degrees}° - strength: ${gustStrength.toFixed(2)} - duration: ${(gustDuration/1000).toFixed(1)}s`);
    };
    
    // Schedule random wind gusts - LONGER INTERVALS
    const scheduleNextGust = () => {
      const nextInterval = 20000 + Math.random() * 20000; // 20-40 seconds (increased from 8-20)
      setTimeout(() => {
        createSandGust();
        scheduleNextGust();
      }, nextInterval);
    };
    
    // Initial gust after longer delay
    setTimeout(createSandGust, 8000 + Math.random() * 5000); // 8-13 seconds
    scheduleNextGust();
}

  async initFarmEnvironment() {
    // Central farm area size
    const farmSize = 70; // 100x100 units square
    const numberOfPalms = 100; // Adjust this number as needed

    // 1. Create background environment (larger surrounding area)
    this.createBackgroundEnvironment(farmSize);
    
    // 2. Load and place palm trees in the central farm
    const palmModelPaths = [
      "models/palms/Palm.glb",
      // Add more model paths here as needed
    ];
    await this.loadAndPlacePalmTrees(farmSize, palmModelPaths, numberOfPalms);
    
    // 3. Add visual boundary indicator
    this.createFarmBoundary(farmSize);
        
    // Add atmospheric effects
    this.addAtmosphericEffects(farmSize);
  }

  createBackgroundEnvironment(farmSize: number) {
    // Create large mountain backdrop around the farm
    const terrainWidth = farmSize * 8; // Very large terrain for mountain backdrop
    const textureScale = terrainWidth / 10; // Texture scaling factor

    // Create mountain mesh with dramatic height variation
    BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "surroundingMountains",
      this.createMountainRangeHeightMap(),
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
        }
      },
      this.scene
    );
    
    // Add custom grass vegetation
    // this.createCustomGrass(farmSize, terrainWidth);
  }

  createPBRTerrainMaterial(textureScale: number): BABYLON.Material {
    // Create PBR Material for realistic physically-based rendering
    const pbrMat = new BABYLON.PBRMaterial("pbrTerrain", this.scene);
    
    // Load high-quality textures
    const baseColor = new BABYLON.Texture(
      "Textures/ground/textures/sand/sandy_gravel_02_diff_4k.jpg",
      this.scene
    );
    baseColor.uScale = textureScale ;
    baseColor.vScale = textureScale ;
    
    const normalTexture = new BABYLON.Texture(
      "Textures/ground/textures/sand/sandy_gravel_02_nor_gl_4k.jpg",
      this.scene
    );
    normalTexture.uScale = textureScale ;
    normalTexture.vScale = textureScale ;
    
    const armTexture = new BABYLON.Texture(
      "Textures/ground/textures/sand/sandy_gravel_02_arm_4k.jpg",
      this.scene
    );
    armTexture.uScale = textureScale ;
    armTexture.vScale = textureScale ;
    
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

  createMountainRangeHeightMap(): string {
    const resolution = 512;
    const canvas = document.createElement("canvas");
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext("2d")!;
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, resolution, resolution);
    
    const imageData = ctx.getImageData(0, 0, resolution, resolution);
    const data = imageData.data;
    
    // Define the 3 zones based on distance from center
    // Zone 1: Farm area (flat, height 0)
    // Zone 1B: Elevated platform around farm (wide, raised plateau)
    // Zone 2: Trees/grass area (blocky plateaus) 
    // Zone 3: Mountain area (gradual elevations to tall peaks)
    
    const ZONE1_RADIUS = 0.18;  // Farm area (farmSize / terrainWidth)
    const ZONE1_SLOPE_END = 0.32; // Wide elevated platform around farm
    const ZONE2_RADIUS = 0.45;   // Trees and grass area (placeholders)
    const ZONE3_START = 0.5;     // Mountains begin with transition
    
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const idx = (y * resolution + x) * 4;
        
        // Normalize to -1 to 1
        const nx = (x / resolution) * 2 - 1;
        const ny = (y / resolution) * 2 - 1;
        
        // Distance from center (0 to ~1.4 at corners)
        const distFromCenter = Math.sqrt(nx * nx + ny * ny);
        
        let height = 0;
        
        // ZONE 1: Farm area - completely flat
        if (distFromCenter < ZONE1_RADIUS) {
          height = 0; // Perfectly flat farm
        } 
        // ZONE 1B: Wide elevated platform around farm - contiguous raised region
        else if (distFromCenter < ZONE1_SLOPE_END) {
          const platformHeight = 0.15; // Elevated platform height
          const rampWidth = 0.03; // Quick rise at farm edge
          const rampEnd = ZONE1_RADIUS + rampWidth;
          
          if (distFromCenter < rampEnd) {
            // Quick ramp up from farm to platform
            const rampFactor = (distFromCenter - ZONE1_RADIUS) / rampWidth;
            const smoothRamp = rampFactor * rampFactor * (3 - 2 * rampFactor);
            height = smoothRamp * platformHeight;
          } else {
            // Flat elevated platform - contiguous and wide
            height = platformHeight;
          }
        } 
        // ZONE 2: Trees/grass area - Blocky plateaus/mesas
        else if (distFromCenter < ZONE2_RADIUS) {
          // Create distinct blocky plateau formations
          const blockX = nx * 3.0;
          const blockY = ny * 3.0;
          
          // Create blocky patterns using stepped functions
          const block1 = Math.sin(blockX * 1.2) * Math.cos(blockY * 1.1);
          const block2 = Math.cos(blockX * 1.5 + 2.1) * Math.sin(blockY * 1.3);
          const block3 = Math.sin((blockX + blockY) * 1.0);
          
          // Average and apply step function for blocky effect
          const avgBlock = (block1 + block2 + block3) / 3.0;
          
          // Create discrete height levels (steps)
          let blockHeight = 0;
          if (avgBlock > 0.6) {
            blockHeight = 0.28; // Tallest blocks
          } else if (avgBlock > 0.3) {
            blockHeight = 0.20; // Medium-high blocks
          } else if (avgBlock > 0.0) {
            blockHeight = 0.12; // Medium blocks
          } else if (avgBlock > -0.3) {
            blockHeight = 0.06; // Low blocks
          } else {
            blockHeight = 0.0; // Ground level/valleys
          }
          
          // Add secondary smaller blocks for detail
          const detailBlock = Math.sin(blockX * 2.5) * Math.cos(blockY * 2.3);
          if (detailBlock > 0.5 && blockHeight > 0) {
            blockHeight += 0.04; // Add small block detail on top
          }
          
          // Distance-based falloff
          const distanceFromZone2Center = (distFromCenter - ZONE1_SLOPE_END) / (ZONE2_RADIUS - ZONE1_SLOPE_END);
          const edgeFalloff = 1.0 - (distanceFromZone2Center * 0.6);
          
          // Apply falloff
          height = blockHeight * Math.max(0, edgeFalloff);
          
          // Very slight smoothing at block edges to avoid perfect squares
          const edgeSmooth = (Math.sin(blockX * 8.0) * Math.cos(blockY * 8.0)) * 0.008;
          height += edgeSmooth;
          
          // Clamp height
          height = Math.max(0, Math.min(height, 0.3));
        } 
        // Transition zone before mountains
        else if (distFromCenter < ZONE3_START) {
          // Smooth rise from flat to mountain base
          const transitionFactor = (distFromCenter - ZONE2_RADIUS) / (ZONE3_START - ZONE2_RADIUS);
          const smoothTransition = transitionFactor * transitionFactor * (3 - 2 * transitionFactor);
          height = smoothTransition * 0.02; // Gentle rise ~4 units
        }
        // ZONE 3: Mountain area - gradual elevations to tall peaks
        else {
          // Calculate progressive elevation factor
          const mountainDistance = (distFromCenter - ZONE3_START) / (1.4 - ZONE3_START);
          
          // Apply triple smoothstep for ultra-gradual elevation
          const smooth1 = mountainDistance * mountainDistance * (3 - 2 * mountainDistance);
          const smooth2 = smooth1 * smooth1 * (3 - 2 * smooth1);
          const smooth3 = smooth2 * smooth2 * (3 - 2 * smooth2);
          
          // Progressive multiplier - mountains get taller with distance
          const elevationMultiplier = mountainDistance * 0.35 + smooth1 * 0.35 + smooth2 * 0.25 + smooth3 * 0.25;
          
          // Create varied mountain ranges in all directions with better connectivity
          // North range
          const northPattern = Math.sin(nx * Math.PI * 2.0) * Math.cos(ny * Math.PI * 1.5 + 2.5);
          const northPeaks = Math.pow(Math.max(0, northPattern), 1.2) * 0.55;
          
          // East range
          const eastPattern = Math.cos(nx * Math.PI * 1.7 + 1.0) * Math.sin(ny * Math.PI * 2.2);
          const eastPeaks = Math.pow(Math.max(0, eastPattern), 1.2) * 0.52;
          
          // South range
          const southPattern = Math.sin((nx + ny) * Math.PI * 1.8 + 1.5) * Math.cos((nx - ny) * Math.PI * 1.9);
          const southPeaks = Math.pow(Math.max(0, southPattern), 1.2) * 0.50;
          
          // West range
          const westPattern = Math.sin(ny * Math.PI * 2.1 - 0.5) * Math.cos(nx * Math.PI * 1.6 + 2.0);
          const westPeaks = Math.pow(Math.max(0, westPattern), 1.2) * 0.56;
          
          // Add connecting ridges between ranges for semi-connected mountains
          const connectingRidge1 = Math.sin((nx + ny) * Math.PI * 2.5) * Math.cos((nx - ny) * Math.PI * 2.2);
          const connectingRidge2 = Math.cos((nx * 2 + ny) * Math.PI * 1.8) * Math.sin((ny * 2 - nx) * Math.PI * 1.6);
          const connectors = (Math.pow(Math.max(0, connectingRidge1), 1.2) * 0.35 + 
                             Math.pow(Math.max(0, connectingRidge2), 1.2) * 0.32);
          
          // Blend all mountain ranges with connectors - using max for better coverage
          const allPeaks = northPeaks + eastPeaks + southPeaks + westPeaks + connectors;
          const combinedPeaks = allPeaks * 0.42;
          
          // Add subtle ridge details for texture
          const ridgeDetail = (
            Math.sin(nx * Math.PI * 4.0 + ny * Math.PI * 3.2) * 0.025 +
            Math.cos(ny * Math.PI * 3.8 - nx * Math.PI * 3.5) * 0.02
          );
          
          // Combine with elevation multiplier
          height = (combinedPeaks + Math.max(0, ridgeDetail)) * elevationMultiplier;
          
          // Strong base elevation to eliminate gaps and ensure continuous coverage
          const baseElevation = smooth1 * 0.25 + smooth2 * 0.2;
          height += baseElevation;
          
          // Ensure minimum height for continuous backdrop (no gaps)
          const minBackdropHeight = smooth1 * 0.15;
          height = Math.max(height, minBackdropHeight);
          
          // Boost distant mountains significantly for tall backdrop
          if (distFromCenter > 0.75) {
            const distantFactor = (distFromCenter - 0.75) / 0.65;
            const distantBoost = distantFactor * distantFactor * (3 - 2 * distantFactor);
            height *= (1.0 + distantBoost * 2.8); // Very tall continuous mountains at edges
          }
          
          // Gentle valleys for variation (reduced to maintain connectivity)
          const valleyPattern = Math.sin(nx * Math.PI * 2.8) * Math.sin(ny * Math.PI * 2.6);
          if (valleyPattern < 0) {
            height *= (1 - Math.abs(valleyPattern) * 0.15); // Shallower valleys
          }
        }
        
        // Convert to 0-255 for heightmap
        const normalizedHeight = Math.floor(height * 255);
        const clampedHeight = Math.max(0, Math.min(255, normalizedHeight));
        
        data[idx] = clampedHeight;
        data[idx + 1] = clampedHeight;
        data[idx + 2] = clampedHeight;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }

  createFarmBoundary(farmSize: number) {
    // Create subtle visual boundary around farm area
    const boundary = BABYLON.MeshBuilder.CreateLines(
      "farmBoundary",
      {
        points: [
          new BABYLON.Vector3(-farmSize / 2, 0.1, -farmSize / 2),
          new BABYLON.Vector3(farmSize / 2, 0.1, -farmSize / 2),
          new BABYLON.Vector3(farmSize / 2, 0.1, farmSize / 2),
          new BABYLON.Vector3(-farmSize / 2, 0.1, farmSize / 2),
          new BABYLON.Vector3(-farmSize / 2, 0.1, -farmSize / 2),
        ],
      },
      this.scene
    );
    boundary.color = new BABYLON.Color3(0.8, 0.8, 0.8);
    boundary.alpha = 0.3;
  }

  addGroundInteraction(farmSize: number) {
    // Create a pickable ground plane for mouse interaction
    const groundPlane = BABYLON.MeshBuilder.CreateGround(
      "interactiveGround",
      { width: farmSize, height: farmSize },
      this.scene
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
        this.canvas.style.cursor = 'pointer';
      } else {
        this.canvas.style.cursor = 'default';
      }
    };
  }

  createRippleEffect(position: BABYLON.Vector3) {
    // Create expanding ring effect
    const ripple = BABYLON.MeshBuilder.CreateTorus(
      "ripple",
      { diameter: 0.5, thickness: 0.05, tessellation: 32 },
      this.scene
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

  async loadAndPlacePalmTrees(farmSize: number, modelPaths: string[], numberOfPalms: number) {
    try {
      // Load all palm tree models from the provided paths
      const loadedModels = [];
      const rootNode = new BABYLON.TransformNode("palmTreesRoot", this.scene);
      for (const modelPath of modelPaths) {
        const model = await BABYLON.SceneLoader.ImportMeshAsync(
          "",
          "./",
          modelPath,
          this.scene
        );
        
        // Hide original meshes
        model.meshes.forEach(mesh => mesh.setEnabled(false));
        loadedModels.push(model);
      }
      
      console.log(`Loaded ${loadedModels.length} palm tree model(s)`);
      
      // Smart distribution using Poisson-like sampling with grid guidance
      const treePositions = this.generateSmartTreeDistribution(farmSize, numberOfPalms); // Slightly larger area for edge trees
      
      let treeIndex = 0;
      
      for (const position of treePositions) {
        // Smart model selection based on position for natural variety
        // Select from available models using modelType
        const modelIndex = position.modelType % loadedModels.length;
        const sourceModel = loadedModels[modelIndex];
        
        // Clone the tree
        const clonedMeshes: BABYLON.AbstractMesh[] = [];
        sourceModel.meshes.forEach(mesh => {
          if (mesh) {
            const clone = mesh.clone(`tree_${treeIndex}_${mesh.name}`, null);
            if (clone) {
              clone.setEnabled(true);
              clonedMeshes.push(clone);
            }
          }
        });
        
        // Create parent for easy manipulation
        const treeParent = new BABYLON.TransformNode(`tree_${treeIndex}`, this.scene);
        clonedMeshes.forEach(mesh => {
          mesh.parent = treeParent;
        });
        
        // Position
        treeParent.position.set(position.x, 0, position.z);
        
        // Random rotation (only Y-axis for natural look)
        treeParent.rotation.y = Math.random() * Math.PI * 2;
        
        // Scale variation based on position (creates natural variation zones)
        const scale = 2 + Math.random() * 1.0;
        treeParent.scaling.set(scale, scale, scale);
        
        // Enable shadows
        clonedMeshes.forEach(mesh => {
          if (mesh instanceof BABYLON.Mesh) {
            this.shadowGenerator?.addShadowCaster(mesh);
            mesh.receiveShadows = true;
          }
        });

        treeParent.parent = rootNode;

        // Add wind animation for natural movement
        this.addWindAnimationToTree(treeParent);
        
        treeIndex++;
      }
      
      console.log(`Placed ${treeIndex} palm trees using smart distribution`);
      
    } catch (error) {
      console.error("Error loading palm trees:", error);
      // Fallback: create simple placeholder trees
      this.createPlaceholderTrees(farmSize);
    }
  }

  addWindAnimationToTree(treeParent: BABYLON.TransformNode) {
    // Ultra-smooth and optimized wind animation using Babylon.js Animation system
    const windSpeed = 0.35 + Math.random() * 0.15; // Very gentle wind (0.35-0.5)
    const windStrength = 0.012 + Math.random() * 0.006; // Subtle sway (0.012-0.018)
    
    // Store original rotation for reference
    const originalRotationY = treeParent.rotation.y;
    
    // Optimized frame rate and duration
    const fps = 60; // Reduced FPS for better performance while maintaining smoothness
    const swayDuration = 120; // Fixed duration for consistency
    
    // OPTIMIZED: Create animation group for better performance
    const animationGroup = new BABYLON.AnimationGroup("palmWindSway", this.scene);
    
    // X-axis sway - Optimized with 5 perfectly placed keyframes
    const swayXAnimation = new BABYLON.Animation(
      "swayX",
      "rotation.x",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    
    const keysX = [
      { frame: 0, value: 0 },
      { frame: swayDuration * 0.25, value: -windStrength * 0.8 },
      { frame: swayDuration * 0.5, value: 0 },
      { frame: swayDuration * 0.75, value: windStrength * 0.8 },
      { frame: swayDuration, value: 0 }
    ];
    swayXAnimation.setKeys(keysX);
    
    // Exponential easing for the smoothest natural motion
    const exponentialEase = new BABYLON.ExponentialEase(2);
    exponentialEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    swayXAnimation.setEasingFunction(exponentialEase);
    
    // Z-axis sway - Phase-shifted for realistic movement
    const swayZAnimation = new BABYLON.Animation(
      "swayZ",
      "rotation.z",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    
    const keysZ = [
      { frame: 0, value: windStrength * 0.4 },
      { frame: swayDuration * 0.25, value: 0 },
      { frame: swayDuration * 0.5, value: -windStrength * 0.4 },
      { frame: swayDuration * 0.75, value: 0 },
      { frame: swayDuration, value: windStrength * 0.4 }
    ];
    swayZAnimation.setKeys(keysZ);
    swayZAnimation.setEasingFunction(exponentialEase);
    
    // Y-axis twist - Very subtle rotation
    const twistYAnimation = new BABYLON.Animation(
      "twistY",
      "rotation.y",
      fps,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    
    const keysY = [
      { frame: 0, value: originalRotationY },
      { frame: swayDuration * 0.33, value: originalRotationY - 0.005 },
      { frame: swayDuration * 0.66, value: originalRotationY + 0.005 },
      { frame: swayDuration, value: originalRotationY }
    ];
    twistYAnimation.setKeys(keysY);
    
    // Quadratic easing for ultra-smooth twist
    const quadraticEase = new BABYLON.QuadraticEase();
    quadraticEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    twistYAnimation.setEasingFunction(quadraticEase);
    
    // OPTIMIZED: Add animations to group for batch processing
    animationGroup.addTargetedAnimation(swayXAnimation, treeParent);
    animationGroup.addTargetedAnimation(swayZAnimation, treeParent);
    animationGroup.addTargetedAnimation(twistYAnimation, treeParent);
    
    // Normalize animations for smooth looping
    animationGroup.normalize(0, swayDuration);
    
    // OPTIMIZED: Play with speed ratio and enable blending
    animationGroup.play(true); // Loop infinitely
    animationGroup.speedRatio = windSpeed;
    
    // Enable animation blending for seamless transitions
    animationGroup.enableBlending = true;
    animationGroup.blendingSpeed = 0.015; // Ultra-smooth blending
    
    // PERFORMANCE: Set animation weight for efficiency
    animationGroup.setWeightForAllAnimatables(1.0);
  }

  generateSmartTreeDistribution(farmSize: number, numberOfPalms: number): Array<{x: number, z: number, scale: number, modelType: number}> {
    const positions: Array<{x: number, z: number, scale: number, modelType: number}> = [];
    
    // Smart grid parameters
    const margin = 3; // Keep trees away from boundary
    const availableSize = farmSize - (margin * 2);
    const centerX = 0;
    const centerZ = 0;
    
    // Calculate ideal minimum spacing based on number of palms and available area
    const areaPerTree = (availableSize * availableSize) / numberOfPalms;
    const minSpacing = Math.sqrt(areaPerTree) * 0.9; // 90% of ideal spacing for some overlap
    
    // Try to place trees with progressively relaxed spacing if needed
    let spacingMultiplier = 1.0;
    const maxRounds = 5;
    
    for (let round = 0; round < maxRounds && positions.length < numberOfPalms; round++) {
      const currentSpacing = minSpacing * spacingMultiplier;
      const maxAttempts = numberOfPalms * 30;
      let attempts = 0;
      
      while (positions.length < numberOfPalms && attempts < maxAttempts) {
        attempts++;
        
        // Generate random position within bounds
        const x = (Math.random() - 0.5) * availableSize;
        const z = (Math.random() - 0.5) * availableSize;
        
        // Check minimum distance from existing trees
        let validPosition = true;
        for (const pos of positions) {
          const dist = Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2);
          if (dist < currentSpacing) {
            validPosition = false;
            break;
          }
        }
        
        if (validPosition) {
          // Calculate distance from center for scale variation
          const distFromCenter = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
          const maxDist = farmSize / 2;
          const centerFactor = 1 - (distFromCenter / maxDist) * 0.15; // Center trees slightly larger
          
          // Smart scale variation (0.85 to 1.15)
          const baseScale = 0.85 + Math.random() * 0.3;
          const scale = baseScale * centerFactor;
          
          // Random model selection for natural variety
          const modelType = Math.floor(Math.random() * 10);
          
          positions.push({ x, z, scale, modelType });
        }
      }
      
      // If we haven't reached the target, reduce spacing for next round
      if (positions.length < numberOfPalms) {
        spacingMultiplier *= 0.8; // Reduce spacing by 20% each round
      }
    }
    
    console.log(`Generated ${positions.length} palm positions (requested: ${numberOfPalms}, final spacing: ${(minSpacing * spacingMultiplier).toFixed(2)})`);
    return positions;
  }

  createPlaceholderTrees(farmSize: number) {
    // Fallback simple trees if models fail to load
    const treeSpacing = 12;
    const treesPerRow = Math.floor(farmSize / treeSpacing) - 1;
    const offset = -(treesPerRow * treeSpacing) / 2;
    
    for (let row = 0; row < treesPerRow; row++) {
      for (let col = 0; col < treesPerRow; col++) {
        const x = offset + col * treeSpacing + (Math.random() - 0.5) * 1.5;
        const z = offset + row * treeSpacing + (Math.random() - 0.5) * 1.5;
        
        // Simple trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder(
          `simplePalm_${row}_${col}_trunk`,
          { height: 8, diameterTop: 0.3, diameterBottom: 0.5 },
          this.scene
        );
        trunk.position.set(x, 4, z);
        
        const trunkMat = new BABYLON.StandardMaterial(`simpleTrunkMat_${row}_${col}`, this.scene);
        trunkMat.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
        trunk.material = trunkMat;
        
        // Simple palm fronds
        for (let i = 0; i < 6; i++) {
          const frond = BABYLON.MeshBuilder.CreateBox(
            `frond_${row}_${col}_${i}`,
            { width: 0.3, height: 0.1, depth: 4 },
            this.scene
          );
          frond.position.set(x, 8, z);
          frond.rotation.y = (i / 6) * Math.PI * 2;
          frond.rotation.x = Math.PI / 6;
          
          const frondMat = new BABYLON.StandardMaterial(`frondMat_${row}_${col}_${i}`, this.scene);
          frondMat.diffuseColor = new BABYLON.Color3(0.1, 0.4, 0.1);
          frond.material = frondMat;
          
          this.shadowGenerator?.addShadowCaster(frond);
        }
        
        this.shadowGenerator?.addShadowCaster(trunk);
        trunk.receiveShadows = true;
      }
    }
  }
  
  async loadAndPlaceGrass(farmSize: number, modelPaths: string[]) {
    try {
      // Load all grass models from the provided paths
      const loadedModels = [];
      
      for (const modelPath of modelPaths) {
        const model = await BABYLON.SceneLoader.ImportMeshAsync(
          "",
          "./",
          modelPath,
          this.scene
        );
        
        // Hide original meshes
        model.meshes.forEach(mesh => mesh.setEnabled(false));
        loadedModels.push(model);
      }
      
      console.log(`Loaded ${loadedModels.length} grass model(s)`);
      
      // Generate grass distribution in zone 2 (vegetation area)
      const terrainWidth = farmSize * 6;
      const grassPositions = this.generateGrassDistribution(farmSize * 1.35, terrainWidth);
      
      let grassIndex = 0;
      
      for (const position of grassPositions) {
        // Select from available models using rotation for variety
        const modelIndex = grassIndex % loadedModels.length;
        const sourceModel = loadedModels[modelIndex];
        
        // Clone the grass
        const clonedMeshes: BABYLON.AbstractMesh[] = [];
        sourceModel.meshes.forEach(mesh => {
          if (mesh) {
            const clone = mesh.clone(`grass_${grassIndex}_${mesh.name}`, null);
            if (clone) {
              clone.setEnabled(true);
              clonedMeshes.push(clone);
            }
          }
        });
        
        // Create parent for easy manipulation
        const grassParent = new BABYLON.TransformNode(`grass_${grassIndex}`, this.scene);
        clonedMeshes.forEach(mesh => {
          mesh.parent = grassParent;
        });
        
        // Position
        grassParent.position.set(position.x, 0, position.z);
        
        // Random rotation (only Y-axis for natural look)
        grassParent.rotation.y = Math.random() * Math.PI * 2;
        
        // Scale variation
        grassParent.scaling.set(17, 17, 17);
        
        // Enable shadows for grass
        clonedMeshes.forEach(mesh => {
          if (mesh instanceof BABYLON.Mesh) {
            this.shadowGenerator?.addShadowCaster(mesh);
            mesh.receiveShadows = true;
          }
        });
        
        grassIndex++;
      }
      
      console.log(`Placed ${grassIndex} grass instances in zone 2`);
      
    } catch (error) {
      console.error("Error loading grass:", error);
    }
  }

  generateGrassDistribution(farmSize: number, terrainWidth: number): Array<{x: number, z: number, scale: number}> {
    const positions: Array<{x: number, z: number, scale: number}> = [];
    
    // Zone 2 parameters (vegetation area around farm)
    const zone1Radius = farmSize / 2 + 5; // Just outside farm boundary
    const zone2OuterRadius = terrainWidth * 0.45; // Zone 2 outer boundary
    
    // Grass distribution parameters
    const minSpacing = 2.5; // Minimum distance between grass
    const numGrassInstances = 800; // Number of grass instances
    
    // Generate random positions in zone 2
    let attempts = 0;
    const maxAttempts = numGrassInstances * 10;
    
    while (positions.length < numGrassInstances && attempts < maxAttempts) {
      attempts++;
      
      // Generate random position in zone 2 ring
      const angle = Math.random() * Math.PI * 2;
      const radius = zone1Radius + Math.random() * (zone2OuterRadius - zone1Radius);
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Check minimum distance from existing positions
      let validPosition = true;
      for (const pos of positions) {
        const dist = Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2);
        if (dist < minSpacing) {
          validPosition = false;
          break;
        }
      }
      
      if (validPosition) {
        // Random scale variation for natural look
        const scale = 0.8 + Math.random() * 0.6; // 0.8 to 1.4
        positions.push({ x, z, scale });
      }
    }
    
    console.log(`Generated ${positions.length} grass positions in zone 2`);
    return positions;
  }
  
}
// Exporting a factory function for creating the BabylonManager instance
export const createStudioSceneManager = (
  props: any
): any => {
  return new StudioSceneManager(props);
};
