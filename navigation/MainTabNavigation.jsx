// MainTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import ShopStackNavigation from "../navigation/ShopStackNavigation";
import HomeScreen from "../screens/HomeScreen";
import PlanStackNavigation from "./PlanStackNavigation";
import ProfileStackNavigation from "./ProfileStackNavigation";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#ddd",
        tabBarStyle: {
          backgroundColor: "#C02C26",
          height: 70,
          paddingTop: 8,
        },
        tabBarShowLabel: false,

        tabBarIcon: ({ focused }) => {
          let iconSource;
          if (route.name === "home") {
            iconSource = require("../assets/icons/Home.png");
          } else if (route.name === "plan") {
            iconSource = require("../assets/icons/Plan.png");
          } else if (route.name === "shop") {
            iconSource = require("../assets/icons/Cart.png");
          } else if (route.name === "profile") {
            iconSource = require("../assets/icons/Profile.png");
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "white" : "#ddd",
              }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="plan" component={PlanStackNavigation} />
      <Tab.Screen name="shop" component={ShopStackNavigation} />
      <Tab.Screen name="profile" component={ProfileStackNavigation} />
    </Tab.Navigator>
  );
}
