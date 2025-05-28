import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

function FlowerCard({ image, name, price, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-8 w-[48%] self-start mr-[4%]"
    >
      {/* Flower Image */}
      <Image source={image} className="w-full h-40 rounded-t-lg object-cover" />

      {/* Flower Name and Price */}
      <View className="p-2 items-center bg-white rounded-b-lg w-full">
        <Text className="self-start text-base font-medium text-gray-800 mb-4">
          {name}
        </Text>
        <Text className="self-end text-sm font-semibold text-gray-600 mb-4">
          ${price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default FlowerCard;
