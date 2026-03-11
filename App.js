import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SongsScreen from "./screens/SongsScreen";
import PlayerScreen from "./screens/PlayerScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { MusicProvider } from "./context/MusicContext";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  const Tabs = createBottomTabNavigator();

  return (
    <MusicProvider>
      <NavigationContainer>
        <Tabs.Navigator
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
          })}
        >
          <Tabs.Screen name="Songs" component={SongsScreen} />
          <Tabs.Screen name="Player" component={PlayerScreen} />
          <Tabs.Screen name="Equalizer" component={SettingsScreen} />
        </Tabs.Navigator>
      </NavigationContainer>
    </MusicProvider>
  );
}
