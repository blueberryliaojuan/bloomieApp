// PlanStackNavigation.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PlanScreen from "../screens/PlanScreen";
import PlanCheckout from "../screens/PlanCheckout";
// import PlanPayment from "../screens/PlanPayment";
import ModifyPlan from "../screens/ModifyPlan";

const Stack = createStackNavigator();

export default function PlanStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="planMain" component={PlanScreen} />
      <Stack.Screen name="planCheckout" component={PlanCheckout} />
      {/* <Stack.Screen name="planPayment" component={PlanPayment} /> */}
      <Stack.Screen name="modifyPlan" component={ModifyPlan} />
    </Stack.Navigator>
  );
}
