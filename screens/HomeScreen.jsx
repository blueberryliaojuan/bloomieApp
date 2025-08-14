import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RatingStars from "../components/RatingStar";

import classicImg from "../assets/images/home/classic.png";
import wildflowerImg from "../assets/images/home/wild.png";
import modernImg from "../assets/images/home/modern.png";

const bouquetImages = {
  Classic: classicImg,
  Wildflower: wildflowerImg,
  Modern: modernImg,
};
export default function HomeScreen() {
  const navigation = useNavigation();
  const [bouquetData, setBouquetData] = useState(null);
  const [type, setType] = useState(null); // 当前选中类型
  const [frequency, setFrequency] = useState("monthly");

  useEffect(() => {
    fetch("http://192.168.1.71:3000/bouquetData")
      .then((res) => res.json())
      .then((data) => {
        setBouquetData(data);
        setType(Object.keys(data)[0]); // 默认第一个类型高亮
      })
      .catch((err) => console.error("Fetch bouquetData error:", err));
  }, []);

  if (!bouquetData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header Logo */}
      <View className="items-center pt-16 pb-4">
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
      </View>

      {/* Hero Banner */}
      <View className="px-4 mt-4">
        <View className="rounded-xl overflow-hidden">
          <Image
            source={require("../assets/images/home/homeBanner.png")}
            className="w-full h-60"
            resizeMode="cover"
          />
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 justify-end p-4">
            <Text className="text-white text-lg font-semibold">
              Fresh Flowers Delivered to Your Door
            </Text>
            <TouchableOpacity
              className="mt-2 bg-[#C02C26] px-4 py-2 rounded-lg self-start"
              onPress={() => {
                navigation.navigate("plan"); // 跳转并传 type
              }}
            >
              <Text className="text-white font-semibold">Save 10% on Plan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Choose Subscription Button */}
        <TouchableOpacity
          className="mt-4 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
          onPress={() => navigation.navigate("plan")}
        >
          <Text className="text-white font-semibold text-lg">
            Choose Your Subscription
          </Text>
          <View className="absolute right-0 h-14 w-14 rounded-full bg-[#ECBDC9] items-center justify-center">
            <Image
              source={require("../assets/icons/ArrowUpRight.png")}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Choose Your Style */}
      <View className="mt-8 px-4">
        <Text className="text-lg font-bold mb-4">Choose Your Style</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {Object.keys(bouquetData).map((t) => (
            <TouchableOpacity
              key={t}
              className={`bg-white rounded-xl shadow h-80 w-60 mr-4 p-4 border-2 ${
                type === t ? "border-[#C02C26]" : "border-transparent"
              }`}
              onPress={() => {
                setType(t); // 高亮当前类型
                navigation.navigate("plan", { type: t }); // 跳转并传 type
              }}
            >
              <View className="items-center justify-center h-48">
                <Image
                  source={bouquetImages[t]}
                  className="h-40 rounded-lg"
                  resizeMode="contain"
                />
              </View>

              <View className="p-3">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold">{t}</Text>
                  <Text className="text-[#C02C26] font-bold">
                    ${bouquetData[t][0].frequency[frequency].price}/
                    {frequency === "monthly" ? "Month" : "Week"}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                  {bouquetData[t][0].desc}
                </Text>
                <View className="flex-row items-center mt-2">
                  <RatingStars
                    rating={bouquetData[t][0].rating}
                    reviews={bouquetData[t][0].reviews}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Why Choose Bloome */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-bold mb-4">Why Choose Bloome?</Text>

        <View className="bg-white rounded-xl shadow p-4 mb-3 flex-row items-center">
          {/* <Text className="text-[#C02C26] mr-3"></Text> */}
          <Image
            source={require("../assets/icons/Package.png")}
            className="w-8 h-8 rounded-t-xl  mr-4"
            resizeMode="cover"
          />
          <View>
            <Text className="font-semibold">Fresh Flowers Delivered</Text>
            <Text className="text-gray-500 text-sm">Right to your door</Text>
          </View>
        </View>

        <View className="bg-white rounded-xl shadow p-4 mb-3 flex-row items-center">
          <Image
            source={require("../assets/icons/Flower.png")}
            className="w-8 h-8 rounded-t-xl  mr-4"
            resizeMode="cover"
          />
          <View>
            <Text className="font-semibold">Expert Curation</Text>
            <Text className="text-gray-500 text-sm">
              Hand picked by professional florists
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-xl shadow p-4 flex-row items-center">
          <Image
            source={require("../assets/icons/CalendarCheck.png")}
            className="w-8 h-8 rounded-t-xl mr-4"
            resizeMode="cover"
          />
          <View>
            <Text className="font-semibold">Flexible Schedule</Text>
            <Text className="text-gray-500 text-sm">
              Weekly, monthly or anytime
            </Text>
          </View>
        </View>
      </View>

      {/* Testimonial */}
      <View className="mt-6 px-4 pb-10">
        <View className="bg-white rounded-xl shadow p-4">
          <Text className="text-yellow-500">★★★★★</Text>
          <Text className="text-gray-700 mt-2">
            "Bloome has transformed my home! The flowers are always fresh and
            beautifully arranged. I love the surprise of seeing what arrives
            each week."
          </Text>
          <Text className="mt-2 text-gray-500">— Sarah M., San Francisco</Text>
        </View>
      </View>
    </ScrollView>
  );
}
