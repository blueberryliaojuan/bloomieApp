// loginManager.js
import AsyncStorage from "@react-native-async-storage/async-storage";
const { HOST } = require("../server");
const API_URL = `${HOST}/users`;

class LoginManager {
  constructor() {
    this.currentUser = null;
  }

  /** Load saved user session from AsyncStorage */
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
   * Authenticate user credentials against JSON server
   * @param {string} email
   * @param {string} password
   * @returns {object|false} User object if valid, false otherwise
   */
  async authenticate(email, password) {
    try {
      const response = await fetch(API_URL);
      // console.log("response", response);
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();

      const user = users.find((u) => u.email === email);
      if (!user) return false; // email not found
      if (user.password !== password) return false; // wrong password
      return user;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
  }

  /** Login method */
  async login(email, password) {
    const user = await this.authenticate(email, password);

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

  /** Logout method */
  async logout() {
    this.currentUser = null;
    try {
      await AsyncStorage.removeItem("bloomieUser");
    } catch (error) {
      console.error("Error clearing user session:", error);
    }
    return { success: true, message: "Logged out" };
  }

  /** Check login status */
  isLoggedIn() {
    return this.currentUser !== null;
  }

  /** Get current logged-in user info */
  getCurrentUser() {
    return this.currentUser;
  }
}

export const loginManager = new LoginManager();
