// Equipos predefinidos: FC Barcelona y Real Madrid
export const defaultTeams = [
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    color: '#A50044', // Azulgrana
    players: [
      { id: 'barca-1', name: 'Ter Stegen', number: 1, position: 'POR', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-2', name: 'Koundé', number: 23, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-3', name: 'Araujo', number: 4, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-4', name: 'Christensen', number: 15, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-5', name: 'Baldé', number: 3, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-6', name: 'Gavi', number: 6, position: 'MED', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-7', name: 'Pedri', number: 8, position: 'MED', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-8', name: 'De Jong', number: 21, position: 'MED', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-9', name: 'Yamal', number: 19, position: 'DEL', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-10', name: 'Lewandowski', number: 9, position: 'DEL', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-11', name: 'Raphinha', number: 11, position: 'DEL', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-12', name: 'Iñaki Peña', number: 13, position: 'POR', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-13', name: 'Eric García', number: 24, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-14', name: 'Fermín', number: 16, position: 'MED', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'barca-15', name: 'Ferrán Torres', number: 7, position: 'DEL', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
    ],
  },
  {
    id: 'madrid',
    name: 'Real Madrid',
    color: '#FFFFFF', // Blanco
    players: [
      { id: 'rm-1', name: 'Courtois', number: 1, position: 'POR', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-2', name: 'Carvajal', number: 2, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-3', name: 'Militão', number: 3, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-4', name: 'Rüdiger', number: 22, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-5', name: 'Mendy', number: 23, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-6', name: 'Tchouaméni', number: 18, position: 'MED', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-7', name: 'Valverde', number: 15, position: 'MED', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-8', name: 'Bellingham', number: 5, position: 'MED', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-9', name: 'Vinícius Jr', number: 7, position: 'DEL', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-10', name: 'Mbappé', number: 9, position: 'DEL', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-11', name: 'Rodrygo', number: 11, position: 'DEL', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-12', name: 'Lunin', number: 13, position: 'POR', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-13', name: 'Nacho', number: 6, position: 'DEF', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-14', name: 'Camavinga', number: 12, position: 'MED', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
      { id: 'rm-15', name: 'Joselu', number: 14, position: 'DEL', stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, fouls: 0, corners: 0, throwIns: 0, matchesPlayed: 0 } },
    ],
  },
];

export const positions = {
  POR: { name: 'Portero', color: '#FF9100' },
  DEF: { name: 'Defensa', color: '#448AFF' },
  MED: { name: 'Mediocampista', color: '#D500F9' },
  DEL: { name: 'Delantero', color: '#FF1744' },
};

export const eventTypes = {
  goal: { name: 'Gol', icon: '⚽', color: '#4CAF50' },
  assist: { name: 'Asistencia', icon: '👟', color: '#2196F3' },
  yellowCard: { name: 'Tarjeta Amarilla', icon: '🟨', color: '#FFC107' },
  redCard: { name: 'Tarjeta Roja', icon: '🟥', color: '#D32F2F' },
  substitution: { name: 'Sustitución', icon: '🔄', color: '#9C27B0' },
  foul: { name: 'Falta', icon: '🤚', color: '#FF6D00' },
  corner: { name: 'Córner', icon: '🏁', color: '#00BFA5' },
  throwIn: { name: 'Saque de banda', icon: '📍', color: '#5C6BC0' },
};

export default defaultTeams;
