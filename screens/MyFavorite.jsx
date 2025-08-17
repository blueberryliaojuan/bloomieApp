import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Text, Icon, ListItem, Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import SuggestionCarousel from "../components/SuggestionCarousel";
import { useUserState } from "../services/UserState";
import { useFocusEffect } from "@react-navigation/native";

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
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://192.168.1.71:3000";

export default function FavoriteScreen() {
  const { user } = useUserState();
  const [favorites, setFavorites] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 页面聚焦时拉最新数据
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }

      let isMounted = true;

      const fetchData = async () => {
        setLoading(true);
        try {
          const resFlowers = await fetch(`${HOST}/flowers`);
          const allFlowers = await resFlowers.json();

          const resFavs = await fetch(`${HOST}/favorites?userId=${user.id}`);
          const favData = await resFavs.json();
          const validFavs = favData.filter((f) => !f.deleted);
          const favoriteIds = validFavs.map((f) => f.flowerId);

          if (!isMounted) return;

          const activeFlowers = allFlowers.filter((f) => !f.deleted);

          setFavorites(activeFlowers.filter((f) => favoriteIds.includes(f.id)));
          setSuggestions(
            activeFlowers.filter((f) => !favoriteIds.includes(f.id))
          );
        } catch (err) {
          console.error("FavoriteScreen fetch error:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchData();

      return () => {
        isMounted = false;
      };
    }, [user?.id])
  );

  // 添加收藏（软删除）
  const handleAddFavorite = async (flower) => {
    if (!flower?.id) return;

    try {
      const res = await fetch(
        `${HOST}/favorites?userId=${user.id}&flowerId=${flower.id}`
      );
      const existing = await res.json();

      if (existing.length > 0) {
        const fav = existing[0];
        if (fav.deleted) {
          await fetch(`${HOST}/favorites/${fav.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deleted: false }),
          });
        }
      } else {
        await fetch(`${HOST}/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            flowerId: flower.id,
            deleted: false,
          }),
        });
      }

      setFavorites((prev) => [flower, ...prev]);
      setSuggestions((prev) => prev.filter((f) => f.id !== flower.id));
    } catch (err) {
      console.error("AddFavorite error:", err);
    }
  };

  // 删除收藏（软删除）
  const handleDeleteFavorite = async (flower) => {
    try {
      const res = await fetch(
        `${HOST}/favorites?userId=${user.id}&flowerId=${flower.id}`
      );
      const fav = await res.json();

      if (fav[0]) {
        await fetch(`${HOST}/favorites/${fav[0].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deleted: true }),
        });
      }

      setFavorites((prev) => prev.filter((f) => f.id !== flower.id));
      setSuggestions((prev) => [flower, ...prev]);
    } catch (err) {
      console.error("DeleteFavorite error:", err);
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <ListItem.Swipeable
      key={item.id}
      bottomDivider
      containerStyle={{ paddingVertical: 8 }}
      rightContent={(reset) => (
        <Button
          title="Delete"
          onPress={() => {
            handleDeleteFavorite(item);
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
          <Text className="text-gray-500">
            ${item.price?.toFixed(2) ?? "0.00"}
          </Text>
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
    <View className="flex-1 bg-white">
      <View className="items-center pt-16 pb-4">
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
      </View>

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

      <View className="px-4">
        <Text className="text-lg font-bold mt-6 mb-2 text-[#C02C26]">
          Your Favorites
        </Text>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteItem}
        />
      </View>
    </View>
  );
}
