// ProfileStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/ProfileScreen";
import MySubscription from "../screens/MySubscription";
import MyFavorite from "../screens/MyFavorite";

const Stack = createStackNavigator();

export default function ProfileStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 如果你不想要默认header
      }}
    >
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="myFavorite" component={MyFavorite} />
      <Stack.Screen name="mySubscription" component={MySubscription} />
    </Stack.Navigator>
  );
}
