// FutManager - Premium Dark Sports Theme
export const colors = {
  // Fondos principales
  background: '#0A0E21',
  backgroundLight: '#0F1429',
  backgroundCard: '#151A30',
  surface: '#1A1F36',
  surfaceLight: '#222842',
  surfaceAlt: '#1E2340',

  // Acentos principales
  primary: '#00E676',
  primaryDark: '#00C853',
  primaryLight: '#69F0AE',
  primaryGlow: 'rgba(0, 230, 118, 0.15)',

  // Acento secundario (dorado)
  accent: '#FFD600',
  accentDark: '#FFAB00',
  accentLight: '#FFFF00',
  accentGlow: 'rgba(255, 214, 0, 0.15)',

  // Estados
  danger: '#FF1744',
  dangerDark: '#D50000',
  dangerGlow: 'rgba(255, 23, 68, 0.15)',
  success: '#00E676',
  warning: '#FFD600',
  info: '#448AFF',
  infoGlow: 'rgba(68, 138, 255, 0.15)',

  // Texto
  textPrimary: '#FFFFFF',
  textSecondary: '#8892B0',
  textMuted: '#5A6384',
  textDark: '#0A0E21',
  textAccent: '#00E676',

  // Tarjetas deportivas
  yellowCard: '#FFD600',
  redCard: '#FF1744',

  // Posiciones (más vibrantes)
  goalkeeper: '#FF9100',
  defender: '#448AFF',
  midfielder: '#D500F9',
  forward: '#FF1744',

  // Bordes y separadores
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  divider: 'rgba(255, 255, 255, 0.06)',

  // Overlay
  overlay: 'rgba(10, 14, 33, 0.85)',
  glass: 'rgba(26, 31, 54, 0.75)',
  glassLight: 'rgba(34, 40, 66, 0.6)',
};

export const gradients = {
  background: ['#0A0E21', '#0F1429', '#151A30'],
  card: ['#1A1F36', '#222842'],
  primary: ['#00E676', '#00C853'],
  accent: ['#FFD600', '#FFAB00'],
  danger: ['#FF1744', '#D50000'],
  hero: ['#0A0E21', '#0D1B2A', '#1B2838'],
  match: ['#0A0E21', '#0D1117', '#151A30'],
  glow: ['rgba(0, 230, 118, 0.08)', 'rgba(0, 230, 118, 0)', 'rgba(0, 230, 118, 0)'],
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  accentGlow: {
    shadowColor: '#FFD600',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  round: 9999,
};

export const typography = {
  hero: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
  },
  small: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  mono: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
};

export const buttons = {
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.glow,
  },
  secondary: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  danger: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.medium,
  },
  accent: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.accentGlow,
  },
};

export default {
  colors,
  gradients,
  shadows,
  spacing,
  borderRadius,
  typography,
  buttons,
};
