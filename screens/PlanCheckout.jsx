/**
 * @file ModifySubscriptionScreen.jsx
 * @description Modify user's flower subscription plan using react-hook-form + yup and JSON Server integration
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserState } from "../services/UserState.js";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function ModifySubscriptionScreen() {
  const navigation = useNavigation();
  const { user } = useUserState();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState({
    bouquetStyle: "Classic",
    bouquetSize: "Medium",
    delivery: "Weekly",
  });

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
    { id: "Medium", label: "Medium", desc: "10-12 stems", price: 35 },
    { id: "Large", label: "Large", desc: "15-18 stems", price: 50 },
  ];

  const deliveryOptions = [
    { id: "Weekly", label: "Weekly", desc: "Every week" },
    { id: "Monthly", label: "Monthly", desc: "Once a month", save: "Save 10%" },
  ];

  const schema = yup.object().shape({
    bouquetStyle: yup
      .string()
      .oneOf(bouquetStyles.map((s) => s.id))
      .required(),
    bouquetSize: yup
      .string()
      .oneOf(bouquetSizes.map((s) => s.id))
      .required(),
    delivery: yup
      .string()
      .oneOf(deliveryOptions.map((d) => d.id))
      .required(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const values = watch();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const res = await fetch(
          `http://192.168.1.71:3000/subscriptions?userId=${user.id}`
        );
        const data = await res.json();
        if (data.length > 0) {
          const sub = data[0];
          setDefaultValues({
            bouquetStyle: sub.type || "Classic",
            bouquetSize: sub.size || "Medium",
            delivery: sub.frequency || "Weekly",
          });
          setValue("bouquetStyle", sub.type || "Classic");
          setValue("bouquetSize", sub.size || "Medium");
          setValue("delivery", sub.frequency || "Weekly");
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `http://192.168.1.71:3000/subscriptions/${user.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: data.bouquetStyle,
            size: data.bouquetSize,
            frequency: data.delivery,
          }),
        }
      );
      if (res.ok) {
        Alert.alert("Success", "Subscription updated!");
        navigation.navigate("profile");
      } else {
        Alert.alert("Error", "Failed to update subscription");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="items-center pt-16 pb-4">
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
      </View>
      <ScrollView className="px-4 mt-4">
        <Text className="text-2xl font-bold mb-1">Modify Subscription</Text>
        <Text className="text-gray-500 mb-5">
          Customize your perfect flower plan
        </Text>

        {/* Bouquet Style */}
        <Text className="text-lg font-semibold mb-3">Bouquet Style</Text>
        <Controller
          control={control}
          name="bouquetStyle"
          render={() =>
            bouquetStyles.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setValue("bouquetStyle", item.id)}
                className={`flex-row items-center p-3 border rounded-lg mb-3 ${
                  values.bouquetStyle === item.id
                    ? "border-[#C02C26]"
                    : "border-gray-300"
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
            ))
          }
        />
        {errors.bouquetStyle && (
          <Text className="text-red-500 mb-3">
            {errors.bouquetStyle.message}
          </Text>
        )}

        {/* Bouquet Size */}
        <Text className="text-lg font-semibold mb-3">Bouquet Size</Text>
        <Controller
          control={control}
          name="bouquetSize"
          render={() => (
            <View className="flex-row justify-between mb-5">
              {bouquetSizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  onPress={() => setValue("bouquetSize", size.id)}
                  className={`flex-1 items-center border rounded-lg p-3 mx-1 ${
                    values.bouquetSize === size.id
                      ? "border-[#C02C26]"
                      : "border-gray-300"
                  }`}
                >
                  <Text className="text-base font-semibold">{size.label}</Text>
                  <Text className="text-gray-500">{size.desc}</Text>
                  <Text
                    className={`mt-2 font-bold ${
                      values.bouquetSize === size.id
                        ? "text-[#C02C26]"
                        : "text-black"
                    }`}
                  >
                    ${size.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.bouquetSize && (
          <Text className="text-red-500 mb-3">
            {errors.bouquetSize.message}
          </Text>
        )}

        {/* Delivery Frequency */}
        <Text className="text-lg font-semibold mb-3">Delivery Frequency</Text>
        <Controller
          control={control}
          name="delivery"
          render={() =>
            deliveryOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setValue("delivery", opt.id)}
                className={`flex-row items-center justify-between p-4 border rounded-lg mb-3 ${
                  values.delivery === opt.id
                    ? "bg-[#C02C26] border-[#C02C26]"
                    : "border-gray-300"
                }`}
              >
                <View>
                  <Text
                    className={`text-base font-semibold ${
                      values.delivery === opt.id ? "text-white" : "text-black"
                    }`}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    className={`${
                      values.delivery === opt.id
                        ? "text-white"
                        : "text-gray-500"
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
                {values.delivery === opt.id && (
                  <Text className="text-white font-bold">✓</Text>
                )}
              </TouchableOpacity>
            ))
          }
        />
        {errors.delivery && (
          <Text className="text-red-500 mb-3">{errors.delivery.message}</Text>
        )}

        {/* Your New Plan */}
        <Text className="text-lg font-semibold mb-3">Your New Plan</Text>
        <View className="border rounded-lg p-4 border-red-200 mb-6">
          <Text className="font-semibold">
            {values.bouquetStyle} - {values.bouquetSize}
          </Text>
          <Text className="text-gray-500">Delivery: {values.delivery}</Text>
          <Text className="text-[#C02C26] font-bold mt-2">
            {bouquetSizes.find((s) => s.id === values.bouquetSize)?.price || 35}{" "}
            / {values.delivery}
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
          onPress={handleSubmit(onSubmit)}
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
