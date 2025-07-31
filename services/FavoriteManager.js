import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_KEY = "FAVORITE_FLOWERS";

export async function getFavorites() {
  try {
    const raw = await AsyncStorage.getItem(FAVORITE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.log("Error getting favorites from AsyncStorage:", err);
    return [];
  }
}

export async function addFavorite(id) {
  try {
    const current = await getFavorites();
    if (!current.includes(id)) {
      const updated = [...current, id];
      await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.log("Error adding favorite:", err);
  }
}

export async function removeFavorite(id) {
  try {
    const current = await getFavorites();
    const updated = current.filter((favId) => favId !== id);
    await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.log("Error removing favorite:", err);
  }
}

// Set the entire favorite list (overwrite all)
export async function setFavorites(idArray) {
  try {
    await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(idArray));
  } catch (e) {
    console.error("setFavorites error:", e);
  }
}
