import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../styles/theme';
import TeamBadge from '../components/TeamBadge';

const FORMATIONS = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2'];

const POSITION_ORDER = { POR: 0, DEF: 1, MED: 2, DEL: 3 };
const POSITION_LABELS = { POR: 'Portero', DEF: 'Defensa', MED: 'Mediocentro', DEL: 'Delantero' };
const POSITION_COLORS = { POR: '#FF9100', DEF: '#448AFF', MED: '#D500F9', DEL: '#FF1744' };

const sortByPosition = (players) =>
  [...players].sort((a, b) => (POSITION_ORDER[a.position] ?? 99) - (POSITION_ORDER[b.position] ?? 99));

const buildDefaultLineup = (team) => {
  const sorted = sortByPosition(team.players);
  return sorted.slice(0, Math.min(11, sorted.length)).map(p => p.id);
};

const LineupScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { homeTeam, awayTeam } = route.params;

  const [activeTab, setActiveTab] = useState('home');
  const [homeFormation, setHomeFormation] = useState('4-3-3');
  const [awayFormation, setAwayFormation] = useState('4-3-3');
  const [homeLineup, setHomeLineup] = useState(() => buildDefaultLineup(homeTeam));
  const [awayLineup, setAwayLineup] = useState(() => buildDefaultLineup(awayTeam));
  const [showFormationModal, setShowFormationModal] = useState(false);

  const isHome = activeTab === 'home';
  const currentTeam = isHome ? homeTeam : awayTeam;
  const currentLineup = isHome ? homeLineup : awayLineup;
  const currentFormation = isHome ? homeFormation : awayFormation;
  const setCurrentLineup = isHome ? setHomeLineup : setAwayLineup;
  const setCurrentFormation = isHome ? setHomeFormation : setAwayFormation;

  const hasLessThan11 = currentTeam.players.length < 11;
  const sortedPlayers = sortByPosition(currentTeam.players);

  const groupedPlayers = sortedPlayers.reduce((acc, player) => {
    const pos = player.position || 'DEL';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(player);
    return acc;
  }, {});
  const positionSections = ['POR', 'DEF', 'MED', 'DEL'].filter(pos => groupedPlayers[pos]);

  const togglePlayer = (playerId) => {
    if (hasLessThan11) return;
    setCurrentLineup(prev => {
      if (prev.includes(playerId)) return prev.filter(id => id !== playerId);
      if (prev.length >= 11) return prev;
      return [...prev, playerId];
    });
  };

  const handleStartMatch = () => {
    navigation.replace('Match', { homeTeam, awayTeam, homeLineup, awayLineup });
  };

  return (
    <LinearGradient
      colors={gradients.background}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Alineaciones</Text>
        <Text style={styles.subtitle}>Elige el 11 inicial de cada equipo</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[{ key: 'home', team: homeTeam, lineup: homeLineup }, { key: 'away', team: awayTeam, lineup: awayLineup }].map(({ key, team, lineup }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, activeTab === key && styles.tabActive]}
            onPress={() => setActiveTab(key)}
            activeOpacity={0.7}
          >
            <TeamBadge team={team} size={20} />
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]} numberOfLines={1}>
              {team.name}
            </Text>
            <View style={[styles.tabBadge, lineup.length === 11 && styles.tabBadgeFull]}>
              <Text style={[styles.tabBadgeText, lineup.length === 11 && styles.tabBadgeTextFull]}>
                {lineup.length}/11
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Formation Picker */}
      <TouchableOpacity style={styles.formationRow} onPress={() => setShowFormationModal(true)} activeOpacity={0.7}>
        <Text style={styles.formationLabel}>Formación</Text>
        <View style={styles.formationPicker}>
          <Text style={styles.formationValue}>{currentFormation}</Text>
          <Text style={styles.formationArrow}>▾</Text>
        </View>
      </TouchableOpacity>

      {/* Warning banner */}
      {hasLessThan11 && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            ⚠️  {currentTeam.name} solo tiene {currentTeam.players.length} jugadores — se usarán todos como titulares.
          </Text>
        </View>
      )}

      {/* Selection counter */}
      {!hasLessThan11 && (
        <View style={styles.counterRow}>
          <Text style={styles.counterText}>
            Titulares:{' '}
            <Text style={[styles.counterNum, currentLineup.length === 11 && styles.counterNumFull]}>
              {currentLineup.length}
            </Text>
            /11
          </Text>
          {currentLineup.length === 11 && (
            <View style={styles.completeBadge}>
              <Text style={styles.completeText}>✓ Completo</Text>
            </View>
          )}
        </View>
      )}

      {/* Players list */}
      <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
        {positionSections.map(pos => (
          <View key={pos}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: POSITION_COLORS[pos] }]} />
              <Text style={[styles.sectionTitle, { color: POSITION_COLORS[pos] }]}>
                {POSITION_LABELS[pos]}
              </Text>
            </View>
            {groupedPlayers[pos].map(player => {
              const isSelected = currentLineup.includes(player.id);
              const isDisabledAdd = !isSelected && currentLineup.length >= 11;
              return (
                <TouchableOpacity
                  key={player.id}
                  style={[
                    styles.playerRow,
                    isSelected && styles.playerRowSelected,
                    isDisabledAdd && styles.playerRowDisabled,
                  ]}
                  onPress={() => togglePlayer(player.id)}
                  disabled={hasLessThan11 || isDisabledAdd}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={[
                    styles.posBadge,
                    { backgroundColor: `${POSITION_COLORS[pos]}22`, borderColor: POSITION_COLORS[pos] }
                  ]}>
                    <Text style={[styles.posBadgeText, { color: POSITION_COLORS[pos] }]}>{pos}</Text>
                  </View>
                  <Text style={[styles.dorsal, isSelected && styles.dorsalSelected]}>
                    {player.number}
                  </Text>
                  <Text style={[
                    styles.playerName,
                    isSelected && styles.playerNameSelected,
                    isDisabledAdd && styles.playerNameDisabled,
                  ]}>
                    {player.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.starterBadge}>
                      <Text style={styles.starterText}>TITULAR</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Start button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartMatch} activeOpacity={0.8}>
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Comenzar Partido</Text>
            <Text style={styles.startButtonIcon}>⚽</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Formation Modal */}
      <Modal
        visible={showFormationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFormationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowFormationModal(false)}
          activeOpacity={1}
        >
          <View style={styles.formationModal}>
            <Text style={styles.formationModalTitle}>Selecciona una formación</Text>
            {FORMATIONS.map(f => {
              const active = currentFormation === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.formationOption, active && styles.formationOptionActive]}
                  onPress={() => { setCurrentFormation(f); setShowFormationModal(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.formationOptionText, active && styles.formationOptionTextActive]}>
                    {f}
                  </Text>
                  {active && <Text style={styles.formationOptionCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 4,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabText: {
    ...typography.small,
    color: colors.textMuted,
    fontWeight: '600',
    flex: 1,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  tabBadge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.round,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBadgeFull: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tabBadgeTextFull: {
    color: colors.primary,
  },
  formationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formationLabel: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formationPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  formationValue: {
    ...typography.heading,
    color: colors.primary,
    fontWeight: '700',
  },
  formationArrow: {
    color: colors.textMuted,
    fontSize: 16,
  },
  warningBanner: {
    backgroundColor: 'rgba(255,214,0,0.1)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  warningText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  counterText: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  counterNum: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  counterNumFull: {
    color: colors.primary,
  },
  completeBadge: {
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  completeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  playersList: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  playerRowSelected: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  playerRowDisabled: {
    opacity: 0.4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#000',
    fontSize: 13,
    fontWeight: '900',
  },
  posBadge: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 32,
    alignItems: 'center',
  },
  posBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dorsal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    minWidth: 22,
    textAlign: 'center',
  },
  dorsalSelected: {
    color: colors.primary,
  },
  playerName: {
    flex: 1,
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  playerNameSelected: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  playerNameDisabled: {
    color: colors.textMuted,
  },
  starterBadge: {
    backgroundColor: colors.primaryGlow,
    borderRadius: borderRadius.round,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  starterText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footer: {
    paddingTop: spacing.md,
  },
  startButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.glow,
  },
  startButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  startButtonText: {
    ...typography.heading,
    color: '#000',
    fontWeight: '800',
  },
  startButtonIcon: {
    fontSize: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formationModal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: 260,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.large,
  },
  formationModalTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  formationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formationOptionActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  formationOptionText: {
    ...typography.subtitle,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  formationOptionTextActive: {
    color: colors.primary,
  },
  formationOptionCheck: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
});

export default LineupScreen;
