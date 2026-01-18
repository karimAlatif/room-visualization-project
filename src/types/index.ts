import { Vector3 } from "babylonjs";

export type PalmStatus = "healthy" | "warning" | "critical";
export type RobotStatus = "idle" | "moving" | "scanning" | "returning";
export type AlertSeverity = "high" | "medium" | "info";

export const FarmSize = 200;
export const FarmNumberOfPalms = 150;
export const FarmNumberOfRobots = 5;
export const FarmNumberOfAlerts = 5;
export const FarmNumberOfActivityLogs = 50;
export const FarmNumberOfPalmVarieties = 4;
export const FarmNumberOfPalmStatuses = 5;
export const FarmNumberOfRobotStatuses = 4;

export interface Palm {
  id: string;
  position: Vector3;
  variety: string;
  status: PalmStatus;
  hydration: number;
  nutrientLevel: number;
  pestProbability: number;
  estimatedHarvest: string;
  lastWatered: string;
  modelType: number;
}

export interface Robot {
  id: string;
  position: Vector3;
  targetPosition?: Vector3;
  battery: number;
  status: RobotStatus;
  currentMission?: string;
  assignedPalmId?: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  palmId?: string;
  robotId?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  entityType: "palm" | "robot";
  entityId: string;
}

export interface FarmState {
  palms: Palm[];
  robots: Robot[];
  alerts: Alert[];
  activityLogs: ActivityLog[];
  selectedPalmId?: string;
  selectedRobotId?: string;
  temperature: number;

  // Actions
  selectPalm: (id: string) => void;
  selectRobot: (id: string) => void;
  assignRobotToPalm: (robotId: string, palmId: string) => void;
  updateRobotPosition: (robotId: string, position: Vector3) => void;
  completeRobotMission: (robotId: string) => void;
  returnRobotToBase: (robotId: string) => void;
  addActivityLog: (log: Omit<ActivityLog, "id" | "timestamp">) => void;
  updatePalmStatus: (palmId: string, status: PalmStatus) => void;
}

export const generateSmartTreeDistribution = (): Palm[] => {
  const palms: Palm[] = [];
  const varieties = ["Medjool", "Deglet Noor", "Barhi", "Zahidi"];
  const statuses: PalmStatus[] = [
    "healthy",
    "healthy",
    "healthy",
    "warning",
    "critical",
  ];

  // Smart grid parameters
  const margin = 3; // Keep trees away from boundary
  const availableSize = FarmSize - margin * 2;
  // const centerX = 0;
  // const centerZ = 0;

  // Calculate ideal minimum spacing based on number of palms and available area
  const areaPerTree = (availableSize * availableSize) / FarmNumberOfPalms;
  const minSpacing = Math.sqrt(areaPerTree) * 0.9; // 90% of ideal spacing for some overlap

  // Try to place trees with progressively relaxed spacing if needed
  let spacingMultiplier = 1.0;
  const maxRounds = 5;

  for (
    let round = 0;
    round < maxRounds && palms.length < FarmNumberOfPalms;
    round++
  ) {
    const currentSpacing = minSpacing * spacingMultiplier;
    const maxAttempts = FarmNumberOfPalms * 30;
    let attempts = 0;

    while (palms.length < FarmNumberOfPalms && attempts < maxAttempts) {
      attempts++;

      // Generate random position within bounds
      const x = (Math.random() - 0.5) * availableSize;
      const z = (Math.random() - 0.5) * availableSize;

      // Check minimum distance from existing trees
      let validPosition = true;
      for (const palm of palms) {
        const dist = Math.sqrt(
          (x - palm.position.x) ** 2 + (z - palm.position.z) ** 2
        );
        if (dist < currentSpacing) {
          validPosition = false;
          break;
        }
      }

      if (validPosition) {
        // Calculate distance from center for scale variation
        //   const distFromCenter = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
        //   const maxDist = FarmSize / 2;
        //   const centerFactor = 1 - (distFromCenter / maxDist) * 0.15; // Center trees slightly larger

        // Smart scale variation (0.85 to 1.15)
        //   const baseScale = 0.85 + Math.random() * 0.3;
        //   const scale = baseScale * centerFactor;

        // Random model selection for natural variety
        const modelType = Math.floor(Math.random() * 10);

        palms.push({
          id: `PALM-${String(Math.random() * 5).padStart(3, "0")}`,
          position: new Vector3(x, 0, z),
          variety: varieties[Math.floor(Math.random() * varieties.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          hydration: Math.floor(Math.random() * 40) + 60,
          nutrientLevel: Math.floor(Math.random() * 30) + 70,
          pestProbability: Math.floor(Math.random() * 20),
          estimatedHarvest: "2025-03-15",
          lastWatered: "2025-01-10",
          modelType,
        });

        //   palms.push({ x, z, scale, modelType });
      }
    }

    // If we haven't reached the target, reduce spacing for next round
    if (palms.length < FarmNumberOfPalms) {
      spacingMultiplier *= 0.8; // Reduce spacing by 20% each round
    }
  }

  console.log(
    `Generated ${
      palms.length
    } palm positions (requested: ${FarmNumberOfPalms}, final spacing: ${(
      minSpacing * spacingMultiplier
    ).toFixed(2)})`
  );
  return palms;
};

export const generateGridTreeDistribution = (): Palm[] => {
  const palms: Palm[] = [];
  const varieties = ["Medjool", "Deglet Noor", "Barhi", "Zahidi"];
  const statuses: PalmStatus[] = [
    "healthy",
    "healthy",
    "healthy",
    "warning",
    "critical",
  ];

  // Grid parameters - palms placed at borders with gaps between them
  const margin = 3; // Small margin from absolute boundary
  const availableSize = FarmSize - margin * 2;

  // Calculate optimal grid dimensions
  const rows = Math.ceil(Math.sqrt(FarmNumberOfPalms));
  const cols = Math.ceil(FarmNumberOfPalms / rows);

  // Calculate spacing between trees (gaps are BETWEEN palms, not outside)
  // Palms start at the border and spacing is added between them
  const spacingX = availableSize / (cols - 1 || 1); // Space between palms in X
  const spacingZ = availableSize / (rows - 1 || 1); // Space between palms in Z

  // Starting position at the border (top-left corner)
  const startX = -availableSize / 2;
  const startZ = -availableSize / 2;

  let palmIndex = 0;

  // Generate grid positions starting from borders
  for (let row = 0; row < rows && palmIndex < FarmNumberOfPalms; row++) {
    for (let col = 0; col < cols && palmIndex < FarmNumberOfPalms; col++) {
      // Calculate grid position - palms placed at borders and filled inward
      const x = startX + spacingX * col;
      const z = startZ + spacingZ * row;

      // Add slight random offset for natural look (optional, smaller offset)
      const offsetX = (Math.random() - 0.5) * Math.min(spacingX * 0.1, 1.5);
      const offsetZ = (Math.random() - 0.5) * Math.min(spacingZ * 0.1, 1.5);

      // Random model selection for variety
      const modelType = Math.floor(Math.random() * 10);

      palms.push({
        id: `PALM-${String(palmIndex + 1).padStart(3, "0")}`,
        position: new Vector3(x + offsetX, 0, z + offsetZ),
        variety: varieties[palmIndex % varieties.length], // Cycle through varieties
        status: statuses[Math.floor(Math.random() * statuses.length)],
        hydration: Math.floor(Math.random() * 40) + 60,
        nutrientLevel: Math.floor(Math.random() * 30) + 70,
        pestProbability: Math.floor(Math.random() * 20),
        estimatedHarvest: "2025-03-15",
        lastWatered: "2025-01-10",
        modelType,
      });

      palmIndex++;
    }
  }

  console.log(
    `Generated ${palms.length} palm positions in ${rows}x${cols} grid (spacing: ${spacingX.toFixed(
      2
    )}x${spacingZ.toFixed(2)}, border-to-border layout)`
  );
  return palms;
};

// Generate initial palm positions in a grid pattern
// export const generatePalms = (): Palm[] => {
//   const palms: Palm[] = [];
//   const varieties = ["Medjool", "Deglet Noor", "Barhi", "Zahidi"];
//   const statuses: PalmStatus[] = [
//     "healthy",
//     "healthy",
//     "healthy",
//     "warning",
//     "critical",
//   ];

//   let id = 1;
//   for (let row = 0; row < 10; row++) {
//     for (let col = 0; col < 10; col++) {
//       const x = (col - 4.5) * 8 + (Math.random() - 0.5) * 2;
//       const z = (row - 4.5) * 8 + (Math.random() - 0.5) * 2;

//       palms.push({
//         id: `PALM-${String(id).padStart(3, "0")}`,
//         position: new Vector3(x, 0, z),
//         variety: varieties[Math.floor(Math.random() * varieties.length)],
//         status: statuses[Math.floor(Math.random() * statuses.length)],
//         hydration: Math.floor(Math.random() * 40) + 60,
//         nutrientLevel: Math.floor(Math.random() * 30) + 70,
//         pestProbability: Math.floor(Math.random() * 20),
//         estimatedHarvest: "2025-03-15",
//         lastWatered: "2025-01-10",
//       });
//       id++;
//     }
//   }
//   return palms;
// };

// Generate initial robots
export const generateRobots = (): Robot[] => {
  return [
    {
      id: "RB-001",
      position: new Vector3(-30, 0, -30),
      battery: 95,
      status: "idle",
    },
    {
      id: "RB-002",
      position: new Vector3(-30, 0, 30),
      battery: 78,
      status: "idle",
    },
    {
      id: "RB-003",
      position: new Vector3(30, 0, -30),
      battery: 88,
      status: "idle",
    },
    {
      id: "RB-004",
      position: new Vector3(30, 0, 30),
      battery: 45,
      status: "idle",
    },
    {
      id: "RB-005",
      position: new Vector3(0, 0, 0),
      battery: 12,
      status: "idle",
    },
  ];
};

// Generate initial alerts
export const generateAlerts = (): Alert[] => {
  return [
    {
      id: "ALT-001",
      severity: "high",
      message: "Critical hydration level detected",
      timestamp: "2025-01-11T08:30:00",
      palmId: "PALM-023",
    },
    {
      id: "ALT-002",
      severity: "high",
      message: "Robot RB-005 battery critical",
      timestamp: "2025-01-11T08:15:00",
      robotId: "RB-005",
    },
    {
      id: "ALT-003",
      severity: "medium",
      message: "Pest activity detected in sector B",
      timestamp: "2025-01-11T07:45:00",
    },
    {
      id: "ALT-004",
      severity: "medium",
      message: "Scheduled maintenance due for RB-002",
      timestamp: "2025-01-11T07:00:00",
      robotId: "RB-002",
    },
    {
      id: "ALT-005",
      severity: "info",
      message: "Weather update: Light rain expected",
      timestamp: "2025-01-11T06:30:00",
    },
  ];
};
