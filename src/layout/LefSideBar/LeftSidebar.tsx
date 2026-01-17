import React, { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Icon,
} from '@mui/material';
import { useFarmStore } from 'src/shared/store';
import { StatusCard } from 'shared/components/StatusCard';
import { AlertItem } from 'shared/components/AlertItem';
import { TreeListItem } from 'shared/components/TreeListItem';
import { clsx } from 'clsx';
import { useLeftSidebarStyles } from './LeftSidebar.styles';
import { Dashboard, Park, BugReport, WbSunny, CrisisAlert, BatteryCharging90, FavoriteBorder, AddAlert, Menu, Summarize } from '@mui/icons-material';




interface LeftSidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export const LeftSidebar = ({ isCollapsed = false, setIsCollapsed }: LeftSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trees'>('overview');
  const theme = useTheme();
  const classes = useLeftSidebarStyles();

  const { palms, robots, alerts, temperature, selectedPalmId, selectPalm } = useFarmStore();

  const healthyCount = palms.filter(p => p.status === 'healthy').length;
  const warningCount = palms.filter(p => p.status === 'warning').length;
  const criticalCount = palms.filter(p => p.status === 'critical').length;
  const activeRobots = robots.filter(r => r.status !== 'idle').length;
  const criticalBattery = robots.filter(r => r.battery < 20).length;

  return (
    <Box className={`${classes.sidebar} ${isCollapsed ? classes.sidebarCollapsed : classes.sidebarExpanded}`}>
      {/* Header */}
      <Box className={classes.header}>
        <Box className={`${classes.headerTitle} ${isCollapsed ? classes.headerTitleCollapsed : ''}`}>
          <Box className={classes.headerIcon}>
            <Dashboard />
          </Box>
          <Typography className={classes.titleText}>Farm Control</Typography>
        </Box>
      </Box>

      {/* Collapsed Content */}
      <Box className={`${classes.collapsedContent} ${!isCollapsed ? classes.collapsedContentHidden : ''}`}>
        <Box
          className={classes.collapsedIconButton}
          onClick={() => {
            setIsCollapsed?.(false);
            setActiveTab('overview');
          }}
        >
          <Dashboard className={classes.collapsedIcon} />
        </Box>
        <Box
          className={classes.collapsedIconButton}
          onClick={() => {
            setIsCollapsed?.(false);
            setActiveTab('trees');
          }}
        >
          <Park className={classes.collapsedIcon} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box className={`${classes.tabsContainer} ${isCollapsed ? classes.tabsContainerHidden : ''}`}>
        <button
          onClick={() => setActiveTab('overview')}
          className={clsx(
            classes.tabButton,
            activeTab === 'overview' && classes.tabButtonActive
          )}
        >
          <Dashboard />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('trees')}
          className={clsx(
            classes.tabButton,
            activeTab === 'trees' && classes.tabButtonActive
          )}
        >
          <Park />
          Trees
        </button>
      </Box>

      {/* Tab Content */}
      <Box className={`${classes.tabContent} ${isCollapsed ? classes.tabContentHidden : ''}`}>
        {activeTab === 'overview' && (
          <>
            {/* Summary Section */}
            <Box className={classes.section}>
              <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIcon}>
                  <Summarize />
                </Box>
                <Typography className={classes.sectionTitle}>Summary</Typography>
              </Box>
              <Box className={classes.cardsGrid}>
                <StatusCard
                  title="Total Trees"
                  value={palms.length}
                  icon={<Park />}
                />
                <StatusCard
                  title="Active Units"
                  value={`${activeRobots}/${robots.length}`}
                  icon={<BugReport />}
                />
                <StatusCard
                  title="Temperature"
                  value={`${temperature}°C`}
                  icon={<WbSunny />}
                />
                <StatusCard
                  title="Missions"
                  value={activeRobots}
                  icon={<CrisisAlert />}
                />
              </Box>

              {criticalBattery > 0 && (
                <Box sx={{ mt: 2 }}>
                  <StatusCard
                    title="Low Battery"
                    value={criticalBattery}
                    icon={<BatteryCharging90 />}
                    variant="critical"
                  />
                </Box>
              )}
            </Box>

            {/* Health Status Section */}
            <Box className={classes.section}>
              <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIcon}>
                  <FavoriteBorder />
                </Box>
                <Typography className={classes.sectionTitle}>Health Status</Typography>
              </Box>
              <Box className={classes.healthCard}>
                <Box className={classes.donutContainer}>
                  <Box className={classes.donutWrapper}>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={theme.palette.divider}
                        strokeWidth="8"
                      />
                      {palms.length > 0 && (
                        <>
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke={theme.palette.success.main}
                            strokeWidth="8"
                            strokeDasharray={`${(healthyCount / palms.length) * 264} 264`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke={theme.palette.warning.main}
                            strokeWidth="8"
                            strokeDasharray={`${(warningCount / palms.length) * 264} 264`}
                            strokeDashoffset={`${-(healthyCount / palms.length) * 264}`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke={theme.palette.error.main}
                            strokeWidth="8"
                            strokeDasharray={`${(criticalCount / palms.length) * 264} 264`}
                            strokeDashoffset={`${-((healthyCount + warningCount) / palms.length) * 264}`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                        </>
                      )}
                    </svg>
                    <Box className={classes.donutCenter}>
                      <Typography className={classes.donutCenterText}>{palms.length}</Typography>
                      <Typography className={classes.donutCenterLabel}>Total</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className={classes.statusGrid}>
                  <Box className={classes.statusItem}>
                    <Box className={classes.statusLabel}>
                      <Box className={`${classes.statusDot} ${classes.statusDotHealthy}`} />
                      <Typography className={classes.statusLabelText}>Healthy</Typography>
                    </Box>
                    <Typography className={`${classes.statusValue} ${classes.statusValueHealthy}`}>{healthyCount}</Typography>
                  </Box>
                  <Box className={classes.statusItem}>
                    <Box className={classes.statusLabel}>
                      <Box className={`${classes.statusDot} ${classes.statusDotWarning}`} />
                      <Typography className={classes.statusLabelText}>Warning</Typography>
                    </Box>
                    <Typography className={`${classes.statusValue} ${classes.statusValueWarning}`}>{warningCount}</Typography>
                  </Box>
                  <Box className={classes.statusItem}>
                    <Box className={classes.statusLabel}>
                      <Box className={`${classes.statusDot} ${classes.statusDotCritical}`} />
                      <Typography className={classes.statusLabelText}>Critical</Typography>
                    </Box>
                    <Typography className={`${classes.statusValue} ${classes.statusValueCritical}`}>{criticalCount}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Alerts Section */}
            <Box className={classes.section}>
              <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIcon}>
                  <AddAlert />
                </Box>
                <Typography className={classes.sectionTitle}>Active Alerts</Typography>
              </Box>
              <Box className={classes.alertsList}>
                {alerts.length > 0 ? (
                  alerts.slice(0, 5).map((alert) => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onClick={() => alert.palmId && selectPalm(alert.palmId)}
                    />
                  ))
                ) : (
                  <Box className={classes.emptyState}>
                    <AddAlert className={classes.emptyStateIcon} />
                    <Typography>No active alerts</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}

        {activeTab === 'trees' && (
          <Box className={classes.section}>
            <Box className={classes.sectionHeader}>
              <Box className={classes.sectionIcon}>
                <Menu />
              </Box>
              <Typography className={classes.sectionTitle}>Tree List</Typography>
            </Box>
            <Box className={classes.treesList}>
              {palms.length > 0 ? (
                palms.map((palm) => (
                  <TreeListItem
                    key={palm.id}
                    palm={palm}
                    isSelected={selectedPalmId === palm.id}
                    onClick={() => selectPalm(palm.id)}
                  />
                ))
              ) : (
                <Box className={classes.emptyState}>
                  <Park className={classes.emptyStateIcon} />
                  <Typography>No trees available</Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
