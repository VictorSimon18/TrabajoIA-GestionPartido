import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultTeams } from '../data/defaultTeams';

const STORAGE_KEYS = {
  TEAMS: '@futmanager_teams',
  MATCHES: '@futmanager_matches',
  CURRENT_MATCH: '@futmanager_current_match',
};

// ============ EQUIPOS ============

// Inicializar equipos por defecto si no existen
export const initializeTeams = async () => {
  try {
    const existingTeams = await AsyncStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!existingTeams) {
      await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(defaultTeams));
      return defaultTeams;
    }
    return JSON.parse(existingTeams);
  } catch (error) {
    console.error('Error initializing teams:', error);
    return defaultTeams;
  }
};

// Obtener todos los equipos
export const getTeams = async () => {
  try {
    const teams = await AsyncStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!teams) {
      return await initializeTeams();
    }
    return JSON.parse(teams);
  } catch (error) {
    console.error('Error getting teams:', error);
    return [];
  }
};

// Obtener un equipo por ID
export const getTeamById = async (teamId) => {
  try {
    const teams = await getTeams();
    return teams.find(team => team.id === teamId) || null;
  } catch (error) {
    console.error('Error getting team by id:', error);
    return null;
  }
};

// Guardar un nuevo equipo
export const saveTeam = async (team) => {
  try {
    const teams = await getTeams();
    const existingIndex = teams.findIndex(t => t.id === team.id);

    if (existingIndex >= 0) {
      teams[existingIndex] = team;
    } else {
      teams.push(team);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    return true;
  } catch (error) {
    console.error('Error saving team:', error);
    return false;
  }
};

// Eliminar un equipo
export const deleteTeam = async (teamId) => {
  try {
    const teams = await getTeams();
    const filteredTeams = teams.filter(team => team.id !== teamId);
    await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(filteredTeams));
    return true;
  } catch (error) {
    console.error('Error deleting team:', error);
    return false;
  }
};

// Actualizar estadísticas de un jugador
export const updatePlayerStats = async (teamId, playerId, statsUpdate) => {
  try {
    const teams = await getTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) return false;

    const playerIndex = teams[teamIndex].players.findIndex(p => p.id === playerId);

    if (playerIndex === -1) return false;

    const player = teams[teamIndex].players[playerIndex];
    player.stats = {
      ...player.stats,
      ...statsUpdate,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    return true;
  } catch (error) {
    console.error('Error updating player stats:', error);
    return false;
  }
};

// ============ PARTIDOS ============

// Obtener historial de partidos
export const getMatches = async () => {
  try {
    const matches = await AsyncStorage.getItem(STORAGE_KEYS.MATCHES);
    return matches ? JSON.parse(matches) : [];
  } catch (error) {
    console.error('Error getting matches:', error);
    return [];
  }
};

// Guardar un partido finalizado
export const saveMatch = async (match) => {
  try {
    const matches = await getMatches();
    matches.push(match);
    await AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    return true;
  } catch (error) {
    console.error('Error saving match:', error);
    return false;
  }
};

// Guardar estado del partido actual (para recuperar si se cierra la app)
export const saveCurrentMatch = async (matchState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_MATCH, JSON.stringify(matchState));
    return true;
  } catch (error) {
    console.error('Error saving current match:', error);
    return false;
  }
};

// Obtener partido actual guardado
export const getCurrentMatch = async () => {
  try {
    const match = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_MATCH);
    return match ? JSON.parse(match) : null;
  } catch (error) {
    console.error('Error getting current match:', error);
    return null;
  }
};

// Limpiar partido actual
export const clearCurrentMatch = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_MATCH);
    return true;
  } catch (error) {
    console.error('Error clearing current match:', error);
    return false;
  }
};

// ============ ESTADÍSTICAS ============

// Obtener estadísticas de un equipo
export const getTeamStats = async (teamId) => {
  try {
    const matches = await getMatches();
    const team = await getTeamById(teamId);

    if (!team) return null;

    const teamMatches = matches.filter(
      m => m.homeTeam.id === teamId || m.awayTeam.id === teamId
    );

    let wins = 0, draws = 0, losses = 0;
    let goalsFor = 0, goalsAgainst = 0;
    let fouls = 0, corners = 0, throwIns = 0;

    teamMatches.forEach(match => {
      const isHome = match.homeTeam.id === teamId;
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;

      goalsFor += teamScore;
      goalsAgainst += opponentScore;

      if (teamScore > opponentScore) wins++;
      else if (teamScore < opponentScore) losses++;
      else draws++;

      const teamEvents = (match.events || []).filter(e => e.teamId === teamId);
      fouls += teamEvents.filter(e => e.type === 'foul').length;
      corners += teamEvents.filter(e => e.type === 'corner').length;
      throwIns += teamEvents.filter(e => e.type === 'throwIn').length;
    });

    return {
      team,
      matchesPlayed: teamMatches.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: (wins * 3) + draws,
      fouls,
      corners,
      throwIns,
    };
  } catch (error) {
    console.error('Error getting team stats:', error);
    return null;
  }
};

// Resetear todos los datos (para desarrollo)
export const resetAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TEAMS,
      STORAGE_KEYS.MATCHES,
      STORAGE_KEYS.CURRENT_MATCH,
    ]);
    await initializeTeams();
    return true;
  } catch (error) {
    console.error('Error resetting data:', error);
    return false;
  }
};

export default {
  initializeTeams,
  getTeams,
  getTeamById,
  saveTeam,
  deleteTeam,
  updatePlayerStats,
  getMatches,
  saveMatch,
  saveCurrentMatch,
  getCurrentMatch,
  clearCurrentMatch,
  getTeamStats,
  resetAllData,
};
