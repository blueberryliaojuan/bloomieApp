import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";

import {
  setOnBoardingFlag,
  getOnBoardingFlag,
} from "../services/OnboardingManager";

import { useState, useEffect } from "react";

const Stack = createStackNavigator();

function TabNavigation() {
  // add state for onboarding flag
  const [obFlag, setObFlag] = useState(null);

  useEffect(() => {
    // Check if the onboarding flag is set
    getOnBoardingFlag().then((flag) => {
      console.log("🚩flag", flag);
      if (flag === null) {
        // If not set, it's the first launch, initialize it to false
        setOnBoardingFlag(false);
        setObFlag(false);
      } else {
        setObFlag(true); // already launched
      }
    });
  }, []);
  return (
    <Stack.Navigator
      initialRouteName={obFlag ? "home" : "splash"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen
        name="home"
        component={HomeScreen}
        screenOptions={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default TabNavigation;
