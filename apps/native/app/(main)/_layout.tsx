import React from "react";
import { Stack } from "expo-router";

const MainLayout: React.FC = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="profile"
        options={{ headerShown: true, title: "Profile" }}
      />
      <Stack.Screen
        name="profile-edit"
        options={{ headerShown: true, title: "Edit Profile" }}
      />
      <Stack.Screen
        name="exercise-catalog"
        options={{ headerShown: true, title: "Exercises" }}
      />
      <Stack.Screen
        name="exercise-detail"
        options={{ headerShown: true, title: "Exercise" }}
      />
    </Stack>
  );
};

export default MainLayout;
