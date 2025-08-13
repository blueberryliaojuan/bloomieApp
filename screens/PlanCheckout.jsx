import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { ChevronLeftIcon } from "react-native-heroicons/outline"; // 你也可以用自己图标库或者图片代替

export default function PlanPayment() {
  const navigation = useNavigation();
  const route = useRoute();

  // 假设从上个页面传来的参数里有 bouquet info 和 frequency
  const { bouquetId, frequency } = route.params;

  // 简单state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // 订阅按钮事件
  const handleSubscribe = () => {
    // 支付逻辑
    alert("Subscription submitted!");
  };

  const handleModify = () => {
    navigation.navigate("modifyPlan", {
      frequency,
      bouquetId,
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-4 border-b border-gray-200">
        <TouchableOpacity onPress={handleModify}>
          <Text className="text-red-600 text-2xl">{"<"} </Text>
          <Text className="text-black font-bold text-lg ml-2">
            Modify Subscription11
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {/* Order Summary */}
        <Text className="text-black font-bold text-base mt-4 mb-2">
          Order Summary
        </Text>

        <View className="flex-row items-center bg-white border-b border-gray-300 pb-4 mb-4">
          <Image
            source={require("../assets/images/home/modern.png")}
            className="h-4"
            resizeMode="contain"
          />
          <View className="ml-4 flex-1">
            <Text className="text-black font-semibold text-lg">
              {/* {bouquet.type} - {bouquet.size} */}
            </Text>
            <Text className="text-gray-500">
              Fresh flowers delivered {frequency.toLowerCase()}
            </Text>
            <Text className="text-black font-bold text-lg mt-2">
              {/* ${bouquet.price} / {frequency} */}
            </Text>
          </View>
        </View>

        {/* Address Form */}
        <Text className="text-black font-bold text-base mb-2">
          Street Address
        </Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Street Address"
          className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        />

        <View className="flex-row space-x-4">
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="City"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
          <TextInput
            value={zip}
            onChangeText={setZip}
            placeholder="ZIP Code"
            className="w-24 border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
        </View>

        {/* Payment Method */}
        <Text className="text-black font-bold text-base mb-2">
          Payment Method
        </Text>

        <TextInput
          value={cardName}
          onChangeText={setCardName}
          placeholder="Cardholder Name"
          className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        />
        <TextInput
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="Card Number"
          keyboardType="numeric"
          className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        />

        <View className="flex-row space-x-4">
          <TextInput
            value={expiry}
            onChangeText={setExpiry}
            placeholder="Expiry Date"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
          <TextInput
            value={cvv}
            onChangeText={setCvv}
            placeholder="CVV"
            keyboardType="numeric"
            className="w-24 border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
        </View>

        {/* Security info */}
        <View className="bg-gray-100 p-4 rounded-md mb-28">
          <Text className="text-gray-600 text-sm">
            Your payment information is secure and encrypted
          </Text>
        </View>
      </ScrollView>

      {/* Subscribe Button */}

      <TouchableOpacity
        onPress={handleSubscribe}
        className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
      >
        <Text className="text-white font-semibold text-lg">
          Subscribe For $35/Weekly
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
  );
}
