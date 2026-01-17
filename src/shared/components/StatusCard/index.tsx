import React, { ReactNode } from 'react';
import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';
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
                return classes.iconHealthy;
            case 'warning':
                return classes.iconWarning;
            case 'critical':
                return classes.iconCritical;
            default:
                return classes.iconDefault;
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
        <Card className={getCardClass()}>
            <CardContent className={classes.cardContent}>
                <Box className={classes.iconContainer}>
                    <Box className={getIconClass()}>
                        {icon}
                    </Box>
                </Box>
                
                <Box className={classes.content}>
                    <Typography className={classes.title}>
                        {title}
                    </Typography>
                    <Typography className={classes.value}>
                        {value}
                    </Typography>
                    
                    {trend && trendValue && (
                        <Box className={classes.trendContainer}>
                            <Typography className={`${classes.trend} ${getTrendClass()}`}>
                                <span className={classes.trendSymbol}>
                                    {getTrendSymbol()}
                                </span>
                                {trendValue}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};
