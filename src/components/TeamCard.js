import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows, borderRadius, spacing, typography } from '../styles/theme';

const TeamCard = ({ team, onPress, onDelete, showStats = false, stats = null }) => {
  const playerCount = team.players?.length || 0;

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: team.color || colors.primary }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.mainContent}>
        <View style={[styles.colorBadge, { backgroundColor: team.color || colors.primary }]}>
          <Text style={styles.colorBadgeText}>
            {team.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.playerCount}>
            {playerCount} jugadores
          </Text>

          {showStats && stats && (
            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Text style={styles.statText}>PJ: {stats.matchesPlayed}</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.statText}>G: {stats.wins}</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: colors.warning }]}>
                <Text style={styles.statText}>E: {stats.draws}</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: colors.danger }]}>
                <Text style={styles.statText}>P: {stats.losses}</Text>
              </View>
            </View>
          )}
        </View>

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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
    borderLeftWidth: 5,
    ...shadows.medium,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  colorBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  colorBadgeText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    flex: 1,
  },
  teamName: {
    ...typography.heading,
    color: colors.textDark,
  },
  playerCount: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  statBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  deleteText: {
    fontSize: 20,
  },
  arrowContainer: {
    padding: spacing.sm,
  },
  arrow: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '300',
  },
});

export default TeamCard;
