import { View, Text, StyleSheet, Dimensions } from "react-native";
import Slider from "@react-native-community/slider";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useMusic } from "../context/MusicContext";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const {
    volume,
    pitch,
    changeVolume,
    changePitch,
    currentColor,
    songs,
    currentIndex,
  } = useMusic();
  const currentSong = songs[currentIndex];

  return (
    <View style={styles.root}>
      {/* Background */}
      <LinearGradient
        colors={["#0D0D1A", "#0A0A0A"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle color orb */}
      <View style={[styles.orb, { backgroundColor: currentColor[0] }]} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Equalizer</Text>
        <Text style={styles.headerSubtitle}>
          {currentSong.title} · {currentSong.artist}
        </Text>
      </View>

      {/* Volume Card */}
      <BlurView intensity={30} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.07)", "rgba(255,255,255,0.02)"]}
          style={styles.cardInner}
        >
          {/* Icon + Label */}
          <View style={styles.cardHeader}>
            <LinearGradient colors={currentColor} style={styles.iconBadge}>
              <Text style={styles.iconEmoji}>🔊</Text>
            </LinearGradient>
            <View>
              <Text style={styles.cardTitle}>Volume</Text>
              <Text style={styles.cardSubtitle}>Playback loudness</Text>
            </View>
            <Text style={[styles.cardValue, { color: currentColor[0] }]}>
              {Math.round(volume * 100)}%
            </Text>
          </View>

          {/* Slider */}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={changeVolume}
            minimumTrackTintColor={currentColor[0]}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor="#FFFFFF"
          />

          {/* Min/Max labels */}
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0%</Text>
            <Text style={styles.sliderLabel}>100%</Text>
          </View>
        </LinearGradient>
      </BlurView>

      {/* Pitch Card */}
      <BlurView intensity={30} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.07)", "rgba(255,255,255,0.02)"]}
          style={styles.cardInner}
        >
          <View style={styles.cardHeader}>
            <LinearGradient colors={currentColor} style={styles.iconBadge}>
              <Text style={styles.iconEmoji}>🎵</Text>
            </LinearGradient>
            <View>
              <Text style={styles.cardTitle}>Playback Speed</Text>
              <Text style={styles.cardSubtitle}>Rate of playback</Text>
            </View>
            <Text style={[styles.cardValue, { color: currentColor[0] }]}>
              {pitch.toFixed(2)}x
            </Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            value={pitch}
            onValueChange={changePitch}
            minimumTrackTintColor={currentColor[0]}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor="#FFFFFF"
          />

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0.5x</Text>
            <Text style={styles.sliderLabel}>2.0x</Text>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  orb: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    top: -width * 0.3,
    right: -width * 0.2,
    opacity: 0.08,
  },

  // Header
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // Cards
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },
  cardInner: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: { fontSize: 20 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginTop: 2,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: "auto",
    letterSpacing: 0.5,
  },

  // Slider
  slider: {
    width: "100%",
    height: 40,
    marginVertical: -8,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
    letterSpacing: 0.3,
  },

  hint: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.2)",
    marginTop: 8,
    letterSpacing: 0.3,
  },
});
