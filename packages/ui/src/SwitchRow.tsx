import React from "react";
import { Text, Switch, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export type SwitchRowProps = {
  label: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  colors: {
    surface: string;
    text: string;
  };
  iconName: keyof typeof Feather.glyphMap;
  iconBackground: string;
};

export const SwitchRow: React.FC<SwitchRowProps> = ({
  label,
  isEnabled,
  onToggle,
  colors,
  iconName,
  iconBackground,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.leftSection}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBackground }]}>
          <Feather name={iconName} size={24} color={colors.text} />
        </View>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      <Switch value={isEnabled} onValueChange={onToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
