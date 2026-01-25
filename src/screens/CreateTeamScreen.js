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
  const [players, setPlayers] = useState([]);

  // Estado para nuevo jugador
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState('DEF');

  useEffect(() => {
    if (isEditing && existingTeam) {
      setTeamName(existingTeam.name);
      setTeamColor(existingTeam.color || TEAM_COLORS[0]);
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
      stats: {
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        matchesPlayed: 0,
      },
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

  // Ordenar jugadores por posición
  const sortedPlayers = [...players].sort((a, b) => {
    const order = { POR: 1, DEF: 2, MED: 3, DEL: 4 };
    return (order[a.position] || 5) - (order[b.position] || 5);
  });

  return (
    <LinearGradient colors={gradients.primary} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
              <Text style={styles.backButtonText}>‹ Volver</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{isEditing ? 'Editar Equipo' : 'Crear Equipo'}</Text>
          </View>

          {/* Nombre del equipo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nombre del Equipo</Text>
            <TextInput
              style={styles.input}
              value={teamName}
              onChangeText={setTeamName}
              placeholder="Ej: Club Deportivo..."
              placeholderTextColor={colors.textMuted}
              maxLength={30}
            />
          </View>

          {/* Selector de color */}
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
                />
              ))}
            </View>
          </View>

          {/* Añadir jugador */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Añadir Jugador ({players.length}/25)
            </Text>

            <View style={styles.addPlayerForm}>
              <TextInput
                style={[styles.input, styles.nameInput]}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                placeholder="Nombre"
                placeholderTextColor={colors.textMuted}
                maxLength={20}
              />

              <TextInput
                style={[styles.input, styles.numberInput]}
                value={newPlayerNumber}
                onChangeText={setNewPlayerNumber}
                placeholder="#"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            <View style={styles.positionSelector}>
              {POSITIONS.map((pos) => (
                <TouchableOpacity
                  key={pos}
                  style={[
                    styles.positionButton,
                    { backgroundColor: positions[pos].color },
                    newPlayerPosition === pos && styles.positionSelected,
                  ]}
                  onPress={() => setNewPlayerPosition(pos)}
                >
                  <Text style={styles.positionButtonText}>{positions[pos].name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddPlayer}
              disabled={players.length >= 25}
            >
              <Text style={styles.addButtonText}>+ Añadir Jugador</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de jugadores */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Plantilla {players.length >= 11 ? '✓' : `(mínimo 11)`}
            </Text>

            {sortedPlayers.map((player) => (
              <TouchableOpacity
                key={player.id}
                onLongPress={() => handleRemovePlayer(player.id)}
              >
                <PlayerCard player={player} teamColor={teamColor} />
              </TouchableOpacity>
            ))}

            {players.length === 0 && (
              <Text style={styles.emptyText}>
                Añade jugadores a tu equipo
              </Text>
            )}

            {players.length > 0 && (
              <Text style={styles.hintText}>
                Mantén pulsado un jugador para eliminarlo
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Botón guardar */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            players.length < 11 && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveTeam}
          disabled={players.length < 11}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Guardar Cambios' : 'Crear Equipo'}
          </Text>
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
    color: colors.textPrimary,
    fontSize: 18,
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
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textDark,
    ...shadows.small,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: colors.textPrimary,
    transform: [{ scale: 1.1 }],
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
    width: 60,
    textAlign: 'center',
  },
  positionSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  positionButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    opacity: 0.7,
  },
  positionSelected: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
    ...shadows.small,
  },
  positionButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.small,
  },
  addButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    paddingVertical: spacing.xl,
  },
  hintText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.accent,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.large,
  },
  saveButtonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreateTeamScreen;
