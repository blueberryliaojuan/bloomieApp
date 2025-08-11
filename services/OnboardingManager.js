// onboardingManager.js
import AsyncStorage from "@react-native-async-storage/async-storage";

class OnboardingManager {
  constructor() {
    this.completed = false;
  }

  /**
   * Load onboarding flag from AsyncStorage
   */
  async loadFlag() {
    try {
      const currentFlag = await AsyncStorage.getItem("onboardingFlag");
      this.completed = currentFlag ? JSON.parse(currentFlag) : false;
    } catch (error) {
      console.error("Error loading onboarding flag:", error);
    }
  }

  /**
   * Set onboarding completed flag
   * @param {boolean} obFlag - true if onboarding is completed
   */
  async setFlag(obFlag) {
    try {
      await AsyncStorage.setItem("onboardingFlag", JSON.stringify(obFlag));
      this.completed = obFlag;
      return true;
    } catch (error) {
      console.error("Error setting onboarding flag:", error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  async complete() {
    return await this.setFlag(true);
  }

  /**
   * Reset onboarding status
   */
  async reset() {
    try {
      await AsyncStorage.removeItem("onboardingFlag");
      this.completed = false;
    } catch (error) {
      console.error("Error resetting onboarding flag:", error);
    }
  }

  /**
   * Check if onboarding is completed
   */
  isCompleted() {
    return this.completed;
  }
}

export const onboardingManager = new OnboardingManager();
