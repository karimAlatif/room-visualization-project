import React from "react";
import { Box, IconButton } from "@mui/material";
import { useStyles } from "./RightSidebar.styles";
import { useFarmStore } from "src/shared/store";
import { PalmDetails } from "./PalmDetails";
import { RobotDetails } from "./RobotDetails";
import { EmptyState } from "./EmptyState";
import { PanelHeader } from "./PanelHeader";
import { X as CloseIcon } from "lucide-react";

export const RightPanel = () => {
  const { selectedRobotId, palms, robots } = useFarmStore();
  const classes = useStyles();

  const selectedPalm = palms[0];
  const selectedRobot = robots.find((r) => r.id === selectedRobotId);

  const hasSelection = selectedPalm || selectedRobot;

  const handleClose = () => {
    // TODO: Implement close handler if needed
    // selectPalm(null);
    // selectRobot(null);
  };

  if (!hasSelection) {
    return <EmptyState />;
  }

  return (
    <Box className={classes.panelWithSelection}>
      {/* Header with close button */}
      <Box className={classes.panelHeader}>
        {selectedPalm && <PanelHeader palm={selectedPalm} />}
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon size={20} color="white" strokeWidth={2.5} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box className={classes.panelContent}>
        {selectedPalm && <PalmDetails palm={selectedPalm} />}
        {selectedRobot && <RobotDetails robot={selectedRobot} />}
      </Box>
    </Box>
  );
};
