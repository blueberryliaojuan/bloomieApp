import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";

import {
  setOnBoardingFlag,
  getOnBoardingFlag,
} from "../services/OnboardingManager";

import { useState, useEffect } from "react";

const Stack = createStackNavigator();

function AppNavigation() {
  // add state for onboarding flag
  const [obFlag, setObFlag] = useState(null);
  // const [loading, setLoading] = useState(true);

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
      // setLoading(false);
    });
  }, []);
  // if (loading) return null;
  return (
    <Stack.Navigator
      initialRouteName={obFlag ? "home" : "splash"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigation;
