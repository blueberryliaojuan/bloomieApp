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
      if (flag === null) {
        // If not set, initialize it to true
        setOnBoardingFlag(true);
      }
    });
  }, []);
  return (
    <Stack.Navigator
      initialRouteName="splash"
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
