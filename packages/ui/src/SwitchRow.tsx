import React from "react";
import { Text, Switch, StyleSheet, View } from "react-native";

export type SwitchRowProps = {
  label: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  colors?: {
    secondary?: string;
    text?: string;
  };
};

export const SwitchRow: React.FC<SwitchRowProps> = ({
  label,
  isEnabled,
  onToggle,
  colors,
}) => {
  const backgroundColor = colors?.secondary || styles.container.backgroundColor;
  const textColor = colors?.text || styles.text.color;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      <Switch value={isEnabled} onValueChange={onToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
});
