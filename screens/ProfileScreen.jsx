import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useState, useEffect } from "react";
import { useUserState } from "../services/UserState";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const { user, clearUser } = useUserState();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // 检查登录状态
  useEffect(() => {
    if (!user) {
      // 如果未登录，跳到登录页面
      navigation.replace("login");
    }
  }, [user]);

  if (!user) {
    return null; // 防止页面在未登录状态下闪一下
  }

  return (
    <View className="flex-1 bg-white">
      {/* User Info Card */}
      <View className=" mx-4 mt-8 rounded-lg p-4">
        <Text className="text-xl font-bold text-center mb-4">
          {user?.first} {user?.last}
        </Text>
        <View className="flex-col justify-between items-center mt-2">
          <View className="flex-row items-center mb-2">
            <Ionicons name="mail-outline" size={18} color="#C02C26" />
            <Text className="ml-2 text-gray-600">{user?.email}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="call-outline" size={18} color="#C02C26" />
            <Text className="ml-2 text-gray-600">
              {user?.phone || "+1 (555) 123-4567"}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row mt-4 justify-around border-t border-dotted border-gray-300 pt-3">
          <View className="items-center">
            <Text className="font-semibold">12</Text>
            <Text className="text-gray-500 text-sm">Deliveries</Text>
          </View>
          <View className="items-center">
            <Text className="font-semibold">10</Text>
            <Text className="text-gray-500 text-sm">Received</Text>
          </View>
        </View>
      </View>

      {/* My Account */}
      <Text className="mt-6 mb-2 px-4 font-semibold text-lg">My Account</Text>
      <View className="bg-gray-100 mx-4 rounded-lg">
        <MenuItem
          icon="cube-outline"
          label="My Subscription"
          onPress={() => navigation.navigate("mySubscription")}
        />
        <MenuItem
          icon="heart-outline"
          label="Saved Bouquets"
          onPress={() => navigation.navigate("myFavorite")}
        />
        <MenuItem icon="star-outline" label="Reviews" onPress={() => {}} />
      </View>

      {/* Delivery Settings */}
      <Text className="mt-6 mb-2 px-4 font-semibold text-lg">
        Delivery Settings
      </Text>
      <View className="bg-gray-100 mx-4 rounded-lg">
        <MenuItem
          icon="location-outline"
          label="Delivery Address"
          onPress={() => {}}
        />
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={20} color="#C02C26" />
            <Text className="ml-3 text-base">Notification</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ true: "#C02C26" }}
            thumbColor={"white"}
          />
        </View>
        <MenuItem
          icon="card-outline"
          label="Payment method"
          onPress={() => {}}
        />
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        className="bg-[#C02C26] mx-4 mt-8 py-3 rounded-full"
        onPress={() => {
          clearUser();
          navigation.navigate("home");
        }}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={20} color="#C02C26" />
        <Text className="ml-3 text-base">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C02C26" />
    </TouchableOpacity>
  );
}
