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
import TeamBadge from '../components/TeamBadge';

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

    const sortedPlayers = [...selectedTeam.players].sort(
      (a, b) => b.stats.goals - a.stats.goals
    );

    const statItems = [
      { label: 'Partidos', value: stats.matchesPlayed, color: colors.info },
      { label: 'Victorias', value: stats.wins, color: colors.primary },
      { label: 'Empates', value: stats.draws, color: colors.accent },
      { label: 'Derrotas', value: stats.losses, color: colors.danger },
    ];

    return (
      <View style={styles.teamDetail}>
        {/* Team header */}
        <View style={styles.detailHeader}>
          <TeamBadge team={selectedTeam} size={52} />
          <View style={styles.detailHeaderInfo}>
            <Text style={styles.detailTeamName}>{selectedTeam.name}</Text>
            <Text style={styles.detailSubtext}>{selectedTeam.players.length} jugadores</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedTeam(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.detailScroll}>
          {/* Stats grid */}
          <View style={styles.statsGrid}>
            {statItems.map(({ label, value, color }) => (
              <View key={label} style={[styles.statCard, { borderColor: color }]}>
                <Text style={[styles.statValue, { color }]}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Goals row */}
          <View style={styles.goalsRow}>
            <View style={styles.goalStat}>
              <Text style={[styles.goalValue, { color: colors.primary }]}>{stats.goalsFor}</Text>
              <Text style={styles.goalLabel}>A favor</Text>
            </View>
            <View style={styles.goalDivider} />
            <View style={styles.goalStat}>
              <Text style={[styles.goalValue, { color: colors.danger }]}>{stats.goalsAgainst}</Text>
              <Text style={styles.goalLabel}>En contra</Text>
            </View>
            <View style={styles.goalDivider} />
            <View style={styles.goalStat}>
              <Text style={[
                styles.goalValue,
                { color: stats.goalDifference >= 0 ? colors.primary : colors.danger }
              ]}>
                {stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}
              </Text>
              <Text style={styles.goalLabel}>Diferencia</Text>
            </View>
          </View>

          {/* Team collective stats */}
          <View style={styles.collectiveRow}>
            <View style={styles.collectiveItem}>
              <Text style={styles.collectiveIcon}>🤚</Text>
              <Text style={styles.collectiveValue}>{stats.fouls || 0}</Text>
              <Text style={styles.collectiveLabel}>Faltas</Text>
            </View>
            <View style={styles.collectiveDivider} />
            <View style={styles.collectiveItem}>
              <Text style={styles.collectiveIcon}>🏁</Text>
              <Text style={styles.collectiveValue}>{stats.corners || 0}</Text>
              <Text style={styles.collectiveLabel}>Córners</Text>
            </View>
            <View style={styles.collectiveDivider} />
            <View style={styles.collectiveItem}>
              <Text style={styles.collectiveIcon}>📍</Text>
              <Text style={styles.collectiveValue}>{stats.throwIns || 0}</Text>
              <Text style={styles.collectiveLabel}>Saques de banda</Text>
            </View>
          </View>

          {/* Players */}
          <View style={styles.playersSection}>
            <Text style={styles.playersTitle}>Jugadores</Text>
            {sortedPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                teamColor={selectedTeam.color}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <LinearGradient colors={gradients.background} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Estadísticas</Text>
        <View style={styles.counterRow}>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{totalMatches}</Text>
          </View>
          <Text style={styles.subtitle}>partidos jugados</Text>
        </View>
      </View>

      {selectedTeam ? (
        renderTeamDetail()
      ) : (
        <ScrollView
          style={styles.teamsList}
          contentContainerStyle={styles.teamsListContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>SELECCIONA UN EQUIPO</Text>

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
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>📊</Text>
              </View>
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
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  counterBadge: {
    backgroundColor: colors.accentGlow,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  counterText: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 13,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  teamsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  teamsListContent: {
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  teamDetail: {
    flex: 1,
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.large,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailHeaderInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  detailTeamName: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  detailSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  detailScroll: {
    flex: 1,
    padding: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  goalsRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalStat: {
    flex: 1,
    alignItems: 'center',
  },
  goalDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  goalValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  goalLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  collectiveRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  collectiveItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  collectiveDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  collectiveIcon: {
    fontSize: 18,
  },
  collectiveValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  collectiveLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  playersSection: {
    marginBottom: spacing.lg,
  },
  playersTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});

export default StatsScreen;
