import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

import { SwitchRow } from "@repo/ui";

import { ThemeContext } from "@src/context/ThemeContext";

const Settings = () => {
  const { currentTheme, toggleTheme, colors } = useContext(ThemeContext);

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
        <Text style={[styles.title, { color: colors.text }]}>Theme Switch</Text>
        <SwitchRow
          label="Dark Theme"
          isEnabled={currentTheme === "dark"}
          onToggle={toggleTheme}
          colors={colors}
        />
      </View>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
