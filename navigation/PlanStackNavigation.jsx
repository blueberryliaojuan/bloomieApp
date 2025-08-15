// PlanStackNavigation.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PlanScreen from "../screens/PlanScreen";
import PlanCheckout from "../screens/PlanCheckout";
// import PlanPayment from "../screens/PlanPayment";

const Stack = createStackNavigator();

export default function PlanStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="planMain" component={PlanScreen} />
      <Stack.Screen
        name="planCheckout"
        component={PlanCheckout}
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#C02C26" },
          headerTintColor: "#fff",
        }}
      />
      {/* <Stack.Screen name="planPayment" component={PlanPayment} /> */}
    </Stack.Navigator>
  );
}
