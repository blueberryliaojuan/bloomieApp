/**
 * @file FlowerDetailScreen.js
 * @description Displays detailed flower information including image, description, price, and user reviews.
 * Allows navigation back and includes "Add to Cart" call-to-action.
 * @author Juan Liao
 * @created 2025-07-31
 * @lastModified 2025-07-31 by Juan Liao - Initial detail screen with API fetch and FlatList
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

/**
 * @component FlowerDetailScreen
 * @description Displays the details of a specific flower fetched from backend API.
 * Includes product image, name, description, price, reviews, and Add to Cart button.
 */
function FlowerDetailScreen() {
  // Determine local server address depending on platform
  const HOST =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://192.168.1.71:3000";

  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const route = useRoute();

  // Destructure route parameters passed from previous screen
  const { id, image } = route.params;

  const [flowerData, setFlowerData] = useState(null); // Store fetched flower data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  /**
   * @function fetchFlowerData
   * @description Fetches flower detail by ID from API
   * @returns {void}
   */
  useEffect(() => {
    const fetchFlowerData = async () => {
      try {
        const response = await fetch(`${HOST}/flowers?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch flower data");
        }

        const data = await response.json();
        console.log("detailed data", data);
        setFlowerData(data[0]); // Only take the first match
      } catch (err) {
        console.log("Error fetching flower data:", err);
        setError(err.message);
      } finally {
        console.log("Finished fetching flower data by id.");
        setLoading(false);
      }
    };

    fetchFlowerData();
  }, [id]);

  // ===== Render Loading State =====
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#C02C26" />
        <Text className="text-[#C02C26] font-bold mt-4">Loading...</Text>
      </SafeAreaView>
    );
  }

  // ===== Render Error State =====
  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 font-bold">{error}</Text>
      </SafeAreaView>
    );
  }

  // ===== Main Detail Layout =====
  return (
    <SafeAreaView
      className="flex-1 flex bg-white w-full relative"
      style={{ maxWidth: screenWidth }}
    >
      {/* ===== Header with Back Button and Logo ===== */}
      <View className="flex flex-row items-center justify-between px-8 ">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/icons/left.png")}
            className="h-8 w-8"
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Image
          source={require("../assets/logoBlack.png")}
          className="h-8 w-24"
          resizeMode="contain"
        />
        {/* Placeholder for symmetry layout (e.g. heart icon, not functional now) */}
        <Image
          source={require("../assets/icons/heart.png")}
          className="h-8 w-8 opacity-0"
          resizeMode="contain"
        />
      </View>

      {/* ===== Flower Image ===== */}
      <View className="flex items-center w-full h-[220] mt-8 ">
        <Image source={image} className="h-full w-full" resizeMode="contain" />
      </View>

      {/* ===== Flower Info Section ===== */}
      <View className="bg-[#F8E9E7] p-8">
        <Text className="text-[#C02C26] font-bold text-xl">
          {flowerData?.name}
        </Text>
        <Text className="text-black text-sm mt-2">
          {flowerData?.description}
        </Text>
        <Text className="text-red mt-2 text-right">
          Price: ${flowerData?.price.toFixed(2)}
        </Text>
      </View>

      {/* ===== Client Reviews Section ===== */}
      <View className="p-8 ">
        <Text className="text-[#C02C26] font-bold text-xl">Client Reviews</Text>

        <FlatList
          data={flowerData?.reviews}
          renderItem={({ item }) => {
            return (
              <View
                key={item.id.toString()}
                className="mt-4 border border-[#C02C26] p-4 rounded-lg"
              >
                <Text className="text-black text-sm">{item.comment}</Text>
                <Text className="text-[#C02C26] text-right">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </Text>
                <Text className="text-gray-500 text-xs mt-2 text-right">
                  - {item.user}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* ===== Call To Action: Add to Cart Button ===== */}
      <View className="flex items-center justify-center p-8 absolute bottom-0 left-0 right-0">
        <View className="bg-[#C02C26] w-full max-w-[280px] h-14 rounded-full flex items-center justify-center">
          <Text className="text-white font-bold text-m">Add to Cart</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default FlowerDetailScreen;
