import { makeStyles } from '@mui/styles';
import { Theme, alpha } from '@mui/material/styles';

export const useAlertItemStyles = makeStyles((theme: Theme) => ({
  alertItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.06),
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '@media (max-width: 768px)': {
      padding: '12px 14px',
      gap: 10,
    },
  },
  alertItemClickable: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      borderColor: alpha(theme.palette.common.white, 0.15),
      transform: 'translateX(3px)',
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
    backgroundColor: theme.palette.error.main,
  },
  statusDotMedium: {
    backgroundColor: theme.palette.warning.main,
  },
  statusDotInfo: {
    backgroundColor: theme.palette.info.main,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    fontSize: '0.8rem',
    color: theme.palette.text.primary,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.5,
    fontWeight: 500,
    '@media (max-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
  timestamp: {
    fontSize: '0.65rem',
    color: theme.palette.text.secondary,
    marginTop: 4,
    letterSpacing: '0.02em',
  },
}));
