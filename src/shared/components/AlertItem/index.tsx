import React from 'react';
import { Box, Typography } from '@mui/material';
import { Alert, AlertSeverity } from 'src/types';
import { useAlertItemStyles } from './AlertItem.styles';

interface AlertItemProps {
    alert: Alert;
    onClick?: () => void;
}

const severityConfig: Record<AlertSeverity, { className: keyof ReturnType<typeof useAlertItemStyles> }> = {
    high: { className: 'statusDotHigh' },
    medium: { className: 'statusDotMedium' },
    info: { className: 'statusDotInfo' },
};

export const AlertItem = ({ alert, onClick }: AlertItemProps) => {
    const classes = useAlertItemStyles();
    const config = severityConfig[alert.severity];

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getAlertItemClass = () => {
        const baseClass = classes.alertItem;
        return onClick ? `${baseClass} ${classes.alertItemClickable}` : baseClass;
    };

    return (
        <Box 
            className={getAlertItemClass()}
            onClick={onClick}
        >
            <Box className={`${classes.statusDot} ${classes[config.className]}`} />
            <Box className={classes.content}>
                <Typography className={classes.message}>
                    {alert.message}
                </Typography>
                <Typography className={classes.timestamp}>
                    {formatTime(alert.timestamp)}
                </Typography>
            </Box>
        </Box>
    );
};
