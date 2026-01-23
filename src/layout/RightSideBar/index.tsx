import React, { useCallback, useEffect, useMemo } from "react";
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
        if (!!entity && !!entityType) {
          selectEntity({
            id: entity,
            type: entityType,
          });
        } else {
          selectEntity(undefined);
        }
      });
    }
  }, [studioSceneMethods]);

  const handleClose = useCallback((): void => {
    selectEntity(undefined);
    if (studioSceneMethods) {
      studioSceneMethods?.clearSelection();
    }
  }, [selectEntity, studioSceneMethods]);

  const entity = useMemo(() => {
    if (!selectedEntity) return null;
    if (selectedEntity.type === "palm") {
      return palms.find((p) => p.id === selectedEntity.id);
    } else if (selectedEntity.type === "robot") {
      return robots.find((r) => r.id === selectedEntity.id);
    }
    return null;
  }, [selectedEntity, palms, robots]);

  if (!selectedEntity || !entity) {
    return <EmptyState />;
  }

  return (
    <Box className={classes.panelWithSelection}>
      {/* Header with close button */}
      <Box className={classes.panelHeader}>
        <PanelHeader selectedEntity={selectedEntity} entity={entity} />
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon size={20} color="white" strokeWidth={2.5} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box className={classes.panelContent}>
        {selectedEntity?.type === "palm" && (
          <PalmDetails palm={entity as Palm} />
        )}
        {selectedEntity?.type === "robot" && (
          <RobotDetails robot={entity as Robot} />
        )}
      </Box>
    </Box>
  );
};
