// RatingStars.js
import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

/**
 * RatingStars Component
 * Renders a star-based rating display with full, half, and empty stars,
 * along with a numeric rating value and review count.
 *
 * Props:
 * - rating (number): The average rating (0 - 5, e.g., 4.6)
 * - reviews (number): The number of reviews (integer)
 *
 * Example:
 * <RatingStars rating={4.6} reviews={126} />
 */
export default function RatingStars({ rating, reviews }) {
  // Number of full stars to render
  const fullStars = Math.floor(rating);

  // Whether a half star should be rendered
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;

  // Number of empty stars to fill up to 5 stars
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
      {/* Render full stars */}
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <Icon key={`full-${i}`} name="star" size={16} color="#FBBF24" />
        ))}

      {/* Render half star if applicable */}
      {halfStar === 1 && (
        <Icon name="star-half-full" size={16} color="#FBBF24" />
      )}

      {/* Render empty stars */}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <Icon key={`empty-${i}`} name="star-o" size={16} color="#D1D5DB" />
        ))}

      {/* Render rating number and review count */}
      <Text style={{ color: "#6B7280", fontSize: 12, marginLeft: 4 }}>
        {rating.toFixed(1)} ({reviews} Review{reviews > 1 ? "s" : ""})
      </Text>
    </View>
  );
}
