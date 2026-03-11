import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useMusic } from "../context/MusicContext";

const PlayerScreen = ({ route }) => {
  const {
    songs,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    position,
    duration,
    isShuffled,
    isRepeating,
    togglePlayPause,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    skipNext,
    skipPrev,
  } = useMusic();

  const songId = route.params?.songId ?? null;
  const currentSong = songs[currentIndex];

  // Sync when coming from SongsScreen
  useEffect(() => {
    if (songId) {
      const i = songs.findIndex((s) => s.id === songId);
      if (i !== -1) setCurrentIndex(i);
    }
  }, [songId]);

  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentSong.title}</Text>
      <Text style={styles.artist}>{currentSong.artist}</Text>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={seekTo}
      />

      <View style={styles.timeRow}>
        <Text>{formatTime(position)}</Text>
        <Text>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={skipPrev}>
          <Text style={styles.controlBtn}>⏮</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <Text style={styles.controlBtn}>{isPlaying ? "⏸" : "▶️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={skipNext}>
          <Text style={styles.controlBtn}>⏭</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.extraControls}>
        <TouchableOpacity onPress={toggleShuffle}>
          <Text style={[styles.extraBtn, isShuffled && styles.active]}>🔀</Text>
          <Text style={[styles.extraLabel, isShuffled && styles.active]}>
            {isShuffled ? "Shuffle: On" : "Shuffle: Off"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeat}>
          <Text style={[styles.extraBtn, isRepeating && styles.active]}>
            🔂
          </Text>
          <Text style={[styles.extraLabel, isRepeating && styles.active]}>
            {isRepeating ? "Repeat: On" : "Repeat: Off"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  artist: { fontSize: 16, color: "#666", marginBottom: 32 },
  slider: { width: "100%", height: 40 },
  timeRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controls: { flexDirection: "row", gap: 32, marginTop: 32 },
  controlBtn: { fontSize: 36 },
  extraControls: { flexDirection: "row", gap: 32, marginTop: 24 },
  extraBtn: { fontSize: 28, opacity: 0.4, textAlign: "center" },
  extraLabel: { fontSize: 11, textAlign: "center", opacity: 0.4, marginTop: 4 },
  active: { opacity: 1 },
});
