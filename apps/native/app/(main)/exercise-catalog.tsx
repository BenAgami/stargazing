import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ScreenHeader } from "@repo/ui";
import { useTheme } from "@src/context/ThemeContext";
import { useExercises } from "@src/hooks/queries/useExercises";
import ExerciseCard from "@src/components/ExerciseCard";
import ExerciseTypeSegmented, {
  type ExerciseTypeFilter,
} from "@src/components/ExerciseTypeSegmented";
import type { ExerciseSummary } from "@src/types/workout";

type CatalogParams = { pickerReturnTo?: string };

const ExerciseCatalog: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams<CatalogParams>();
  const isPicker = !!params.pickerReturnTo;
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ExerciseTypeFilter>("ALL");

  const { data, isLoading, error } = useExercises();

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    const q = search.trim().toLowerCase();
    return items.filter((ex) => {
      if (type !== "ALL" && ex.exerciseType !== type) return false;
      if (q && !ex.displayName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, search, type]);

  const handleCardPress = (exercise: ExerciseSummary) => {
    router.push({
      pathname: "/exercise-detail",
      params: {
        code: exercise.code,
        ...(isPicker ? { pickerReturnTo: params.pickerReturnTo } : {}),
      },
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={isPicker ? "Pick exercise" : "Exercises"}
        subtitle={
          isPicker ? "Choose an exercise to add to your workout" : "Browse the catalog"
        }
        color={colors.text}
      />
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search exercises"
        placeholderTextColor={colors.text + "80"}
        style={[
          styles.searchInput,
          { backgroundColor: colors.surface, color: colors.text },
        ]}
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search exercises"
      />
      <ExerciseTypeSegmented value={type} onChange={setType} />

      {isLoading && (
        <ActivityIndicator size="large" color={colors.text} style={styles.loader} />
      )}

      {error && !isLoading && (
        <Text style={[styles.errorText, { color: "#E57373" }]}>
          Failed to load exercises.
        </Text>
      )}

      {!isLoading && !error && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.code}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <ExerciseCard exercise={item} onPress={handleCardPress} />
          )}
          ListEmptyComponent={
            <View>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                {data?.items.length === 0
                  ? "No exercises in the catalog yet."
                  : "No exercises match your filters."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ExerciseCatalog;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  gridContent: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 24 },
  loader: { marginTop: 40 },
  errorText: { textAlign: "center", marginTop: 40, fontSize: 14 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 14, opacity: 0.6 },
});
