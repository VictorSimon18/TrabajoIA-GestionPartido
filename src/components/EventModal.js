import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, borderRadius, spacing, typography } from '../styles/theme';
import { eventTypes, positions } from '../data/defaultTeams';

const EventModal = ({
  visible,
  player,
  teamPlayers = [],
  minute,
  onClose,
  onEventSelect,
  benchPlayers = [],
  events = [],
}) => {
  const [showAssistPicker, setShowAssistPicker] = useState(false);
  const [showSubstitutionPicker, setShowSubstitutionPicker] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);

  if (!player) return null;

  const positionData = positions[player.position] || { name: player.position, color: '#5A6384' };

  // Calculate card status for this player from match events
  const playerEvents = events.filter(e => e.playerId === player.id);
  const yellowCount = playerEvents.filter(e => e.type === 'yellowCard').length;
  const redCount = playerEvents.filter(e => e.type === 'redCard').length;
  const isExpelled = redCount > 0 || yellowCount >= 2;

  const handleEventPress = (eventType) => {
    if (eventType === 'goal') {
      setPendingEvent({ type: 'goal' });
      setShowAssistPicker(true);
    } else if (eventType === 'substitution') {
      setPendingEvent({ type: 'substitution' });
      setShowSubstitutionPicker(true);
    } else if (eventType === 'yellowCard') {
      if (yellowCount >= 1) {
        // Second yellow → register yellow + auto red (double yellow)
        onEventSelect({
          type: 'yellowCard',
          playerId: player.id,
          minute,
        });
        onEventSelect({
          type: 'redCard',
          playerId: player.id,
          minute,
          isDoubleYellow: true,
        });
        handleClose();
      } else {
        onEventSelect({
          type: 'yellowCard',
          playerId: player.id,
          minute,
        });
        handleClose();
      }
    } else {
      onEventSelect({
        type: eventType,
        playerId: player.id,
        minute,
      });
      handleClose();
    }
  };

  const handleAssistSelect = (assistPlayerId) => {
    onEventSelect({
      type: 'goal',
      playerId: player.id,
      minute,
      relatedPlayerId: assistPlayerId,
    });

    if (assistPlayerId) {
      onEventSelect({
        type: 'assist',
        playerId: assistPlayerId,
        minute,
        relatedPlayerId: player.id,
      });
    }

    setShowAssistPicker(false);
    handleClose();
  };

  const handleSubstitutionSelect = (inPlayerId) => {
    onEventSelect({
      type: 'substitution',
      playerId: player.id,
      minute,
      relatedPlayerId: inPlayerId,
    });
    setShowSubstitutionPicker(false);
    handleClose();
  };

  const handleClose = () => {
    setShowAssistPicker(false);
    setShowSubstitutionPicker(false);
    setPendingEvent(null);
    onClose();
  };

  const otherPlayers = teamPlayers.filter(p => p.id !== player.id);

  const eventButtons = [
    { type: 'goal', icon: '⚽', label: 'Gol', gradient: ['#00E676', '#00C853'] },
    { type: 'yellowCard', icon: '🟨', label: 'Amarilla', gradient: ['#FFD600', '#FFAB00'], disabled: yellowCount >= 2 },
    { type: 'redCard', icon: '🟥', label: 'Roja', gradient: ['#FF1744', '#D50000'], disabled: redCount > 0 },
    { type: 'substitution', icon: '🔄', label: 'Cambio', gradient: ['#D500F9', '#AA00FF'] },
    { type: 'foul', icon: '🤚', label: 'Falta', gradient: ['#FF6D00', '#E65100'] },
    { type: 'corner', icon: '🏁', label: 'Córner', gradient: ['#00BFA5', '#00897B'] },
    { type: 'throwIn', icon: '📍', label: 'Saque', gradient: ['#5C6BC0', '#3949AB'] },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContainer} onPress={e => e.stopPropagation()}>
          {/* Player header */}
          <View style={styles.header}>
            <View style={[styles.numberBadge, { backgroundColor: positionData.color }]}>
              <Text style={styles.numberText}>{player.number}</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <View style={styles.positionRow}>
                <View style={[styles.positionDot, { backgroundColor: positionData.color }]} />
                <Text style={styles.playerPosition}>{positionData.name}</Text>
              </View>
            </View>
            <View style={styles.minuteBadge}>
              <Text style={styles.minuteText}>{minute}'</Text>
            </View>
          </View>

          {/* Expelled message */}
          {isExpelled && !showAssistPicker && !showSubstitutionPicker && (
            <View style={styles.expelledContainer}>
              <Text style={styles.expelledIcon}>🟥</Text>
              <Text style={styles.expelledText}>Jugador expulsado</Text>
              <Text style={styles.expelledSubtext}>No puede registrar más eventos</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Assist picker */}
          {showAssistPicker && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>Selecciona asistente</Text>
              <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => handleAssistSelect(null)}
                >
                  <View style={styles.noAssistBadge}>
                    <Text style={styles.noAssistText}>—</Text>
                  </View>
                  <Text style={styles.pickerItemText}>Sin asistencia</Text>
                </TouchableOpacity>
                {otherPlayers.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.pickerItem}
                    onPress={() => handleAssistSelect(p.id)}
                  >
                    <View style={[styles.pickerNumberBadge, { backgroundColor: (positions[p.position] || {}).color || colors.surfaceLight }]}>
                      <Text style={styles.pickerNumber}>{p.number}</Text>
                    </View>
                    <Text style={styles.pickerItemText}>{p.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAssistPicker(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Substitution picker */}
          {showSubstitutionPicker && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>Jugador que entra</Text>
              <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                {benchPlayers.length === 0 ? (
                  <Text style={styles.noBenchText}>No hay jugadores en el banquillo</Text>
                ) : (
                  benchPlayers.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.pickerItem}
                      onPress={() => handleSubstitutionSelect(p.id)}
                    >
                      <View style={[styles.pickerNumberBadge, { backgroundColor: (positions[p.position] || {}).color || colors.surfaceLight }]}>
                        <Text style={styles.pickerNumber}>{p.number}</Text>
                      </View>
                      <Text style={styles.pickerItemText}>{p.name}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowSubstitutionPicker(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Event buttons grid */}
          {!isExpelled && !showAssistPicker && !showSubstitutionPicker && (
            <View style={styles.eventsContainer}>
              <Text style={styles.eventsTitle}>Registrar evento</Text>

              {/* Card warning */}
              {yellowCount === 1 && (
                <View style={styles.warningBadge}>
                  <Text style={styles.warningText}>⚠️ Tiene 1 amarilla — la siguiente será doble amarilla (roja)</Text>
                </View>
              )}

              <View style={styles.eventsGrid}>
                {eventButtons.map(({ type, icon, label, gradient, disabled }) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.eventButtonWrapper, disabled && styles.eventButtonDisabled]}
                    onPress={() => !disabled && handleEventPress(type)}
                    activeOpacity={disabled ? 1 : 0.7}
                  >
                    <LinearGradient
                      colors={disabled ? [colors.surfaceLight, colors.surfaceLight] : gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.eventButton}
                    >
                      <Text style={[styles.eventIcon, disabled && styles.eventIconDisabled]}>{icon}</Text>
                      <Text style={[styles.eventLabel, disabled && styles.eventLabelDisabled]}>{label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xxl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  numberBadge: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  playerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  playerName: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  positionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  playerPosition: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  minuteBadge: {
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  minuteText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  expelledContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  expelledIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  expelledText: {
    ...typography.subtitle,
    color: colors.danger,
    fontWeight: '700',
  },
  expelledSubtext: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  warningBadge: {
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 0, 0.3)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  warningText: {
    color: '#FFD600',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  eventsContainer: {
    padding: spacing.lg,
  },
  eventsTitle: {
    ...typography.heading,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 1,
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  eventButtonWrapper: {
    width: '48%',
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  eventButtonDisabled: {
    opacity: 0.4,
  },
  eventButton: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  eventIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  eventIconDisabled: {
    opacity: 0.5,
  },
  eventLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  eventLabelDisabled: {
    color: colors.textMuted,
  },
  closeButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  pickerContainer: {
    padding: spacing.lg,
  },
  pickerTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pickerList: {
    maxHeight: 300,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  pickerNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  noAssistBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  noAssistText: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  pickerItemText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  noBenchText: {
    textAlign: 'center',
    color: colors.textMuted,
    padding: spacing.lg,
    fontSize: 14,
  },
  cancelButton: {
    marginTop: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EventModal;
