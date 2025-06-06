import React, { useState, useEffect } from "react";
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

function Shop() {
  //check if the app is running on Android or iOS to set the correct host URL
  const HOST =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000";

  const [activeFilter, setActiveFilter] = useState("Seasonal"); // default active filter
  // state to hold search text
  const [searchText, setSearchText] = useState("");

  // const filters = ["All", "Seasonal", "Occasion", "Customize"]; // Filter options

  const renderCategories = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveFilter(item)} // Update filter options on click
    >
      <View
        className={`${
          activeFilter === item ? "bg-[#C02C26]" : "bg-white"
        }  my-2 mr-4 px-8 py-1.5 rounded-xl shadow-md`}
      >
        <Text
          className={`font-semibold ${
            activeFilter === item ? "text-white" : "text-slate-600"
          }`}
        >
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const navigation = useNavigation();
  const renderFlowerItem = ({ item }) => (
    <FlowerCard
      image={imageMap[item.imageKey]} // Use the imageMap to get the correct image
      name={item.name}
      price={item.price.toFixed(2)} // Format price to 2 decimal places
      onPress={() => {
        console.log(`Clicked on ${item.name}`);
        navigation.navigate("flowerDetail", {
          name: item.name,
          image: imageMap[item.imageKey],
          id: item.id,
        });
      }}
    />
  );

  // const flowers = [
  //   {
  //     id: "bloomie01",
  //     name: "Whispers of the Rose",
  //     description:
  //       "Beautiful roses, whispering love and passion in every petal.",
  //     imageUrl: require("../assets/images/flowerBouquet01.jpeg"),
  //     img: "img1",
  //     price: 25,
  //     tags: ["flowerBouquet", "romantic", "rose", "spring"],
  //     favorite: true,
  //     reviews: [
  //       {
  //         user: "Alice",
  //         rating: 5,
  //         comment: "Absolutely stunning roses!",
  //       },
  //       {
  //         user: "Bob",
  //         rating: 4,
  //         comment: "Loved the colors, but some petals were a bit dry.",
  //       },
  //     ],
  //   },
  // ];
  const initialFlowers = [];
  const [isLoading, setIsLoading] = useState(true);
  const [flowers, setFlowers] = useState(initialFlowers);
  const [error, setError] = useState(null);
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
  // Fetch flowers data from the server
  useEffect(() => {
    const fetchFlowers = async () => {
      console.log("Get all flowers list");
      try {
        //React Native emulators often need special handling for local servers:
        //For iOS Simulator: http://127.0.0.1:3000/flowers works fine.
        const response = await fetch(`${HOST}/flowers`);
        console.log("Fetching flowers data from server...");
        if (!response.ok) {
          throw new Error("Failed to fetch flowers data.");
        }
        const data = await response.json();
        console.log("Fetched data: ", data);
        setFlowers(data);
      } catch (err) {
        console.log("Error fetching flowers data:", err);
        setError(err.message);
      } finally {
        console.log("Finished fetching flowers data.");
        setIsLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  const fetchFlowersByName = async (name) => {
    console.log("Searching for flowers with name:", name);
    try {
      const response = await fetch(`${HOST}/flowers?name_like=${name}`);
      if (!response.ok) {
        throw new Error("Failed to search flowers data.");
      }
      const data = await response.json();
      console.log("Searched flower data: ", data);
      setFlowers(data);
    } catch (error) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
    <SafeAreaView>
      <View className="flex flex-row items-center justify-start mx-8">
        <Image
          source={require("../assets/flowerLogoRed.png")}
          className="w-10 h-10  mt-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-bold ml-2 mt-4">Good morning, Ella</Text>
      </View>
      <View className=" mt-5 px-8 relative">
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
      <View className="px-8 mt-5">
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
