import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

function FlowerCard({ image, name, price, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} className="mb-8 w-40 self-center">
      {/* Flower Image */}
      <Image source={image} className="w-40 h-40 rounded-t-lg object-cover" />

      {/* Flower Name and Price */}
      <View className="p-2 items-center bg-white rounded-b-lg">
        <Text className="text-pretty self-start text-m h-10 text-gray-800 mb-1">
          {name}
        </Text>
        <Text className="text-sm font-semibold self-end text-gray-600 mb-md-2">
          ${price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default FlowerCard;
