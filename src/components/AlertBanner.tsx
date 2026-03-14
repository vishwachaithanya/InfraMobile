import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AlertBannerProps {
  type: "error" | "success" | "warning";
  message: string;
}

const CONFIG = {
  error: { bg: "#FEE2E2", color: "#EF4444", icon: "alert-circle" },
  success: { bg: "#D1FAE5", color: "#10B981", icon: "checkmark-circle" },
  warning: { bg: "#FEF3C7", color: "#D97706", icon: "warning" },
};

export function AlertBanner({ type, message }: AlertBannerProps) {
  const cfg = CONFIG[type];
  return (
    <View style={[styles.box, { backgroundColor: cfg.bg }]}>
      <Ionicons name={cfg.icon as any} size={16} color={cfg.color} />
      <Text style={[styles.text, { color: cfg.color, fontFamily: "Inter_400Regular" }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  text: { fontSize: 14, flex: 1 },
});
