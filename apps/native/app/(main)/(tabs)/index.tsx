import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

import { useTheme } from "@src/context/ThemeContext";

const Home: React.FC = () => {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.header, { color: colors.text }]}>Clear Night</Text>
      </View>
    </>
  );
};

export default Home;

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
