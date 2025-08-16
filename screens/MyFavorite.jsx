/**
 * @file FavoriteScreen.js
 * @description Displays a list of favorite flowers and suggestions with add/remove functionality.
 * Integrates with AsyncStorage for local caching and state persistence.
 * @author Juan Liao
 * @created 2025-07
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  View,
} from "react-native";
import { Text, Icon, ListItem, Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import SuggestionCarousel from "../components/SuggestionCarousel";

// ======= Local Storage Helpers (AsyncStorage) =======
import {
  setFavorites,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/FavoriteManager.js";

// ======= Local Image Resources =======
const imageMap = {
  flowerBouquet01: require("../assets/images/flowerBouquet01.jpeg"),
  flowerBouquet02: require("../assets/images/flowerBouquet02.jpeg"),
  flowerBouquet03: require("../assets/images/flowerBouquet03.jpeg"),
  flowerBouquet04: require("../assets/images/flowerBouquet04.jpeg"),
  flowerBouquet05: require("../assets/images/flowerBouquet05.jpeg"),
  flowerBouquet06: require("../assets/images/flowerBouquet06.jpeg"),
  flowerBouquet07: require("../assets/images/flowerBouquet07.jpeg"),
  flowerBouquet08: require("../assets/images/flowerBouquet08.jpeg"),
  flowerBouquet09: require("../assets/images/flowerBouquet09.jpeg"),
};

// Set HOST for both iOS and Android platforms
const HOST =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://192.168.1.71:3000";

/**
 * @component FavoriteScreen
 * @description Screen component for displaying and managing user's favorite flowers and suggestions.
 */
export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true); // Used to prevent state updates on unmounted components

  /**
   * @function fetchFlowersFromApi
   * @description Fetches full flower list from API
   * @returns {Promise<Array>} Array of flower objects
   */
  const fetchFlowersFromApi = async () => {
    const res = await fetch(`${HOST}/flowers`);
    if (!res.ok) throw new Error("Failed to fetch flower list");
    return res.json();
  };

  /**
   * @function fetchFavoritesFromStorage
   * @description Merges AsyncStorage favorite IDs with API flower list and updates state
   */
  const fetchFavoritesFromStorage = useCallback(async () => {
    setLoading(true);
    try {
      const allFlowers = await fetchFlowersFromApi();
      const favoriteIds = await getFavorites();

      let mergedFlowers;
      if (favoriteIds && favoriteIds.length > 0) {
        // Merge favorite IDs from local storage into API result
        mergedFlowers = allFlowers.map((flower) => ({
          ...flower,
          favorite: favoriteIds.includes(flower.id),
        }));
      } else {
        mergedFlowers = allFlowers;
      }

      const favoriteFlowers = mergedFlowers.filter((f) => f.favorite);
      const suggestionFlowers = mergedFlowers.filter((f) => !f.favorite);

      if (isMounted.current) {
        setFavorites(favoriteFlowers);
        setSuggestions(suggestionFlowers);
      }
    } catch (err) {
      console.error("fetchFavoritesFromStorage error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * @function handleDelete
   * @description Removes a flower from favorites and updates UI state
   * @param {string} id - Flower ID to remove from favorites
   */
  const handleDelete = async (id) => {
    await removeFavorite(id);

    const removedItem = favorites.find((f) => f.id === id);
    if (!removedItem) return;

    const updatedFavorites = favorites.filter((f) => f.id !== id);
    const updatedSuggestions = [...suggestions, removedItem];

    setFavorites(updatedFavorites);
    setSuggestions(updatedSuggestions);
  };

  /**
   * @function handleAddFavorite
   * @description Adds a flower to favorites and updates UI state
   * @param {string} id - Flower ID to add to favorites
   */
  const handleAddFavorite = async (id) => {
    await addFavorite(id);

    const addedItem = suggestions.find((f) => f.id === id);
    if (!addedItem) return;

    const updatedSuggestions = suggestions.filter((f) => f.id !== id);
    const updatedFavorites = [...favorites, addedItem];

    setFavorites(updatedFavorites);
    setSuggestions(updatedSuggestions);
  };

  /**
   * Fetch data every time the screen is focused (navigation)
   */
  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      fetchFavoritesFromStorage();

      return () => {
        isMounted.current = false;
      };
    }, [fetchFavoritesFromStorage])
  );

  /**
   * @function renderSwipeableItem
   * @description Renders each flower item in the favorites list with swipe-to-delete
   * @param {object} param0
   * @returns {JSX.Element}
   */
  const renderSwipeableItem = ({ item }) => (
    <ListItem.Swipeable
      key={item.id}
      bottomDivider
      containerStyle={{ paddingVertical: 8 }}
      rightContent={(reset) => (
        <Button
          title="Delete"
          onPress={() => {
            handleDelete(item.id);
            reset();
          }}
          icon={{ name: "delete", color: "white" }}
          buttonStyle={{ minHeight: "100%", backgroundColor: "#C02C26" }}
        />
      )}
    >
      <View className="flex-row items-center flex-1">
        <Image
          source={imageMap[item.imageKey]}
          className="w-[70px] h-[70px] rounded-lg mr-3"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="font-semibold text-base">{item.name}</Text>
          <Text className="text-gray-500">${item.price.toFixed(2)}</Text>
        </View>
      </View>
      <Icon name="chevron-right" color="#C02C26" />
    </ListItem.Swipeable>
  );

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#C02C26" />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="items-center pt-16 pb-4">
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
      </View>
      {/* Suggested flowers */}
      <View className="px-4 mt-4">
        <Text className="text-lg font-bold mb-2 text-[#C02C26]">
          You May Be Interested
        </Text>
        <SuggestionCarousel
          data={suggestions}
          imageMap={imageMap}
          onAddFavorite={handleAddFavorite}
        />
      </View>
      {/* Favorite list */}
      <View className="px-4">
        <Text className="text-lg font-bold mt-6 mb-2 text-[#C02C26]">
          Your Favorites
        </Text>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSwipeableItem}
        />
      </View>
    </View>
  );
}
