import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { TreePalm } from "lucide-react";
import { useLeftSidebarStyles } from "./LeftSidebar.styles";

interface Palm {
  id: string;
  status: "healthy" | "warning" | "critical";
  variety: string;
}

interface TreeListProps {
  palms: Palm[];
  selectedPalmId: string | null | undefined;
  onSelectPalm: (palmId: string) => void;
}

const TreeListItem: React.FC<{
  palm: Palm;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ palm, isSelected, onSelect }) => {
  const classes = useLeftSidebarStyles();

  return (
    <Card
      onClick={onSelect}
      className={`${classes.treeCard} ${isSelected ? classes.treeCardSelected : ""}`}
    >
      <CardContent className={classes.treeCardContent}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              className={`${classes.treePalmAvatar} ${isSelected ? classes.treePalmAvatarSelected : ""}`}
            >
              <TreePalm
                size={16}
                strokeWidth={2}
                color={isSelected ? "#22c55e" : "#93c5fd"}
              />
            </Box>
            <Typography variant="body2" className={classes.treeLabel}>
              {palm.id}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="caption" className={classes.treeVariety}>
              {palm.variety}
            </Typography>
            <Box
              className={`${classes.treeStatusDot} ${
                palm.status === "healthy"
                  ? classes.treeStatusDotHealthy
                  : palm.status === "warning"
                    ? classes.treeStatusDotWarning
                    : classes.treeStatusDotCritical
              }`}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const TreeList: React.FC<TreeListProps> = ({
  palms,
  selectedPalmId,
  onSelectPalm,
}) => {
  return (
    <Stack spacing={1.5}>
      {palms.map((palm) => (
        <TreeListItem
          key={palm.id}
          palm={palm}
          isSelected={selectedPalmId === palm.id}
          onSelect={() => onSelectPalm(palm.id)}
        />
      ))}
    </Stack>
  );
};
