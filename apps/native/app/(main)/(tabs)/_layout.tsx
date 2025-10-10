import { useContext } from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Entypo, Ionicons } from "@expo/vector-icons";

import { ThemeContext } from "@src/context/ThemeContext";

const TabsLayout = () => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000000",
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
