/**
 * @file OnBoardingScreen.jsx
 * @description Onboarding screens for Bloome flower app.
 *              Uses react-native-onboarding-swiper to show 3 intro slides.
 *              Custom Skip, Next, and Done buttons with original rounded styles.
 *              Navigates to login screen after skipping or finishing onboarding.
 * @author Juan
 * @date 2025-08
 */

import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

// Get device screen width for responsive images
const { width: screenWidth } = Dimensions.get("window");

function OnBoardingScreen({ navigation }) {
  // Custom Skip button
  const SkipButton = (props) => (
    <TouchableOpacity
      {...props}
      className="px-8 py-4 rounded-tl-[100%] rounded-bl-[100%] bg-[#C02C26] rounded-full items-center justify-center active:opacity-70"
    >
      <Text className="text-white font-semibold text-base">Skip</Text>
    </TouchableOpacity>
  );

  // Custom Next button
  const NextButton = (props) => (
    <TouchableOpacity
      {...props}
      className="px-8 py-4 rounded-tr-[100%] rounded-br-[100%] bg-[#C02C26] rounded-full items-center justify-center active:opacity-70"
    >
      <Text className="text-white font-semibold text-base">Next</Text>
    </TouchableOpacity>
  );

  // Custom Done button
  const DoneButton = (props) => (
    <TouchableOpacity
      {...props}
      className="px-8 py-4 rounded-tr-[100%] rounded-br-[100%] bg-[#C02C26] rounded-full items-center justify-center active:opacity-70"
    >
      <Text className="text-white font-semibold text-base">Finish</Text>
    </TouchableOpacity>
  );

  return (
    <Onboarding
      onSkip={() => navigation.replace("login")}
      onDone={() => navigation.replace("login")}
      SkipButtonComponent={SkipButton}
      NextButtonComponent={NextButton}
      DoneButtonComponent={DoneButton}
      bottomBarHighlight={false} // disable default bottom highlight
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <View className="items-center px-6">
              <Text className="text-5xl font-bold text-[#C02C26] mb-16 text-center">
                Fresh Flowers, Delivered Regularly
              </Text>
              <Image
                source={require("../assets/images/onboarding/onboarding1.png")}
                style={{ width: screenWidth * 0.9, height: screenWidth * 0.9 }}
                resizeMode="contain"
              />
              <Text className="text-lg text-gray-600 mt-8 px-12 text-center">
                Get stunning, seasonal arrangements delivered to your home
                weekly or monthly, no effort needed.
              </Text>
            </View>
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "#fff",
          image: (
            <View className="items-center px-6">
              <Text className="text-5xl font-bold text-[#C02C26] mb-16 text-center">
                Pick Your Bloomie Plan
              </Text>
              <Image
                source={require("../assets/images/onboarding/onboarding2.png")}
                style={{ width: screenWidth * 0.9, height: screenWidth * 0.9 }}
                resizeMode="contain"
              />
              <Text className="text-lg text-gray-600 mt-8 px-12 text-center">
                Choose a bouquet style and size that fits your space and mood.
                Skip or cancel anytime.
              </Text>
            </View>
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "#fff",
          image: (
            <View className="items-center px-6">
              <Text className="text-5xl font-bold text-[#C02C26] mb-16 text-center">
                Enjoy Your Blooms
              </Text>
              <Image
                source={require("../assets/images/onboarding/onboarding3.png")}
                style={{ width: screenWidth * 0.9, height: screenWidth * 0.9 }}
                resizeMode="contain"
              />
              <Text className="text-lg text-gray-600 mt-8 px-12 text-center">
                Our florists handpick and deliver fresh flowers — beautifully
                packaged, right to your door.
              </Text>
            </View>
          ),
          title: "",
          subtitle: "",
        },
      ]}
    />
  );
}

export default OnBoardingScreen;
