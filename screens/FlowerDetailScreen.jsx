/**
 * @file FlowerDetailScreen.js
 * @description Displays detailed flower information including image, description, price, and user reviews using API.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import RatingStar from "../components/RatingStar"; // 假设你已有这个组件

function FlowerDetailScreen() {
  const HOST =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://192.168.1.71:3000";

  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const route = useRoute();
  const { id, image } = route.params;

  const [flowerData, setFlowerData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  const handlePress = () => {
    // 这里可以加实际的购物车逻辑
    setAdded(true);
    // 可选：几秒后自动恢复按钮状态
    setTimeout(() => setAdded(false), 2000);
  };

  useEffect(() => {
    const fetchFlowerData = async () => {
      try {
        // 获取花卉信息
        const resFlower = await fetch(`${HOST}/flowers?id=${id}`);
        const dataFlower = await resFlower.json();
        const flower = dataFlower[0];
        setFlowerData(flower);

        // 获取对应评论
        const resComments = await fetch(`${HOST}/comments?flowerId=${id}`);
        const dataComments = await resComments.json();
        setComments(dataComments);
      } catch (err) {
        console.error(err);
        setError("Failed to load flower details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlowerData();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#C02C26" />
        <Text className="text-[#C02C26] font-bold mt-4">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 font-bold">{error}</Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-white relative"
      style={{ maxWidth: screenWidth }}
    >
      <View className="items-center pt-16 pb-4 relative">
        <TouchableOpacity
          className="absolute left-4"
          style={{
            top: "180%",
          }}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/icons/left.png")}
            className="h-8 w-8"
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
      </View>

      <ScrollView className="px-4">
        {/* Flower Image */}
        <View className="flex items-center w-full h-[220] mt-8 ">
          <Image
            source={image}
            className="h-full w-full"
            resizeMode="contain"
          />
        </View>

        {/* Flower Info */}
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

        {/* Client Reviews */}
        <View className="p-8 ">
          <Text className="text-[#C02C26] font-bold text-xl">
            Client Reviews
          </Text>

          {comments.length === 0 ? (
            <Text className="text-gray-500 mt-4">No reviews yet.</Text>
          ) : (
            <View className="mt-4">
              {comments.map((item) => (
                <View
                  key={item.id.toString()}
                  className="mt-4 border border-[#C02C26] p-4 rounded-lg"
                >
                  <Text className="text-black text-sm">{item.content}</Text>
                  <View className="mt-1">
                    <RatingStar rating={item.rating} />
                  </View>
                  <Text className="text-gray-500 text-xs mt-2 text-right">
                    - Anonymous User {item.userId}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Add to Cart */}
        <View className="px-4">
          <TouchableOpacity
            onPress={handlePress}
            className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
          >
            <Text className="text-white font-semibold text-lg">
              {added ? "Added to Cart" : "Add to Cart"}
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
      </ScrollView>
    </View>
  );
}

export default FlowerDetailScreen;
