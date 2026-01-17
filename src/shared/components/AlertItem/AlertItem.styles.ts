import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useAlertItemStyles = makeStyles((theme: Theme) => ({
  alertItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '12px 14px',
    borderRadius: 10,
    background: `linear-gradient(135deg, ${theme?.palette?.action?.disabledBackground || 'rgba(148, 163, 184, 0.06)'} 0%, transparent 100%)`,
    border: `1px solid ${theme?.palette?.divider || 'rgba(148, 163, 184, 0.06)'}`,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '@media (max-width: 768px)': {
      padding: '10px 12px',
      gap: 8,
    },
  },
  alertItemClickable: {
    cursor: 'pointer',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme?.palette?.action?.hover || 'rgba(74, 222, 128, 0.06)'} 0%, transparent 100%)`,
      borderColor: `${theme?.palette?.primary?.main || '#4ade80'}20`,
      transform: 'translateX(2px)',
    },
  },
  statusDot: {
    width: 10,
    height: 10,
    marginTop: 4,
    flexShrink: 0,
    borderRadius: '50%',
    boxShadow: '0 0 8px currentColor',
    '@media (max-width: 768px)': {
      width: 8,
      height: 8,
      marginTop: 3,
    },
  },
  statusDotHigh: {
    backgroundColor: theme?.palette?.error?.main || '#ef4444',
  },
  statusDotMedium: {
    backgroundColor: theme?.palette?.warning?.main || '#f59e0b',
  },
  statusDotInfo: {
    backgroundColor: theme?.palette?.info?.main || '#3b82f6',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    fontSize: '0.8rem',
    color: theme?.palette?.text?.primary || '#f1f5f9',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.4,
    fontWeight: 500,
    '@media (max-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
  timestamp: {
    fontSize: '0.65rem',
    color: theme?.palette?.text?.secondary || '#94a3b8',
    fontFamily: 'monospace',
    marginTop: 4,
    letterSpacing: '0.02em',
  },
}));
