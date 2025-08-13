/**
 * @file Cart.js
 * @description Displays the cart screen in the app. Currently shows a placeholder text.
 * @author Juan Liao
 * @created 2025-07-31
 * @lastModified 2025-07-31 by Juan Liao - Initial creation
 */

import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * @function Cart
 * @description React Native component that renders the user's shopping cart screen.
 * Currently, it displays a placeholder "Cart" text centered on the screen.
 * @returns {JSX.Element} Cart screen layout
 */
function PlanPayment() {
  return (
    // Container with white background and centered content
    <SafeAreaView className="flex-1 flex bg-white items-center justify-center">
      <Text>Payment</Text>
    </SafeAreaView>
  );
}

export default PlanPayment;
