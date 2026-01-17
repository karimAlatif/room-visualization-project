import React, { ReactNode } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useStatusCardStyles } from './StatusCard.styles';

interface StatusCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    variant?: 'default' | 'healthy' | 'warning' | 'critical';
}

export const StatusCard = ({
    title,
    value,
    icon,
    trend,
    trendValue,
    variant = 'default'
}: StatusCardProps) => {
    const theme = useTheme();
    const classes = useStatusCardStyles();

    const getCardClass = () => {
        switch (variant) {
            case 'healthy':
                return `${classes.card} ${classes.cardHealthy}`;
            case 'warning':
                return `${classes.card} ${classes.cardWarning}`;
            case 'critical':
                return `${classes.card} ${classes.cardCritical}`;
            default:
                return classes.card;
        }
    };

    const getIconClass = () => {
        switch (variant) {
            case 'healthy':
                return `${classes.iconContainer} ${classes.iconHealthy}`;
            case 'warning':
                return `${classes.iconContainer} ${classes.iconWarning}`;
            case 'critical':
                return `${classes.iconContainer} ${classes.iconCritical}`;
            default:
                return `${classes.iconContainer} ${classes.iconDefault}`;
        }
    };

    const getTrendClass = () => {
        if (!trend) return '';
        switch (trend) {
            case 'up':
                return classes.trendUp;
            case 'down':
                return classes.trendDown;
            case 'neutral':
                return classes.trendNeutral;
            default:
                return '';
        }
    };

    const getTrendSymbol = () => {
        switch (trend) {
            case 'up':
                return '↑';
            case 'down':
                return '↓';
            case 'neutral':
                return '→';
            default:
                return '';
        }
    };

    return (
        <Box className={getCardClass()}>
            <Box className={classes.cardContent}>
                <Box className={getIconClass()}>
                    {icon}
                </Box>
                
                <Box className={classes.content}>
                    <Typography className={classes.title}>
                        {title}
                    </Typography>
                    <Box className={classes.valueRow}>
                        <Typography className={classes.value}>
                            {value}
                        </Typography>
                        {trend && trendValue && (
                            <Box className={`${classes.trend} ${getTrendClass()}`}>
                                <span className={classes.trendSymbol}>
                                    {getTrendSymbol()}
                                </span>
                                <span>{trendValue}</span>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
