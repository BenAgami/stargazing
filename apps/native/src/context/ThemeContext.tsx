import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { themes, ThemeNames, ThemeColors } from "../theme/colors";

type ThemeContextType = {
  currentTheme: ThemeNames;
  toggleTheme: () => void;
  colors: ThemeColors;
};

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "light",
  toggleTheme: () => {},
  colors: themes.light,
});

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeNames>("light");

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem(
          "theme"
        )) as ThemeNames | null;

        if (savedTheme && themes[savedTheme]) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Error loading theme.", error);
      }
    };
    getTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme: ThemeNames = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error saving theme.", error);
    }
  };

  const colors: ThemeColors = themes[theme];

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
