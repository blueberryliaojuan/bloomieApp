/**
 * @file PlanPayment.jsx
 * @description Payment page for Bloome flower subscription app.
 *              Displays order summary, address form, payment inputs, and subscription button.
 *              Uses react-hook-form + yup for validation, stores data to JSON Server, and associates subscription with logged-in user.
 * @author Juan
 * @date 2025-08
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginManager } from "../services/LoginManager.js"; // 导入登录管理器

// Bouquet images
import wildImg from "../assets/images/home/wild.png";
import classicImg from "../assets/images/home/classic.png";
import modernImg from "../assets/images/home/modern.png";

// Map bouquet type to corresponding image
const images = {
  Classic: classicImg,
  Wildflower: wildImg,
  Modern: modernImg,
};

// Yup schema
const schema = yup.object().shape({
  address: yup.string().required("Street Address is required"),
  city: yup.string().required("City is required"),
  zip: yup
    .string()
    .matches(/^[A-Za-z0-9]{6}$/, "ZIP Code must be 6 alphanumeric characters")
    .required("ZIP Code is required"),
  cardName: yup.string().required("Cardholder Name is required"),
  cardNumber: yup
    .string()
    .matches(/^\d{16}$/, "Card Number must be 16 digits")
    .required("Card Number is required"),
  expiry: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY")
    .required("Expiry date is required"),
  cvv: yup
    .string()
    .matches(/^\d{3}$/, "CVV must be 3 digits")
    .required("CVV is required"),
});

export default function PlanPayment() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bouquetId, frequency, type } = route.params;

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // react-hook-form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch plan data
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch("http://192.168.1.71:3000/bouquetData");
        const data = await response.json();
        const planItem = data[type]?.find((item) => item.id === bouquetId);

        if (planItem) {
          setPlan({ ...planItem, type });
        } else {
          setPlan(null);
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [bouquetId, type]);

  // Submit form
  const onSubmit = async (formData) => {
    const currentUser = loginManager.getCurrentUser();

    if (!currentUser) {
      alert("You must be logged in to subscribe.");
      return;
    }

    // 计算下一次送货日期（示例：按frequency计算）
    const now = new Date();
    let deliveries = [];

    // helper function：根据 frequency 增加日期
    const addDeliveryDate = (baseDate, times) => {
      const d = new Date(baseDate);
      if (frequency.toLowerCase() === "monthly") {
        d.setMonth(d.getMonth() + times);
      } else {
        d.setDate(d.getDate() + 7 * times);
      }
      return d.toISOString().split("T")[0];
    };

    // 生成三条 upcomingDeliveries
    for (let i = 1; i <= 3; i++) {
      const deliveryDate = addDeliveryDate(now, i);
      deliveries.push({
        date: deliveryDate,
        name: `${plan.type} Bouquet`,
        status: i === 1 ? "confirmed" : "scheduled", // 第一条 confirmed，其余 scheduled
      });
    }

    const newSubscription = {
      userId: currentUser.id,
      bouquetId: plan.id,
      bouquetName: `${plan.type} Bouquet`,
      type: plan.type,
      frequency,
      price: plan.frequency[frequency.toLowerCase()]?.price ?? 0,
      status: "active",
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      nextDelivery: deliveries[0].date,
      upcomingDeliveries: deliveries,
    };

    console.log("newSubscription", newSubscription);

    try {
      // 先查一下该用户是否已有订阅
      const checkRes = await fetch(
        `http://192.168.1.71:3000/subscriptions?userId=${newSubscription.userId}`
      );
      const existingSubs = await checkRes.json();

      if (existingSubs.length > 0) {
        // 如果已有订阅 → 更新第一个
        const existingSub = existingSubs[0];
        await fetch(
          `http://192.168.1.71:3000/subscriptions/${existingSub.id}`,
          {
            method: "PATCH", // 或 PUT，看你需求
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSubscription),
          }
        );
      } else {
        // 否则创建新的
        await fetch("http://192.168.1.71:3000/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSubscription),
        });
      }

      // Reset form and navigate
      reset();
      navigation.navigate("profileStack", {
        screen: "mySubscription",
        params: {
          frequency,
          bouquetId: plan.id,
          type,
        },
      });
    } catch (err) {
      console.error("Error saving subscription:", err);
    }
  };
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading plan...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Plan not found</Text>
      </View>
    );
  }

  const frequencyLower = frequency.toLowerCase();
  const planPrice = plan.frequency[frequencyLower]?.price ?? 0;
  const frequencyLabel = frequencyLower === "monthly" ? "Month" : "Week";

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="px-4" keyboardShouldPersistTaps="handled">
        {/* Order Summary */}
        <Text className="text-black font-bold text-base mt-4 mb-2">
          Order Summary
        </Text>

        <View className="flex-row items-center border-b border-gray-300 pb-4 mb-4">
          <Image
            source={images[plan.type]}
            className="h-40 w-40 rounded-lg"
            resizeMode="contain"
          />
          <View className="ml-4 flex-1">
            <Text className="text-black font-semibold text-lg">
              {plan.type} Bouquet
            </Text>
            <Text className="text-gray-500">
              Fresh flowers delivered {frequencyLower}
            </Text>
            <Text className="text-black font-bold text-lg mt-2">
              ${planPrice} / {frequencyLabel}
            </Text>
          </View>
        </View>

        {/* Address */}
        <Text className="text-black font-bold text-base mb-2 mt-8">
          Street Address
        </Text>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Street Address"
              className="border border-gray-300 rounded-md px-3 py-2 mb-1"
            />
          )}
        />
        {errors.address && (
          <Text className="text-red-500 text-sm mb-3">
            {errors.address.message}
          </Text>
        )}

        <View className="flex-row">
          <View className="flex-1 mr-2">
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="City"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-1"
                />
              )}
            />
            {errors.city && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.city.message}
              </Text>
            )}
          </View>

          <View className="w-24">
            <Controller
              control={control}
              name="zip"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="ZIP"
                  keyboardType="default"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-1"
                />
              )}
            />
            {errors.zip && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.zip.message}
              </Text>
            )}
          </View>
        </View>

        {/* Payment */}
        <Text className="text-black font-bold text-base mb-2 mt-8">
          Payment Method
        </Text>

        <Controller
          control={control}
          name="cardName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Cardholder Name"
              className="border border-gray-300 rounded-md px-3 py-2 mb-1"
            />
          )}
        />
        {errors.cardName && (
          <Text className="text-red-500 text-sm mb-3">
            {errors.cardName.message}
          </Text>
        )}

        <Controller
          control={control}
          name="cardNumber"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Card Number"
              keyboardType="numeric"
              className="border border-gray-300 rounded-md px-3 py-2 mb-1"
            />
          )}
        />
        {errors.cardNumber && (
          <Text className="text-red-500 text-sm mb-3">
            {errors.cardNumber.message}
          </Text>
        )}

        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Controller
              control={control}
              name="expiry"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="MM/YY"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-1"
                />
              )}
            />
            {errors.expiry && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.expiry.message}
              </Text>
            )}
          </View>

          <View className="w-24">
            <Controller
              control={control}
              name="cvv"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="CVV"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-1"
                />
              )}
            />
            {errors.cvv && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.cvv.message}
              </Text>
            )}
          </View>
        </View>

        {/* Security info */}
        <View className="bg-gray-100 p-4 rounded-md mb-12">
          <Text className="text-gray-600 text-sm">
            Your payment information is secure and encrypted
          </Text>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="mt-4 mb-8 flex-row bg-[#C02C26] py-3 px-12 rounded-full justify-between items-center relative"
        >
          <Text className="text-white font-semibold text-lg">
            Subscribe For ${planPrice}/{frequencyLabel}
          </Text>
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
