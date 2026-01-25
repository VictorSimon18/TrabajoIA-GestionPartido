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

  const positionData = positions[player.position] || { name: player.position, color: '#757575' };

  const handleEventPress = (eventType) => {
    if (eventType === 'goal') {
      // Mostrar selector de asistencia
      setPendingEvent({ type: 'goal' });
      setShowAssistPicker(true);
    } else if (eventType === 'substitution') {
      // Mostrar selector de jugador que entra
      setPendingEvent({ type: 'substitution' });
      setShowSubstitutionPicker(true);
    } else {
      // Evento directo
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
      playerId: player.id, // Sale
      minute,
      relatedPlayerId: inPlayerId, // Entra
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContainer} onPress={e => e.stopPropagation()}>
          {/* Cabecera del jugador */}
          <View style={styles.header}>
            <View style={[styles.numberBadge, { backgroundColor: positionData.color }]}>
              <Text style={styles.numberText}>{player.number}</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerPosition}>{positionData.name}</Text>
            </View>
            <View style={styles.minuteBadge}>
              <Text style={styles.minuteText}>{minute}'</Text>
            </View>
          </View>

          {/* Selector de asistencia */}
          {showAssistPicker && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>¿Quién asistió?</Text>
              <ScrollView style={styles.pickerList}>
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => handleAssistSelect(null)}
                >
                  <Text style={styles.pickerItemText}>Sin asistencia</Text>
                </TouchableOpacity>
                {otherPlayers.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.pickerItem}
                    onPress={() => handleAssistSelect(p.id)}
                  >
                    <Text style={styles.pickerNumber}>{p.number}</Text>
                    <Text style={styles.pickerItemText}>{p.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAssistPicker(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Selector de sustitución */}
          {showSubstitutionPicker && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerTitle}>¿Quién entra?</Text>
              <ScrollView style={styles.pickerList}>
                {benchPlayers.length === 0 ? (
                  <Text style={styles.noBenchText}>No hay jugadores en el banquillo</Text>
                ) : (
                  benchPlayers.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.pickerItem}
                      onPress={() => handleSubstitutionSelect(p.id)}
                    >
                      <Text style={styles.pickerNumber}>{p.number}</Text>
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

          {/* Botones de eventos */}
          {!showAssistPicker && !showSubstitutionPicker && (
            <View style={styles.eventsContainer}>
              <Text style={styles.eventsTitle}>Registrar evento</Text>

              <View style={styles.eventsGrid}>
                <TouchableOpacity
                  style={[styles.eventButton, { backgroundColor: eventTypes.goal.color }]}
                  onPress={() => handleEventPress('goal')}
                >
                  <Text style={styles.eventIcon}>⚽</Text>
                  <Text style={styles.eventLabel}>Gol</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.eventButton, { backgroundColor: eventTypes.yellowCard.color }]}
                  onPress={() => handleEventPress('yellowCard')}
                >
                  <Text style={styles.eventIcon}>🟨</Text>
                  <Text style={styles.eventLabel}>Amarilla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.eventButton, { backgroundColor: eventTypes.redCard.color }]}
                  onPress={() => handleEventPress('redCard')}
                >
                  <Text style={styles.eventIcon}>🟥</Text>
                  <Text style={styles.eventLabel}>Roja</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.eventButton, { backgroundColor: eventTypes.substitution.color }]}
                  onPress={() => handleEventPress('substitution')}
                >
                  <Text style={styles.eventIcon}>🔄</Text>
                  <Text style={styles.eventLabel}>Cambio</Text>
                </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  numberBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  playerName: {
    ...typography.subtitle,
    color: colors.textDark,
  },
  playerPosition: {
    ...typography.body,
    color: colors.textMuted,
  },
  minuteBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  minuteText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  eventsContainer: {
    padding: spacing.lg,
  },
  eventsTitle: {
    ...typography.heading,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  eventButton: {
    width: '47%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  eventIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  eventLabel: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  pickerContainer: {
    padding: spacing.lg,
  },
  pickerTitle: {
    ...typography.heading,
    color: colors.textDark,
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerNumber: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.textDark,
  },
  noBenchText: {
    textAlign: 'center',
    color: colors.textMuted,
    padding: spacing.lg,
  },
  cancelButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
  },
  cancelButtonText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
});

export default EventModal;
