import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../styles/theme';
import Timer from '../components/Timer';
import PlayerCard from '../components/PlayerCard';
import EventModal from '../components/EventModal';
import TeamBadge from '../components/TeamBadge';
import { saveMatch, updatePlayerStats, saveCurrentMatch, clearCurrentMatch } from '../storage/asyncStorage';

const MatchScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { homeTeam, awayTeam } = route.params;
  const timerRef = useRef(null);

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState([]);
  const [currentMinute, setCurrentMinute] = useState(0);

  const [homeLineup, setHomeLineup] = useState(homeTeam.players.slice(0, 11).map(p => p.id));
  const [awayLineup, setAwayLineup] = useState(awayTeam.players.slice(0, 11).map(p => p.id));

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const saveState = async () => {
      await saveCurrentMatch({
        homeTeam, awayTeam, homeScore, awayScore,
        events, homeLineup, awayLineup, currentMinute,
      });
    };
    saveState();
  }, [homeScore, awayScore, events]);

  const handleTimeUpdate = (seconds) => {
    setCurrentMinute(Math.floor(seconds / 60));
  };

  // Check if a player is expelled (has red card in events)
  const isPlayerExpelled = (playerId) => {
    const playerEvts = events.filter(e => e.playerId === playerId);
    const reds = playerEvts.filter(e => e.type === 'redCard').length;
    const yellows = playerEvts.filter(e => e.type === 'yellowCard').length;
    return reds > 0 || yellows >= 2;
  };

  const handlePlayerPress = (player, team) => {
    if (isPlayerExpelled(player.id)) {
      Alert.alert('Jugador expulsado', `${player.name} ha sido expulsado y no puede participar más en el partido.`);
      return;
    }
    setSelectedPlayer(player);
    setSelectedTeam(team);
    setModalVisible(true);
  };

  const handleEventSelect = async (eventData) => {
    const newEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...eventData,
      teamId: selectedTeam.id,
    };

    setEvents(prev => [...prev, newEvent]);

    if (eventData.type === 'goal') {
      if (selectedTeam.id === homeTeam.id) {
        setHomeScore(prev => prev + 1);
      } else {
        setAwayScore(prev => prev + 1);
      }
    }

    if (eventData.type === 'substitution' && eventData.relatedPlayerId) {
      if (selectedTeam.id === homeTeam.id) {
        setHomeLineup(prev =>
          prev.map(id => id === eventData.playerId ? eventData.relatedPlayerId : id)
        );
      } else {
        setAwayLineup(prev =>
          prev.map(id => id === eventData.playerId ? eventData.relatedPlayerId : id)
        );
      }
    }
  };

  const getLineupPlayers = (team, lineupIds) => {
    return team.players.filter(p => lineupIds.includes(p.id));
  };

  const getBenchPlayers = (team, lineupIds) => {
    return team.players.filter(p => !lineupIds.includes(p.id));
  };

  // Calculate team counters from events
  const getTeamCounters = (teamId) => {
    const teamEvents = events.filter(e => e.teamId === teamId);
    return {
      fouls: teamEvents.filter(e => e.type === 'foul').length,
      corners: teamEvents.filter(e => e.type === 'corner').length,
      throwIns: teamEvents.filter(e => e.type === 'throwIn').length,
    };
  };

  const homeCounters = getTeamCounters(homeTeam.id);
  const awayCounters = getTeamCounters(awayTeam.id);

  const handleEndMatch = () => {
    Alert.alert(
      'Finalizar Partido',
      `¿Deseas finalizar el partido?\n\n${homeTeam.name} ${homeScore} - ${awayScore} ${awayTeam.name}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: async () => {
            const match = {
              id: `match-${Date.now()}`,
              date: new Date().toISOString(),
              homeTeam: { id: homeTeam.id, name: homeTeam.name, color: homeTeam.color },
              awayTeam: { id: awayTeam.id, name: awayTeam.name, color: awayTeam.color },
              homeScore, awayScore, events,
              lineup: { home: homeLineup, away: awayLineup },
            };

            await saveMatch(match);

            // Fix: Aggregate all events per player FIRST, then update once
            const playerEventCounts = {};
            for (const event of events) {
              const key = `${event.teamId}-${event.playerId}`;
              if (!playerEventCounts[key]) {
                playerEventCounts[key] = {
                  teamId: event.teamId,
                  playerId: event.playerId,
                  goals: 0, assists: 0, yellowCards: 0, redCards: 0,
                  fouls: 0, corners: 0, throwIns: 0,
                };
              }
              if (event.type === 'goal') playerEventCounts[key].goals++;
              if (event.type === 'assist') playerEventCounts[key].assists++;
              if (event.type === 'yellowCard') playerEventCounts[key].yellowCards++;
              if (event.type === 'redCard') playerEventCounts[key].redCards++;
              if (event.type === 'foul') playerEventCounts[key].fouls++;
              if (event.type === 'corner') playerEventCounts[key].corners++;
              if (event.type === 'throwIn') playerEventCounts[key].throwIns++;
            }

            // Now update each player's stats by adding the totals
            for (const key of Object.keys(playerEventCounts)) {
              const { teamId, playerId, goals, assists, yellowCards, redCards, fouls, corners, throwIns } = playerEventCounts[key];
              const team = teamId === homeTeam.id ? homeTeam : awayTeam;
              const player = team.players.find(p => p.id === playerId);

              if (player) {
                const statsUpdate = {};
                if (goals > 0) statsUpdate.goals = (player.stats.goals || 0) + goals;
                if (assists > 0) statsUpdate.assists = (player.stats.assists || 0) + assists;
                if (yellowCards > 0) statsUpdate.yellowCards = (player.stats.yellowCards || 0) + yellowCards;
                if (redCards > 0) statsUpdate.redCards = (player.stats.redCards || 0) + redCards;
                if (fouls > 0) statsUpdate.fouls = (player.stats.fouls || 0) + fouls;
                if (corners > 0) statsUpdate.corners = (player.stats.corners || 0) + corners;
                if (throwIns > 0) statsUpdate.throwIns = (player.stats.throwIns || 0) + throwIns;

                if (Object.keys(statsUpdate).length > 0) {
                  await updatePlayerStats(teamId, playerId, statsUpdate);
                }
              }
            }

            const allLineupPlayers = [
              ...homeLineup.map(id => ({ teamId: homeTeam.id, playerId: id })),
              ...awayLineup.map(id => ({ teamId: awayTeam.id, playerId: id })),
            ];

            for (const { teamId, playerId } of allLineupPlayers) {
              const team = teamId === homeTeam.id ? homeTeam : awayTeam;
              const player = team.players.find(p => p.id === playerId);
              if (player) {
                await updatePlayerStats(teamId, playerId, {
                  matchesPlayed: (player.stats.matchesPlayed || 0) + 1,
                });
              }
            }

            await clearCurrentMatch();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const homeLinePlayers = getLineupPlayers(homeTeam, homeLineup);
  const awayLinePlayers = getLineupPlayers(awayTeam, awayLineup);
  const homeBenchPlayers = getBenchPlayers(homeTeam, homeLineup);
  const awayBenchPlayers = getBenchPlayers(awayTeam, awayLineup);

  return (
    <LinearGradient colors={gradients.match} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Timer */}
      <Timer ref={timerRef} onTimeUpdate={handleTimeUpdate} />

      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <View style={styles.teamScore}>
          <TeamBadge team={homeTeam} size={32} />
          <Text style={styles.teamNameScore} numberOfLines={1}>{homeTeam.name}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{homeScore}</Text>
          </View>
          <Text style={styles.scoreSeparator}>:</Text>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{awayScore}</Text>
          </View>
        </View>

        <View style={styles.teamScore}>
          <TeamBadge team={awayTeam} size={32} />
          <Text style={styles.teamNameScore} numberOfLines={1}>{awayTeam.name}</Text>
        </View>
      </View>

      {/* Team counters row */}
      <View style={styles.countersRow}>
        <View style={styles.countersSide}>
          <View style={styles.counterItem}>
            <Text style={styles.counterIcon}>🤚</Text>
            <Text style={styles.counterValue}>{homeCounters.fouls}</Text>
          </View>
          <View style={styles.counterItem}>
            <Text style={styles.counterIcon}>🏁</Text>
            <Text style={styles.counterValue}>{homeCounters.corners}</Text>
          </View>
          <View style={styles.counterItem}>
            <Text style={styles.counterIcon}>📍</Text>
            <Text style={styles.counterValue}>{homeCounters.throwIns}</Text>
          </View>
        </View>
        <View style={styles.countersLabel}>
          <Text style={styles.countersLabelText}>Faltas · Córners · Saques</Text>
        </View>
        <View style={styles.countersSide}>
          <View style={styles.counterItem}>
            <Text style={styles.counterIcon}>🤚</Text>
            <Text style={styles.counterValue}>{awayCounters.fouls}</Text>
          </View>
          <View style={styles.counterItem}>
            <Text style={styles.counterIcon}>🏁</Text>
            <Text style={styles.counterValue}>{awayCounters.corners}</Text>
          </View>
          <View style={styles.counterItem}>
            <Text style={styles.counterIcon}>📍</Text>
            <Text style={styles.counterValue}>{awayCounters.throwIns}</Text>
          </View>
        </View>
      </View>

      {/* Lineups */}
      <View style={styles.lineupsContainer}>
        <View style={styles.lineupColumn}>
          <View style={styles.lineupHeader}>
            <TeamBadge team={homeTeam} size={20} />
            <Text style={styles.lineupTitle}>Local</Text>
          </View>
          <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
            {homeLinePlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                teamColor={homeTeam.color}
                isCompact
                matchEvents={events}
                onPress={() => handlePlayerPress(player, homeTeam)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.columnDivider} />

        <View style={styles.lineupColumn}>
          <View style={styles.lineupHeader}>
            <TeamBadge team={awayTeam} size={20} />
            <Text style={styles.lineupTitle}>Visitante</Text>
          </View>
          <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
            {awayLinePlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                teamColor={awayTeam.color}
                isCompact
                matchEvents={events}
                onPress={() => handlePlayerPress(player, awayTeam)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* End match button */}
      <TouchableOpacity style={styles.endButton} onPress={handleEndMatch} activeOpacity={0.7}>
        <LinearGradient
          colors={gradients.danger}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.endButtonGradient}
        >
          <Text style={styles.endButtonText}>Finalizar Partido</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Event Modal */}
      <EventModal
        visible={modalVisible}
        player={selectedPlayer}
        teamPlayers={selectedTeam?.id === homeTeam.id ? homeLinePlayers : awayLinePlayers}
        benchPlayers={selectedTeam?.id === homeTeam.id ? homeBenchPlayers : awayBenchPlayers}
        minute={currentMinute}
        onClose={() => setModalVisible(false)}
        onEventSelect={handleEventSelect}
        events={events}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  teamScore: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  teamNameScore: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreText: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  scoreSeparator: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '300',
  },
  countersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countersSide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  countersLabel: {
    paddingHorizontal: spacing.xs,
  },
  countersLabelText: {
    fontSize: 8,
    color: colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  counterItem: {
    alignItems: 'center',
    gap: 1,
  },
  counterIcon: {
    fontSize: 12,
  },
  counterValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  lineupsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  lineupColumn: {
    flex: 1,
  },
  columnDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  lineupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  lineupTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  playersList: {
    flex: 1,
  },
  endButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  endButtonGradient: {
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.xl,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default MatchScreen;
