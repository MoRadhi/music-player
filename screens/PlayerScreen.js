import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useMusic } from "../context/MusicContext";

const { width } = Dimensions.get("window");
const VINYL_SIZE = width * 0.68;

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
    currentColor,
  } = useMusic();

  const spinAnimation = useRef(null);
  const spinDeg = useRef(new Animated.Value(0)).current;
  const lastDeg = useRef(0);

  const glowAnim = useRef(new Animated.Value(0.6)).current;
  const orbAnim = useRef(new Animated.Value(0)).current;

  const songId = route.params?.songId ?? null;
  const currentSong = songs[currentIndex];

  // Sync when coming from SongsScreen
  useEffect(() => {
    if (songId) {
      const i = songs.findIndex((s) => s.id === songId);
      if (i !== -1) setCurrentIndex(i);
    }
  }, [songId]);

  // Spin vinyl
  useEffect(() => {
    if (isPlaying) {
      // Always animate from current degree forward
      const targetDeg = lastDeg.current + 360;
      spinAnimation.current = Animated.loop(
        Animated.timing(spinDeg, {
          toValue: targetDeg,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      spinAnimation.current.start();

      // Glow pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      spinAnimation.current?.stop();
      // Capture exact degree where it stopped
      spinDeg.stopAnimation((val) => {
        lastDeg.current = val % 360;
        spinDeg.setValue(lastDeg.current);
      });
    }
  }, [isPlaying]);

  // Spin orb when song changes
  useEffect(() => {
    orbAnim.setValue(0);
    Animated.timing(orbAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.cubic), // starts fast, slows to stop
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const orbSpin = orbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spin = spinDeg.interpolate({
    inputRange: [lastDeg.current, lastDeg.current + 360],
    outputRange: [`${lastDeg.current}deg`, `${lastDeg.current + 360}deg`],
  });

  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.root}>
      {/* Dynamic background */}
      <LinearGradient
        colors={[currentColor[0] + "CC", currentColor[1] + "99", "#0A0A0A"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 0.8 }}
      />

      {/* Rotating background orb */}
      <Animated.View
        style={[
          styles.glowOrb,
          {
            backgroundColor: "transparent",
            transform: [{ rotate: orbSpin }],
            opacity: glowAnim,
          },
        ]}
      >
        <LinearGradient
          colors={[currentColor[0], currentColor[1], "transparent"]}
          style={styles.orbGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>NOW PLAYING</Text>
      </View>

      {/* Vinyl */}
      <View style={styles.vinylWrapper}>
        <Animated.View
          style={[styles.vinyl, { transform: [{ rotate: spin }] }]}
        >
          {/* Vinyl grooves */}
          {[0.88, 0.78, 0.68, 0.58].map((scale, i) => (
            <View
              key={i}
              style={[
                styles.groove,
                {
                  width: VINYL_SIZE * scale,
                  height: VINYL_SIZE * scale,
                  borderRadius: (VINYL_SIZE * scale) / 2,
                  opacity: 0.15 - i * 0.02,
                },
              ]}
            />
          ))}

          {/* Album art circle */}
          <Image
            source={currentSong.artwork}
            style={styles.albumArt}
            resizeMode="cover"
          />

          {/* Center hole */}
          <View style={styles.centerHole} />
        </Animated.View>
      </View>

      {/* Song info */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{currentSong.title}</Text>
        <Text style={styles.songArtist}>{currentSong.artist}</Text>
      </View>

      {/* Glass controls card */}
      <BlurView intensity={40} tint="dark" style={styles.glassCard}>
        <LinearGradient
          colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
          style={styles.glassInner}
        >
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={seekTo}
              minimumTrackTintColor={currentColor[0]}
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor="#FFFFFF"
            />
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Main controls */}
          <View style={styles.controls}>
            {/* Shuffle */}
            <TouchableOpacity onPress={toggleShuffle} style={styles.sideBtn}>
              <Ionicons
                name="shuffle"
                size={20}
                color={isShuffled ? currentColor[0] : "rgba(255,255,255,0.4)"}
              />
            </TouchableOpacity>

            {/* Prev */}
            <TouchableOpacity onPress={skipPrev} style={styles.skipBtn}>
              <View style={styles.skipBtnInner}>
                <Ionicons name="play-skip-back" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            {/* Play/Pause */}
            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playBtnWrapper}
            >
              <LinearGradient
                colors={[currentColor[0], currentColor[1]]}
                style={styles.playBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={30}
                  color="#FFFFFF"
                  style={{ marginLeft: isPlaying ? 0 : 3 }} // optical centering for play icon
                />
              </LinearGradient>
            </TouchableOpacity>

            {/* Next */}
            <TouchableOpacity onPress={skipNext} style={styles.skipBtn}>
              <View style={styles.skipBtnInner}>
                <Ionicons name="play-skip-forward" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Repeat */}
            <TouchableOpacity onPress={toggleRepeat} style={styles.sideBtn}>
              <Ionicons
                name="repeat"
                size={20}
                color={isRepeating ? currentColor[0] : "rgba(255,255,255,0.4)"}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  glowOrb: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    top: -width * 0.25,
    alignSelf: "center",
    overflow: "hidden",
  },
  orbGradient: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.45,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.4)",
  },

  // Vinyl
  vinylWrapper: {
    alignItems: "center",
    marginBottom: 32,
  },
  vinyl: {
    width: VINYL_SIZE,
    height: VINYL_SIZE,
    borderRadius: VINYL_SIZE / 2,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.8,
    shadowRadius: 32,
    elevation: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  groove: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
  },
  albumArt: {
    width: VINYL_SIZE * 0.46,
    height: VINYL_SIZE * 0.46,
    borderRadius: VINYL_SIZE * 0.23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
  },
  albumArtEmoji: { fontSize: 44 },
  centerHole: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  // Song info
  songInfo: {
    alignItems: "center",
    marginBottom: 28,
  },
  songTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  songArtist: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    marginTop: 6,
    letterSpacing: 0.5,
  },

  // Glass card
  glassCard: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  glassInner: {
    padding: 24,
  },

  // Progress
  progressContainer: { marginBottom: 24 },
  slider: { width: "100%", height: 40 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.5,
  },

  // Controls
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sideBtn: { padding: 8 },
  sideBtnText: { fontSize: 18, opacity: 0.4 },
  skipBtn: { padding: 8 },
  skipBtnInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  skipBtnText: { fontSize: 18, color: "#FFFFFF" },
  playBtnWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
