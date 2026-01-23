import React from "react";
import { Box, Typography } from "@mui/material";
import { Zap as BotIcon } from "lucide-react";
import { useStyles } from "./RightSidebar.styles";

export const EmptyState = () => {
  const classes = useStyles();

  return (
    <Box className={classes.panel}>
      <Box className={classes.emptyState}>
        <Box className={classes.emptyIcon}>
          <BotIcon
            size={32}
            strokeWidth={2.5}
            className={classes.emptyIconSvg}
          />
        </Box>
        <Typography variant="h6" className={classes.emptyTitle}>
          No Selection
        </Typography>
        <Typography variant="body2" className={classes.emptyDescription}>
          Click on a palm tree or robot in the 3D view to see details
        </Typography>
      </Box>
    </Box>
  );
};
