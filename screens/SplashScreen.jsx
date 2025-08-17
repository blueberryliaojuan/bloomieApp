/**
 * File: SplashScreen.js
 * Description: Shows the splash screen animation and app logo.
 *              After 2 seconds, navigates to onboarding or login based on completion status.
 * Author: Juan Liao
 * Created: 2025-06
 */

import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import LottieView from "lottie-react-native";
import { onboardingManager } from "../services/OnboardingManager.js";

function SplashScreen({ navigation }) {
  const [playAnimation, setPlayAnimation] = useState(false);
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setPlayAnimation(true);
    }, 500);

    async function checkOnboarding() {
      await onboardingManager.loadFlag();
      if (onboardingManager.isCompleted()) {
        navigation.replace("login"); // Navigate to login if onboarding done
      } else {
        navigation.replace("onboarding"); // Otherwise navigate to onboarding
      }
    }
    const timer = setTimeout(() => {
      checkOnboarding();
    }, 2000); // Delay navigation for splash animation

    return () => clearTimeout(timer); // Clear timeout on unmount
  }, [navigation]);

  return (
    <View className="flex-1 flex flex-col justify-center items-center bg-[#C02C26]">
      <LottieView
        source={require("../assets/animations/bloomieLogo.json")}
        autoPlay={playAnimation}
        loop={false}
        style={{ width: 300, height: 300, alignSelf: "center" }}
      />
      <Image
        source={require("../assets/logoWhite.png")}
        style={{ height: 60, marginTop: 40, alignSelf: "center" }}
        resizeMode="contain"
      />
    </View>
  );
}

export default SplashScreen;
