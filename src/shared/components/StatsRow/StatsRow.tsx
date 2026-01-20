import React from 'react';
import { Box, Typography } from '@mui/material';
import { useStatsRowStyles } from './StatsRow.styles';

interface StatItem {
  icon: React.ReactElement;
  label: string;
  value: string | number;
  iconClassName?: string;
}

interface StatsRowProps {
  leftStat: StatItem;
  rightStat: StatItem;
}

export const StatsRow: React.FC<StatsRowProps> = ({ leftStat, rightStat }) => {
  const classes = useStatsRowStyles();

  return (
    <Box className={classes.statsRow}>
      <Box className={classes.statCard}>
        <Box className={classes.statHeader}>
          <Box className={leftStat.iconClassName || classes.statIcon}>
            {leftStat.icon}
          </Box>
          <Typography className={classes.statLabel}>{leftStat.label}</Typography>
        </Box>
        <Typography className={classes.statValue}>{leftStat.value}</Typography>
      </Box>
      <Box className={classes.statCard}>
        <Box className={classes.statHeader}>
          <Box className={rightStat.iconClassName || classes.statIcon}>
            {rightStat.icon}
          </Box>
          <Typography className={classes.statLabel}>{rightStat.label}</Typography>
        </Box>
        <Typography className={classes.statValue}>{rightStat.value}</Typography>
      </Box>
    </Box>
  );
};
