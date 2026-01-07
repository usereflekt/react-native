import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ReflektProvider, SDKConfig } from '@reflekt/react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Configure SDK - Replace with your actual API key and respondent ID
const reflektConfig: SDKConfig = {
  apiKey: 'rf_dYpyvMKVlpVMYSFOmfpYbOhJnhjQKYMeWLpDDAtOxUYyGxIsEoGWkpTrBUkFgZpo', // Replace with your actual API key from the Reflekt dashboard
  respondentId: 'test-user-123', // Replace with your user's unique identifier
  autoShow: true, // Set to true to automatically show surveys when available
  debug: true, // Enable debug logging in development
  pollIntervalMinutes: 0, // Disable polling in development (set > 0 in production)
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ReflektProvider config={reflektConfig}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ReflektProvider>
    </GestureHandlerRootView>
  );
}
