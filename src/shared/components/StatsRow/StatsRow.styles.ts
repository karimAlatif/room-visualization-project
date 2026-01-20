import { makeStyles } from '@mui/styles';
import { Theme, alpha } from '@mui/material/styles';

export const useStatsRowStyles = makeStyles((theme: Theme) => ({
  // Stats Row - Combined Card
  statsRow: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 0,
    marginBottom: 16,
    padding: '20px 24px',
    borderRadius: 24,
    backgroundColor: alpha(theme.palette.common.white, 0.12),
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.25)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}, 0 0 60px ${alpha(theme.palette.primary.main, 0.08)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.2)}`,
    transition: 'all 0.3s ease-in-out',
    position: 'relative' as const,
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.18),
      transform: 'translateY(-2px)',
      boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.18)}, 0 0 80px ${alpha(theme.palette.primary.main, 0.12)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.25)}`,
    },
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      left: '50%',
      top: '15%',
      bottom: '15%',
      width: 1,
      background: `linear-gradient(to bottom, transparent, ${alpha(theme.palette.common.white, 0.4)}, transparent)`,
      boxShadow: `0 0 8px ${alpha(theme.palette.common.white, 0.3)}`,
    },
  },
  statCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '0 8px',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      fontSize: '28px !important',
      color: theme.palette.text.secondary,
      opacity: 0.8,
      filter: `drop-shadow(0 0 8px ${alpha(theme.palette.common.white, 0.3)})`,
    },
  },
  statLabel: {
    fontSize: '1.15rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    letterSpacing: '0.01em',
    textShadow: `0 0 12px ${alpha(theme.palette.common.white, 0.2)}`,
  },
  statValue: {
    fontSize: '3.75rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    lineHeight: 1,
    textShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.15)}, 0 0 30px ${alpha(theme.palette.common.white, 0.15)}`,
    marginTop: 4,
    letterSpacing: '-0.02em',
  },
}));
