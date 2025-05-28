import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ShopScreen from "../screens/ShopScreen";
import FlowerDetailScreen from "../screens/FlowerDetailScreen";

function ShopStackNavigation() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="shop" component={ShopScreen} />
      <Stack.Screen name="flowerDetail" component={FlowerDetailScreen} />
    </Stack.Navigator>
  );
}

export default ShopStackNavigation;
