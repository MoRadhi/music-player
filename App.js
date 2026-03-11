import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SongsScreen from "./screens/SongsScreen";
import PlayerScreen from "./screens/PlayerScreen";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  const Tabs = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tabs.Navigator>
        <Tabs.Screen name="Songs" component={SongsScreen} />
        <Tabs.Screen name="Player" component={PlayerScreen} />
        <Tabs.Screen name="Settings" component={SettingsScreen} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
