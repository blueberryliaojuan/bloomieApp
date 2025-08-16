/**
 * File: LoginScreen.js
 * Description: Login screen with form validation, login logic, and session restore.
 *              Uses react-hook-form and yup for form handling and validation.
 *              On successful login, navigates to home screen.
 *              Supports guest login and navigation to sign up screen.
 * Author: Juan Liao
 * Created: 2025-08
 */

import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUserState } from "../services/UserState.js";
import { loginManager } from "../services/LoginManager.js";

// Define Yup validation schema for email and password
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const { user, setUser, clearUser } = useUserState(); // Custom user state
  const [loginError, setLoginError] = useState(""); // Display login errors
  const route = useRoute(); // Access route params

  // Setup react-hook-form with default values and validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "liam@bloomie.com",
      password: "password01",
    },
    resolver: yupResolver(schema),
  });

  /**
   * useEffect: Restore user session on component mount
   * If a saved session exists, navigate directly to the main screen
   */
  useEffect(() => {
    async function restoreUser() {
      const savedUser = await loginManager.loadSession();
      if (savedUser) {
        setUser(savedUser);
        navigation.replace("main");
      }
    }
    restoreUser();
  }, [navigation]);

  /**
   * onLogin: Handle login form submission
   * - Calls loginManager to authenticate
   * - Sets user state on success
   * - Redirects based on origin (profile, plan checkout, or main)
   */
  const onLogin = async (data) => {
    setLoginError("");
    console.log("onLogin data", data);

    const result = await loginManager.login(data.email, data.password);

    if (result.success) {
      setLoginError("");
      setUser(result.user);

      // Navigate based on origin page
      if (route.params?.from === "profile") {
        navigation.replace("profile"); // Go back to Profile
      } else if (route.params?.from === "planCheckout") {
        navigation.navigate("main", {
          screen: "plan",
          params: {
            screen: "planCheckout",
            params: {
              frequency: route.params?.frequency,
              bouquetId: route.params?.bouquetId,
              type: route.params?.type,
            },
          },
        });
      } else {
        navigation.replace("main"); // Default: go to main
      }
    } else {
      setLoginError(result.message); // Show login error
    }
  };

  /**
   * onLoginAsGuest: Skip login and navigate to main screen
   */
  const onLoginAsGuest = () => {
    navigation.replace("main");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Top section with logo and welcome text */}
      <View
        className=" bg-[#C02C26] p-8 justify-end relative overflow-hidden"
        style={{ flex: 1, maxHeight: "33%" }}
      >
        {/* Decorative shadow images */}
        <Image
          source={require("../assets/flowerLogoShadow.png")}
          className="absolute -top-8 -left-2 w-48 h-48"
          style={{ transform: [{ rotate: "45deg" }] }}
        />
        <Image
          source={require("../assets/flowerLogoShadow.png")}
          className="absolute -bottom-12 -right-8 w-48 h-48"
          style={{ transform: [{ rotate: "120deg" }] }}
        />
        {/* Center logo */}
        <View className="absolute inset-0 flex justify-center items-center">
          <Image
            source={require("../assets/logoWhite.png")}
            style={{ height: 48, marginTop: -16 }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-4xl font-bold text-white mb-1">Welcome</Text>
        <Text className="text-white text-lg  mb-2">Log in to your account</Text>
      </View>

      {/* Form section */}
      <View className="flex-2 px-12 pt-8 mt-16">
        {/* Email input */}
        <Text className="text-gray-600 font-semibold mb-2">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border-b border-gray-300 pb-2 mb-1 text-gray-900"
              placeholder="Your email"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mb-4">{errors.email.message}</Text>
        )}

        {/* Password input */}
        <Text className="text-gray-600 font-semibold mb-2 mt-12">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border-b border-gray-300 pb-2 mb-1 text-gray-900"
              placeholder="Your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 mb-4">{errors.password.message}</Text>
        )}

        {/* Display login error if exists */}
        {loginError ? (
          <Text className="text-red-500 mb-4">{loginError}</Text>
        ) : null}

        {/* Login button */}
        <TouchableOpacity
          onPress={handleSubmit(onLogin)}
          className="border border-[#C02C26] bg-[#C02C26] rounded-full py-3 px-10 items-center mt-24"
        >
          <Text className="text-white font-semibold text-lg">Log In</Text>
        </TouchableOpacity>

        {/* Guest login button */}
        <TouchableOpacity
          onPress={handleSubmit(onLoginAsGuest)}
          className="border border-[#C02C26] mt-12  rounded-full py-3 px-10 items-center"
        >
          <Text className="text-[#C02C26] text-lg">Continue as guest</Text>
        </TouchableOpacity>

        {/* Navigate to Sign Up screen */}
        <TouchableOpacity
          onPress={() => navigation.navigate("signUp")}
          className="mt-6 items-center"
        >
          <Text className="text-[#C02C26] ">
            Don’t have an account?{"  "}
            <Text className=" underline font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
