import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Audio } from "expo-av";
import songs from "../constants/songs";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(true);

  const soundRef = useRef(null);
  const shuffleOrder = useRef([...Array(songs.length).keys()]);
  const isRepeatingRef = useRef(false);
  const getNextIndexRef = useRef(null);

  useEffect(() => {
    loadAndPlay(currentIndex); // play the song with the new index
    return () => unload(); // cleanup on unmount
  }, [currentIndex]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  }, []);

  const unload = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync(); // release the current sound object from memory completely
      soundRef.current = null;
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis);
    setDuration(status.durationMillis ?? 1);
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      if (isRepeatingRef.current) {
        // just replay the same sound directly, no index change needed
        soundRef.current?.replayAsync();
      } else {
        setCurrentIndex((prev) => getNextIndexRef.current(prev));
      }
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

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const seekTo = async (value) => {
    if (soundRef.current) await soundRef.current.setPositionAsync(value);
  };

  const changeVolume = async (value) => {
    setVolume(value);
    if (soundRef.current) await soundRef.current.setVolumeAsync(value);
  };

  const changePitch = async (value) => {
    setPitch(value);
    if (soundRef.current) {
      await soundRef.current.setRateAsync(value, true); // true = correct pitch
    }
  };

  const generateShuffle = () => {
    // Fisher-Yates shuffle algorithm
    const arr = [...Array(songs.length).keys()];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    shuffleOrder.current = arr;
  };

  const toggleShuffle = () => {
    if (!isShuffled) generateShuffle();
    setIsShuffled((prev) => !prev);
  };

  const toggleRepeat = () => setIsRepeating((prev) => !prev);

  useEffect(() => {
    isRepeatingRef.current = isRepeating;
  }, [isRepeating]);

  const getNextIndex = useCallback(
    (current) => {
      if (isRepeating) return current;
      if (isShuffled) {
        const pos = shuffleOrder.current.indexOf(current);
        return shuffleOrder.current[(pos + 1) % songs.length];
      }
      return (current + 1) % songs.length;
    },
    [isRepeating, isShuffled],
  );

  const getPrevIndex = useCallback(
    (current) => {
      if (isRepeating) return current;
      if (isShuffled) {
        const pos = shuffleOrder.current.indexOf(current);
        return shuffleOrder.current[(pos - 1 + songs.length) % songs.length];
      }
      return (current - 1 + songs.length) % songs.length;
    },
    [isRepeating, isShuffled],
  );

  // Keep ref updated
  useEffect(() => {
    getNextIndexRef.current = getNextIndex;
  }, [getNextIndex]);

  const skipNext = () => setCurrentIndex((prev) => getNextIndex(prev));
  const skipPrev = () => setCurrentIndex((prev) => getPrevIndex(prev));

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentIndex,
        setCurrentIndex,
        isPlaying,
        position,
        duration,
        volume,
        pitch,
        isShuffled,
        isRepeating,
        togglePlayPause,
        seekTo,
        changeVolume,
        changePitch,
        toggleShuffle,
        toggleRepeat,
        skipNext,
        skipPrev,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
