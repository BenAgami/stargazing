import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

import { SwitchRow } from "@repo/ui";

import { useTheme } from "@src/context/ThemeContext";
import { baseColors } from "@src/theme/colors";

const Settings: React.FC = () => {
  const { currentTheme, toggleTheme, colors } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Settings
            </Text>

            <Text style={[styles.headerSubtitle, { color: colors.text }]}>
              Customize your experience
            </Text>
          </View>

          <ScrollView>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Preferences
              </Text>

              <View
                style={[
                  styles.sectionBody,
                  { backgroundColor: colors.background },
                ]}
              >
                <View style={[styles.rowWrapper, styles.rowFirst]}>
                  <SwitchRow
                    label="Dark Mode"
                    isEnabled={currentTheme === "dark"}
                    onToggle={toggleTheme}
                    colors={colors}
                    iconName="moon"
                    iconBackground={baseColors.blue}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    marginHorizontal: 24,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 6,
  },
  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    marginVertical: 8,
    marginHorizontal: 24,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#5f5f5f",
  },
  /** Row */
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: "#5f5f5f",
  },
  rowFirst: {
    borderTopWidth: 0,
  },
});
