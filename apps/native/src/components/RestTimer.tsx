import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@src/context/ThemeContext";

const formatSeconds = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec}s`;
  return `${m}:${String(sec).padStart(2, "0")}`;
};

export interface RestTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  onSkip: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({
  secondsLeft,
  totalSeconds,
  onSkip,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.text }]}>Rest</Text>
      <Text
        style={[
          styles.count,
          { color: colors.text, fontVariant: ["tabular-nums"] },
        ]}
        accessibilityLiveRegion="polite"
        accessibilityLabel={`Rest timer, ${secondsLeft} seconds remaining`}
      >
        {formatSeconds(secondsLeft)}
      </Text>
      <Text style={[styles.totalLabel, { color: colors.text }]}>
        of {formatSeconds(totalSeconds)}
      </Text>
      <Pressable
        onPress={onSkip}
        style={({ pressed }) => [
          styles.skipButton,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Skip rest"
      >
        <Text style={styles.skipButtonText}>Skip rest</Text>
      </Pressable>
    </View>
  );
};

export default RestTimer;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: 0.6,
  },
  count: { fontSize: 64, fontWeight: "800", marginVertical: 8 },
  totalLabel: { fontSize: 13, opacity: 0.5, marginBottom: 16 },
  skipButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  skipButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
