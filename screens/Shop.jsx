import React from "react";
import { Image, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";

function Shop() {
  return (
    <SafeAreaView>
      <View className="flex flex-row items-center justify-start">
        <Image
          source={require("../assets/flowerLogoRed.png")}
          className="w-10 h-10 ml-4 mt-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-bold ml-2 mt-4">Good morning, Ella</Text>
      </View>
      <View className=" mt-5 px-4">
        <InputField
          placeholder="Search"
          className="border border-slate-400 rounded-xl p-2"
        />
      </View>
    </SafeAreaView>
  );
}

export default Shop;
