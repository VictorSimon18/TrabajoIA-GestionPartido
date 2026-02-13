import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows, borderRadius, spacing } from '../styles/theme';
import { positions } from '../data/defaultTeams';

const PlayerCard = ({ player, teamColor, onPress, isCompact = false, matchEvents = [] }) => {
  const positionData = positions[player.position] || { name: player.position, color: '#5A6384' };

  const playerEvents = matchEvents.filter(e => e.playerId === player.id);
  const goals = playerEvents.filter(e => e.type === 'goal').length;
  const assists = playerEvents.filter(e => e.type === 'assist').length;
  const yellowCards = playerEvents.filter(e => e.type === 'yellowCard').length;
  const redCards = playerEvents.filter(e => e.type === 'redCard').length;
  const isSubbedOut = playerEvents.some(e => e.type === 'substitution' && e.relatedPlayerId);
  const isExpelled = redCards > 0 || yellowCards >= 2;

  if (isCompact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          isSubbedOut && styles.subbedOut,
          isExpelled && styles.expelled,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.numberBadgeCompact, { backgroundColor: positionData.color }]}>
          <Text style={styles.numberTextCompact}>{player.number}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, isExpelled && styles.expelledText]} numberOfLines={1}>{player.name}</Text>
          <View style={styles.eventsRow}>
            {goals > 0 && <Text style={styles.eventIcon}>{'⚽'.repeat(goals)}</Text>}
            {assists > 0 && <Text style={styles.eventIcon}>{'👟'.repeat(assists)}</Text>}
            {yellowCards > 0 && <Text style={styles.eventIcon}>{'🟨'.repeat(yellowCards)}</Text>}
            {redCards > 0 && <Text style={styles.eventIcon}>🟥</Text>}
          </View>
        </View>
        <View style={[styles.positionDot, { backgroundColor: positionData.color }]} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.numberBadge, { backgroundColor: positionData.color }]}>
        <Text style={styles.numberText}>{player.number}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.playerName}>{player.name}</Text>
        <View style={styles.positionTag}>
          <View style={[styles.positionIndicator, { backgroundColor: positionData.color }]} />
          <Text style={styles.positionText}>{positionData.name}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>⚽</Text>
          <Text style={styles.statValue}>{player.stats.goals}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>👟</Text>
          <Text style={styles.statValue}>{player.stats.assists}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🟨</Text>
          <Text style={[styles.statValue, player.stats.yellowCards > 0 && { color: colors.yellowCard }]}>
            {player.stats.yellowCards}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🟥</Text>
          <Text style={[styles.statValue, player.stats.redCards > 0 && { color: colors.redCard }]}>
            {player.stats.redCards}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🤚</Text>
          <Text style={styles.statValue}>{player.stats.fouls || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🏁</Text>
          <Text style={styles.statValue}>{player.stats.corners || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>📍</Text>
          <Text style={styles.statValue}>{player.stats.throwIns || 0}</Text>
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
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subbedOut: {
    opacity: 0.4,
  },
  expelled: {
    opacity: 0.4,
    borderColor: '#FF1744',
    borderWidth: 1.5,
  },
  expelledText: {
    color: colors.textMuted,
  },
  numberBadge: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  numberBadgeCompact: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  numberTextCompact: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  infoContainer: {
    flex: 1,
  },
  compactInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  compactName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  positionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  positionIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  positionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  positionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    maxWidth: 160,
    justifyContent: 'flex-end',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  eventsRow: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 2,
  },
  eventIcon: {
    fontSize: 11,
  },
});

export default PlayerCard;
