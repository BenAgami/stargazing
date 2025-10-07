import { Stack } from "expo-router";

import ThemeProvider from "../src/context/ThemeContext";

const AppLayout = () => {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
};

export default AppLayout;
