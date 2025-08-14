// PlanScreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import RatingStars from "../components/RatingStar";
import wildImg from "../assets/images/home/wild.png";
import classicImg from "../assets/images/home/classic.png";
import modernImg from "../assets/images/home/modern.png";

const images = {
  Classic: classicImg,
  Wildflower: wildImg,
  Modern: modernImg,
};

export default function PlanScreen() {
  const navigation = useNavigation();
  const [frequency, setFrequency] = useState("Monthly");
  const [type, setType] = useState("Classic");
  const [bouquetData, setBouquetData] = useState(null);
  const [selectedBouquetId, setSelectedBouquetId] = useState(null);

  useEffect(() => {
    fetch("http://192.168.1.71:3000/bouquetData")
      .then((res) => res.json())
      .then((data) => {
        setBouquetData(data);
      })
      .catch((err) => console.error("Fetch bouquetData error:", err));
  }, []);

  if (!bouquetData) {
    return <Text>Loading...</Text>;
  }

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
      {/* Type Tabs */}
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
            {/* 下划线 */}
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
            <View className="flex-row items-center mb-4">
              <Image source={images[type]} className="w-24 h-24 rounded-lg" />
              <View className="ml-6 flex-1">
                <Text className="text-lg font-semibold">
                  {type} - {item.size}
                </Text>
                <RatingStars rating={item.rating} reviews={item.reviews} />
                <Text className="text-[#C02C26] font-bold mt-2">
                  ${item.frequency[frequency.toLowerCase()].price} / {frequency}
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
