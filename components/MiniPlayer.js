import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useMusic } from "../context/MusicContext";
import { useEffect, useRef } from "react";

export default function MiniPlayer({ navigation, activeRoute }) {
  const {
    songs,
    currentIndex,
    isPlaying,
    position,
    duration,
    togglePlayPause,
    skipNext,
    currentColor,
  } = useMusic();

  const currentSong = songs[currentIndex];
  const progress = duration > 0 ? position / duration : 0;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // fade back in when returning to non-Player tab
  useEffect(() => {
    if (activeRoute !== "Player") {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [activeRoute]);

  if (activeRoute === "Player") return null;

  const handlePress = () => {
    navigation.navigate("Player");
  };

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <BlurView intensity={60} tint="dark" style={styles.blur}>
          <LinearGradient
            colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
            style={styles.inner}
          >
            {/* Progress bar at top */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: currentColor[0],
                  },
                ]}
              />
            </View>

            <View style={styles.content}>
              {/* Album art */}
              <Image
                source={currentSong.artwork}
                style={styles.albumArt}
                resizeMode="cover"
              />

              {/* Song info */}
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {currentSong.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {currentSong.artist}
                </Text>
              </View>

              {/* Controls */}
              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={styles.controlBtn}
                >
                  <Text style={styles.controlText}>
                    {isPlaying ? "⏸" : "▶️"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={skipNext} style={styles.controlBtn}>
                  <Text style={styles.controlText}>⏭</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 12,
    marginBottom: 90,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  blur: { borderRadius: 18 },
  inner: { borderRadius: 18 },
  progressTrack: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 1,
  },
  progressFill: {
    height: "100%",
    borderRadius: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  albumArt: {
    width: 44, // or whatever size it currently is
    height: 44,
    borderRadius: 10,
    overflow: "hidden",
  },
  albumArtEmoji: { fontSize: 22 },
  info: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  artist: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  controlText: { fontSize: 14 },
});
