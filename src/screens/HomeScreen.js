import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../styles/theme';
import { initializeTeams } from '../storage/asyncStorage';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Inicializar equipos por defecto al cargar la app
    initializeTeams();
  }, []);

  const menuButtons = [
    {
      title: 'Empezar Partido',
      subtitle: 'Inicia un nuevo encuentro',
      icon: '⚽',
      screen: 'TeamSelection',
      color: colors.accent,
    },
    {
      title: 'Gestor de Equipos',
      subtitle: 'Crea y administra equipos',
      icon: '👥',
      screen: 'TeamManager',
      color: colors.secondary,
    },
    {
      title: 'Estadísticas',
      subtitle: 'Consulta el rendimiento',
      icon: '📊',
      screen: 'Stats',
      color: colors.info,
    },
  ];

  return (
    <LinearGradient colors={gradients.primary} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />

      {/* Logo y Título */}
      <View style={styles.header}>
        <Text style={styles.logo}>⚽</Text>
        <Text style={styles.title}>FutManager</Text>
        <Text style={styles.subtitle}>Gestión de Partidos</Text>
      </View>

      {/* Botones del menú */}
      <View style={styles.menuContainer}>
        {menuButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuButton, { backgroundColor: button.color }]}
            onPress={() => navigation.navigate(button.screen)}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonIcon}>{button.icon}</Text>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>{button.title}</Text>
              <Text style={styles.buttonSubtitle}>{button.subtitle}</Text>
            </View>
            <Text style={styles.buttonArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Fútbol 11 • Cronómetro • Eventos</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl * 2,
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    ...typography.title,
    fontSize: 42,
    color: colors.textPrimary,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.large,
  },
  buttonIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  buttonArrow: {
    fontSize: 36,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  footerText: {
    ...typography.small,
    color: colors.textSecondary,
    opacity: 0.7,
  },
});

export default HomeScreen;
