// PlanScreen.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import RatingStars from "../components/RatingStar";
import wildImg from "../assets/images/home/wild.png";
import classicImg from "../assets/images/home/classic.png";
import modernImg from "../assets/images/home/modern.png";

import { useNavigation } from "@react-navigation/native";

const bouquetData = {
  Classic: [
    {
      id: "C1",
      size: "Small",
      price: 28,
      stems: "6 - 8",
      arrangement: "Compact arrangement",
      desc: "Perfect for apartments",
      rating: 4.6,
      reviews: 126,
    },
    {
      id: "C2",
      size: "Medium",
      price: 35,
      stems: "10 - 12",
      arrangement: "Full arrangement",
      desc: "Perfect for dining tables",
      rating: 4.8,
      reviews: 98,
    },
    {
      id: "C3",
      size: "Large",
      price: 50,
      stems: "15 - 18",
      arrangement: "Premium arrangement",
      desc: "Perfect for events",
      rating: 4.9,
      reviews: 210,
    },
  ],
  Wildflower: [
    {
      id: "W1",
      size: "Small",
      price: 24,
      stems: "6 - 8",
      arrangement: "Compact arrangement",
      desc: "Compact style",
      rating: 4.5,
      reviews: 88,
    },
    {
      id: "W2",
      size: "Medium",
      price: 30,
      stems: "10 - 12",
      arrangement: "Premium arrangement",
      desc: "Perfect for events",
      rating: 4.7,
      reviews: 112,
    },
    {
      id: "W3",
      size: "Large",
      price: 46,
      stems: "15 - 18",
      arrangement: "Bold arrangement",
      desc: "Bold design",
      rating: 4.8,
      reviews: 145,
    },
  ],
  Modern: [
    {
      id: "M1",
      size: "Small",
      price: 34,
      stems: "6 - 8",
      arrangement: "Artistic arrangement",
      desc: "Unique textures",
      rating: 4.6,
      reviews: 76,
    },
    {
      id: "M2",
      size: "Medium",
      price: 42,
      stems: "8 - 10",
      arrangement: "Contemporary arrangement",
      desc: "Unique textures",
      rating: 4.7,
      reviews: 89,
    },
    {
      id: "M3",
      size: "Large",
      price: 55,
      stems: "12 - 14",
      arrangement: "Premium artistic arrangement",
      desc: "Event-ready",
      rating: 4.9,
      reviews: 134,
    },
  ],
};

const images = {
  Classic: classicImg,
  Wildflower: wildImg,
  Modern: modernImg,
};

export default function PlanScreen() {
  const navigation = useNavigation();
  const [frequency, setFrequency] = useState("Monthly");
  const [type, setType] = useState("Classic");
  const [selectedBouquetId, setSelectedBouquetId] = useState(null);
  // 点击 bouquet 卡片
  const handleSelectBouquet = (bouquetId) => {
    // console.log("bouquetId", bouquetId);
    setSelectedBouquetId(bouquetId);
  };

  // 跳转到结算页
  const handleCheckout = () => {
    if (!selectedBouquetId) {
      alert("Please select a bouquet first");
      return;
    }
    console.log("frequency", frequency);
    console.log("selectedBouquetId", selectedBouquetId);
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
      {/* Title */}
      <Text className="text-xl font-bold mt-4 mb-4">Choose Your Plan</Text>
      {/* <Text className="text-[#C02C26] mb-4">Delivery Frequency</Text> */}

      {/* Frequency Buttons */}
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
              {freq} {freq === "Monthly" ? "(Save 10%)" : ""}
            </Text>
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
            <View className="flex-row items-center mb-4">
              <Image source={images[type]} className="w-24 h-24 rounded-lg" />
              <View className="ml-6 flex-1">
                <Text className="text-lg font-semibold">
                  {type} - {item.size}
                </Text>
                <RatingStars rating={item.rating} reviews={item.reviews} />
                <Text className="text-[#C02C26] font-bold mt-2">
                  ${item.price} / {frequency}
                </Text>
              </View>
            </View>

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
