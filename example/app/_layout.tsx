import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ReflektProvider, SDKConfig } from '@reflekt/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const reflektConfig: SDKConfig = {
  apiKey: 'rf_dYpyvMKVlpVMYSFOmfpYbOhJnhjQKYMeWLpDDAtOxUYyGxIsEoGWkpTrBUkFgZpo',
  respondentId: 'test-user-123',
  autoShow: true,
  debug: true,
};

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReflektProvider config={reflektConfig}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ReflektProvider>
    </GestureHandlerRootView>
  );
}
