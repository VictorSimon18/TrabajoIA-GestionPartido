import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../styles/theme';
import { initializeTeams } from '../storage/asyncStorage';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    initializeTeams();
  }, []);

  const menuButtons = [
    {
      title: 'Empezar Partido',
      subtitle: 'Inicia un nuevo encuentro',
      icon: '⚽',
      screen: 'TeamSelection',
      gradient: ['#00E676', '#00C853'],
      glowColor: colors.primaryGlow,
    },
    {
      title: 'Gestor de Equipos',
      subtitle: 'Crea y administra equipos',
      icon: '👥',
      screen: 'TeamManager',
      gradient: ['#448AFF', '#2962FF'],
      glowColor: colors.infoGlow,
    },
    {
      title: 'Estadísticas',
      subtitle: 'Consulta el rendimiento',
      icon: '📊',
      screen: 'Stats',
      gradient: ['#FFD600', '#FFAB00'],
      glowColor: colors.accentGlow,
    },
  ];

  return (
    <LinearGradient colors={gradients.hero} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />

      {/* Decorative glow */}
      <View style={styles.glowCircle} />

      {/* Logo y Titulo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>⚽</Text>
        </View>
        <Text style={styles.title}>FutManager</Text>
        <Text style={styles.subtitle}>Gestión de Partidos</Text>
      </View>

      {/* Menu Cards */}
      <View style={styles.menuContainer}>
        {menuButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() => navigation.navigate(button.screen)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={button.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuCardGradient}
            >
              <View style={styles.menuCardContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.buttonIcon}>{button.icon}</Text>
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>{button.title}</Text>
                  <Text style={styles.buttonSubtitle}>{button.subtitle}</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Text style={styles.buttonArrow}>→</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerText}>Fútbol 11  •  Cronómetro  •  Eventos</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  glowCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primaryGlow,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl * 1.5,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.glow,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  menuCard: {
    borderRadius: borderRadius.xl,
    ...shadows.large,
  },
  menuCardGradient: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  buttonIcon: {
    fontSize: 28,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    ...typography.heading,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buttonSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  footerDivider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  footerText: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
