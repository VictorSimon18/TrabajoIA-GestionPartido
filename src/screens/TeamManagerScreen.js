import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../styles/theme';
import { getTeams, deleteTeam } from '../storage/asyncStorage';
import TeamCard from '../components/TeamCard';

const TeamManagerScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [teams, setTeams] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTeams();
    }, [])
  );

  const loadTeams = async () => {
    const loadedTeams = await getTeams();
    setTeams(loadedTeams);
  };

  const handleDeleteTeam = (teamId) => {
    const team = teams.find(t => t.id === teamId);

    // No permitir eliminar equipos por defecto
    if (teamId === 'barcelona' || teamId === 'madrid') {
      Alert.alert('Error', 'No puedes eliminar los equipos predeterminados');
      return;
    }

    Alert.alert(
      'Eliminar Equipo',
      `¿Estás seguro de que quieres eliminar a ${team?.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteTeam(teamId);
            loadTeams();
          },
        },
      ]
    );
  };

  const handleTeamPress = (team) => {
    navigation.navigate('CreateTeam', { team, isEditing: true });
  };

  return (
    <LinearGradient colors={gradients.primary} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gestor de Equipos</Text>
        <Text style={styles.subtitle}>{teams.length} equipos registrados</Text>
      </View>

      <ScrollView
        style={styles.teamsList}
        contentContainerStyle={styles.teamsListContent}
        showsVerticalScrollIndicator={false}
      >
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onPress={() => handleTeamPress(team)}
            onDelete={team.id !== 'barcelona' && team.id !== 'madrid' ? handleDeleteTeam : null}
          />
        ))}

        {teams.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No hay equipos</Text>
            <Text style={styles.emptySubtext}>Crea tu primer equipo</Text>
          </View>
        )}
      </ScrollView>

      {/* Botón flotante para crear equipo */}
      <TouchableOpacity
        style={[styles.fab, { bottom: spacing.xl + insets.bottom }]}
        onPress={() => navigation.navigate('CreateTeam', { isEditing: false })}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
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
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  teamsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  teamsListContent: {
    paddingBottom: spacing.xxl * 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  fabText: {
    fontSize: 36,
    color: colors.textDark,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default TeamManagerScreen;
