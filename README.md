# Bloomie Flower Store App 🌸

**ReactNative + Expo Project**

Bloomie is a flower store offering both in-store and online shopping options.

---

## Resources

### Design:

- **Figma Project**: [Bloomie Design](https://www.figma.com/design/m24HAz42h3DNXgcbUf4PFJ/Bloomie?node-id=0-1&p=f&t=xv0EKzgGbUqhsPBj-0)
- **Prototype**: [Bloomie App Prototype](https://www.figma.com/proto/m24HAz42h3DNXgcbUf4PFJ/Bloomie?node-id=32-175&node-type=canvas&t=5SbDYwfoUMlI4P4f-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=32%3A128&show-proto-sidebar=1)

---

## Setup Instructions

### github: [BloomieApp](https://github.com/blueberryliaojuan/bloomieApp)

### Dependencies Overview

- **@hookform/resolvers & react-hook-form**: Simplifies form validation and integrates with `yup` for schema-based validation.
- **@hookstate/core**: A state management library for React applications.
- **@react-native-async-storage/async-storage**: Provides persistent key-value storage for React Native apps.
- **@react-navigation/bottom-tabs, @react-navigation/native, @react-navigation/stack**: Tools for implementing navigation and tab-based routing.
- **@rneui/base & @rneui/themed**: React Native UI toolkit for building styled components.
- **expo & expo-status-bar**: Core Expo SDK for development and managing the status bar.
- **json-server**: A mock REST API server for local development and testing.
- **lottie-react-native**: Enables animations using Lottie JSON files.
- **nativewind**: Tailwind CSS integration for React Native styling.
- **react & react-native**: Core libraries for building mobile applications.
- **react-native-anchor-carousel**: A carousel component for React Native.
- **react-native-gesture-handler & react-native-reanimated**: Gesture handling and advanced animations.
- **react-native-onboarding-swiper**: Component for creating onboarding screens.
- **react-native-safe-area-context & react-native-screens**: Utilities for handling device safe areas and screens.
- **react-native-vector-icons**: Library for using scalable vector icons.
- **tailwindcss**: Utility-first CSS framework for styling components.
- **yup**: Schema validation library for form inputs.

**Dev Dependencies:**

- **@babel/core**: JavaScript compiler for transforming modern JS and React code.
- **@types/react**: TypeScript type definitions for React.
- **typescript**: TypeScript compiler for type checking and development.

### API Integration

- The API is powered by a local JSON Server.
- API details are documented in the `API.md` file.
- JSON data is stored in the `db.json` file.

### Installation Steps

Follow these steps to set up and run the Bloomie Flower Store App locally:

1. **Install Project Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
2. Start the JSON Server
   ```bash
   npm run db
   this sets up a local mock API using db.json.
   ```
3. Configure Server Host
   Open server.js and update the HOST constant to your machine's IP address.
4. Run the Development Server
   ```bash
   npm run start
   ```

---
