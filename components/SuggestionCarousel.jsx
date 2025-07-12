import React, { useRef } from "react";
import { Dimensions, Image, View, Text, TouchableOpacity } from "react-native";
import Carousel from "react-native-anchor-carousel";
import { Icon } from "@rneui/themed";

const { width: screenWidth } = Dimensions.get("window");

export default function SuggestionCarousel({ data, imageMap, onAddFavorite }) {
  const carouselRef = useRef(null);

  const handleAddFavorite = async (id) => {
    try {
      await onAddFavorite(id);
    } catch (err) {
      console.error("Add to favorite failed", err);
    }
  };

  if (!data || data.length === 0) {
    return null; // 数据为空不渲染
  }

  const renderItem = ({ item }) => (
    <View className="relative items-center w-[200px]" key={item.id}>
      <View className="bg-white rounded-xl shadow-md p-3 w-full">
        <TouchableOpacity
          className="absolute z-10 bottom-4 right-4"
          onPress={() => handleAddFavorite(item.id)}
        >
          <View className="w-8 h-8 bg-[#C02C26] rounded-full items-center justify-center">
            <Icon name="heart" type="font-awesome" size={16} color="white" />
          </View>
          <View className="absolute bottom-[-2px] right-[-2px] bg-white rounded-full p-[1px]">
            <Icon name="plus" type="font-awesome" size={8} color="#C02C26" />
          </View>
        </TouchableOpacity>

        <View className="w-full h-[140px] rounded-lg overflow-hidden mb-2">
          <Image
            source={imageMap[item.imageKey]}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <Text
          className="text-center font-bold text-base min-h-[44px]"
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text className="text-center text-gray-500">
          ${item.price.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const adjustedContainerWidth = Math.max(screenWidth, 200);

  return (
    <View className="h-[260px]">
      <Carousel
        style={{ flex: 1 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        itemWidth={200}
        containerWidth={adjustedContainerWidth}
        separatorWidth={8}
        ref={carouselRef}
        inActiveOpacity={0.6}
        initialIndex={0}
      />
    </View>
  );
}
