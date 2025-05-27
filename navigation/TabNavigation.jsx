import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator();

function TabNavigation() {
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
