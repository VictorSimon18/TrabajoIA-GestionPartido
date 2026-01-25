# FutManager ⚽

Aplicación móvil para gestión de partidos de fútbol 11 con cronómetro en tiempo real, registro de eventos y estadísticas.

## Características

- **Cronómetro en tiempo real** con control de primera y segunda parte
- **Registro de eventos**: goles, asistencias, tarjetas, sustituciones
- **Gestión de equipos**: crear, editar y eliminar equipos personalizados
- **Estadísticas detalladas** por equipo y jugador
- **Equipos predefinidos**: FC Barcelona y Real Madrid
- **Tema deportivo**: colores verdes con acentos amarillos y rojos

## Requisitos

- Node.js 18+
- npm o yarn
- Expo CLI
- Expo Go app (para probar en dispositivo móvil)

## Instalación

1. Navega al directorio del proyecto:
```bash
cd FutManager
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npx expo start
```

4. Escanea el código QR con la app Expo Go en tu móvil, o presiona:
   - `a` para abrir en Android Emulator
   - `i` para abrir en iOS Simulator
   - `w` para abrir en el navegador

## Estructura del Proyecto

```
FutManager/
├── App.js                      # Entry point con navegación
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js       # Pantalla principal
│   │   ├── TeamSelectionScreen.js  # Selección de equipos
│   │   ├── MatchScreen.js      # Partido en curso
│   │   ├── TeamManagerScreen.js    # Gestión de equipos
│   │   ├── CreateTeamScreen.js     # Crear/editar equipos
│   │   └── StatsScreen.js      # Estadísticas
│   ├── components/
│   │   ├── PlayerCard.js       # Tarjeta de jugador
│   │   ├── EventModal.js       # Modal de eventos
│   │   ├── TeamCard.js         # Tarjeta de equipo
│   │   └── Timer.js            # Cronómetro
│   ├── data/
│   │   └── defaultTeams.js     # Equipos predefinidos
│   ├── storage/
│   │   └── asyncStorage.js     # Persistencia de datos
│   └── styles/
│       └── theme.js            # Tema visual
```

## Uso

### Iniciar un Partido
1. Desde la pantalla principal, pulsa "Empezar Partido"
2. Selecciona el equipo local y visitante
3. Pulsa "Comenzar Partido"
4. Usa el cronómetro para controlar el tiempo
5. Toca un jugador para registrar eventos (goles, tarjetas, cambios)
6. Al finalizar, pulsa "Finalizar Partido"

### Crear un Equipo
1. Ve a "Gestor de Equipos"
2. Pulsa el botón "+" flotante
3. Introduce nombre, color y añade al menos 11 jugadores
4. Guarda el equipo

### Ver Estadísticas
1. Ve a "Estadísticas"
2. Selecciona un equipo para ver su rendimiento
3. Consulta estadísticas individuales de cada jugador

## Tecnologías

- React Native + Expo
- React Navigation
- AsyncStorage
- Expo Linear Gradient

## Licencia

MIT
