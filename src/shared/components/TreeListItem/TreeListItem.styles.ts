import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useTreeListItemStyles = makeStyles((theme: Theme) => ({
  treeListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    border: `1px solid transparent`,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme?.palette?.action?.hover || 'rgba(74, 222, 128, 0.05)'} 0%, transparent 100%)`,
      borderColor: `${theme?.palette?.divider || 'rgba(148, 163, 184, 0.08)'}`,
    },
    '@media (max-width: 768px)': {
      padding: '10px 12px',
      gap: 10,
    },
  },
  treeListItemSelected: {
    background: `linear-gradient(135deg, ${theme?.palette?.primary?.main || '#4ade80'}10 0%, ${theme?.palette?.primary?.main || '#4ade80'}04 100%)`,
    borderColor: `${theme?.palette?.primary?.main || '#4ade80'}25`,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme?.palette?.primary?.main || '#4ade80'}12 0%, ${theme?.palette?.primary?.main || '#4ade80'}06 100%)`,
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
    backgroundColor: theme?.palette?.success?.main || '#10b981',
  },
  statusDotWarning: {
    backgroundColor: theme?.palette?.warning?.main || '#f59e0b',
  },
  statusDotCritical: {
    backgroundColor: theme?.palette?.error?.main || '#ef4444',
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
    fontFamily: 'monospace',
    color: theme?.palette?.text?.primary || '#f1f5f9',
    fontWeight: 600,
    '@media (max-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
  palmVariety: {
    fontSize: '0.7rem',
    color: theme?.palette?.text?.secondary || '#94a3b8',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      padding: '3px 6px',
      fontSize: '0.6rem',
    },
  },
  statusBadgeHealthy: {
    background: `${theme?.palette?.success?.main || '#10b981'}15`,
    color: theme?.palette?.success?.main || '#10b981',
    border: `1px solid ${theme?.palette?.success?.main || '#10b981'}20`,
  },
  statusBadgeWarning: {
    background: `${theme?.palette?.warning?.main || '#f59e0b'}15`,
    color: theme?.palette?.warning?.main || '#f59e0b',
    border: `1px solid ${theme?.palette?.warning?.main || '#f59e0b'}20`,
  },
  statusBadgeCritical: {
    background: `${theme?.palette?.error?.main || '#ef4444'}15`,
    color: theme?.palette?.error?.main || '#ef4444',
    border: `1px solid ${theme?.palette?.error?.main || '#ef4444'}20`,
  },
}));
