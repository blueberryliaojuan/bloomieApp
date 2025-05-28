import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import ShopStackNavigation from "../navigation/ShopStackNavigation";
import ShopScreen from "./ShopScreen";
import CartScreen from "./Cart";
import ProfileScreen from "./Profile";

const Tab = createBottomTabNavigator();
function HomeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="shopNav"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#ddd",
        tabBarStyle: { backgroundColor: "#C02C26" },
        tabBarIcon: ({ focused }) => {
          let iconSource;
          if (route.name === "shopNav") {
            iconSource = require("../assets/icons/flower.png");
          } else if (route.name === "cart") {
            iconSource = require("../assets/icons/cart.png");
          } else if (route.name === "profile") {
            iconSource = require("../assets/icons/profile.png");
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
      <Tab.Screen name="shopNav" component={ShopStackNavigation} />
      <Tab.Screen name="cart" component={CartScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
export default HomeScreen;
