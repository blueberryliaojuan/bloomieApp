import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";

function FlowerCard({
  id,
  image,
  name,
  price,
  isFavorite,
  onToggleFavorite,
  onClickCard,
}) {
  return (
    <TouchableOpacity
      onPress={onClickCard}
      className="mb-8 w-[48%] self-start mr-[4%] relative"
    >
      {/* Flower Image */}
      <Image
        source={image}
        className="w-full h-[160] rounded-t-lg object-cover"
      />

      {/* Flower Name and Price */}
      <View className="p-2 items-center bg-white rounded-b-lg w-full">
        <Text className="self-start text-base font-medium text-gray-800 mb-4">
          {name}
        </Text>
        <Text className="self-end text-sm font-semibold text-gray-600 mb-4">
          ${price}
        </Text>
      </View>

      {/* Favorite Icon */}
      <View className="w-8 h-8 absolute top-2 right-2 bg-white/50 rounded-full p-1">
        <Icon
          name="heart"
          type="font-awesome" // icon type
          color={isFavorite ? "#C02C26" : "#eeeeee"}
          size={20}
          onPress={() => onToggleFavorite()}
        />
      </View>
    </TouchableOpacity>
  );
}

export default FlowerCard;
