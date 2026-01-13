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
  onLoadProgress?: (progress: number) => void;

  constructor(props: any) {
    this.engine = props.engine;
    this.canvas = props.canvas;
    this.scene = new BABYLON.Scene(this.engine);
    this.onLoadProgress = props.onLoadProgress;
  }

  //#region  MainSceneProperties
  async createScene() {
    try {
            //Create Scene
      this.scene.clearColor = new BABYLON.Color4(0.68, 0.78, 0.88, 1); // Lighter sky for better fog blend
      this.scene.imageProcessingConfiguration.contrast = 2.5;
      this.scene.imageProcessingConfiguration.exposure = 1.8;
      
      // Add linear fog for distant mountains (not affecting near farm area)
      this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
      this.scene.fogStart = 2000; // Fog begins at distance (beyond farm)
      this.scene.fogEnd = 9500; // Full fog at far mountains
      this.scene.fogColor = new BABYLON.Color3(0.75, 0.82, 0.92); // Lighter atmospheric fog

    //Installation
    this.camera = this.createCamera(); //create Camera
    this.setUpEnvironMent(); //set up the environment      // Load the room with progress tracking
      await this.initFarmEnvironment();
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
    camera.wheelPrecision = 50;
    camera.pinchPrecision = 100;
    
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
    sunLight.intensity = 1.7; // Brighter for fog penetration
    
    // Warm sun color for better atmosphere
    sunLight.diffuse = new BABYLON.Color3(1.0, 0.97, 0.92);
    sunLight.specular = new BABYLON.Color3(1.0, 0.97, 0.90);
    
    // Hemispheric light for realistic sky ambient light
    const skyLight = new BABYLON.HemisphericLight(
      "SkyAmbient",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    skyLight.intensity = 0.55; // Enhanced for fog
    skyLight.diffuse = new BABYLON.Color3(0.72, 0.82, 0.95); // Lighter blue matching fog
    skyLight.groundColor = new BABYLON.Color3(0.35, 0.45, 0.35); // Warmer ground reflection
    skyLight.specular = new BABYLON.Color3(0.15, 0.15, 0.15); // Slight specular for depth
    
    // Additional fill light for realistic outdoor lighting (bounced light simulation)
    // const fillLight = new BABYLON.HemisphericLight(
    //   "FillLight",
    //   new BABYLON.Vector3(0, -1, 0), // From below (ground bounce)
    //   this.scene
    // );
    // fillLight.intensity = 0.2; // Subtle fill
    // fillLight.diffuse = new BABYLON.Color3(0.6, 0.65, 0.5); // Slightly warm from grass
    // fillLight.groundColor = new BABYLON.Color3(0.4, 0.45, 0.6); // Sky color
    // fillLight.specular = new BABYLON.Color3(0, 0, 0); // No specular

    // Realistic shadow generator
    this.shadowGenerator = new BABYLON.ShadowGenerator(4096, sunLight); // Higher resolution for quality
    this.shadowGenerator.usePercentageCloserFiltering = true; // PCF for soft, realistic shadows
    this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;
    this.shadowGenerator.darkness = 0.4; // Slightly darker for depth
    this.shadowGenerator.bias = 0.00001; // Prevent shadow acne
    this.shadowGenerator.normalBias = 0.015; // Better shadow alignment
    
    // Shadow frustum for optimal shadow coverage
    sunLight.shadowMinZ = 5;
    sunLight.shadowMaxZ = 450;
    sunLight.shadowOrthoScale = 0.45; // Balanced coverage


    // this.scene.debugLayer.show();
    // Create skybox
    this.createSkybox();

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

  async initFarmEnvironment() {
    // Central farm area size
    const farmSize = 50; // 100x100 units square
        
    // 1. Create background environment (larger surrounding area)
    this.createBackgroundEnvironment(farmSize);
    
    // 2. Load and place palm trees in the central farm
    const palmModelPaths = [
      "models/palms/realistic_hd_date_palm_1178_adult_thriving_with_dates.glb",
      "models/palms/realistic_hd_date_palm_1378_mature_thriving.glb",
      // Add more model paths here as needed
    ];
    await this.loadAndPlacePalmTrees(farmSize, palmModelPaths);
    
    // 3. Load and place grass in zone 2 (vegetation area)
    const grassModelPaths = [
      "models/vegetation/grass/grass1.glb",
      "models/vegetation/grass/grass2.glb",
      "models/vegetation/grass/grass3.glb"

      // Add more grass model paths here as needed
    ];
    await this.loadAndPlaceGrass(farmSize, grassModelPaths);
    
    // 4. Add visual boundary indicator
    this.createFarmBoundary(farmSize);
  }

  createBackgroundEnvironment(farmSize: number) {
    // Create large mountain backdrop around the farm
    const terrainWidth = farmSize * 8; // Very large terrain for mountain backdrop
    const textureScale = terrainWidth / 30; // Texture scaling factor

    // Create mountain mesh with dramatic height variation
    BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "surroundingMountains",
      this.createMountainRangeHeightMap(),
      {
        width: terrainWidth,
        height: terrainWidth,
        subdivisions: 150,
        minHeight: 0,
        maxHeight: 30,
        onReady: (mesh) => {
          mesh.receiveShadows = true;
          mesh.position.y = 0;
          
          // Create advanced multi-texture terrain material with height-based blending
          mesh.material = this.createAdvancedTerrainMaterial(textureScale);
        }
      },
      this.scene
    );
    
    // Add custom grass vegetation
    // this.createCustomGrass(farmSize, terrainWidth);
  }

  createAdvancedTerrainMaterial(textureScale: number): BABYLON.Material {
    // Create custom shader with per-tile texture variation
    BABYLON.Effect.ShadersStore["terrainTileVertexShader"] = `
      precision highp float;
      
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      
      uniform mat4 worldViewProjection;
      uniform mat4 world;
      uniform mat4 view;
      
      varying vec2 vUV;
      varying vec3 vPositionW;
      varying vec3 vNormalW;
      varying vec3 vViewPosition;
      
      void main(void) {
        vec4 worldPos = world * vec4(position, 1.0);
        gl_Position = worldViewProjection * vec4(position, 1.0);
        
        vUV = uv;
        vPositionW = worldPos.xyz;
        vNormalW = normalize(mat3(world) * normal);
        vViewPosition = (view * worldPos).xyz;
      }
    `;
    
    BABYLON.Effect.ShadersStore["terrainTileFragmentShader"] = `
      precision highp float;
      
      varying vec2 vUV;
      varying vec3 vPositionW;
      varying vec3 vNormalW;
      varying vec3 vViewPosition;
      
      uniform sampler2D grassDiffuse;
      uniform sampler2D grassNormal;
      uniform sampler2D metallicTexture;
      uniform float textureScale;
      uniform vec3 cameraPosition;
      uniform float tileSize;
      
      // Hash function for random values
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      
      // Rotation matrix
      mat2 rotate(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }
      
      void main(void) {
        // Calculate tile ID based on world position
        vec2 tileID = floor(vPositionW.xz / tileSize);
        
        // Generate random values per tile
        float randomAngle = hash(tileID) * 6.28318; // 0 to 2PI
        float randomScale = 0.85 + hash(tileID + vec2(7.3, 2.1)) * 0.3; // 0.85 to 1.15
        vec2 randomOffset = vec2(
          hash(tileID + vec2(3.7, 8.2)),
          hash(tileID + vec2(5.3, 1.9))
        );
        
        // Get local position within tile
        vec2 localPos = fract(vPositionW.xz / tileSize);
        
        // Apply rotation around tile center
        vec2 centered = localPos - 0.5;
        vec2 rotated = rotate(randomAngle) * centered;
        vec2 finalLocal = rotated + 0.5;
        
        // Apply scale and offset
        vec2 finalUV = (finalLocal / randomScale + randomOffset) * textureScale;
        
        // Sample textures
        vec4 baseColor = texture2D(grassDiffuse, finalUV);
        vec3 normalMap = texture2D(grassNormal, finalUV).xyz * 2.0 - 1.0;
        float roughness = texture2D(metallicTexture, finalUV).r;
        
        // Calculate lighting
        vec3 N = normalize(vNormalW);
        vec3 L = normalize(vec3(0.5, 1.0, 0.3)); // Light direction
        vec3 V = normalize(cameraPosition - vPositionW);
        vec3 H = normalize(L + V);
        
        // Diffuse
        float NdotL = max(dot(N, L), 0.0);
        vec3 diffuse = baseColor.rgb * NdotL;
        
        // Ambient
        vec3 ambient = baseColor.rgb * 0.2;
        
        // Specular with roughness
        float NdotH = max(dot(N, H), 0.0);
        float shininess = mix(64.0, 8.0, roughness); // Rougher = less shiny
        float specular = pow(NdotH, shininess) * (1.0 - roughness) * 0.15;
        
        // Combine
        vec3 finalColor = ambient + diffuse + vec3(specular);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
    
    const terrainMat = new BABYLON.ShaderMaterial(
      "terrainTile",
      this.scene,
      {
        vertex: "terrainTile",
        fragment: "terrainTile",
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldViewProjection", "view", "cameraPosition", "textureScale", "tileSize"],
        samplers: ["grassDiffuse", "grassNormal", "metallicTexture"],
      }
    );
    
    // Load textures
    const grassDiffuse = new BABYLON.Texture(
      "Textuers/ground/textures/ForestLeaves02/forest_leaves_02_diffuse_4k.jpg",
      this.scene
    );
    
    const grassNormal = new BABYLON.Texture(
      "Textuers/ground/textures/ForestLeaves02/forest_leaves_02_nor_gl_4k.jpg",
      this.scene
    );
    
    const metallicTexture = new BABYLON.Texture(
      "Textuers/ground/textures/ForestLeaves02/forest_leaves_02_rough_4k.jpg",
      this.scene
    );
    
    terrainMat.setTexture("grassDiffuse", grassDiffuse);
    terrainMat.setTexture("grassNormal", grassNormal);
    terrainMat.setTexture("metallicTexture", metallicTexture);
    
    terrainMat.setFloat("textureScale", textureScale * 0.3);
    terrainMat.setFloat("tileSize", 125.0);
    
    // Update camera position each frame
    this.scene.registerBeforeRender(() => {
      if (this.camera) {
        terrainMat.setVector3("cameraPosition", this.camera.position);
      }
    });
    
    terrainMat.backFaceCulling = true;
    
    return terrainMat;
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
    // Zone 2: Trees/grass area (flat, height 0) 
    // Zone 3: Mountain area (gradual elevations to tall peaks)
    
    const ZONE1_RADIUS = 0.15;  // Farm area (farmSize / terrainWidth)
    const ZONE1_SLOPE_END = 0.165; // Small slope at farm edge
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
        
        // ZONE 1: Farm area - completely flat with small slope at edge
        if (distFromCenter < ZONE1_RADIUS) {
          height = 0; // Perfectly flat farm
        } else if (distFromCenter < ZONE1_SLOPE_END) {
          // Small slope transition at farm edge with double smoothstep for ultra-gradual rise
          const slopeFactor = (distFromCenter - ZONE1_RADIUS) / (ZONE1_SLOPE_END - ZONE1_RADIUS);
          const smoothSlope1 = slopeFactor * slopeFactor * (3 - 2 * slopeFactor);
          const smoothSlope2 = smoothSlope1 * smoothSlope1 * (3 - 2 * smoothSlope1);
          height = smoothSlope2 * 0.095; // Very gradual elevation ~2.8 units (0.035 * 80)
        } 
        // ZONE 2: Trees/grass area - completely flat
        else if (distFromCenter < ZONE2_RADIUS) {
          height = 0; // Flat placeholder area
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

  async loadAndPlacePalmTrees(farmSize: number, modelPaths: string[]) {
    try {
      // Load all palm tree models from the provided paths
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
      
      console.log(`Loaded ${loadedModels.length} palm tree model(s)`);
      
      // Smart distribution using Poisson-like sampling with grid guidance
      const treePositions = this.generateSmartTreeDistribution(farmSize * 1.2); // Slightly larger area for edge trees
      
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
        const scale = position.scale;
        treeParent.scaling.set(scale, scale, scale);
        
        // Enable shadows
        clonedMeshes.forEach(mesh => {
          if (mesh instanceof BABYLON.Mesh) {
            this.shadowGenerator?.addShadowCaster(mesh);
            mesh.receiveShadows = true;
          }
        });
        
        treeIndex++;
      }
      
      console.log(`Placed ${treeIndex} palm trees using smart distribution`);
      
    } catch (error) {
      console.error("Error loading palm trees:", error);
      // Fallback: create simple placeholder trees
      this.createPlaceholderTrees(farmSize);
    }
  }

  generateSmartTreeDistribution(farmSize: number): Array<{x: number, z: number, scale: number, modelType: number}> {
    const positions: Array<{x: number, z: number, scale: number, modelType: number}> = [];
    
    // Smart grid parameters
    const minSpacing = 10; // Minimum distance between trees
    const idealSpacing = 12; // Ideal spacing for farm operations
    const maxVariation = 2.5; // Maximum random offset from grid point
    
    // Calculate grid
    const gridSize = Math.floor(farmSize / idealSpacing);
    const startOffset = -(gridSize * idealSpacing) / 2;
    
    // Create zones for natural variation
    const centerX = 0;
    const centerZ = 0;
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Base grid position
        const baseX = startOffset + col * idealSpacing;
        const baseZ = startOffset + row * idealSpacing;
        
        // Smart jittering using blue noise-like approach
        // Offset based on row/col position for better distribution
        const rowOffset = (row % 3) * 0.3;
        const colOffset = (col % 3) * 0.3;
        const noise = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
        const normalizedNoise = (noise - Math.floor(noise)) * 2 - 1;
        
        const offsetX = (normalizedNoise * maxVariation) + (rowOffset - 0.45);
        const offsetZ = ((Math.cos(row * 7.233 + col * 5.898) * 0.5 + 0.5) * 2 - 1) * maxVariation + (colOffset - 0.45);
        
        const x = baseX + offsetX;
        const z = baseZ + offsetZ;
        
        // Check if position is within farm bounds (with margin)
        const margin = 3;
        if (Math.abs(x) < farmSize / 2 - margin && Math.abs(z) < farmSize / 2 - margin) {
          // Ensure minimum distance from existing trees
          let validPosition = true;
          for (const pos of positions) {
            const dist = Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2);
            if (dist < minSpacing) {
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
            
            // Distribute models with variation for natural look
            // Use row/col pattern plus random variation
            let modelType = (row + col) % 3; // Supports multiple models
            // 20% chance to use random model for more natural distribution
            if (Math.random() < 0.2) {
              modelType = Math.floor(Math.random() * 10); // Random selection
            }
            
            positions.push({ x, z, scale, modelType });
          }
        }
      }
    }
    
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
