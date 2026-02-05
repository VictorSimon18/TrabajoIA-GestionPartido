import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../styles/theme';
import { saveTeam } from '../storage/asyncStorage';
import { positions } from '../data/defaultTeams';
import PlayerCard from '../components/PlayerCard';
import TeamBadge from '../components/TeamBadge';

const TEAM_COLORS = [
  '#D32F2F', '#C2185B', '#7B1FA2', '#512DA8',
  '#303F9F', '#1976D2', '#0288D1', '#0097A7',
  '#00796B', '#388E3C', '#689F38', '#AFB42B',
  '#FBC02D', '#FFA000', '#F57C00', '#E64A19',
  '#5D4037', '#616161', '#455A64', '#000000',
];

const POSITIONS = ['POR', 'DEF', 'MED', 'DEL'];

const CreateTeamScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { team: existingTeam, isEditing } = route.params || {};

  const [teamName, setTeamName] = useState('');
  const [teamColor, setTeamColor] = useState(TEAM_COLORS[0]);
  const [logoUrl, setLogoUrl] = useState('');
  const [players, setPlayers] = useState([]);

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState('DEF');

  useEffect(() => {
    if (isEditing && existingTeam) {
      setTeamName(existingTeam.name);
      setTeamColor(existingTeam.color || TEAM_COLORS[0]);
      setLogoUrl(existingTeam.logoUrl || '');
      setPlayers(existingTeam.players || []);
    }
  }, [existingTeam, isEditing]);

  const generatePlayerId = () => `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      Alert.alert('Error', 'Introduce el nombre del jugador');
      return;
    }

    const number = parseInt(newPlayerNumber, 10);
    if (isNaN(number) || number < 1 || number > 99) {
      Alert.alert('Error', 'El dorsal debe ser un número entre 1 y 99');
      return;
    }

    if (players.some(p => p.number === number)) {
      Alert.alert('Error', 'Ya existe un jugador con ese dorsal');
      return;
    }

    const newPlayer = {
      id: generatePlayerId(),
      name: newPlayerName.trim(),
      number,
      position: newPlayerPosition,
      stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 0 },
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    setNewPlayerNumber('');
  };

  const handleRemovePlayer = (playerId) => {
    Alert.alert(
      'Eliminar Jugador',
      '¿Estás seguro de eliminar este jugador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setPlayers(players.filter(p => p.id !== playerId)),
        },
      ]
    );
  };

  const handleSaveTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Introduce el nombre del equipo');
      return;
    }

    if (players.length < 11) {
      Alert.alert('Error', `Necesitas al menos 11 jugadores. Tienes ${players.length}.`);
      return;
    }

    const team = {
      id: isEditing && existingTeam ? existingTeam.id : `team-${Date.now()}`,
      name: teamName.trim(),
      color: teamColor,
      logoUrl: logoUrl.trim() || undefined,
      players,
    };

    const success = await saveTeam(team);

    if (success) {
      Alert.alert('Éxito', isEditing ? 'Equipo actualizado' : 'Equipo creado', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'No se pudo guardar el equipo');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const order = { POR: 1, DEF: 2, MED: 3, DEL: 4 };
    return (order[a.position] || 5) - (order[b.position] || 5);
  });

  return (
    <LinearGradient colors={gradients.background} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{isEditing ? 'Editar Equipo' : 'Crear Equipo'}</Text>
          </View>

          {/* Team name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nombre del Equipo</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={teamName}
                onChangeText={setTeamName}
                placeholder="Ej: Club Deportivo..."
                placeholderTextColor={colors.textMuted}
                maxLength={30}
              />
            </View>
          </View>

          {/* Color picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color del Equipo</Text>
            <View style={styles.colorGrid}>
              {TEAM_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    teamColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setTeamColor(color)}
                  activeOpacity={0.7}
                >
                  {teamColor === color && (
                    <Text style={styles.colorCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Team badge URL */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escudo del Equipo</Text>
            <View style={styles.badgeRow}>
              <TeamBadge
                team={{ name: teamName || 'EQ', color: teamColor, logoUrl: logoUrl.trim() || undefined }}
                size={64}
              />
              <View style={styles.badgeInputContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={logoUrl}
                    onChangeText={setLogoUrl}
                    placeholder="URL de imagen del escudo"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                  />
                </View>
                {logoUrl.trim() !== '' && (
                  <TouchableOpacity
                    style={styles.clearUrlButton}
                    onPress={() => setLogoUrl('')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearUrlText}>Limpiar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Add player form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Añadir Jugador
              <Text style={styles.playerCountText}> ({players.length}/25)</Text>
            </Text>

            <View style={styles.addPlayerForm}>
              <View style={[styles.inputContainer, styles.nameInput]}>
                <TextInput
                  style={styles.input}
                  value={newPlayerName}
                  onChangeText={setNewPlayerName}
                  placeholder="Nombre"
                  placeholderTextColor={colors.textMuted}
                  maxLength={20}
                />
              </View>

              <View style={[styles.inputContainer, styles.numberInput]}>
                <TextInput
                  style={[styles.input, { textAlign: 'center' }]}
                  value={newPlayerNumber}
                  onChangeText={setNewPlayerNumber}
                  placeholder="#"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.positionSelector}>
              {POSITIONS.map((pos) => {
                const posData = positions[pos];
                const isActive = newPlayerPosition === pos;
                return (
                  <TouchableOpacity
                    key={pos}
                    style={[
                      styles.positionButton,
                      isActive && { backgroundColor: posData.color, borderColor: posData.color },
                    ]}
                    onPress={() => setNewPlayerPosition(pos)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.positionButtonText,
                      isActive && { color: '#FFFFFF' }
                    ]}>{posData.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.addButton, players.length >= 25 && styles.addButtonDisabled]}
              onPress={handleAddPlayer}
              disabled={players.length >= 25}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={players.length >= 25 ? [colors.surfaceLight, colors.surfaceLight] : ['#448AFF', '#2962FF']}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>+ Añadir Jugador</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Player list */}
          <View style={styles.section}>
            <View style={styles.plantillaHeader}>
              <Text style={styles.sectionTitle}>Plantilla</Text>
              {players.length >= 11 ? (
                <View style={styles.validBadge}>
                  <Text style={styles.validText}>✓ Completa</Text>
                </View>
              ) : (
                <View style={styles.invalidBadge}>
                  <Text style={styles.invalidText}>Mín. 11</Text>
                </View>
              )}
            </View>

            {sortedPlayers.map((player) => (
              <TouchableOpacity
                key={player.id}
                onLongPress={() => handleRemovePlayer(player.id)}
              >
                <PlayerCard player={player} teamColor={teamColor} />
              </TouchableOpacity>
            ))}

            {players.length === 0 && (
              <View style={styles.emptyPlayers}>
                <Text style={styles.emptyText}>Añade jugadores a tu equipo</Text>
              </View>
            )}

            {players.length > 0 && (
              <Text style={styles.hintText}>
                Mantén pulsado un jugador para eliminarlo
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveButton, players.length < 11 && styles.saveButtonDisabled]}
          onPress={handleSaveTeam}
          disabled={players.length < 11}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={players.length < 11 ? [colors.surfaceLight, colors.surfaceLight] : gradients.primary}
            style={styles.saveButtonGradient}
          >
            <Text style={[
              styles.saveButtonText,
              players.length < 11 && { color: colors.textMuted }
            ]}>
              {isEditing ? 'Guardar Cambios' : 'Crear Equipo'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  playerCountText: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorOption: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  colorCheck: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badgeInputContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  clearUrlButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearUrlText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 12,
  },
  addPlayerForm: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  nameInput: {
    flex: 1,
  },
  numberInput: {
    width: 64,
  },
  positionSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  positionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  positionButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  addButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonGradient: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  plantillaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  validBadge: {
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  validText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  invalidBadge: {
    backgroundColor: colors.dangerGlow,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  invalidText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 12,
  },
  emptyPlayers: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  hintText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.md,
  },
  saveButton: {
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.glow,
  },
  saveButtonDisabled: {
    ...shadows.small,
  },
  saveButtonGradient: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
});

export default CreateTeamScreen;
