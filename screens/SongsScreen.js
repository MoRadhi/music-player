import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { useMusic } from "../context/MusicContext";
import { useState } from "react";

const SongsScreen = ({ navigation }) => {
  const { songs, currentIndex, setCurrentIndex } = useMusic();
  const [queueVisible, setQueueVisible] = useState(false);

  const openQueue = () => setQueueVisible(true);
  const closeQueue = () => setQueueVisible(false);

  const jumpToSong = (index) => {
    setCurrentIndex(index);
    closeQueue();
    navigation.navigate("Player");
  };

  return (
    <View style={styles.container}>
      {/* Queue Button */}
      <TouchableOpacity style={styles.queueBtn} onPress={openQueue}>
        <Text style={styles.queueBtnText}>🎵 View Queue</Text>
      </TouchableOpacity>

      {/* Songs List */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.songItem}
            onPress={() => {
              setCurrentIndex(index);
              navigation.navigate("Player", { songId: item.id });
            }}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Queue Modal */}
      <Modal
        visible={queueVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeQueue}
      >
        {/* Dark overlay — tap to close */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeQueue}
        />

        {/* Bottom sheet */}
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Queue</Text>

          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.queueItem,
                  index === currentIndex && styles.queueItemActive,
                ]}
                onPress={() => jumpToSong(index)}
              >
                {/* Highlight indicator */}
                {index === currentIndex && (
                  <Text style={styles.nowPlayingDot}>▶ </Text>
                )}
                <View>
                  <Text
                    style={[
                      styles.queueTitle,
                      index === currentIndex && styles.queueTitleActive,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.queueArtist}>{item.artist}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SongsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  // Songs list
  songItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 16, fontWeight: "bold" },
  artist: { fontSize: 14, color: "#666" },

  // Queue button
  queueBtn: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  queueBtnText: { fontSize: 16, fontWeight: "600" },

  // Modal overlay
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  // Bottom sheet
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "60%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  // Queue items
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  queueItemActive: { backgroundColor: "#f0f0f0" },
  nowPlayingDot: { color: "#1DB954", fontWeight: "bold" },
  queueTitle: { fontSize: 15, fontWeight: "500" },
  queueTitleActive: { color: "#1DB954", fontWeight: "bold" },
  queueArtist: { fontSize: 13, color: "#666" },
});
