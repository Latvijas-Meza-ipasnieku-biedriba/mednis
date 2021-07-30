# Contributing to Mednis

Feel free to submit issues or pull requests that might improve this project in any way.

If you've identified a security vulnerability, please inform us about it by sending an email to <support@mednis.app>.

## Set up for development

### Configuration

Create `src/configuration.ts` file with one named export `configuration` that adheres to `Configuration` type from `src/types/configuration.ts`.

```ts
// src/configuration.ts

import { Configuration } from "./types/configuration";

export const configuration: Configuration = {
    // ...
};
```

### Android

Run without opening Android Studio:

```bash
# Install dependencies
npm install
# Run on emulator or connected device
npm run android
```

Run from Android Studio:

```bash
# Install dependencies
npm install
# Build React project
npm run build
# Sync result with native project
npx cap sync android
# Open Android Studio and run from there
npx cap open android
```

When React project has changed:

```bash
# Build React project
npm run build
# Sync result with native project
npx cap sync android
# Run native project
# ...
```

### Android (Live Reload)

Add `server` entry to `capacitor.config.json`:

```json
{
    // DO NOT COMMIT THIS CHANGE
    "server": {
        "url": "http://10.0.2.2:8080", // 10.0.2.2 for emulator, 192.168.1.101 (LAN network IP) for device
        "cleartext": true
    }
}
```

Run from terminal:

```bash
# Start development server
npm start
# Build React project
npm run build
# Sync result with native project
npx cap sync android
# Run native project
# ...
```

### iOS

Run from Xcode:

```bash
# Install dependencies
npm install
# Build React project
npm run build
# Sync result with native project
npx cap sync ios
# Open Xcode and run from there
npx cap open ios
# Run native project
# ...
```

When React project has changed:

```bash
# Build React project
npm run build
# Sync result with native project
npx cap sync ios
# Run native project
# ...
```

### iOS (Live Reload)

Add `server` entry to `capacitor.config.json`:

```json
{
    // DO NOT COMMIT THIS CHANGE
    "server": {
        "url": "http://localhost:8080" // localhost for simulator, 192.168.1.101 (LAN network IP) for device
    }
}
```

Run from terminal:

```bash
# Start development server
npm start
# Build React project
npm run build
# Sync result with native project
npx cap sync ios
# Run native project
# ...
```
