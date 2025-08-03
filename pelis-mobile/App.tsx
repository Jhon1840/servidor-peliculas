import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoviesScreen from './src/screens/MoviesScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';

export type RootStackParamList = {
  Movies: undefined;
  VideoPlayer: { url: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Movies" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Movies" component={MoviesScreen} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
