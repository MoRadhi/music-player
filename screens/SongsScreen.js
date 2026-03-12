import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useMusic } from "../context/MusicContext";
import { useState } from "react";

const { width } = Dimensions.get("window");

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

  const playSong = (index) => {
    setCurrentIndex(index);
    navigation.navigate("Player", { songId: songs[index].id });
  };

  return (
    <View style={styles.root}>
      {/* Background */}
      <LinearGradient
        colors={["#1A0A2E", "#0A0A0A"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Library</Text>
        <TouchableOpacity onPress={openQueue} style={styles.queueBtn}>
          <BlurView intensity={40} tint="dark" style={styles.queueBtnBlur}>
            <Text style={styles.queueBtnText}>Queue ≡</Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Songs List */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => playSong(index)} activeOpacity={0.7}>
            <BlurView intensity={20} tint="dark" style={styles.songCard}>
              <LinearGradient
                colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
                style={styles.songCardInner}
              >
                {/* Color accent bar */}
                <View
                  style={[styles.accentBar, { backgroundColor: item.color[0] }]}
                />

                {/* Album art */}
                <LinearGradient colors={item.color} style={styles.albumArt}>
                  <Text style={styles.albumArtEmoji}>🎵</Text>
                </LinearGradient>

                {/* Song info */}
                <View style={styles.songInfo}>
                  <Text
                    style={[
                      styles.songTitle,
                      index === currentIndex && { color: item.color[0] },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {item.artist}
                  </Text>
                </View>

                {/* Now playing indicator */}
                {index === currentIndex && (
                  <View style={styles.nowPlaying}>
                    <Text
                      style={[styles.nowPlayingText, { color: item.color[0] }]}
                    >
                      ▶
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        )}
      />

      {/* Queue Modal */}
      <Modal
        visible={queueVisible}
        transparent
        animationType="slide"
        onRequestClose={closeQueue}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeQueue}
        />
        <BlurView intensity={60} tint="dark" style={styles.sheet}>
          <LinearGradient
            colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
            style={styles.sheetInner}
          >
            {/* Handle */}
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Queue</Text>

            <FlatList
              data={songs}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => jumpToSong(index)}
                  activeOpacity={0.7}
                  style={[
                    styles.queueItem,
                    index === currentIndex && styles.queueItemActive,
                  ]}
                >
                  {/* Album art */}
                  <LinearGradient
                    colors={item.color}
                    style={styles.queueAlbumArt}
                  >
                    <Text style={styles.queueAlbumArtEmoji}>🎵</Text>
                  </LinearGradient>

                  {/* Info */}
                  <View style={styles.queueInfo}>
                    <Text
                      style={[
                        styles.queueTitle,
                        index === currentIndex && { color: item.color[0] },
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.queueArtist} numberOfLines={1}>
                      {item.artist}
                    </Text>
                  </View>

                  {/* Now playing */}
                  {index === currentIndex && (
                    <Text
                      style={[styles.queueNowPlaying, { color: item.color[0] }]}
                    >
                      ▶
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </LinearGradient>
        </BlurView>
      </Modal>
    </View>
  );
};

export default SongsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingTop: 56,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  queueBtn: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  queueBtnBlur: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  queueBtnText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // Songs list
  list: {
    paddingHorizontal: 16,
    paddingBottom: 160,
    gap: 10,
  },

  // Song card
  songCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  songCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  accentBar: {
    width: 3,
    height: 40,
    borderRadius: 2,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  albumArtEmoji: { fontSize: 24 },
  songInfo: { flex: 1 },
  songTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  songArtist: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    marginTop: 3,
  },
  nowPlaying: {
    width: 28,
    alignItems: "center",
  },
  nowPlayingText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "65%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sheetInner: {
    padding: 20,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  // Queue items
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    gap: 12,
    marginBottom: 4,
  },
  queueItemActive: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  queueAlbumArt: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  queueAlbumArtEmoji: { fontSize: 20 },
  queueInfo: { flex: 1 },
  queueTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  queueArtist: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },
  queueNowPlaying: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
