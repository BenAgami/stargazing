import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ExerciseSummary } from "@src/types/workout";

const CARD_PALETTE = [
  "#E57373", "#F06292", "#BA68C8", "#7986CB",
  "#4FC3F7", "#4DB6AC", "#81C784", "#FFD54F",
  "#FF8A65", "#A1887F",
];

const cardColor = (code: string): string => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_PALETTE[Math.abs(hash) % CARD_PALETTE.length];
};

export interface ExerciseCardProps {
  exercise: ExerciseSummary;
  onPress: (exercise: ExerciseSummary) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  const bg = cardColor(exercise.code);
  const isStatic = exercise.exerciseType === "STATIC_HOLD";
  const badgeLabel = isStatic ? "Static Hold" : "Dynamic";

  return (
    <Pressable
      onPress={() => onPress(exercise)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.displayName}, ${badgeLabel}`}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeLabel}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {exercise.displayName}
      </Text>
    </Pressable>
  );
};

export default ExerciseCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    justifyContent: "space-between",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
