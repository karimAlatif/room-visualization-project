import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PalmStatus } from 'src/types';
import { useTreeListItemStyles } from './TreeListItem.styles';

interface Palm {
  id: string;
  variety: string;
  status: PalmStatus;
}

interface TreeListItemProps {
  palm: Palm;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig: Record<PalmStatus, { 
  label: string; 
  dotClass: keyof ReturnType<typeof useTreeListItemStyles>;
  badgeClass: keyof ReturnType<typeof useTreeListItemStyles>;
}> = {
  healthy: { 
    label: 'Healthy', 
    dotClass: 'statusDotHealthy', 
    badgeClass: 'statusBadgeHealthy' 
  },
  warning: { 
    label: 'Warning', 
    dotClass: 'statusDotWarning', 
    badgeClass: 'statusBadgeWarning' 
  },
  critical: { 
    label: 'Critical', 
    dotClass: 'statusDotCritical', 
    badgeClass: 'statusBadgeCritical' 
  },
};

export const TreeListItem = ({ palm, isSelected, onClick }: TreeListItemProps) => {
  const theme = useTheme();
  const classes = useTreeListItemStyles();
  const config = statusConfig[palm.status];

  const getTreeListItemClass = () => {
    const baseClass = classes.treeListItem;
    return isSelected ? `${baseClass} ${classes.treeListItemSelected}` : baseClass;
  };

  return (
    <Box
      className={getTreeListItemClass()}
      onClick={onClick}
    >
      <Box className={`${classes.statusDot} ${classes[config.dotClass]}`} />
      <Box className={classes.content}>
        <Typography className={classes.palmId}>
          {palm.id}
        </Typography>
        <Typography className={classes.palmVariety}>
          {palm.variety}
        </Typography>
      </Box>
      <Box className={`${classes.statusBadge} ${classes[config.badgeClass]}`}>
        {config.label}
      </Box>
    </Box>
  );
};
