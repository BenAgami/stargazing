import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@src/context/ThemeContext";
import { useExerciseDetail } from "@src/hooks/queries/useExerciseDetail";
import { setPickedExercise } from "@src/state/pickedExerciseStore";

type DetailParams = { code?: string; pickerReturnTo?: string };

const formatType = (t: "DYNAMIC" | "STATIC_HOLD"): string =>
  t === "STATIC_HOLD" ? "Static Hold" : "Dynamic";

const ExerciseDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams<DetailParams>();
  const code = params.code;
  const isPicker = !!params.pickerReturnTo;
  const { data, isLoading, error } = useExerciseDetail(code);

  const handleAddToWorkout = () => {
    if (!data) return;
    if (isPicker) {
      setPickedExercise({
        exerciseId: data.id,
        exerciseCode: data.code,
        exerciseDisplayName: data.displayName,
        exerciseType: data.exerciseType,
      });
      // Pop BOTH exercise-detail and exercise-catalog so we return to the
      // existing workout-builder instance with its draft state intact.
      // router.replace would have created a new builder on the stack.
      router.dismiss(2);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.text}
            style={styles.loader}
          />
        )}
        {error && !isLoading && (
          <Text style={[styles.errorText, { color: "#E57373" }]}>
            Failed to load exercise.
          </Text>
        )}
        {data && !isLoading && (
          <>
            <Text style={[styles.name, { color: colors.text }]}>
              {data.displayName}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {formatType(data.exerciseType)}
              </Text>
            </View>
            <Text style={[styles.description, { color: colors.text }]}>
              {data.description ?? "No description available yet."}
            </Text>
            <Pressable
              onPress={handleAddToWorkout}
              style={({ pressed }) => [
                styles.cta,
                { backgroundColor: pressed ? "#006EE6" : "#007AFF" },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Add to workout"
            >
              <Text style={styles.ctaText}>
                {isPicker ? "Add to workout" : "Done"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseDetailScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 24, paddingBottom: 48 },
  loader: { marginTop: 60 },
  errorText: { fontSize: 14, marginTop: 40, textAlign: "center" },
  name: { fontSize: 28, fontWeight: "700", marginTop: 12 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#7986CB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  description: { fontSize: 16, lineHeight: 24, marginTop: 24 },
  cta: {
    marginTop: 36,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
