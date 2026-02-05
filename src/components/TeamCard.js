import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows, borderRadius, spacing, typography } from '../styles/theme';
import TeamBadge from './TeamBadge';

const TeamCard = ({ team, onPress, onDelete, showStats = false, stats = null }) => {
  const playerCount = team.players?.length || 0;
  const teamColor = team.color || colors.primary;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.mainContent}>
        {/* Badge */}
        <View style={styles.badgeWrapper}>
          <TeamBadge team={team} size={50} />
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.playerCount}>
            {playerCount} jugadores
          </Text>

          {showStats && stats && (
            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Text style={styles.statText}>PJ {stats.matchesPlayed}</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: colors.primaryGlow, borderColor: colors.primary }]}>
                <Text style={[styles.statText, { color: colors.primary }]}>G {stats.wins}</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: colors.accentGlow, borderColor: colors.accent }]}>
                <Text style={[styles.statText, { color: colors.accent }]}>E {stats.draws}</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: colors.dangerGlow, borderColor: colors.danger }]}>
                <Text style={[styles.statText, { color: colors.danger }]}>P {stats.losses}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Acciones */}
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(team.id);
            }}
          >
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        )}

        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>

      {/* Linea de acento inferior */}
      <View style={[styles.accentLine, { backgroundColor: teamColor }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.medium,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  badgeWrapper: {
    marginRight: spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  teamName: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  playerCount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  statBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  deleteButton: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  deleteText: {
    fontSize: 18,
  },
  arrowContainer: {
    padding: spacing.xs,
  },
  arrow: {
    fontSize: 24,
    color: colors.textMuted,
    fontWeight: '300',
  },
  accentLine: {
    height: 2,
    width: '100%',
  },
});

export default TeamCard;
