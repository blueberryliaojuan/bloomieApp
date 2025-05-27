import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // 使用 Ionicons 图标库
import ShopScreen from "./Shop";
import CartScreen from "./Cart";
import ProfileScreen from "./Profile";

const Tab = createBottomTabNavigator();
function HomeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="shop"
      screenOptions={({ route }) => ({
        headerShown: false, //hide the header
        tabBarActiveTintColor: "white", // 激活时的图标颜色
        tabBarInactiveTintColor: "#ddd", // 非激活时的图标颜色
        tabBarStyle: { backgroundColor: "#C02C26" }, // Tab bar 背景色
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "shop") {
            iconName = focused ? "basket" : "basket-outline";
          } else if (route.name === "cart") {
            iconName = focused ? "basket" : "basket-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return (
            <Ionicons
              name={iconName}
              size={20}
              color={focused ? "white" : "#ddd"} // 图标颜色根据选中状态变化
            />
          );
        },
      })}
    >
      <Tab.Screen name="shop" component={ShopScreen} />
      <Tab.Screen name="cart" component={CartScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
export default HomeScreen;
