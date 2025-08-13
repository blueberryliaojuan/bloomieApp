import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import FlowerCard from "../components/FlowerCard";

//>>>>>>>>> for using React Native AsyncStorage
import {
  setFavorites,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/FavoriteManager.js";
//>>>>>>>>> for using React Native AsyncStorage

function Shop() {
  const [activeFilter, setActiveFilter] = useState("Seasonal"); // default active filter
  const [searchText, setSearchText] = useState(""); // state to hold search text
  const initialFlowers = [];
  const [isLoading, setIsLoading] = useState(true);
  const [flowers, setFlowers] = useState(initialFlowers);
  const [error, setError] = useState(null);
  // const filters = ["All", "Seasonal", "Occasion", "Customize"]; // Filter options

  const isMounted = useRef(true); // Track if component is mounted
  //check if the app is running on Android or iOS to set the correct host URL
  const HOST =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://192.168.1.71:3000";

  // Fetch flowers data from the server
  // const fetchFlowersFromApi = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${HOST}/flowers`);
  //     if (!response.ok) throw new Error("Failed to fetch flowers data.");
  //     const data = await response.json();
  //     setFlowers(data);
  //     setError(null);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchFlowersFromApi = async () => {
    const res = await fetch(`${HOST}/flowers`);
    if (!res.ok) throw new Error("Failed to fetch flowers data.");
    return res.json();
  };

  // get data from API and merge with favorites status in AsyncStorage
  const loadFlowers = useCallback(async () => {
    setIsLoading(true);
    try {
      const allFlowers = await fetchFlowersFromApi();
      const favoriteIds = await getFavorites();

      // merge based on favorite ids
      //if there is no favorite id, keep the favorite according to the API data
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

      if (isMounted.current) {
        setFlowers(mergedFlowers);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) setError(err.message);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  const fetchFlowersByName = async (name) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${HOST}/flowers?name_like=${name}`);
      if (!response.ok) throw new Error("Failed to search flowers data.");

      const data = await response.json();

      const favoriteIds = await getFavorites();

      const merged = data.map((f) => ({
        ...f,
        favorite: favoriteIds.includes(f.id),
      }));

      if (isMounted.current) {
        setFlowers(merged);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) setError(err.message);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };
  const handleToggleFavorite = async (id) => {
    const flower = flowers.find((f) => f.id === id);
    if (!flower) return;

    const updatedFavorite = !flower.favorite;

    try {
      // update API
      const res = await fetch(`${HOST}/flowers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: updatedFavorite }),
      });

      if (!res.ok) throw new Error("Failed to update favorite");

      // update AsyncStorage
      if (updatedFavorite) {
        await addFavorite(id);
      } else {
        await removeFavorite(id);
      }

      // update state
      setFlowers((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, favorite: updatedFavorite } : item
        )
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update favorite status.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      loadFlowers();

      return () => {
        isMounted.current = false;
      };
    }, [loadFlowers])
  );

  // const fetchFlowersByName = async (name) => {
  //   console.log("Searching for flowers with name:", name);
  //   try {
  //     const response = await fetch(`${HOST}/flowers?name_like=${name}`);
  //     if (!response.ok) {
  //       throw new Error("Failed to search flowers data.");
  //     }
  //     const data = await response.json();
  //     console.log("Searched flower data: ", data);
  //     setFlowers(data);
  //   } catch (error) {
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleToggleFavorite = async (id) => {
  //   const flower = flowers.find((f) => f.id === id);
  //   if (!flower) return;

  //   const updatedFavorite = !flower.favorite;
  //   try {
  //     const res = await fetch(`${HOST}/flowers/${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ favorite: updatedFavorite }),
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to update favorite");
  //     }

  //     // update state
  //     setFlowers((prev) =>
  //       prev.map((item) =>
  //         item.id === id ? { ...item, favorite: updatedFavorite } : item
  //       )
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     Alert.alert("Error", "Failed to update favorite status.");
  //   }
  // };

  // const renderCategories = ({ item }) => (
  //   <TouchableOpacity
  //     onPress={() => setActiveFilter(item)} // Update filter options on click
  //   >
  //     <View
  //       className={`${
  //         activeFilter === item ? "bg-[#C02C26]" : "bg-white"
  //       }  my-2 mr-4 px-8 py-1.5 rounded-xl shadow-md`}
  //     >
  //       <Text
  //         className={`font-semibold ${
  //           activeFilter === item ? "text-white" : "text-slate-600"
  //         }`}
  //       >
  //         {item}
  //       </Text>
  //     </View>
  //   </TouchableOpacity>
  // );
  const navigation = useNavigation();
  const renderFlowerItem = ({ item }) => (
    <FlowerCard
      image={imageMap[item.imageKey]} // Use the imageMap to get the correct image
      name={item.name}
      id={item.id}
      price={item.price.toFixed(2)} // Format price to 2 decimal places
      isFavorite={item.favorite}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      onClickCard={() => {
        console.log(`Clicked on ${item.name}`);
        navigation.navigate("flowerDetail", {
          name: item.name,
          image: imageMap[item.imageKey],
          id: item.id,
        });
      }}
    />
  );

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

  // Refresh flowers data whenever screen is focused
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchFlowersFromApi();
  //   }, [])
  // );

  // Conditionally define content based on state
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

  return (
    <SafeAreaView className="flex-1">
      {/* <View className="flex flex-row items-center justify-start mx-8">
        <Image
          source={require("../assets/flowerLogoRed.png")}
          className="w-10 h-10  mt-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-bold ml-2 mt-4">Good morning, Ella</Text>
      </View> */}
      {/* Header Logo */}
      <View className="items-center pt-16 pb-4">
        <Image
          source={require("../assets/logoRed.png")}
          className="h-10"
          resizeMode="contain"
        />
        {/* <Text className="text-4xl font-bold text-[#C02C26]">Bloome</Text> */}
      </View>
      <View className=" px-8 relative">
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
      {/* <View className="px-4">
        <FlatList
          data={filters}
          horizontal={true}
          showsVerticalScrollIndicator={false} // hide vertical scroll indicator
          keyExtractor={(item) => item} // set unique key for each item
          renderItem={renderCategories} // render each filter item
        ></FlatList>
      </View> */}
      <View className="flex-1 px-8 mt-5">
        {/* <FlatList
          data={flowers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFlowerItem}
          numColumns={2} // Display items in two columns
          columnWrapperStyle={{ justifyContent: "flex-start" }}
          showsVerticalScrollIndicator={false}
        /> */}
        {content}
      </View>
    </SafeAreaView>
  );
}

export default Shop;
