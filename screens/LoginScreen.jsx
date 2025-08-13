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

// Yup validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const { user, setUser, clearUser } = useUserState();
  const [loginError, setLoginError] = useState("");
  const route = useRoute();
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

  // Load session when component mounts
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

  const onLogin = async (data) => {
    setLoginError("");
    console.log("onLogin data", data);
    const result = await loginManager.login(data.email, data.password);

    if (result.success) {
      setLoginError("");
      setUser(result.user);
      //if it's from profile page
      if (route.params?.from === "profile") {
        navigation.replace("profile"); // go back to Profile
      } else {
        navigation.replace("main");
      }
    } else {
      setLoginError(result.message);
    }
  };

  const onLoginAsGuest = () => {
    navigation.replace("main");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View
        className=" bg-[#C02C26] p-8 justify-end relative overflow-hidden"
        style={{ flex: 1, maxHeight: "33%" }}
      >
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

      <View className="flex-2 px-12 pt-8 mt-16">
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

        {loginError ? (
          <Text className="text-red-500 mb-4">{loginError}</Text>
        ) : null}

        <TouchableOpacity
          onPress={handleSubmit(onLogin)}
          className="border border-[#C02C26] bg-[#C02C26] rounded-full py-3 px-10 items-center mt-24"
        >
          <Text className="text-white font-semibold text-lg">Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit(onLoginAsGuest)}
          className="border border-[#C02C26] mt-12  rounded-full py-3 px-10 items-center"
        >
          <Text className="text-[#C02C26] text-lg">Continue as guest</Text>
        </TouchableOpacity>

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
