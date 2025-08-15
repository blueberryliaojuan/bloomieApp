// ModifySubscriptionScreen.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
export default function ModifySubscriptionScreen() {
  const navigation = useNavigation();
  const [bouquetStyle, setBouquetStyle] = useState("Classic");
  const [bouquetSize, setBouquetSize] = useState("Medium");
  const [delivery, setDelivery] = useState("Weekly");

  const bouquetStyles = [
    {
      id: "Classic",
      title: "Classic",
      subtitle: "Traditional roses and seasonal flowers",
      badge: "Popular",
      img: require("../assets/images/home/classic.png"),
    },
    {
      id: "Wildflower",
      title: "Wildflower",
      subtitle: "Natural, rustic arrangement",
      img: require("../assets/images/home/wild.png"),
    },
    {
      id: "Modern",
      title: "Modern",
      subtitle: "Clean and contemporary blooms",
      img: require("../assets/images/home/modern.png"),
    },
  ];

  const bouquetSizes = [
    { id: "Small", label: "Small", desc: "6-8 stems", price: 25 },
    { id: "Medium", label: "Modern", desc: "10-12 stems", price: 35 },
    { id: "Large", label: "Large", desc: "15-18 stems", price: 50 },
  ];

  const deliveryOptions = [
    { id: "Weekly", label: "Weekly", desc: "Every week" },
    { id: "Monthly", label: "Monthly", desc: "Once a month", save: "Save 10%" },
  ];

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
      <ScrollView className="px-4  mt-4">
        {/* Title */}

        <Text className="text-2xl font-bold mb-1">Modify Subscription</Text>
        <Text className="text-gray-500 mb-5">
          Customize your perfect flower plan
        </Text>

        {/* Bouquet Style */}
        <Text className="text-lg font-semibold mb-3">Bouquet Style</Text>
        {bouquetStyles.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setBouquetStyle(item.id)}
            className={`flex-row items-center p-3 border rounded-lg mb-3 ${
              bouquetStyle === item.id ? "border-[#C02C26]" : "border-gray-300"
            }`}
          >
            <Image source={item.img} className="w-12 h-12 mr-3" />
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-base font-semibold mr-2">
                  {item.title}
                </Text>
                {item.badge && (
                  <View className="bg-[#C02C26] px-2 py-0.5 rounded-full">
                    <Text className="text-white text-xs">{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-500">{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bouquet Size */}
        <Text className="text-lg font-semibold mb-3">Bouquet Size</Text>
        <View className="flex-row justify-between mb-5">
          {bouquetSizes.map((size) => (
            <TouchableOpacity
              key={size.id}
              onPress={() => setBouquetSize(size.id)}
              className={`flex-1 items-center border rounded-lg p-3 mx-1 ${
                bouquetSize === size.id ? "border-[#C02C26]" : "border-gray-300"
              }`}
            >
              <Text className="text-base font-semibold">{size.label}</Text>
              <Text className="text-gray-500">{size.desc}</Text>
              <Text
                className={`mt-2 font-bold ${
                  bouquetSize === size.id ? "text-[#C02C26]" : "text-black"
                }`}
              >
                ${size.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Frequency */}
        <Text className="text-lg font-semibold mb-3">Delivery Frequency</Text>
        {deliveryOptions.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => setDelivery(opt.id)}
            className={`flex-row items-center justify-between p-4 border rounded-lg mb-3 ${
              delivery === opt.id
                ? "bg-[#C02C26] border-[#C02C26]"
                : "border-gray-300"
            }`}
          >
            <View>
              <Text
                className={`text-base font-semibold ${
                  delivery === opt.id ? "text-white" : "text-black"
                }`}
              >
                {opt.label}
              </Text>
              <Text
                className={`${
                  delivery === opt.id ? "text-white" : "text-gray-500"
                }`}
              >
                {opt.desc}
              </Text>
            </View>
            {opt.save && (
              <View className="bg-pink-100 px-2 py-1 rounded-full">
                <Text className="text-pink-500 text-xs">{opt.save}</Text>
              </View>
            )}
            {delivery === opt.id && (
              <Text className="text-white font-bold">✓</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Your New Plan */}
        <Text className="text-lg font-semibold mb-3">Your New Plan</Text>
        <View className="border rounded-lg p-4 border-red-200 mb-6">
          <Text className="font-semibold">
            {bouquetStyle} - {bouquetSize}
          </Text>
          <Text className="text-gray-500">Delivery: {delivery}</Text>
          <Text className="text-[#C02C26] font-bold mt-2">
            $35 / {delivery}
          </Text>
        </View>

        {/* Save Button */}

        <TouchableOpacity
          className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
          onPress={() => navigation.navigate("profile")}
        >
          <Text className="text-white font-semibold text-lg">Save Changes</Text>
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
