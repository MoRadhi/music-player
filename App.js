import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SongsScreen from "./screens/SongsScreen";
import PlayerScreen from "./screens/PlayerScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { MusicProvider } from "./context/MusicContext";

export default function App() {
  const Tabs = createBottomTabNavigator();

  return (
    <MusicProvider>
      <NavigationContainer>
        <Tabs.Navigator>
          <Tabs.Screen name="Songs" component={SongsScreen} />
          <Tabs.Screen name="Player" component={PlayerScreen} />
          <Tabs.Screen name="Settings" component={SettingsScreen} />
        </Tabs.Navigator>
      </NavigationContainer>
    </MusicProvider>
  );
}
