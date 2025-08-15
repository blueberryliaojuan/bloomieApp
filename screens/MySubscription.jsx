/**
 * @file SubscriptionScreen.jsx
 * @description Displays user's active subscription and upcoming deliveries for Bloome app.
 *              Handles loading state, no subscription state, and missing data gracefully.
 * @author Juan
 * @date 2025-08
 */

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserState } from "../services/UserState.js";

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const { user } = useUserState();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(
          `http://192.168.1.71:3000/subscriptions?userId=${user.id}`
        );
        const data = await res.json();
        if (data.length > 0) {
          // 优先取 active 订阅
          const activeSub =
            data.find((sub) => sub.status === "active") || data[0];
          setSubscription(activeSub);
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading subscription...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Please login to see your subscription.</Text>
      </View>
    );
  }

  if (!subscription) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No active subscription found.</Text>
      </View>
    );
  }

  // 默认字段处理
  const status = subscription.status || "Unknown";
  const bouquetName =
    subscription.bouquetName || `${subscription.type || "Bouquet"} Bouquet`;
  const price = subscription.price ?? 0;
  const frequency = subscription.frequency || "N/A";
  const nextDelivery = subscription.nextDelivery || "TBD";
  const upcomingDeliveries = subscription.upcomingDeliveries || [];

  return (
    <View className="flex-1 bg-white">
      {/* Header Logo */}
      <View className="items-center pt-16 pb-4">
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
      </View>

      <ScrollView className="px-4">
        {/* My Subscription */}
        <View className="flex-row justify-between items-center mt-4 mb-2">
          <Text className="text-lg font-bold">My Subscription</Text>
          <Text
            className={`px-3 py-1 rounded-full text-xs ${
              status.toLowerCase() === "active"
                ? "bg-[#C02C26] text-white"
                : "bg-gray-400 text-white"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>

        {/* Subscription Card */}
        <View className="bg-[#C02C26] rounded-xl p-4 mb-6">
          <Text className="text-white text-lg font-bold">{bouquetName}</Text>
          <Text className="text-white text-xl font-bold mt-1">
            ${price}{" "}
            <Text className="text-base font-normal">/ {frequency}</Text>
          </Text>
          <Text className="text-white mt-2">Next delivery: {nextDelivery}</Text>

          <View className="flex-row mt-4 space-x-3">
            <TouchableOpacity className="flex-1 border border-white rounded-lg py-2">
              <Text className="text-center text-white font-semibold">
                Pause
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-white rounded-lg py-2"
              onPress={() => navigation.navigate("modifyPlan")}
            >
              <Text className="text-center text-red-600 font-semibold">
                Modify
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Deliveries */}
        <Text className="text-lg font-bold mb-3">Upcoming Deliveries</Text>
        {upcomingDeliveries.length > 0 ? (
          upcomingDeliveries.map((item, idx) => {
            const itemStatus = item.status || "Unknown";
            const itemName = item.name || bouquetName;
            const itemDate = item.date || "TBD";
            return (
              <View
                key={idx}
                className={`border rounded-lg p-4 mb-3 ${
                  itemStatus.toLowerCase() === "confirmed"
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold">{itemDate}</Text>
                  <Text
                    className={`px-3 py-1 rounded-full text-xs ${
                      itemStatus.toLowerCase() === "confirmed"
                        ? "bg-[#C02C26] text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {itemStatus.charAt(0).toUpperCase() + itemStatus.slice(1)}
                  </Text>
                </View>
                <Text className="mt-1 text-gray-700">{itemName}</Text>
              </View>
            );
          })
        ) : (
          <Text className="text-gray-500 mb-4">No upcoming deliveries.</Text>
        )}

        {/* Settings */}
        <Text className="text-lg font-bold mb-3">Settings</Text>
        <View className="bg-gray-50 rounded-lg mb-6">
          <View className="flex-row items-center border-b border-gray-200 p-4">
            <Text className="ml-3">Delivery Frequency: {frequency}</Text>
          </View>
          <View className="flex-row items-center border-b border-gray-200 p-4">
            <Text className="ml-3">
              Delivery Address: {subscription.address || "N/A"},{" "}
              {subscription.city || "N/A"}, {subscription.zip || "N/A"}
            </Text>
          </View>
          <View className="flex-row items-center p-4">
            <Text className="ml-3">
              Payment Method: **** **** ****{" "}
              {subscription.cardNumber
                ? subscription.cardNumber.slice(-4)
                : "0000"}
            </Text>
          </View>
        </View>

        {/* Need Help */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-gray-600 text-sm">
            Skip deliveries, change your plan, or get support anytime. We're
            here to make your flower experience perfect
          </Text>
          <Text className="italic mt-1">— Sarah M., San Francisco</Text>
        </View>

        <TouchableOpacity className="bg-[#C02C26] rounded-lg py-3 mb-10">
          <Text className="text-center text-white font-semibold">
            Connect Support
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
