React Native Project: MomentMint

## Description
Moment Mint's mobile app is built with React Native, offering a seamless Android-platform experience for iOS and Android users comming soon. Share real-time moments and earn cryptocurrency on the go!

Moment Mint is a revolutionary platform for sharing real-time moments and earning cryptocurrency. Here's what makes it special:

- **Real-time Sharing**: Capture and share exciting moments as they happen - be it a concert, a beautiful sunset, or any thrilling experience.
- **Earn Crypto**: Get rewarded with cryptocurrency for sharing your authentic moments.
- **Blockchain Verification**: We use blockchain technology to verify the authenticity of shared moments, ensuring genuine content.
- **NFT Creation**: Turn your most special moments into unique Non-Fungible Tokens (NFTs), creating digital collectibles that you exclusively own.

Experience the joy of sharing, earn rewards, and immortalize your memories in the digital world with Moment Mint!

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the App](#running-the-app)
4. [Project Structure](#project-structure)
5. [Tech Stack](#tech-stack)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or newer)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tosif121/MomentMint.git
   ```

2. Navigate to the project directory:
   ```bash
   cd MomentMint
   ```

3. Install the required dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

## Running the App

### Android
1. Make sure an Android device/emulator is connected or running.
2. Run the following command to start the app:
   ```bash
   npx react-native run-android
   ```

### iOS (coming soon)

## Project Structure

```
moment-mint-mobile/
├── android/                   # Android-specific files and configurations
├── src/                       # Application source code
│   ├── images/                # App images and assets
│   ├── screen/                # Application screens
│   │   ├── Post/              # Screens for posting moments
│   │   │   ├── CameraScreen.tsx
│   │   │   ├── PreviewScreen.tsx
│   │   ├── Profile/           # Profile management screens
│   │   │   ├── ProfileDrawer.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── ProfilePost.tsx
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProfileEditScreen.tsx
│   │   │   ├── ProfileTab.tsx
│   │   ├── SplashScreen.tsx    # Initial loading screen
│   │   ├── SearchScreen.tsx    # Search feature
│   │   ├── MobileVerificationScreen.tsx
│   │   ├── MessagesScreen.tsx  # Messaging feature
│   │   └── HomeScreen.tsx      # Main home screen
│   ├── utils/                  # Utility files (API, types, helpers)
│   │   ├── activity.ts
│   │   ├── api.ts
│   │   ├── toast.ts
│   │   └── type.ts
├── App.tsx                    # Entry point of the app
└── package.json               # Dependencies and scripts
```

## Tech Stack

- **React Native**: Cross-platform mobile framework.
- **TypeScript**: Strongly-typed JavaScript for scalability and maintainability.
- **React Navigation**: Handles in-app navigation and routing.
- **React Native Camera**: Used for capturing real-time moments.
- **Web3 Libraries**: Integrating blockchain technology for content verification and cryptocurrency rewards.

### Common Issues

1. **Android Gradle issues**:
   - Run the following commands to clean and rebuild the project:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```
