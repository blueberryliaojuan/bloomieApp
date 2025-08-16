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

  const toggleSubscription = async (subscription) => {
    try {
      const today = new Date();
      let updatedSubscription;

      if (subscription.status === "active") {
        // 暂停未来 deliveries
        const updatedDeliveries = subscription.upcomingDeliveries.map(
          (delivery) => {
            const deliveryDate = new Date(delivery.date);
            if (deliveryDate > today) {
              return { ...delivery, status: "paused" };
            }
            return delivery;
          }
        );
        updatedSubscription = {
          ...subscription,
          status: "paused",
          upcomingDeliveries: updatedDeliveries,
        };
      } else if (subscription.status === "paused") {
        // 激活未来 deliveries
        const updatedDeliveries = subscription.upcomingDeliveries.map(
          (delivery) => {
            const deliveryDate = new Date(delivery.date);
            if (deliveryDate > today) {
              return { ...delivery, status: "scheduled" };
            }
            return delivery;
          }
        );
        updatedSubscription = {
          ...subscription,
          status: "active",
          upcomingDeliveries: updatedDeliveries,
        };
      }

      // 更新本地状态，立即刷新 UI
      setSubscription(updatedSubscription);

      // 更新后台
      const response = await fetch(
        `http://192.168.1.71:3000/subscriptions/${subscription.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSubscription),
        }
      );

      if (!response.ok) throw new Error("Failed to update subscription");

      const data = await response.json();
      console.log("Subscription updated:", data);
      alert(
        subscription.status === "active"
          ? "Subscription paused successfully!"
          : "Subscription activated successfully!"
      );
    } catch (error) {
      console.error(error);
      alert("Error updating subscription");
    }
  };

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
        <View className="flex-row justify-start items-center mt-4 mb-2">
          <Text className="text-lg font-bold">My Subscription</Text>
          <Text
            className={`px-3 py-1 rounded-full text-xs ml-4 ${
              status.toLowerCase() === "active"
                ? "bg-[#C02C26] text-white"
                : "bg-gray-400 text-white"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>

        {/* Subscription Card */}
        <View className="bg-[#C02C26] rounded-xl p-4 mb-6 ">
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white text-lg font-bold">
                {bouquetName}
              </Text>
              <Text className="text-white mt-2">
                Next delivery: {nextDelivery}
              </Text>
            </View>

            <Text className="text-white text-xl font-bold mt-1">
              ${price}{" "}
              <Text className="text-base font-normal">/ {frequency}</Text>
            </Text>
          </View>
          <View className="flex-row mt-4 space-x-3">
            <TouchableOpacity
              className="flex-1 border border-white rounded-lg py-2"
              onPress={() => toggleSubscription(subscription)}
            >
              <Text className="text-center text-white font-semibold">
                {subscription.status === "paused" ? "Activate" : "Pause"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-white rounded-lg py-2 ml-4"
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

        {/* CTA Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("shop")}
          className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
        >
          <Text className="text-white font-semibold text-lg">
            Explore More Bouquets
          </Text>
          <View className="absolute right-0 h-14 w-14 rounded-full bg-[#ECBDC9] items-center justify-center">
            <Image
              source={require("../assets/icons/ArrowUpRight.png")}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
