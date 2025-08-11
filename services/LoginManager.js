// loginManager.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USERDATA } from "./userData.js";

class LoginManager {
  constructor() {
    this.currentUser = null;
  }

  /**
   * Load saved user session from AsyncStorage
   */
  async loadSession() {
    try {
      const savedUser = await AsyncStorage.getItem("bloomieUser");
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    } catch (error) {
      console.error("Error loading user session:", error);
    }
  }

  /**
   * Authenticate user credentials against USERDATA
   * @param {string} email - The user ID
   * @param {string} password - The password
   * @returns {object|false} - User object if valid, false otherwise
   */
  authenticate(email, password) {
    const user = USERDATA.find((u) => u.email === email);
    if (!user) return false; // No matching email
    if (user.password !== password) return false; // Wrong password
    return user; // Valid credentials
  }

  /**
   * Login method
   */
  async login(email, password) {
    const user = this.authenticate(email, password);

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    this.currentUser = { ...user };
    delete this.currentUser.password;

    try {
      await AsyncStorage.setItem(
        "bloomieUser",
        JSON.stringify(this.currentUser)
      );
    } catch (error) {
      console.error("Error saving user session:", error);
    }

    return {
      success: true,
      message: "Login successful",
      user: this.currentUser,
    };
  }

  /**
   * Logout method
   */
  async logout() {
    this.currentUser = null;
    try {
      await AsyncStorage.removeItem("bloomieUser");
    } catch (error) {
      console.error("Error clearing user session:", error);
    }
    return { success: true, message: "Logged out" };
  }

  /**
   * Check login status
   */
  isLoggedIn() {
    return this.currentUser !== null;
  }

  /**
   * Get current logged-in user info
   */
  getCurrentUser() {
    return this.currentUser;
  }
}

export const loginManager = new LoginManager();
