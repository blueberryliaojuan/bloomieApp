/**
 * File: Shop.jsx
 * Description:
 *   Shop page displaying flowers for browsing. Users can search by name,
 *   view flower details, and toggle favorites. Fetches data from local API
 *   and manages flower/favorites state with error handling and loading indicators.
 * Author: Juan Liao
 * Created: 2025-08
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Image,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import InputField from "../components/InputField";
import FlowerCard from "../components/FlowerCard";
import { useUserState } from "../services/UserState"; // Custom hook for user login state

function Shop() {
  // --------------------
  // State Hooks
  // --------------------
  const [searchText, setSearchText] = useState(""); // Search input text
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const [flowers, setFlowers] = useState([]); // Flower list data
  const [favorites, setFavorites] = useState([]); // User favorites
  const [error, setError] = useState(null); // Error message

  const isMounted = useRef(true); // Prevent state updates after unmount

  const navigation = useNavigation();
  const { user } = useUserState(); // Current logged-in user

  const HOST = "http://192.168.1.71:3000"; // Local API host

  // --------------------
  // API Functions
  // --------------------

  // Fetch all flowers from API
  const fetchFlowersFromApi = async () => {
    const res = await fetch(`${HOST}/flowers`);
    if (!res.ok) throw new Error("Failed to fetch flowers data.");
    return res.json();
  };

  // Fetch current user's favorites
  const fetchFavorites = async () => {
    if (!user) return [];
    const res = await fetch(`${HOST}/favorites?userId=${user.id}`);
    if (!res.ok) throw new Error("Failed to fetch favorites.");
    return res.json();
  };

  // Load flowers and favorites
  const loadFlowers = useCallback(async () => {
    setIsLoading(true);
    try {
      const allFlowers = await fetchFlowersFromApi();
      const favs = await fetchFavorites();

      if (isMounted.current) {
        setFavorites(favs);
        setFlowers(
          allFlowers.map((flower) => ({
            ...flower,
            favorite: favs.some((f) => f.flowerId === flower.id),
          }))
        );
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) setError(err.message);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [user?.id]);

  // Search flowers by name
  const fetchFlowersByName = async (name) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${HOST}/flowers?name_like=${name}`);
      if (!res.ok) throw new Error("Failed to search flowers.");
      const data = await res.json();

      if (isMounted.current) {
        setFlowers(
          data.map((flower) => ({
            ...flower,
            favorite: favorites.some((f) => f.flowerId === flower.id),
          }))
        );
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) setError(err.message);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  // --------------------
  // Favorite toggle logic
  // --------------------
  const handleToggleFavorite = async (flowerId) => {
    if (!user) {
      Alert.alert("Login required", "Please log in to favorite flowers.");
      return;
    }

    try {
      // Check if flower is already favorited by user (not deleted)
      const existingFav = favorites.find(
        (fav) =>
          fav.userId === user.id && fav.flowerId === flowerId && !fav.deleted
      );

      if (existingFav) {
        // Already favorited → mark as deleted
        await fetch(`${HOST}/favorites/${existingFav.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deleted: true }),
        });

        setFavorites((prev) =>
          prev.map((fav) =>
            fav.id === existingFav.id ? { ...fav, deleted: true } : fav
          )
        );
      } else {
        // Not favorited → add new favorite
        const res = await fetch(`${HOST}/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, flowerId, deleted: false }),
        });
        const newFav = await res.json();

        setFavorites((prev) => [...prev, newFav]);
      }

      // Update flower state to toggle favorite icon in UI
      setFlowers((prev) =>
        prev.map((f) =>
          f.id === flowerId ? { ...f, favorite: !f.favorite } : f
        )
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to toggle favorite.");
    }
  };

  // --------------------
  // Refresh data when screen is focused
  // --------------------
  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;

      const fetchData = async () => {
        setIsLoading(true);
        try {
          const allFlowers = await fetchFlowersFromApi();
          const favs = (await fetchFavorites()).filter((f) => !f.deleted);

          if (!isMounted.current) return;

          setFavorites(favs);
          setFlowers(
            allFlowers.map((flower) => ({
              ...flower,
              favorite: favs.some((f) => f.flowerId === flower.id),
            }))
          );
          setError(null);
        } catch (err) {
          if (isMounted.current) setError(err.message);
        } finally {
          if (isMounted.current) setIsLoading(false);
        }
      };

      fetchData();

      return () => {
        isMounted.current = false;
      };
    }, [user?.id])
  );

  // --------------------
  // Local image mapping
  // --------------------
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

  // --------------------
  // Render single flower card
  // --------------------
  const renderFlowerItem = ({ item }) => (
    <FlowerCard
      image={imageMap[item.imageKey]}
      name={item.name}
      id={item.id}
      price={item.price.toFixed(2)}
      isFavorite={item.favorite}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      onClickCard={() => {
        navigation.navigate("flowerDetail", {
          name: item.name,
          image: imageMap[item.imageKey],
          id: item.id,
        });
      }}
    />
  );

  // --------------------
  // Conditional content rendering
  // --------------------
  let content;
  if (isLoading) {
    content = <ActivityIndicator size="large" color="#C02C26" />;
  } else if (error) {
    content = <Text className="text-red-500 text-center">{error}</Text>;
  } else {
    content = (
      <FlatList
        data={flowers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFlowerItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  // --------------------
  // Page UI
  // --------------------
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="items-center pt-16 pb-4">
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
      </View>

      {/* Search bar */}
      <View className="px-8 relative">
        <InputField
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          className="border border-slate-400 rounded-xl p-2"
        />
        <TouchableOpacity
          className="absolute right-8 top-0 bg-[#C02C26] w-14 rounded-r-xl p-4"
          onPress={() => fetchFlowersByName(searchText)}
        >
          <Image
            source={require("../assets/icons/searchIcon.png")}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Flower list */}
      <View className="flex-1 px-8 mt-5">{content}</View>
    </View>
  );
}

export default Shop;
