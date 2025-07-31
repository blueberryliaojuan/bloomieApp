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

//>>>>>>>>> for using React Native AsyncStorage
import {
  setFavorites,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/FavoriteManager.js";
//>>>>>>>>> for using React Native AsyncStorage

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

const HOST =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // const fetchFavorites = async () => {
  //   const res = await fetch(`${HOST}/flowers?favorite=true`);
  //   if (!res.ok) throw new Error("Failed to fetch favorites");
  //   return res.json();
  // };

  // const fetchSuggestions = async () => {
  //   const res = await fetch(`${HOST}/flowers?favorite=false`);
  //   if (!res.ok) throw new Error("Failed to fetch suggestions");
  //   return res.json();
  // };

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const [favData, sugData] = await Promise.all([
  //       fetchFavorites(),
  //       fetchSuggestions(),
  //     ]);
  //     if (isMounted.current) {
  //       setFavorites(favData);
  //       setSuggestions(sugData);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     if (isMounted.current) setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   isMounted.current = true;
  //   fetchData();

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchData(); // when the screen is focused, fetch data again
  //   }, [])
  // );

  // const handleDelete = async (id) => {
  //   try {
  //     await fetch(`${HOST}/flowers/${id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ favorite: false }),
  //     });
  //     fetchData();
  //   } catch (err) {
  //     console.error("Failed to update favorite", err);
  //   }
  // };

  // const handleAddFavorite = async (id) => {
  //   try {
  //     if (!isMounted.current) return;

  //     const res = await fetch(`${HOST}/flowers/${id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ favorite: true }),
  //     });

  //     if (!res.ok) throw new Error("Failed to update favorite");

  //     await fetchData(); // fetch data again after updating
  //   } catch (err) {
  //     console.error(err);
  //     Alert.alert("Error", "Failed to update favorite status.");
  //   }
  // };

  //>>>>>>>>> for using React Native AsyncStorage
  // Fetch favorites from API
  const fetchFlowersFromApi = async () => {
    const res = await fetch(`${HOST}/flowers`);
    if (!res.ok) throw new Error("Failed to fetch flower list");
    return res.json();
  };

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const allFlowers = await fetchFlowers();

  //     //divide flowers into favorites and suggestions
  //     const favoriteFlowers = allFlowers.filter((f) => f.favorite);
  //     const suggestionFlowers = allFlowers.filter((f) => !f.favorite);

  //     // Cache the list of favorite IDs (for offline use or component refresh upon switching).
  //     const favoriteIds = favoriteFlowers.map((f) => f.id);
  //     await setFavorites(favoriteIds);

  //     // update state
  //     if (isMounted.current) {
  //       setFavorites(favoriteFlowers);
  //       setSuggestions(suggestionFlowers);
  //     }
  //   } catch (err) {
  //     console.error("fetchData error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Read the favorite IDs from AsyncStorage
  // merge them with the data from the API, and refresh the state.
  const fetchFavoritesFromStorage = useCallback(async () => {
    setLoading(true);
    try {
      const allFlowers = await fetchFlowersFromApi();
      const favoriteIds = await getFavorites();

      let mergedFlowers;
      if (favoriteIds && favoriteIds.length > 0) {
        // if there are favorite ids, merge them with the API data
        mergedFlowers = allFlowers.map((flower) => ({
          ...flower,
          favorite: favoriteIds.includes(flower.id),
        }));
      } else {
        // if there are no favorite ids, keep the API data as is
        mergedFlowers = allFlowers;
      }

      //divide flowers into favorites and suggestions
      const favoriteFlowers = allFlowers.filter((f) => f.favorite);
      const suggestionFlowers = allFlowers.filter((f) => !f.favorite);

      if (isMounted.current) {
        // setFavorites(mergedFlowers);
        setFavorites(favoriteFlowers);
        setSuggestions(suggestionFlowers);
      }
    } catch (err) {
      console.error("fetchFavoritesFromStorage error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    await removeFavorite(id);

    // remove from local storage, no fetch again
    const removedItem = favorites.find((f) => f.id === id);
    if (!removedItem) return;

    const updatedFavorites = favorites.filter((f) => f.id !== id);
    const updatedSuggestions = [...suggestions, removedItem];

    setFavorites(updatedFavorites);
    setSuggestions(updatedSuggestions);
  };

  const handleAddFavorite = async (id) => {
    await addFavorite(id);

    const addedItem = suggestions.find((f) => f.id === id);
    if (!addedItem) return;

    const updatedSuggestions = suggestions.filter((f) => f.id !== id);
    const updatedFavorites = [...favorites, addedItem];

    setFavorites(updatedFavorites);
    setSuggestions(updatedSuggestions);
  };

  // useEffect(() => {
  //   isMounted.current = true;
  //   fetchData();
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);
  // useFocusEffect保证每次聚焦都刷新
  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      fetchFavoritesFromStorage();

      return () => {
        isMounted.current = false;
      };
    }, [fetchFavoritesFromStorage])
  );

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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#C02C26" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="px-4 pt-2 flex-1">
      {/* <ScrollView> */}
      <Text className="text-lg font-bold mb-2 text-[#C02C26]">
        You May Be Interested
      </Text>
      <SuggestionCarousel
        data={suggestions}
        imageMap={imageMap}
        onAddFavorite={handleAddFavorite}
      />

      <Text className="text-lg font-bold mt-6 mb-2 text-[#C02C26]">
        Your Favorites
      </Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSwipeableItem}
      />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
