// FutManager - Tema Deportivo/Energético
export const colors = {
  // Colores principales
  primary: '#2E7D32',       // Verde campo
  secondary: '#4CAF50',     // Verde claro
  accent: '#FFC107',        // Amarillo energético
  danger: '#D32F2F',        // Rojo

  // Fondos
  background: '#1B5E20',    // Verde oscuro
  backgroundLight: '#2E7D32',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F5',

  // Texto
  textPrimary: '#FFFFFF',
  textSecondary: '#E8F5E9',
  textDark: '#1B5E20',
  textMuted: '#757575',

  // Estados
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#D32F2F',
  info: '#2196F3',

  // Tarjetas
  yellowCard: '#FFC107',
  redCard: '#D32F2F',

  // Posiciones
  goalkeeper: '#FF9800',
  defender: '#2196F3',
  midfielder: '#9C27B0',
  forward: '#F44336',
};

export const gradients = {
  primary: ['#1B5E20', '#2E7D32', '#4CAF50'],
  secondary: ['#2E7D32', '#4CAF50'],
  accent: ['#FF8F00', '#FFC107'],
  dark: ['#0D3311', '#1B5E20'],
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
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
  xl: 24,
  round: 9999,
};

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal',
  },
};

export const buttons = {
  primary: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  danger: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
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
