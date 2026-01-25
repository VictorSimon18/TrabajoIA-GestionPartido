import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
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
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerBackTitleVisible: false,
  animation: 'slide_from_right',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={screenOptions}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TeamSelection"
            component={TeamSelectionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Match"
            component={MatchScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="TeamManager"
            component={TeamManagerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateTeam"
            component={CreateTeamScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Stats"
            component={StatsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
