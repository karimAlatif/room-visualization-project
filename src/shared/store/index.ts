
import { create } from 'zustand';
import { Vector3 } from 'babylonjs';
import { ActivityLog, FarmState, generateAlerts, generateSmartTreeDistribution , generateRobots, PalmStatus, RobotStatus } from 'src/types';

export const useFarmStore = create<FarmState>((set, get) => ({
    palms: generateSmartTreeDistribution(),
    robots: generateRobots(),
    alerts: generateAlerts(),
    activityLogs: [],
    temperature: 28,
  
    selectPalm: (id: string) => set({ selectedPalmId: id }),
    selectRobot: (id: string) => set({ selectedRobotId: id }),
  
    assignRobotToPalm: (robotId: string, palmId: string) => {
      const palm = get().palms.find(p => p.id === palmId);
      if (!palm) return;
  
      set((state) => ({
        robots: state.robots.map((robot) =>
          robot.id === robotId
            ? {
                ...robot,
                status: 'moving' as RobotStatus,
                currentMission: `Scanning ${palmId}`,
                assignedPalmId: palmId,
                targetPosition: palm.position,
              }
            : robot
        ),
      }));
  
      get().addActivityLog({
        action: 'Mission Assigned',
        details: `${robotId} dispatched to scan ${palmId}`,
        entityType: 'robot',
        entityId: robotId,
      });
    },
  
    updateRobotPosition: (robotId: string, position: Vector3) => {
      set((state) => ({
        robots: state.robots.map((robot) =>  robot.id === robotId ? { ...robot, position: new Vector3(position.x, position.y, position.z) } : robot),
      }));
    },
  
    completeRobotMission: (robotId: string) => {
      const robot = get().robots.find(r => r.id === robotId);
      if (!robot?.assignedPalmId) return;
  
      const palmId = robot.assignedPalmId;
  
      set((state) => ({
        robots: state.robots.map((r) =>
          r.id === robotId
            ? { ...r, status: 'idle' as RobotStatus }
            : r
        ),
        palms: state.palms.map((p) =>
          p.id === palmId
            ? { ...p, status: 'healthy' as PalmStatus, hydration: Math.min(100, p.hydration + 20) }
            : p
        ),
      }));
  
      get().addActivityLog({
        action: 'Scan Complete',
        details: `${robotId} completed scanning ${palmId}`,
        entityType: 'palm',
        entityId: palmId,
      });
    },
  
    returnRobotToBase: (robotId) => {
      set((state) => ({
        robots: state.robots.map((robot) =>
          robot.id === robotId
            ? {
                ...robot,
                status: 'returning' as RobotStatus,
                currentMission: 'Returning to base',
                targetPosition: new Vector3(-30, 0, -30),
              }
            : robot
        ),
      }));
    },
  
    addActivityLog: (log) => {
      const newLog: ActivityLog = {
        ...log,
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        activityLogs: [newLog, ...state.activityLogs].slice(0, 50),
      }));
    },
  
    updatePalmStatus: (palmId, status) => {
      set((state) => ({
        palms: state.palms.map((palm) =>
          palm.id === palmId ? { ...palm, status } : palm
        ),
      }));
    },
  
  }));
  