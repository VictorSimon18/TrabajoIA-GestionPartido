import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../styles/theme';
import { getTeams } from '../storage/asyncStorage';
import TeamBadge from '../components/TeamBadge';

const TeamSelectionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [selectingFor, setSelectingFor] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const loadedTeams = await getTeams();
    setTeams(loadedTeams);
  };

  const handleTeamSelect = (team) => {
    if (selectingFor === 'home') {
      if (awayTeam && awayTeam.id === team.id) {
        Alert.alert('Error', 'El equipo local y visitante no pueden ser el mismo');
        return;
      }
      setHomeTeam(team);
    } else if (selectingFor === 'away') {
      if (homeTeam && homeTeam.id === team.id) {
        Alert.alert('Error', 'El equipo local y visitante no pueden ser el mismo');
        return;
      }
      setAwayTeam(team);
    }
    setSelectingFor(null);
  };

  const handleStartMatch = () => {
    if (!homeTeam || !awayTeam) {
      Alert.alert('Error', 'Selecciona ambos equipos para comenzar');
      return;
    }

    if (homeTeam.players.length < 11 || awayTeam.players.length < 11) {
      Alert.alert('Error', 'Ambos equipos necesitan al menos 11 jugadores');
      return;
    }

    navigation.navigate('Match', { homeTeam, awayTeam });
  };

  const renderTeamSelector = (title, selectedTeam, type) => (
    <TouchableOpacity
      style={[
        styles.teamSelector,
        selectedTeam && { borderColor: selectedTeam.color || colors.primary },
      ]}
      onPress={() => setSelectingFor(type)}
      activeOpacity={0.7}
    >
      {selectedTeam ? (
        <View style={styles.selectedTeam}>
          <TeamBadge team={selectedTeam} size={56} />
          <View style={styles.teamInfo}>
            <Text style={styles.teamLabel}>{title}</Text>
            <Text style={styles.teamName}>{selectedTeam.name}</Text>
            <Text style={styles.playerCount}>{selectedTeam.players.length} jugadores</Text>
          </View>
          <View style={styles.checkBadge}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptySelector}>
          <View style={styles.emptyBadge}>
            <Text style={styles.emptyBadgeText}>?</Text>
          </View>
          <View>
            <Text style={styles.teamLabel}>{title}</Text>
            <Text style={styles.selectText}>Toca para seleccionar</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={gradients.background} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo Partido</Text>
        <Text style={styles.subtitle}>Selecciona los equipos</Text>
      </View>

      {/* Selectores */}
      <View style={styles.selectorsContainer}>
        {renderTeamSelector('Equipo Local', homeTeam, 'home')}

        <View style={styles.vsContainer}>
          <View style={styles.vsLine} />
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={styles.vsLine} />
        </View>

        {renderTeamSelector('Equipo Visitante', awayTeam, 'away')}
      </View>

      {/* Lista de equipos */}
      {selectingFor && (
        <View style={styles.teamListContainer}>
          <View style={styles.teamListHeader}>
            <Text style={styles.teamListTitle}>
              Selecciona {selectingFor === 'home' ? 'Local' : 'Visitante'}
            </Text>
            <TouchableOpacity onPress={() => setSelectingFor(null)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.teamList} showsVerticalScrollIndicator={false}>
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                style={styles.teamOption}
                onPress={() => handleTeamSelect(team)}
                activeOpacity={0.7}
              >
                <TeamBadge team={team} size={42} />
                <View style={styles.optionInfo}>
                  <Text style={styles.optionName}>{team.name}</Text>
                  <Text style={styles.optionPlayers}>{team.players.length} jugadores</Text>
                </View>
                <View style={[styles.optionAccent, { backgroundColor: team.color || colors.primary }]} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Boton comenzar */}
      {!selectingFor && (
        <TouchableOpacity
          style={[
            styles.startButton,
            (!homeTeam || !awayTeam) && styles.startButtonDisabled,
          ]}
          onPress={handleStartMatch}
          disabled={!homeTeam || !awayTeam}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={(!homeTeam || !awayTeam) ? [colors.surfaceLight, colors.surfaceLight] : gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            <Text style={[
              styles.startButtonText,
              (!homeTeam || !awayTeam) && styles.startButtonTextDisabled
            ]}>Comenzar Partido</Text>
            <Text style={styles.startButtonIcon}>⚽</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  selectorsContainer: {
    gap: spacing.xs,
  },
  teamSelector: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.medium,
  },
  selectedTeam: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  teamInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  teamLabel: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  teamName: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginTop: 2,
  },
  playerCount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  emptySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  emptyBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  emptyBadgeText: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '700',
  },
  selectText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  vsLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  vsBadge: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginHorizontal: spacing.md,
  },
  vsText: {
    ...typography.heading,
    color: colors.textMuted,
    fontWeight: '800',
  },
  teamListContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.large,
  },
  teamListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  teamListTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  cancelText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 14,
  },
  teamList: {
    flex: 1,
  },
  teamOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  optionInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  optionName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionPlayers: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionAccent: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  startButton: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.glow,
  },
  startButtonDisabled: {
    ...shadows.small,
  },
  startButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  startButtonText: {
    ...typography.heading,
    color: '#FFFFFF',
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  startButtonTextDisabled: {
    color: colors.textMuted,
  },
  startButtonIcon: {
    fontSize: 24,
  },
});

export default TeamSelectionScreen;
