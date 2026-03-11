import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import songs from "../constants/songs";

const PlayerScreen = ({ route }) => {
  const songId = route.params?.songId ?? songs[0].id;
  const [currentIndex, setCurrentIndex] = useState(
    songs.findIndex((s) => s.id === songId) ?? 0,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const soundRef = useRef(null);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    loadAndPlay(currentIndex); // play the song with the new index
    return () => unload(); // cleanup on unmount
  }, [currentIndex]);

  // Sync when coming from SongsScreen
  useEffect(() => {
    const i = songs.findIndex((s) => s.id === songId);
    if (i !== -1) setCurrentIndex(i); // if index not out of bounds set it
  }, [songId]);

  const unload = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync(); // release the current sound object from memory completely
      soundRef.current = null;
    }
  };

  const loadAndPlay = async (index) => {
    await unload(); // always clean up previous sound first

    const { sound } = await Audio.Sound.createAsync(
      songs[index].file,
      { shouldPlay: true }, //  starts playing immediately when loaded, unlike new expo-audio lib
      onPlaybackStatusUpdate, //callback function that gets called every 500ms with the current status
    );

    soundRef.current = sound; // pass the current sound as a ref to soundRef so we can call operations on it
    setIsPlaying(true);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return; // not ready => ignore
    setPosition(status.positionMillis);
    setDuration(status.durationMillis ?? 1);
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      // auto advance to next song
      setCurrentIndex((prev) => (prev + 1) % songs.length);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const skipNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  const skipPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const onSliderChange = async (value) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
    }
  };

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
        onSlidingComplete={onSliderChange}
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
});
