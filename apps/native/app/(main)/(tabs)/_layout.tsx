import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Entypo, Ionicons } from "@expo/vector-icons";

import { useTheme } from "@src/context/ThemeContext";

const TabsLayout: React.FC = () => {
  const { currentTheme, colors } = useTheme();

  return (
    <>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
