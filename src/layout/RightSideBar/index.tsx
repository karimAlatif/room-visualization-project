import React, { useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { useStyles } from "./RightSidebar.styles";
import { useFarmStore } from "src/shared/store";
import { PalmDetails } from "./PalmDetails";
import { RobotDetails } from "./RobotDetails";
import { EmptyState } from "./EmptyState";
import { PanelHeader } from "./PanelHeader";
import { X as CloseIcon } from "lucide-react";
import { Palm, Robot } from "src/types";

export const RightPanel = () => {
  const { selectedEntity, studioSceneMethods, palms, robots, selectEntity } =
    useFarmStore();
  const classes = useStyles();

  useEffect(() => {
    if (studioSceneMethods) {
      studioSceneMethods.onEntitySelected((entity, entityType) => {
        console.log("Entity selected:", entity);
        if (!!entity && !!entityType) {
          selectEntity({
            id: entity,
            type: entityType,
            entity:
              entityType === "palm"
                ? palms.find((p) => p.id === entity)
                : (robots.find((r) => r.id === entity) as Palm | Robot),
          });
        } else {
          selectEntity(undefined);
        }
      });
    }
  }, [studioSceneMethods]);

  const handleClose = () => {
    // TODO: Implement close handler if needed
    // selectPalm(null);
    // selectRobot(null);
  };

  if (!selectedEntity) {
    return <EmptyState />;
  }

  return (
    <Box className={classes.panelWithSelection}>
      {/* Header with close button */}
      <Box className={classes.panelHeader}>
        <PanelHeader selectedEntity={selectedEntity} />
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon size={20} color="white" strokeWidth={2.5} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box className={classes.panelContent}>
        {selectedEntity?.type === "palm" && (
          <PalmDetails palm={selectedEntity.entity as Palm} />
        )}
        {selectedEntity?.type === "robot" && (
          <RobotDetails robot={selectedEntity.entity as Robot} />
        )}
      </Box>
    </Box>
  );
};
