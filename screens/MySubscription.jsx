// SubscriptionScreen.jsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
export default function SubscriptionScreen() {
  const navigation = useNavigation();
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
          <Text className="bg-[#C02C26] text-white px-3 py-1 rounded-full text-xs">
            Active
          </Text>
        </View>

        {/* Subscription Card */}
        <View className="bg-[#C02C26] rounded-xl p-4 mb-6">
          <Text className="text-white text-lg font-bold">Classic - Medium</Text>
          <Text className="text-white text-xl font-bold mt-1">
            $35 <Text className="text-base font-normal">/ Weekly</Text>
          </Text>
          <Text className="text-white mt-2">Next delivery: March 15, 2024</Text>

          <View className="flex-row mt-4 space-x-3">
            <TouchableOpacity className="flex-1 border border-white rounded-lg py-2">
              <Text className="text-center text-white font-semibold">
                Pause
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-white rounded-lg py-2"
              onPress={() => {
                navigation.navigate("modifyPlan");
              }}
            >
              <Text className="text-center text-red-600 font-semibold">
                Modify
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Deliveries */}
        <Text className="text-lg font-bold mb-3">Upcoming Deliveries</Text>

        {/* Delivery Item - Confirmed */}
        <View className="border border-red-300 rounded-lg p-4 mb-3 bg-red-50">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold">March 15</Text>
            <Text className="bg-[#C02C26] text-white px-3 py-1 rounded-full text-xs">
              Confirmed
            </Text>
          </View>
          <Text className="mt-1 text-gray-700">Spring Mix with Tulips</Text>
        </View>

        {/* Delivery Item - Scheduled */}
        <View className="border border-gray-300 rounded-lg p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold">March 22</Text>
            <Text className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs">
              Scheduled
            </Text>
          </View>
          <Text className="mt-1 text-gray-700">Cherry Blossom Collection</Text>
        </View>

        <View className="border border-gray-300 rounded-lg p-4 mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold">March 29</Text>
            <Text className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs">
              Scheduled
            </Text>
          </View>
          <Text className="mt-1 text-gray-700">Seasonal Surprise</Text>
        </View>

        {/* Setting */}
        <Text className="text-lg font-bold mb-3">Setting</Text>

        <View className="bg-gray-50 rounded-lg mb-6">
          <View className="flex-row items-center border-b border-gray-200 p-4">
            {/* <TruckIcon size={24} color="red" /> */}
            <Text className="ml-3">Delivery Frequency: weekly</Text>
          </View>
          <View className="flex-row items-center border-b border-gray-200 p-4">
            {/* <HomeIcon size={24} color="red" /> */}
            <Text className="ml-3">Delivery Address: weekly</Text>
          </View>
          <View className="flex-row items-center p-4">
            {/* <CreditCardIcon size={24} color="red" /> */}
            <Text className="ml-3">Payment Method: *** *** *** 4242</Text>
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
