import { createContext, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = {
    // Base colors
    colors: {
      background: "#0A0A0A",
      surface: "rgba(255,255,255,0.08)", // glass card background
      surfaceBorder: "rgba(255,255,255,0.12)", // glass card border
      text: "#FFFFFF",
      textSecondary: "rgba(255,255,255,0.6)",
      textMuted: "rgba(255,255,255,0.3)",
    },

    // Glassmorphism card style
    glass: {
      backgroundColor: "rgba(255,255,255,0.08)",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
    },

    // Typography
    typography: {
      heading: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
      title: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
      body: { fontSize: 14, color: "rgba(255,255,255,0.6)" },
      caption: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
    },

    // Spacing
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },

    // Border radius
    radius: {
      sm: 8,
      md: 12,
      lg: 20,
      full: 999,
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
