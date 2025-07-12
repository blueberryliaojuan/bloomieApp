import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  FlatList,
  SectionList,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import { Text, Icon, ListItem, Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import SuggestionCarousel from "../components/SuggestionCarousel";

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
  const fetchFavorites = async () => {
    const res = await fetch(`${HOST}/flowers?favorite=true`);
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return res.json();
  };

  const fetchSuggestions = async () => {
    const res = await fetch(`${HOST}/flowers?favorite=false`);
    if (!res.ok) throw new Error("Failed to fetch suggestions");
    return res.json();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [favData, sugData] = await Promise.all([
        fetchFavorites(),
        fetchSuggestions(),
      ]);
      if (isMounted.current) {
        setFavorites(favData);
        setSuggestions(sugData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`${HOST}/flowers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: false }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update favorite", err);
    }
  };

  const handleAddFavorite = async (id) => {
    try {
      if (!isMounted.current) return;

      const res = await fetch(`${HOST}/flowers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: true }),
      });

      if (!res.ok) throw new Error("Failed to update favorite");

      await fetchData(); // 重新拉数据，更新 favorites 和 suggestions
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update favorite status.");
    }
  };

  const renderSwipeableItem = ({ item }) => (
    <ListItem.Swipeable
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
      <Image
        source={imageMap[item.imageKey]}
        style={{ width: 70, height: 70, borderRadius: 8 }}
      />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>${item.price.toFixed(2)}</ListItem.Subtitle>
      </ListItem.Content>
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
