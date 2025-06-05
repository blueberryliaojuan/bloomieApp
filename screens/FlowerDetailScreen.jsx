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

function FlowerDetailScreen() {
  const HOST =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000";

  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const route = useRoute();
  const { id, image } = route.params; // get id from URL
  const [flowerData, setFlowerData] = useState(null); // flower detail data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state
  useEffect(() => {
    const fetchFlowerData = async () => {
      try {
        const response = await fetch(`${HOST}/flowers?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch flower data");
        }
        const data = await response.json();
        console.log("detailed data", data);
        setFlowerData(data[0]); // get the first flower data from the array
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

  if (loading) {
    // show loading indicator
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#C02C26" />
        <Text className="text-[#C02C26] font-bold mt-4">Loading...</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    // indicate wrong
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 font-bold">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 flex bg-white w-full max-w-[screenWidth] relative">
      {/* header */}
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
        <Image
          source={require("../assets/icons/heart.png")}
          className="h-8 w-8"
          resizeMode="contain"
        />
      </View>
      {/* image */}
      <View className="flex items-center w-full h-[220] mt-8 ">
        <Image source={image} className="h-full w-full" resizeMode="contain" />
      </View>
      {/* info */}
      <View className="bg-[#F8E9E7]  p-8">
        <Text className="text-[#C02C26] font-bold text-xl">
          {flowerData && flowerData.name}
        </Text>
        <Text className="text-black text-sm mt-2">
          {flowerData && flowerData.description}
        </Text>
        <Text className="text-red mt-2 text-right">
          Price: ${flowerData && flowerData.price.toFixed(2)}
        </Text>
      </View>
      {/* reviews */}
      <View className="p-8 ">
        <Text className="text-[#C02C26] font-bold text-xl">Client Reviews</Text>

        <FlatList
          data={flowerData && flowerData.reviews}
          renderItem={({ item }) => {
            return (
              <View className="mt-4 border border-[#C02C26] p-4 rounded-lg">
                <Text className="text-black text-sm ">{item.comment}</Text>

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
          keyExtractor={(item) => item.user}
        ></FlatList>
      </View>
      {/* CTA */}
      <View className="flex items-center justify-center p-8 absolute bottom-0 left-0 right-0">
        <View className="bg-[#C02C26] w-full max-w-[280px] h-14 rounded-full flex items-center justify-center">
          <Text className="text-white font-bold text-m">Add to Cart</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default FlowerDetailScreen;
