# Reflekt React Native SDK

In-app survey and feedback SDK for React Native and Expo applications.

## Installation

```bash
npm install @reflekt/react-native
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install @react-native-async-storage/async-storage react-native-gesture-handler react-native-reanimated react-native-svg
```

### Additional Setup

#### React Native Reanimated

Add the Reanimated Babel plugin to your `babel.config.js`:

```js
module.exports = {
  plugins: ['react-native-reanimated/plugin'],
};
```

#### React Native Gesture Handler

For React Native (non-Expo) projects, wrap your app with `GestureHandlerRootView`:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

For Expo projects, this is handled automatically.

## Quick Start

Wrap your app with `ReflektProvider`:

```tsx
import { ReflektProvider } from '@reflekt/react-native';

export default function App() {
  return (
    <ReflektProvider
      config={{
        apiKey: 'your-api-key',
        respondentId: 'user-123', // Unique identifier for the current user
        appVersion: '1.0.0',
        debug: __DEV__, // Enable debug logging in development
      }}
    >
      <YourApp />
    </ReflektProvider>
  );
}
```

That's it! Surveys will automatically appear when available.

## Configuration

The `config` prop accepts an `SDKConfig` object with the following properties:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `apiKey` | `string` | Yes | - | Your Reflekt API key |
| `respondentId` | `string` | Yes | - | Unique identifier for the current user |
| `autoShow` | `boolean` | No | `true` | Automatically show surveys when available |
| `appVersion` | `string` | No | `'Unknown'` | Your app's version string for analytics |
| `debug` | `boolean` | No | `false` | Enable debug logging |
| `pollIntervalMinutes` | `number` | No | `60` | Interval for polling new surveys. Set to `0` to disable |
| `apiUrl` | `string` | No | - | Custom API URL for self-hosted or staging environments |

## Hooks

### useReflekt

Access the SDK state within your components:

```tsx
import { useReflekt } from '@reflekt/react-native';

function MyComponent() {
  const { isReady } = useReflekt();

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return <YourContent />;
}
```

## Advanced Usage

### Manual SDK Control

For advanced use cases, you can interact with the SDK directly:

```tsx
import { ReflektSDK } from '@reflekt/react-native';

// Check if SDK is initialized
if (ReflektSDK.isInitialized()) {
  const sdk = ReflektSDK.getInstance();
  
  // Get available surveys
  const surveys = await sdk.getAvailableSurveys();
  
  // Reload surveys from the server
  await sdk.reloadAvailableSurveys();
  
  // Get the current theme
  const theme = sdk.getTheme();
}

// Reset the SDK (e.g., on user logout)
ReflektSDK.reset();
```

### Handling User Logout

When a user logs out, reset the SDK to clear cached data:

```tsx
async function handleLogout() {
  ReflektSDK.reset();
  // ... rest of your logout logic
}
```

## Theming

Surveys automatically inherit your project's theme from the Reflekt dashboard. The theme includes:

- **Colors**: Background, text, primary accent, and more
- **Border Radius**: Customizable corners for sheets, buttons, inputs

## Question Types

The SDK supports the following question types:

- **Free Text**: Open-ended text responses
- **Single Select**: Radio button selection
- **Multi Select**: Checkbox selection
- **Rating**: Star, number, or emoji scales (3-10 range)
- **Message**: Informational screens (no response required)

## Requirements

- React Native >= 0.64.0
- React >= 17.0.0
- iOS 12.0+ / Android API 21+

## Troubleshooting

### Surveys not appearing

1. Ensure your API key is correct
2. Check that you have active surveys in your Reflekt dashboard
3. Enable `debug: true` to see detailed logs
4. Verify the `respondentId` hasn't already completed the survey

## License

MIT
