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
    <LinearGradient colors={gradients.background} style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gestor de Equipos</Text>
        <View style={styles.counterRow}>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{teams.length}</Text>
          </View>
          <Text style={styles.subtitle}>equipos registrados</Text>
        </View>
      </View>

      {/* Team list */}
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
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>👥</Text>
            </View>
            <Text style={styles.emptyText}>No hay equipos</Text>
            <Text style={styles.emptySubtext}>Crea tu primer equipo</Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: spacing.xl + insets.bottom }]}
        onPress={() => navigation.navigate('CreateTeam', { isEditing: false })}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={gradients.primary}
          style={styles.fabGradient}
        >
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
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
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  counterBadge: {
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  counterText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
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
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyIcon: {
    fontSize: 36,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    ...shadows.glow,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -2,
  },
});

export default TeamManagerScreen;
