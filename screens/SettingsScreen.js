import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useMusic } from "../context/MusicContext";

export default function SettingsScreen() {
  const { volume, pitch, changeVolume, changePitch } = useMusic();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Equalizer</Text>

      {/* Volume */}
      <View style={styles.control}>
        <Text style={styles.label}>🔊 Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={changeVolume}
        />
        <Text style={styles.value}>{Math.round(volume * 100)}%</Text>
      </View>

      {/* Pitch / Rate */}
      <View style={styles.control}>
        <Text style={styles.label}>🎵 Playback Speed</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2.0}
          value={pitch}
          onValueChange={changePitch}
        />
        <Text style={styles.value}>{pitch.toFixed(2)}x</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 32 },
  control: { marginBottom: 32 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  slider: { width: "100%", height: 40 },
  value: { textAlign: "center", fontSize: 14, color: "#666", marginTop: 4 },
});
