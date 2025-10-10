import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ThemeProvider from "@src/context/ThemeContext";

const AppLayout = () => {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(main)/(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
