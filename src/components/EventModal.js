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
}) => {
  const [showAssistPicker, setShowAssistPicker] = useState(false);
  const [showSubstitutionPicker, setShowSubstitutionPicker] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);

  if (!player) return null;

  const positionData = positions[player.position] || { name: player.position, color: '#5A6384' };

  const handleEventPress = (eventType) => {
    if (eventType === 'goal') {
      setPendingEvent({ type: 'goal' });
      setShowAssistPicker(true);
    } else if (eventType === 'substitution') {
      setPendingEvent({ type: 'substitution' });
      setShowSubstitutionPicker(true);
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
    { type: 'yellowCard', icon: '🟨', label: 'Amarilla', gradient: ['#FFD600', '#FFAB00'] },
    { type: 'redCard', icon: '🟥', label: 'Roja', gradient: ['#FF1744', '#D50000'] },
    { type: 'substitution', icon: '🔄', label: 'Cambio', gradient: ['#D500F9', '#AA00FF'] },
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
          {!showAssistPicker && !showSubstitutionPicker && (
            <View style={styles.eventsContainer}>
              <Text style={styles.eventsTitle}>Registrar evento</Text>

              <View style={styles.eventsGrid}>
                {eventButtons.map(({ type, icon, label, gradient }) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.eventButtonWrapper}
                    onPress={() => handleEventPress(type)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.eventButton}
                    >
                      <Text style={styles.eventIcon}>{icon}</Text>
                      <Text style={styles.eventLabel}>{label}</Text>
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
  eventButton: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  eventIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  eventLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
