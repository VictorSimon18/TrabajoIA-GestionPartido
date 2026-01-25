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

const TeamSelectionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [selectingFor, setSelectingFor] = useState(null); // 'home' | 'away'

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

    navigation.navigate('Match', {
      homeTeam,
      awayTeam,
    });
  };

  const renderTeamSelector = (title, selectedTeam, type) => (
    <TouchableOpacity
      style={[
        styles.teamSelector,
        selectedTeam && { borderColor: selectedTeam.color || colors.primary },
      ]}
      onPress={() => setSelectingFor(type)}
    >
      {selectedTeam ? (
        <View style={styles.selectedTeam}>
          <View style={[styles.teamBadge, { backgroundColor: selectedTeam.color || colors.primary }]}>
            <Text style={styles.teamBadgeText}>
              {selectedTeam.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.teamInfo}>
            <Text style={styles.teamLabel}>{title}</Text>
            <Text style={styles.teamName}>{selectedTeam.name}</Text>
            <Text style={styles.playerCount}>{selectedTeam.players.length} jugadores</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptySelector}>
          <Text style={styles.teamLabel}>{title}</Text>
          <Text style={styles.selectText}>Toca para seleccionar</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={gradients.primary} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo Partido</Text>
        <Text style={styles.subtitle}>Selecciona los equipos</Text>
      </View>

      {/* Selectores de equipo */}
      <View style={styles.selectorsContainer}>
        {renderTeamSelector('Equipo Local', homeTeam, 'home')}

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        {renderTeamSelector('Equipo Visitante', awayTeam, 'away')}
      </View>

      {/* Lista de equipos cuando se está seleccionando */}
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
          <ScrollView style={styles.teamList}>
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                style={[
                  styles.teamOption,
                  { borderLeftColor: team.color || colors.primary },
                ]}
                onPress={() => handleTeamSelect(team)}
              >
                <View style={[styles.optionBadge, { backgroundColor: team.color || colors.primary }]}>
                  <Text style={styles.optionBadgeText}>
                    {team.name.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionName}>{team.name}</Text>
                  <Text style={styles.optionPlayers}>{team.players.length} jugadores</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Botón comenzar */}
      {!selectingFor && (
        <TouchableOpacity
          style={[
            styles.startButton,
            (!homeTeam || !awayTeam) && styles.startButtonDisabled,
          ]}
          onPress={handleStartMatch}
          disabled={!homeTeam || !awayTeam}
        >
          <Text style={styles.startButtonText}>Comenzar Partido</Text>
          <Text style={styles.startButtonIcon}>⚽</Text>
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
    color: colors.textPrimary,
    fontSize: 18,
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
    gap: spacing.md,
  },
  teamSelector: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 3,
    borderColor: 'transparent',
    ...shadows.medium,
  },
  selectedTeam: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamBadge: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamBadgeText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  teamInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  teamLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  teamName: {
    ...typography.subtitle,
    color: colors.textDark,
  },
  playerCount: {
    ...typography.small,
    color: colors.textMuted,
  },
  emptySelector: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  selectText: {
    ...typography.body,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  vsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  vsText: {
    ...typography.title,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  teamListContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    ...shadows.large,
  },
  teamListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  teamListTitle: {
    ...typography.heading,
    color: colors.textDark,
  },
  cancelText: {
    color: colors.danger,
    fontWeight: '600',
  },
  teamList: {
    flex: 1,
  },
  teamOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  optionBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBadgeText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionInfo: {
    marginLeft: spacing.md,
  },
  optionName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textDark,
  },
  optionPlayers: {
    ...typography.small,
    color: colors.textMuted,
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginTop: spacing.xl,
    ...shadows.large,
  },
  startButtonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.7,
  },
  startButtonText: {
    ...typography.subtitle,
    color: colors.textDark,
    marginRight: spacing.sm,
  },
  startButtonIcon: {
    fontSize: 28,
  },
});

export default TeamSelectionScreen;
