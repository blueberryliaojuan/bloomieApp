/**
 * File: AppNavigation.js
 * Description: Defines the main app navigation stack.
 *              Initial route is SplashScreen which handles onboarding check.
 * Author: Juan Liao
 * Created: 2025-08
 */

import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createStackNavigator();

function AppStackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen
        name="onboarding"
        component={OnBoardingScreen}
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#C02C26" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default AppStackNavigation;
