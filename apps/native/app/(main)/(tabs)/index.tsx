import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

import { useTheme } from "@src/context/ThemeContext";

export default function Native() {
  const { currentTheme, colors } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerTitleStyle: {
            color: currentTheme === "dark" ? "white" : "black",
          },
          headerStyle: {
            backgroundColor: currentTheme === "dark" ? "black" : "white",
          },
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.header, { color: colors.text }]}>Clear Night</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 36,
  },
});
