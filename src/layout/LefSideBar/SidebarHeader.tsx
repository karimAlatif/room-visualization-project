import React from "react";
import { Box, Stack, Typography, Avatar } from "@mui/material";
import { TreePalm } from "lucide-react";
import { useLeftSidebarStyles } from "./LeftSidebar.styles";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const SidebarHeader: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const classes = useLeftSidebarStyles();

  return (
    <Box className={classes.headerContainer}>
      <Stack direction="row" spacing={2.5} alignItems="center">
        <Avatar className={classes.headerAvatar}>
          <TreePalm size={28} strokeWidth={2} color="white" />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" className={classes.headerTitle}>
            {title}
          </Typography>
          <Typography variant="body2" className={classes.headerSubtitle}>
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
