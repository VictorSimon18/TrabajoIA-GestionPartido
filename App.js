import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TeamSelectionScreen from './src/screens/TeamSelectionScreen';
import MatchScreen from './src/screens/MatchScreen';
import TeamManagerScreen from './src/screens/TeamManagerScreen';
import CreateTeamScreen from './src/screens/CreateTeamScreen';
import StatsScreen from './src/screens/StatsScreen';

// Theme
import { colors } from './src/styles/theme';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
  animation: 'slide_from_right',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          ...DarkTheme,
          dark: true,
          colors: {
            ...DarkTheme.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.textPrimary,
            border: colors.border,
            notification: colors.accent,
          },
        }}
      >
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={screenOptions}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TeamSelection" component={TeamSelectionScreen} />
          <Stack.Screen
            name="Match"
            component={MatchScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="TeamManager" component={TeamManagerScreen} />
          <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
