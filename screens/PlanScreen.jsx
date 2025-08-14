/**
 * File: PlanScreen.jsx
 * Description: Screen component for selecting a subscription plan for bouquets.
 *              Users can choose delivery frequency, bouquet type, and a specific bouquet.
 * Author: Juan
 * Date: 2025-08
 */

import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import RatingStars from "../components/RatingStar";

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

export default function PlanScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Extract initial type and frequency from route params (if any)
  const { type: routeType, frequency: routeFreq } = route.params || {};

  // State for selected frequency, type, bouquet data, and selected bouquet
  const [frequency, setFrequency] = useState(
    routeFreq
      ? routeFreq.charAt(0).toUpperCase() + routeFreq.slice(1)
      : "Weekly"
  );
  const [type, setType] = useState(routeType || "Classic");
  const [bouquetData, setBouquetData] = useState(null);
  const [selectedBouquetId, setSelectedBouquetId] = useState(null);

  // Update state when route params change
  useEffect(() => {
    if (route.params) {
      console.log("route.params", route.params);
      if (route.params.type) setType(route.params.type);
      if (route.params.frequency)
        setFrequency(
          route.params.frequency.charAt(0).toUpperCase() +
            route.params.frequency.slice(1)
        );
    }
  }, [route.params]);

  // Fetch bouquet data from local server on component mount
  useEffect(() => {
    fetch("http://192.168.1.71:3000/bouquetData")
      .then((res) => res.json())
      .then((data) => setBouquetData(data))
      .catch((err) => console.error("Fetch bouquetData error:", err));
  }, []);

  // Show loading if data is not yet fetched
  if (!bouquetData) {
    return <Text>Loading...</Text>;
  }

  // Handle bouquet card selection
  const handleSelectBouquet = (bouquetId) => {
    setSelectedBouquetId(bouquetId);
  };

  // Handle checkout button press
  const handleCheckout = () => {
    if (!selectedBouquetId) {
      alert("Please select a bouquet first");
      return;
    }
    console.log("frequency", frequency);
    console.log("selectedBouquetId", selectedBouquetId);

    // Navigate to checkout screen with selected frequency and bouquetId
    navigation.navigate("planCheckout", {
      frequency,
      bouquetId: selectedBouquetId,
    });
  };

  return (
    <ScrollView className="flex-1 bg-white px-4">
      {/* Header Logo */}
      <View className="items-center pt-16 pb-4">
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
      </View>

      {/* Page Title */}
      <Text className="text-xl font-bold mt-4 mb-4">Choose Your Plan</Text>

      {/* Frequency Selection Buttons */}
      <View className="flex-row gap-6 mt-4 px-4">
        {["Weekly", "Monthly"].map((freq) => (
          <TouchableOpacity
            key={freq}
            className={`flex-1 px-4 py-4 border rounded-lg ${
              frequency === freq
                ? "bg-[#C02C26] border-[#C02C26]"
                : "border-gray-300"
            }`}
            onPress={() => setFrequency(freq)}
          >
            <Text
              className={`${
                frequency === freq ? "text-white" : "text-gray-700"
              } font-medium text-center`}
            >
              {freq} {freq === "Weekly" ? "(Save 10%)" : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouquet Type Tabs */}
      <View className="flex-row mt-4 border-b border-gray-200">
        {["Classic", "Wildflower", "Modern"].map((t) => (
          <TouchableOpacity
            key={t}
            className="flex-1 py-3 items-center"
            onPress={() => setType(t)}
          >
            <Text
              className={`font-medium ${
                type === t ? "text-[#C02C26]" : "text-gray-500"
              }`}
            >
              {t}
            </Text>
            {/* Underline for selected type */}
            {type === t && (
              <View className="h-1 bg-[#C02C26] w-full mt-1 rounded-full" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouquet Cards */}
      <View className="mt-4">
        {bouquetData[type].map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleSelectBouquet(item.id)}
            className={`bg-white rounded-xl p-4 mb-4 shadow-sm border ${
              selectedBouquetId === item.id
                ? "border-[#C02C26]"
                : "border-gray-200"
            }`}
          >
            {/* Image and Info */}
            <View className="flex-row items-center mb-4">
              <Image source={images[type]} className="w-24 h-24 rounded-lg" />
              <View className="ml-6 flex-1">
                <Text className="text-lg font-semibold">
                  {type} - {item.size}
                </Text>
                <RatingStars rating={item.rating} reviews={item.reviews} />
                <Text className="text-[#C02C26] font-bold mt-2">
                  ${item.frequency[frequency.toLowerCase()].price} /{" "}
                  {frequency === "monthly" ? "Month" : "Week"}
                </Text>
              </View>
            </View>

            {/* Bouquet Details */}
            <View className="bg-gray-100 p-2">
              <View className="flex-row justify-start items-center ">
                <Image
                  source={require("../assets/icons/CheckCircle.png")}
                  className="h-4"
                  resizeMode="contain"
                />
                <Text className="flex-row justify-start items-center text-sm text-gray-500">
                  {item.stems} stems
                </Text>
              </View>
              <View className="flex-row mt-1 ">
                <Image
                  source={require("../assets/icons/CheckCircle.png")}
                  className="h-4"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-500">
                  {item.arrangement}
                </Text>
              </View>
              <View className="flex-row mt-1 ">
                <Image
                  source={require("../assets/icons/CheckCircle.png")}
                  className="h-4"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-500">{item.desc}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Checkout Button */}
      <TouchableOpacity
        onPress={handleCheckout}
        className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
      >
        <Text className="text-white font-semibold text-lg">
          Continue To Checkout
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
  );
}
