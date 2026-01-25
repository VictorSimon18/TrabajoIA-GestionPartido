import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../styles/theme';
import { getTeams, getTeamStats, getMatches } from '../storage/asyncStorage';
import TeamCard from '../components/TeamCard';
import PlayerCard from '../components/PlayerCard';

const StatsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [teams, setTeams] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [totalMatches, setTotalMatches] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const loadedTeams = await getTeams();
    setTeams(loadedTeams);

    const matches = await getMatches();
    setTotalMatches(matches.length);

    // Cargar estadísticas de todos los equipos
    const stats = {};
    for (const team of loadedTeams) {
      const teamStat = await getTeamStats(team.id);
      if (teamStat) {
        stats[team.id] = teamStat;
      }
    }
    setTeamStats(stats);
  };

  const handleTeamPress = (team) => {
    setSelectedTeam(selectedTeam?.id === team.id ? null : team);
  };

  const renderTeamDetail = () => {
    if (!selectedTeam) return null;

    const stats = teamStats[selectedTeam.id];
    if (!stats) return null;

    // Ordenar jugadores por goles
    const sortedPlayers = [...selectedTeam.players].sort(
      (a, b) => b.stats.goals - a.stats.goals
    );

    return (
      <View style={styles.teamDetail}>
        <View style={styles.detailHeader}>
          <View style={[styles.teamBadge, { backgroundColor: selectedTeam.color || colors.primary }]}>
            <Text style={styles.teamBadgeText}>
              {selectedTeam.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailHeaderInfo}>
            <Text style={styles.detailTeamName}>{selectedTeam.name}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedTeam(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estadísticas del equipo */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.matchesPlayed}</Text>
            <Text style={styles.statLabel}>Partidos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.success }]}>
            <Text style={styles.statValue}>{stats.wins}</Text>
            <Text style={styles.statLabel}>Victorias</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.warning }]}>
            <Text style={styles.statValue}>{stats.draws}</Text>
            <Text style={styles.statLabel}>Empates</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.danger }]}>
            <Text style={styles.statValue}>{stats.losses}</Text>
            <Text style={styles.statLabel}>Derrotas</Text>
          </View>
        </View>

        <View style={styles.goalsRow}>
          <View style={styles.goalStat}>
            <Text style={styles.goalValue}>{stats.goalsFor}</Text>
            <Text style={styles.goalLabel}>Goles a favor</Text>
          </View>
          <View style={styles.goalStat}>
            <Text style={styles.goalValue}>{stats.goalsAgainst}</Text>
            <Text style={styles.goalLabel}>Goles en contra</Text>
          </View>
          <View style={styles.goalStat}>
            <Text style={[
              styles.goalValue,
              { color: stats.goalDifference >= 0 ? colors.success : colors.danger }
            ]}>
              {stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}
            </Text>
            <Text style={styles.goalLabel}>Diferencia</Text>
          </View>
        </View>

        {/* Lista de jugadores */}
        <Text style={styles.playersTitle}>Jugadores</Text>
        <ScrollView
          style={styles.playersList}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {sortedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              teamColor={selectedTeam.color}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <LinearGradient colors={gradients.primary} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Estadísticas</Text>
        <Text style={styles.subtitle}>{totalMatches} partidos jugados</Text>
      </View>

      {selectedTeam ? (
        renderTeamDetail()
      ) : (
        <ScrollView
          style={styles.teamsList}
          contentContainerStyle={styles.teamsListContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Selecciona un equipo</Text>

          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onPress={() => handleTeamPress(team)}
              showStats
              stats={teamStats[team.id]}
            />
          ))}

          {teams.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>No hay equipos</Text>
            </View>
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
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
  teamsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  teamsListContent: {
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  teamDetail: {
    flex: 1,
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.large,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  teamBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamBadgeText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  detailHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: spacing.md,
  },
  detailTeamName: {
    ...typography.subtitle,
    color: colors.textDark,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  goalsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  goalStat: {
    flex: 1,
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  goalLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  playersTitle: {
    ...typography.heading,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  playersList: {
    flex: 1,
  },
});

export default StatsScreen;
