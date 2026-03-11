import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useMusic } from "../context/MusicContext";

const SongsScreen = ({ navigation }) => {
  const { songs } = useMusic();

  return (
    <View>
      <FlatList
        data={songs}
        keyExtractor={(song) => song.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.songItem}
            onPress={() => navigation.navigate("Player", { songId: item.id })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SongsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  songItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  title: { fontSize: 16, fontWeight: "bold" },
  artist: { fontSize: 14, color: "#666" },
});
