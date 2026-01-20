import { makeStyles } from '@mui/styles';
import { Theme, alpha } from '@mui/material/styles';

export const useTreeListItemStyles = makeStyles((theme: Theme) => ({
  treeListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 12,
    cursor: 'pointer',
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.08),
      borderColor: alpha(theme.palette.common.white, 0.12),
    },
    '@media (max-width: 768px)': {
      padding: '10px 12px',
      gap: 10,
    },
  },
  treeListItemSelected: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    borderColor: alpha(theme.palette.primary.main, 0.25),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: '0 0 6px currentColor',
  },
  statusDotHealthy: {
    backgroundColor: theme.palette.success.main,
  },
  statusDotWarning: {
    backgroundColor: theme.palette.warning.main,
  },
  statusDotCritical: {
    backgroundColor: theme.palette.error.main,
  },
  content: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  palmId: {
    fontSize: '0.8rem',
    color: theme.palette.text.primary,
    fontWeight: 600,
    '@media (max-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
  palmVariety: {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      padding: '3px 8px',
      fontSize: '0.6rem',
    },
  },
  statusBadgeHealthy: {
    backgroundColor: alpha(theme.palette.success.main, 0.15),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  },
  statusBadgeWarning: {
    backgroundColor: alpha(theme.palette.warning.main, 0.15),
    color: theme.palette.warning.main,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
  },
  statusBadgeCritical: {
    backgroundColor: alpha(theme.palette.error.main, 0.15),
    color: theme.palette.error.main,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
  },
}));
