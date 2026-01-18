# 🍅 Pomodowork

A beautifully designed, iOS-first Pomodoro timer app built with React Native and TypeScript.

![Pomodowork](https://img.shields.io/badge/React%20Native-0.81-blue?logo=react) ![Expo](https://img.shields.io/badge/Expo-54-black?logo=expo) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)

## ✨ Features

- **⏱️ Circular Timer** – Beautiful animated progress ring with work/break phases
- **📋 Custom Profiles** – Create, manage, and switch between Pomodoro configurations
- **🔔 Smart Notifications** – Configurable alerts (sound, vibration, alarm)
- **👆 Swipe-to-Delete** – Intuitive gesture-based profile management
- **📱 iOS Background Support** – Timer works correctly when app is backgrounded

## 🎨 Design

Inspired by modern fintech apps like Trade Republic:
- Dark, minimal aesthetic
- Vibrant coral (work) and teal (break) accents
- Bold typography with consistent thick borders
- Blur-effect navigation bar
- Smooth spring animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Expo Go](https://expo.dev/client) app on your phone

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/pomodowork.git
cd pomodowork

# Install dependencies
npm install

# Start development server
npm start
```

### Running the App

- **📱 iOS/Android**: Scan the QR code with Expo Go
- **🌐 Web**: Press `w` in the terminal
- **🖥️ Simulator**: Press `i` (iOS) or `a` (Android)

## 🏗️ Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigation
│   │   ├── index.tsx       # Timer screen
│   │   ├── profiles.tsx    # Profiles list
│   │   └── settings.tsx    # Settings
│   └── create-profile.tsx  # Modal
├── components/             # Reusable UI components
├── contexts/               # React contexts (state)
├── services/               # Native services
├── types/                  # TypeScript interfaces
├── constants/              # Theme & defaults
└── utils/                  # Helper functions
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo |
| Routing | Expo Router |
| State | React Context + useReducer |
| Animations | Reanimated 4 |
| Gestures | Gesture Handler |
| Storage | AsyncStorage |
| Notifications | Expo Notifications |
| Icons | Ionicons |

## 📦 Core Dependencies

```json
{
  "expo": "~54.0.31",
  "expo-router": "~6.0.21",
  "react-native-reanimated": "~4.1.1",
  "react-native-gesture-handler": "~2.x",
  "expo-notifications": "~0.32.16",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

## 📄 License

MIT License - feel free to use this project for learning or as a base for your own apps!
