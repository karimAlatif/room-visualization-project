import * as BABYLON from "babylonjs";

export const createMountainRangeHeightMap = (): string => {
  const resolution = 512;
  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, resolution, resolution);

  const imageData = ctx.getImageData(0, 0, resolution, resolution);
  const data = imageData.data;

  const ZONE1_RADIUS = 0.18; // Farm area (FarmSize / terrainWidth)
  const ZONE1_SLOPE_END = 0.32; // Wide elevated platform around farm
  const ZONE2_RADIUS = 0.45; // Trees and grass area (placeholders)
  const ZONE3_START = 0.5; // Mountains begin with transition

  
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
          blockHeight = 0.2; // Medium-high blocks
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
        const distanceFromZone2Center =
          (distFromCenter - ZONE1_SLOPE_END) / (ZONE2_RADIUS - ZONE1_SLOPE_END);
        const edgeFalloff = 1.0 - distanceFromZone2Center * 0.6;

        // Apply falloff
        height = blockHeight * Math.max(0, edgeFalloff);

        // Very slight smoothing at block edges to avoid perfect squares
        const edgeSmooth =
          Math.sin(blockX * 8.0) * Math.cos(blockY * 8.0) * 0.008;
        height += edgeSmooth;

        // Clamp height
        height = Math.max(0, Math.min(height, 0.3));
      }
      // Transition zone before mountains
      else if (distFromCenter < ZONE3_START) {
        // Smooth rise from flat to mountain base
        const transitionFactor =
          (distFromCenter - ZONE2_RADIUS) / (ZONE3_START - ZONE2_RADIUS);
        const smoothTransition =
          transitionFactor * transitionFactor * (3 - 2 * transitionFactor);
        height = smoothTransition * 0.02; // Gentle rise ~4 units
      }
      // ZONE 3: Mountain area - gradual elevations to tall peaks
      else {
        // Calculate progressive elevation factor
        const mountainDistance =
          (distFromCenter - ZONE3_START) / (1.4 - ZONE3_START);

        // Apply triple smoothstep for ultra-gradual elevation
        const smooth1 =
          mountainDistance * mountainDistance * (3 - 2 * mountainDistance);
        const smooth2 = smooth1 * smooth1 * (3 - 2 * smooth1);
        const smooth3 = smooth2 * smooth2 * (3 - 2 * smooth2);

        // Progressive multiplier - mountains get taller with distance
        const elevationMultiplier =
          mountainDistance * 0.35 +
          smooth1 * 0.35 +
          smooth2 * 0.25 +
          smooth3 * 0.25;

        // Create varied mountain ranges in all directions with better connectivity
        // North range
        const northPattern =
          Math.sin(nx * Math.PI * 2.0) * Math.cos(ny * Math.PI * 1.5 + 2.5);
        const northPeaks = Math.pow(Math.max(0, northPattern), 1.2) * 0.55;

        // East range
        const eastPattern =
          Math.cos(nx * Math.PI * 1.7 + 1.0) * Math.sin(ny * Math.PI * 2.2);
        const eastPeaks = Math.pow(Math.max(0, eastPattern), 1.2) * 0.52;

        // South range
        const southPattern =
          Math.sin((nx + ny) * Math.PI * 1.8 + 1.5) *
          Math.cos((nx - ny) * Math.PI * 1.9);
        const southPeaks = Math.pow(Math.max(0, southPattern), 1.2) * 0.5;

        // West range
        const westPattern =
          Math.sin(ny * Math.PI * 2.1 - 0.5) *
          Math.cos(nx * Math.PI * 1.6 + 2.0);
        const westPeaks = Math.pow(Math.max(0, westPattern), 1.2) * 0.56;

        // Add connecting ridges between ranges for semi-connected mountains
        const connectingRidge1 =
          Math.sin((nx + ny) * Math.PI * 2.5) *
          Math.cos((nx - ny) * Math.PI * 2.2);
        const connectingRidge2 =
          Math.cos((nx * 2 + ny) * Math.PI * 1.8) *
          Math.sin((ny * 2 - nx) * Math.PI * 1.6);
        const connectors =
          Math.pow(Math.max(0, connectingRidge1), 1.2) * 0.35 +
          Math.pow(Math.max(0, connectingRidge2), 1.2) * 0.32;

        // Blend all mountain ranges with connectors - using max for better coverage
        const allPeaks =
          northPeaks + eastPeaks + southPeaks + westPeaks + connectors;
        const combinedPeaks = allPeaks * 0.42;

        // Add subtle ridge details for texture
        const ridgeDetail =
          Math.sin(nx * Math.PI * 4.0 + ny * Math.PI * 3.2) * 0.025 +
          Math.cos(ny * Math.PI * 3.8 - nx * Math.PI * 3.5) * 0.02;

        // Combine with elevation multiplier
        height =
          (combinedPeaks + Math.max(0, ridgeDetail)) * elevationMultiplier;

        // Strong base elevation to eliminate gaps and ensure continuous coverage
        const baseElevation = smooth1 * 0.25 + smooth2 * 0.2;
        height += baseElevation;

        // Ensure minimum height for continuous backdrop (no gaps)
        const minBackdropHeight = smooth1 * 0.15;
        height = Math.max(height, minBackdropHeight);

        // Boost distant mountains significantly for tall backdrop
        if (distFromCenter > 0.75) {
          const distantFactor = (distFromCenter - 0.75) / 0.65;
          const distantBoost =
            distantFactor * distantFactor * (3 - 2 * distantFactor);
          height *= 1.0 + distantBoost * 2.8; // Very tall continuous mountains at edges
        }

        // Gentle valleys for variation (reduced to maintain connectivity)
        const valleyPattern =
          Math.sin(nx * Math.PI * 2.8) * Math.sin(ny * Math.PI * 2.6);
        if (valleyPattern < 0) {
          height *= 1 - Math.abs(valleyPattern) * 0.15; // Shallower valleys
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
};


type Transformable = BABYLON.TransformNode | BABYLON.Mesh;

export function cloneTransformHierarchy(
  sourceRoot: BABYLON.TransformNode,
  scene: BABYLON.Scene,
  options?: {
    nameSuffix?: string;
    cloneMaterials?: boolean;
  },
): BABYLON.TransformNode {
  const { nameSuffix = "_clone", cloneMaterials = false } = options || {};

  const rootClone = new BABYLON.TransformNode(
    sourceRoot.name + nameSuffix,
    scene,
  );
  
  copyTransform(sourceRoot, rootClone);
  copyMetadata(sourceRoot, rootClone);

  const cloneChildren = (
    source: BABYLON.TransformNode,
    parentClone: BABYLON.TransformNode,
  ) => {
    source.getChildren().forEach((child) => {
      if (!isTransformable(child)) return;

      let cloned: Transformable;

      // ---- Mesh ----
      if (child instanceof BABYLON.Mesh) {
        const meshClone = child.clone(
          child.name + nameSuffix,
          null,
          false,
        ) as BABYLON.Mesh;

        if (cloneMaterials && meshClone.material) {
          meshClone.material = meshClone.material.clone(
            meshClone.material.name + nameSuffix,
          );
        }

        cloned = meshClone;
      }

      // ---- TransformNode ----
      else {
        cloned = new BABYLON.TransformNode(child.name + nameSuffix, scene);
      }

      copyTransform(child, cloned);
      copyMetadata(child, cloned);

      cloned.parent = parentClone;
      cloned.setEnabled(true);

      ///
     

      if (child instanceof BABYLON.TransformNode) {
        cloneChildren(child, cloned);
      }
    });
  };

  cloneChildren(sourceRoot, rootClone);

  return rootClone;
}

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

function isTransformable(node: BABYLON.Node): node is BABYLON.TransformNode {
  return node instanceof BABYLON.TransformNode;
}

function copyTransform(
  source: BABYLON.TransformNode,
  target: BABYLON.TransformNode,
) {
  // 🚨 absolute safety
  if (!source.position || !target.position) return;

  target.position.copyFrom(source.position.clone());
  target.scaling.copyFrom(source.scaling.clone());

  if (source.rotationQuaternion) {
    target.rotationQuaternion = source.rotationQuaternion.clone();
  } else {
    target.rotation.copyFrom(source.rotation);
  }
}

function copyMetadata(source: BABYLON.Node, target: BABYLON.Node) {
  if (source.metadata) {
    target.metadata = structuredClone(source.metadata);
  }
}


// async const loadAndPlaceGrass(modelPaths: string[]) {
//     try {
//       // Load all grass models from the provided paths
//       const loadedModels = [];

//       for (const modelPath of modelPaths) {
//         const model = await BABYLON.SceneLoader.ImportMeshAsync(
//           "",
//           "./",
//           modelPath,
//           this.scene
//         );

//         // Hide original meshes
//         model.meshes.forEach(mesh => mesh.setEnabled(false));
//         loadedModels.push(model);
//       }

//       console.log(`Loaded ${loadedModels.length} grass model(s)`);

//       // Generate grass distribution in zone 2 (vegetation area)
//       const terrainWidth = FarmSize * 6;
//       const grassPositions = this.generateGrassDistribution(FarmSize * 1.35, terrainWidth);

//       let grassIndex = 0;

//       for (const position of grassPositions) {
//         // Select from available models using rotation for variety
//         const modelIndex = grassIndex % loadedModels.length;
//         const sourceModel = loadedModels[modelIndex];

//         // Clone the grass
//         const clonedMeshes: BABYLON.AbstractMesh[] = [];
//         sourceModel.meshes.forEach(mesh => {
//           if (mesh) {
//             const clone = mesh.clone(`grass_${grassIndex}_${mesh.name}`, null);
//             if (clone) {
//               clone.setEnabled(true);
//               clonedMeshes.push(clone);
//             }
//           }
//         });

//         // Create parent for easy manipulation
//         const grassParent = new BABYLON.TransformNode(`grass_${grassIndex}`, this.scene);
//         clonedMeshes.forEach(mesh => {
//           mesh.parent = grassParent;
//         });

//         // Position
//         grassParent.position.set(position.x, 0, position.z);

//         // Random rotation (only Y-axis for natural look)
//         grassParent.rotation.y = Math.random() * Math.PI * 2;

//         // Scale variation
//         grassParent.scaling.set(17, 17, 17);

//         // Enable shadows for grass
//         clonedMeshes.forEach(mesh => {
//           if (mesh instanceof BABYLON.Mesh) {
//             this.shadowGenerator?.addShadowCaster(mesh);
//             mesh.receiveShadows = true;
//           }
//         });

//         grassIndex++;
//       }

//       console.log(`Placed ${grassIndex} grass instances in zone 2`);

//     } catch (error) {
//       console.error("Error loading grass:", error);
//     }
//   }

//  const generateGrassDistribution(terrainWidth: number): Array<{x: number, z: number, scale: number}> {
//     const positions: Array<{x: number, z: number, scale: number}> = [];

//     // Zone 2 parameters (vegetation area around farm)
//     const zone1Radius = FarmSize / 2 + 5; // Just outside farm boundary
//     const zone2OuterRadius = terrainWidth * 0.45; // Zone 2 outer boundary

//     // Grass distribution parameters
//     const minSpacing = 2.5; // Minimum distance between grass
//     const numGrassInstances = 800; // Number of grass instances

//     // Generate random positions in zone 2
//     let attempts = 0;
//     const maxAttempts = numGrassInstances * 10;

//     while (positions.length < numGrassInstances && attempts < maxAttempts) {
//       attempts++;

//       // Generate random position in zone 2 ring
//       const angle = Math.random() * Math.PI * 2;
//       const radius = zone1Radius + Math.random() * (zone2OuterRadius - zone1Radius);

//       const x = Math.cos(angle) * radius;
//       const z = Math.sin(angle) * radius;

//       // Check minimum distance from existing positions
//       let validPosition = true;
//       for (const pos of positions) {
//         const dist = Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2);
//         if (dist < minSpacing) {
//           validPosition = false;
//           break;
//         }
//       }

//       if (validPosition) {
//         // Random scale variation for natural look
//         const scale = 0.8 + Math.random() * 0.6; // 0.8 to 1.4
//         positions.push({ x, z, scale });
//       }
//     }

//     console.log(`Generated ${positions.length} grass positions in zone 2`);
//     return positions;
//   }
  // addWindAnimationToTree(treeParent: BABYLON.TransformNode) {
  //   const scene = this.scene;
  //   const fps = 60;
  //   const swayDuration = 180;

  //   // Store original Y rotation per palm
  //   const originalRotationY = treeParent.rotation.y;

  //   // --- Shared Animations (created once) ---
  //   if (!this.sharedAnimations) {
  //     this.sharedAnimations = {
  //       swayX: null as unknown as BABYLON.Animation,
  //       twistY: null as unknown as BABYLON.Animation,
  //       swayZ: null as unknown as BABYLON.Animation,
  //     };

  //     // X sway
  //     const swayX = new BABYLON.Animation(
  //       "swayX",
  //       "rotation.x",
  //       fps,
  //       BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  //       BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
  //     );
  //     swayX.setKeys([
  //       { frame: 0, value: 0 },
  //       { frame: swayDuration * 0.25, value: -0.015 },
  //       { frame: swayDuration * 0.5, value: 0 },
  //       { frame: swayDuration * 0.75, value: 0.015 },
  //       { frame: swayDuration, value: 0 },
  //     ]);

  //     // Z sway
  //     const swayZ = new BABYLON.Animation(
  //       "swayZ",
  //       "rotation.z",
  //       fps,
  //       BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  //       BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
  //     );
  //     swayZ.setKeys([
  //       { frame: 0, value: 0.006 },
  //       { frame: swayDuration * 0.25, value: 0 },
  //       { frame: swayDuration * 0.5, value: -0.006 },
  //       { frame: swayDuration * 0.75, value: 0 },
  //       { frame: swayDuration, value: 0.006 },
  //     ]);

  //     // Y twist (centered at 0, will add originalRotationY per mesh)
  //     const twistY = new BABYLON.Animation(
  //       "twistY",
  //       "rotation.y",
  //       fps,
  //       BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  //       BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
  //     );
  //     twistY.setKeys([
  //       { frame: 0, value: originalRotationY },
  //       { frame: swayDuration * 0.33, value: originalRotationY - 0.005 },
  //       { frame: swayDuration * 0.66, value: originalRotationY + 0.005 },
  //       { frame: swayDuration, value: originalRotationY },
  //     ]);

  //     if (!this.sharedAnimations) {
  //       this.sharedAnimations = {
  //         swayX: swayX,
  //         swayZ: swayZ,
  //         twistY: twistY,
  //       };
  //     } else {
  //       this.sharedAnimations.swayX = swayX;
  //       this.sharedAnimations.swayZ = swayZ;
  //       this.sharedAnimations.twistY = twistY;
  //     }
  //   }

  //   const { swayX, swayZ, twistY } = this.sharedAnimations;

  //   // --- Random parameters per palm ---
  //   const windSpeed = 0.35 + Math.random() * 0.15; // animation speed
  //   const phaseOffset = Math.random() * swayDuration; // random starting frame

  //   // --- Create Animatables per palm ---
  //   const animX = scene.beginDirectAnimation(
  //     treeParent,
  //     [swayX],
  //     0,
  //     swayDuration,
  //     true,
  //     windSpeed,
  //   );
  //   const animZ = scene.beginDirectAnimation(
  //     treeParent,
  //     [swayZ],
  //     0,
  //     swayDuration,
  //     true,
  //     windSpeed,
  //   );
  //   const animY = scene.beginDirectAnimation(
  //     treeParent,
  //     [twistY],
  //     0,
  //     swayDuration,
  //     true,
  //     windSpeed,
  //   );

  //   // --- Apply random phase offset ---
  //   animX.goToFrame(phaseOffset);
  //   animZ.goToFrame(phaseOffset);
  //   animY.goToFrame(phaseOffset);
  // }