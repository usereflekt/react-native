# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-28

### Added

- Initial release of the Reflekt React Native SDK
- `ReflektProvider` component for easy integration
- `useReflekt` hook for accessing SDK state
- Automatic survey display with configurable polling
- Support for multiple question types:
  - Free text
  - Single select
  - Multi select
  - Rating (stars, numbers, emoji)
  - Message/informational screens
- Theming support with customizable colors and border radius
- Offline caching of surveys and themes
- Impression and response tracking
- Debug mode for development
- Configurable API URL for self-hosted environments
- `ReflektSDK.reset()` method for handling user logout
- `ReflektSDK.isInitialized()` static method for checking SDK state
