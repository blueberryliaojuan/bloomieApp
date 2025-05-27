import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";

function SplashScreen({ navigation }) {
  useEffect(() => {
    // Simulate a splash screen delay
    const timer = setTimeout(() => {
      // Navigate to the home screen after 2s
      navigation.replace("home");
      console.log("Splash screen finished, navigate to HomeScreen");
    }, 2000); //

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigation]);
  return (
    <View className="flex-1 flex flex-col justify-center items-center bg-[#D10F17]">
      {/* <Text> SplashComponent </Text> */}
      {/* the Image component does not support loading SVG files directly, as it only works with static image formats like PNG and JPG  */}
      <Image
        source={require("../assets/flowerLogoPink.png")}
        style={{ width: 200, height: 200, alignSelf: "center" }}
        resizeMode="contain" // Prevents the image from being cropped
      />
      <Image
        source={require("../assets/logoWhite.png")}
        style={{ height: 60, marginTop: 40, alignSelf: "center" }}
        resizeMode="contain" //
      />
    </View>
  );
}

export default SplashScreen;
