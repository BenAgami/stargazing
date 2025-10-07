import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { lightTheme, darkTheme } from "../theme/colors";

type Theme = "light" | "dark";

type ThemeContextType = {
  currentTheme: Theme;
  toggleTheme: () => void;
  colors: typeof lightTheme;
};

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "light",
  toggleTheme: () => {},
  colors: lightTheme,
});

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem(
          "theme"
        )) as Theme | null;

        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Error in loading theme.", error);
      }
    };

    getTheme();
  });

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const colors = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
