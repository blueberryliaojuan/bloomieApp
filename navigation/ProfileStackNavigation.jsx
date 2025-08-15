// ProfileStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/ProfileScreen";
import MySubscription from "../screens/MySubscription";
import MyFavorite from "../screens/MyFavorite";
import ModifyPlan from "../screens/ModifyPlan";

const Stack = createStackNavigator();

export default function ProfileStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#C02C26",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen name="myFavorite" component={MyFavorite} />
      <Stack.Screen name="mySubscription" component={MySubscription} />
      <Stack.Screen name="modifyPlan" component={ModifyPlan} />
    </Stack.Navigator>
  );
}
