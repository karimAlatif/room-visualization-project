import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export const useStatusCardStyles = makeStyles((theme: Theme) => ({
  card: {
    position: 'relative',
    borderRadius: 12,
    background: `linear-gradient(135deg, ${theme?.palette?.background?.paper || '#1e293b'}90 0%, ${theme?.palette?.background?.default || '#0f172a'}70 100%)`,
    border: `1px solid ${theme?.palette?.divider || 'rgba(148, 163, 184, 0.08)'}`,
    boxShadow: `0 2px 8px ${theme?.palette?.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.06)'}`,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 16px ${theme?.palette?.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      borderColor: `${theme?.palette?.primary?.main || '#4ade80'}20`,
    },
  },
  cardHealthy: {
    borderColor: `${theme?.palette?.success?.main || '#10b981'}25`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 3,
      height: '100%',
      background: theme?.palette?.success?.main || '#10b981',
      borderRadius: '3px 0 0 3px',
    },
  },
  cardWarning: {
    borderColor: `${theme?.palette?.warning?.main || '#f59e0b'}25`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 3,
      height: '100%',
      background: theme?.palette?.warning?.main || '#f59e0b',
      borderRadius: '3px 0 0 3px',
    },
  },
  cardCritical: {
    borderColor: `${theme?.palette?.error?.main || '#ef4444'}25`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 3,
      height: '100%',
      background: theme?.palette?.error?.main || '#ef4444',
      borderRadius: '3px 0 0 3px',
    },
  },
  cardContent: {
    padding: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 768px)': {
      padding: 12,
      gap: 10,
    },
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${theme?.palette?.action?.disabledBackground || 'rgba(148, 163, 184, 0.08)'} 0%, transparent 100%)`,
    border: `1px solid ${theme?.palette?.divider || 'rgba(148, 163, 184, 0.08)'}`,
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: 36,
      height: 36,
      borderRadius: 8,
    },
  },
  iconDefault: {
    color: theme?.palette?.primary?.main || '#4ade80',
    '& svg, & .MuiIcon-root': {
      fontSize: 20,
    },
  },
  iconHealthy: {
    color: theme?.palette?.success?.main || '#10b981',
    '& svg, & .MuiIcon-root': {
      fontSize: 20,
    },
  },
  iconWarning: {
    color: theme?.palette?.warning?.main || '#f59e0b',
    '& svg, & .MuiIcon-root': {
      fontSize: 20,
    },
  },
  iconCritical: {
    color: theme?.palette?.error?.main || '#ef4444',
    '& svg, & .MuiIcon-root': {
      fontSize: 20,
    },
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  title: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: theme?.palette?.text?.secondary || '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    lineHeight: 1.2,
  },
  value: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme?.palette?.text?.primary || '#f1f5f9',
    lineHeight: 1.2,
    '@media (max-width: 768px)': {
      fontSize: '1.1rem',
    },
  },
  trendContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  trend: {
    fontSize: '0.7rem',
    fontWeight: 600,
    fontFamily: 'monospace',
    padding: '2px 6px',
    borderRadius: 4,
    border: `1px solid ${theme?.palette?.divider || 'rgba(148, 163, 184, 0.1)'}`,
  },
  trendUp: {
    color: theme?.palette?.success?.main || '#10b981',
    background: `${theme?.palette?.success?.main || '#10b981'}10`,
    borderColor: `${theme?.palette?.success?.main || '#10b981'}20`,
  },
  trendDown: {
    color: theme?.palette?.error?.main || '#ef4444',
    background: `${theme?.palette?.error?.main || '#ef4444'}10`,
    borderColor: `${theme?.palette?.error?.main || '#ef4444'}20`,
  },
  trendNeutral: {
    color: theme?.palette?.text?.disabled || '#64748b',
    background: `${theme?.palette?.text?.disabled || '#64748b'}10`,
    borderColor: `${theme?.palette?.text?.disabled || '#64748b'}20`,
  },
  trendSymbol: {
    fontSize: '0.8rem',
    marginRight: 2,
  },
}));
