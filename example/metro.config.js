const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const sdkRoot = path.resolve(__dirname, '..');

const config = getDefaultConfig(__dirname);

// Enable symlinks (required for file:.. dependencies on Windows)
config.resolver.unstable_enableSymlinks = true;

// Watch the SDK root for live reload during development
config.watchFolders = [sdkRoot];

// CRITICAL: Block SDK's node_modules to prevent duplicate React/RN instances
const escapePathForRegex = (p) => p.replace(/[\\\/]/g, '[\\\\\\/]');
const sdkNodeModulesPath = escapePathForRegex(path.resolve(sdkRoot, 'node_modules'));

config.resolver.blockList = [
  new RegExp(`${sdkNodeModulesPath}[\\\\\/].*`),
];

// Map shared dependencies to example app's node_modules
// This ensures SDK code resolves React/RN from the example app, not the blocked SDK node_modules
const sharedDeps = [
  'react',
  'react-native',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-svg',
  '@react-native-async-storage/async-storage',
];

config.resolver.extraNodeModules = sharedDeps.reduce((acc, dep) => {
  acc[dep] = path.resolve(__dirname, 'node_modules', dep);
  return acc;
}, {});

module.exports = config;
