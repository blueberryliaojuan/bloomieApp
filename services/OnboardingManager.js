import AsyncStorage from "@react-native-async-storage/async-storage";
async function setOnBoardingFlag(obFlag) {
  try {
    // Store the onboarding flag in AsyncStorage
    await AsyncStorage.setItem("onboardingFlag", JSON.stringify(obFlag));
  } catch (error) {
    console.error("Error setting onboarding flag:", error);
    //the screen will know it failed to set the flag
    return false;
  }
}
async function getOnBoardingFlag(obFlag) {
  try {
    // Get the onboarding flag in AsyncStorage
    let currentFlag = await AsyncStorage.getItem("onboardingFlag");
    return currentFlag ? JSON.parse(currentFlag) : null;
  } catch (error) {
    console.error("Error getting onboarding flag:", error);
  }
}

export { setOnBoardingFlag, getOnBoardingFlag };
