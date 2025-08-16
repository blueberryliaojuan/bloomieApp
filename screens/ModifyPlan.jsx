/**
 * @file ModifySubscriptionScreen.jsx
 * @description Modify user's flower subscription plan with live preview and JSON Server integration
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
  const [bouquetData, setBouquetData] = useState({});

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

  const deliveryOptions = [
    { id: "Weekly", label: "Weekly", desc: "Every week", save: "Save 10%" },
    { id: "Monthly", label: "Monthly", desc: "Once a month" },
  ];

  const schema = yup.object().shape({
    bouquetStyle: yup.string().required(),
    bouquetSize: yup.string().required(),
    delivery: yup.string().required(),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bouquetStyle: "Classic",
      bouquetSize: "Medium",
      delivery: "Weekly",
    },
    resolver: yupResolver(schema),
  });

  const values = watch();

  // Fetch subscription and bouquetData
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const bouquetRes = await fetch(`http://192.168.1.71:3000/bouquetData`);
        const bouquetJson = await bouquetRes.json();
        setBouquetData(bouquetJson);

        const subRes = await fetch(
          `http://192.168.1.71:3000/subscriptions?userId=${user.id}`
        );
        const subJson = await subRes.json();
        if (subJson.length > 0) {
          const sub = subJson[0];
          const typeData = bouquetJson[sub.type];
          if (!dataLoaded) {
            // 确保只 reset 一次
            reset({
              bouquetStyle: sub.type,
              bouquetSize:
                typeData.find((b) => b.id === sub.bouquetId)?.size ||
                typeData[0].size,
              delivery: sub.frequency,
            });
            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      // 获取当前选择的 bouquet 对象
      const typeData = bouquetData[data.bouquetStyle];
      const bouquetObj = typeData.find((b) => b.size === data.bouquetSize);

      // 计算价格
      const price =
        bouquetObj?.frequency[data.delivery.toLowerCase()]?.price || 0;

      // 计算下一次送货日期和 upcomingDeliveries
      const now = new Date();
      const frequency = data.delivery;
      const bouquetName = `${data.bouquetStyle} Bouquet`;

      const addDeliveryDate = (baseDate, times) => {
        const d = new Date(baseDate);
        if (frequency.toLowerCase() === "monthly") {
          d.setMonth(d.getMonth() + times);
        } else {
          d.setDate(d.getDate() + 7 * times);
        }
        return d.toISOString().split("T")[0];
      };

      const upcomingDeliveries = [];
      for (let i = 1; i <= 3; i++) {
        const deliveryDate = addDeliveryDate(now, i);
        upcomingDeliveries.push({
          date: deliveryDate,
          name: bouquetName,
          status: i === 1 ? "confirmed" : "scheduled",
        });
      }

      const nextDelivery = upcomingDeliveries[0].date;

      // 先 fetch 用户订阅，拿到 subscription 的真实 id
      const subRes = await fetch(
        `http://192.168.1.71:3000/subscriptions?userId=${user.id}`
      );
      const subs = await subRes.json();
      if (subs.length === 0) {
        Alert.alert("Error", "No subscription found");
        return;
      }
      const subId = subs[0].id;

      // PATCH 更新订阅
      const updateRes = await fetch(
        `http://192.168.1.71:3000/subscriptions/${subId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: data.bouquetStyle,
            bouquetName: `${data.bouquetStyle} Bouquet`,
            bouquetId: bouquetObj?.id,
            size: data.bouquetSize,
            frequency: data.delivery,
            price,
            nextDelivery,
            upcomingDeliveries,
          }),
        }
      );

      if (updateRes.ok) {
        Alert.alert("Success", "Subscription updated!");
        navigation.navigate("mySubscription");
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

  const currentSizes = bouquetData[values.bouquetStyle] || [];
  const currentBouquetObj = currentSizes.find(
    (b) => b.size === values.bouquetSize
  );
  const currentPrice =
    currentBouquetObj?.frequency[values.delivery.toLowerCase()]?.price || 0;

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
        <Text className="text-2xl font-bold mb-4">Modify Subscription</Text>

        {/* Bouquet Style */}
        <Text className="text-lg font-semibold mb-2">Bouquet Style</Text>
        {bouquetData && (
          <Controller
            control={control}
            name="bouquetStyle"
            render={() =>
              bouquetStyles.map((item) => {
                const selected = values.bouquetStyle === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setValue("bouquetStyle", item.id);
                    }}
                    className={`flex-row items-center p-3 border rounded-lg mb-3 ${
                      selected
                        ? "border-[#C02C26] bg-[#FEECEC]"
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
                            <Text className="text-white text-xs">
                              {item.badge}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-500">{item.subtitle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            }
          />
        )}
        {errors.bouquetStyle && (
          <Text className="text-red-500 mb-3">
            {errors.bouquetStyle.message}
          </Text>
        )}

        {/* Bouquet Size */}
        <Text className="text-lg font-semibold mb-2 mt-4">Bouquet Size</Text>
        <Controller
          control={control}
          name="bouquetSize"
          render={() => (
            <View className="flex-row justify-between mb-5">
              {currentSizes.map((size) => {
                const selected = values.bouquetSize === size.size;
                const price =
                  size.frequency[values.delivery.toLowerCase()]?.price;
                return (
                  <TouchableOpacity
                    key={size.size}
                    onPress={() => setValue("bouquetSize", size.size)}
                    className={`flex-1 items-center border rounded-lg p-3 mx-1 ${
                      selected
                        ? "border-[#C02C26] bg-[#FEECEC]"
                        : "border-gray-300"
                    }`}
                  >
                    <Text className="text-base font-semibold">{size.size}</Text>
                    <Text className="text-gray-500">{size.stems} stems</Text>
                    <Text
                      className={`mt-2 font-bold ${
                        selected ? "text-[#C02C26]" : "text-black"
                      }`}
                    >
                      ${price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.bouquetSize && (
          <Text className="text-red-500 mb-3">
            {errors.bouquetSize.message}
          </Text>
        )}

        {/* Delivery Frequency */}
        <Text className="text-lg font-semibold mb-2 mt-4">
          Delivery Frequency
        </Text>
        <Controller
          control={control}
          name="delivery"
          render={() =>
            deliveryOptions.map((opt) => {
              const selected = values.delivery === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setValue("delivery", opt.id)}
                  className={`flex-1 mx-1 my-2 p-4 border rounded-lg mb-3 ${
                    selected
                      ? "bg-[#FEECEC] border-[#C02C26]"
                      : "border-gray-300"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className={`text-base font-semibold `}>
                        {opt.label}
                      </Text>
                      <Text>{opt.desc}</Text>
                    </View>
                    {opt.save && (
                      <View className="absolute right-12 top-3 bg-[#F5BBC9] px-2 py-1 rounded-full">
                        <Text className="text-[#C02C26] text-xs">
                          {opt.save}
                        </Text>
                      </View>
                    )}
                    {selected && (
                      <Image
                        source={require("../assets/icons/CheckCircle.png")}
                        className="w-6 h-6"
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          }
        />
        {errors.delivery && (
          <Text className="text-red-500 mb-3">{errors.delivery.message}</Text>
        )}

        {/* Your New Plan */}
        <Text className="text-lg font-semibold mb-3">Your New Plan</Text>
        <View className="border rounded-lg p-4 border-[#C02C26] mb-6 bg-[#FEECEC]">
          <Text className="font-semibold">
            {values.bouquetStyle} - {values.bouquetSize}
          </Text>
          <Text className="text-gray-500">Delivery: {values.delivery}</Text>
          <Text className="text-[#C02C26] font-bold mt-2">
            ${currentPrice} / {values.delivery}
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white font-semibold text-lg">Save Changes</Text>
          <View className="absolute right-0 h-14 w-14 rounded-full bg-[#FEECEC] items-center justify-center">
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
