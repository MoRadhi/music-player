import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeProvider } from "./context/ThemeContext";
import { MusicProvider } from "./context/MusicContext";
import SongsScreen from "./screens/SongsScreen";
import PlayerScreen from "./screens/PlayerScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MiniPlayer from "./components/MiniPlayer";
import { useState } from "react";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const navigation = useNavigation();
  const [activeRoute, setActiveRoute] = useState("Songs");

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenListeners={{
          state: (e) => {
            const route = e.data?.state?.routes[e.data?.state?.index]?.name;
            if (route) setActiveRoute(route);
          },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Songs: "musical-notes",
              Player: "play-circle",
              Equalizer: "options",
            };
            return (
              <Ionicons name={icons[route.name]} size={size} color={color} />
            );
          },
          tabBarStyle: {
            backgroundColor: "#0A0A0A",
            borderTopColor: "rgba(255,255,255,0.08)",
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: "#8B5CF6",
          tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Songs" component={SongsScreen} />
        <Tab.Screen name="Player" component={PlayerScreen} />
        <Tab.Screen name="Equalizer" component={SettingsScreen} />
      </Tab.Navigator>

      <MiniPlayer navigation={navigation} activeRoute={activeRoute} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </MusicProvider>
    </ThemeProvider>
  );
}
