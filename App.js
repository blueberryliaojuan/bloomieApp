import "./global.css";
import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import AppStackNavigation from "./navigation/AppStackNavigation";

export default function App() {
  return (
    <NavigationContainer>
      <AppStackNavigation />
    </NavigationContainer>
  );
}
