/**
 * @file PlanPayment.jsx
 * @description Payment page for Bloome flower subscription app.
 *              Displays order summary, address form, payment inputs, and subscription button.
 * @author Juan Liao
 * @date 2025-08
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Import bouquet images
import wildImg from "../assets/images/home/wild.png";
import classicImg from "../assets/images/home/classic.png";
import modernImg from "../assets/images/home/modern.png";

// Map bouquet type to corresponding image
const images = {
  Classic: classicImg,
  Wildflower: wildImg,
  Modern: modernImg,
};

export default function PlanPayment() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bouquetId, frequency, type } = route.params;

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Address & Payment states
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Fetch plan data
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        // console.log("route.params", route.params);
        const response = await fetch("http://192.168.1.71:3000/bouquetData");
        const data = await response.json();
        // console.log("data", data);
        // 直接用 type 从 params 筛选 plan
        const bouquetType = type; // 从 params 拿到 type

        const planItem = data[bouquetType].find(
          (item) => item.id === bouquetId
        );

        if (planItem) {
          setPlan({ ...planItem, type: bouquetType }); // 添加 type 属性
        } else {
          setPlan(null); // 没找到 plan
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [bouquetId]);

  // Subscribe button
  const handleSubscribe = () => {
    navigation.navigate("profile", {
      // Tab 名称
      screen: "mySubscription", // Stack 内的 screen
      params: {
        frequency,
        bouquetId: plan.id,
        type,
      },
    });
  };

  // Modify plan
  const handleModify = () => {
    navigation.navigate("modifyPlan", {
      frequency,
      bouquetId,
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading plan...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Plan not found</Text>
      </View>
    );
  }

  const frequencyLower = frequency.toLowerCase();
  const planPrice = plan.frequency[frequencyLower]?.price ?? 0;
  const frequencyLabel = frequencyLower === "monthly" ? "Month" : "Week";

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="px-4" keyboardShouldPersistTaps="handled">
        {/* Order Summary */}
        <Text className="text-black font-bold text-base mt-4 mb-2">
          Order Summary
        </Text>

        <View className="flex-row items-center bg-white border-b border-gray-300 pb-4 mb-4">
          <Image
            source={images[plan.type]}
            className="h-40 w-40 rounded-lg"
            resizeMode="contain"
          />
          <View className="ml-4 flex-1">
            <Text className="text-black font-semibold text-lg">
              {plan.type} Bouquet
            </Text>
            <Text className="text-gray-500">
              Fresh flowers delivered {frequencyLower}
            </Text>
            <Text className="text-black font-bold text-lg mt-2">
              ${planPrice} / {frequencyLabel}
            </Text>
          </View>
        </View>

        {/* Address Form */}
        <Text className="text-black font-bold text-base mb-2 mt-8">
          Street Address
        </Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Street Address"
          className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        />

        <View className="flex-row">
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="City"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mb-4"
            style={{ marginRight: "4px" }}
          />
          <TextInput
            value={zip}
            onChangeText={setZip}
            placeholder="ZIP Code"
            className="w-24 border border-gray-300 rounded-md px-3 py-2 mb-4 ml-4"
          />
        </View>

        {/* Payment Method */}
        <Text className="text-black font-bold text-base mb-2 mt-8">
          Payment Method
        </Text>

        <TextInput
          value={cardName}
          onChangeText={setCardName}
          placeholder="Cardholder Name"
          className="border border-gray-300 rounded-md px-3 py-2 mb-4 "
        />
        <TextInput
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="Card Number"
          keyboardType="numeric"
          className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        />

        <View className="flex-row space-x-4">
          <TextInput
            value={expiry}
            onChangeText={setExpiry}
            placeholder="Expiry Date"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
          <TextInput
            value={cvv}
            onChangeText={setCvv}
            placeholder="CVV"
            keyboardType="numeric"
            className="w-24 border border-gray-300 rounded-md px-3 py-2 mb-4 ml-4"
          />
        </View>

        {/* Security info */}
        <View className="bg-gray-100 p-4 rounded-md mb-12">
          <Text className="text-gray-600 text-sm">
            Your payment information is secure and encrypted
          </Text>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          onPress={handleSubscribe}
          className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
        >
          <Text className="text-white font-semibold text-lg">
            Subscribe For ${planPrice}/{frequencyLabel}
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
