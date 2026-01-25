import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows, borderRadius, spacing } from '../styles/theme';
import { positions } from '../data/defaultTeams';

const PlayerCard = ({ player, teamColor, onPress, isCompact = false, matchEvents = [] }) => {
  const positionData = positions[player.position] || { name: player.position, color: '#757575' };

  // Contar eventos del jugador en el partido actual
  const playerEvents = matchEvents.filter(e => e.playerId === player.id);
  const goals = playerEvents.filter(e => e.type === 'goal').length;
  const assists = playerEvents.filter(e => e.type === 'assist').length;
  const yellowCards = playerEvents.filter(e => e.type === 'yellowCard').length;
  const redCards = playerEvents.filter(e => e.type === 'redCard').length;
  const isSubbedOut = playerEvents.some(e => e.type === 'substitution' && e.relatedPlayerId);

  if (isCompact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          { borderLeftColor: teamColor || colors.primary },
          isSubbedOut && styles.subbedOut,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.numberBadgeCompact, { backgroundColor: positionData.color }]}>
          <Text style={styles.numberTextCompact}>{player.number}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{player.name}</Text>
          <View style={styles.eventsRow}>
            {goals > 0 && <Text style={styles.eventIcon}>{'⚽'.repeat(goals)}</Text>}
            {assists > 0 && <Text style={styles.eventIcon}>{'👟'.repeat(assists)}</Text>}
            {yellowCards > 0 && <Text style={styles.eventIcon}>🟨</Text>}
            {redCards > 0 && <Text style={styles.eventIcon}>🟥</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: teamColor || colors.primary }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.numberBadge, { backgroundColor: positionData.color }]}>
        <Text style={styles.numberText}>{player.number}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.playerName}>{player.name}</Text>
        <View style={styles.positionContainer}>
          <Text style={[styles.positionText, { color: positionData.color }]}>
            {positionData.name}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{player.stats.goals}</Text>
          <Text style={styles.statLabel}>⚽</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{player.stats.assists}</Text>
          <Text style={styles.statLabel}>👟</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.yellowCard }]}>
            {player.stats.yellowCards}
          </Text>
          <Text style={styles.statLabel}>🟨</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.redCard }]}>
            {player.stats.redCards}
          </Text>
          <Text style={styles.statLabel}>🟥</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    borderLeftWidth: 4,
    ...shadows.small,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginVertical: 2,
    borderLeftWidth: 3,
    ...shadows.small,
  },
  subbedOut: {
    opacity: 0.5,
    backgroundColor: 'rgba(200,200,200,0.9)',
  },
  numberBadge: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  numberBadgeCompact: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  numberText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  numberTextCompact: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  compactInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  positionContainer: {
    marginTop: spacing.xs,
  },
  positionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  statLabel: {
    fontSize: 12,
  },
  eventsRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  eventIcon: {
    fontSize: 12,
    marginRight: 2,
  },
});

export default PlayerCard;
