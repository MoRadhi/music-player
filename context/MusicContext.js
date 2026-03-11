import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import songs from "../constants/songs";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const shuffleOrder = useRef([...Array(songs.length).keys()]); // [0, 1, 2]

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

  return (
    <MusicContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        isShuffled,
        toggleShuffle,
        isRepeating,
        toggleRepeat,
        getNextIndex,
        getPrevIndex,
        songs,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
