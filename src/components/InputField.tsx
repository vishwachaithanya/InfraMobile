import React from "react";
import { StyleSheet, TextInput, View, KeyboardTypeOptions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";

interface InputFieldProps {
  icon: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  rightElement?: React.ReactNode;
  editable?: boolean; // <-- Added this
  C: typeof Colors.light;
}

export function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  rightElement,
  editable = true, // <-- Default to true
  C,
}: InputFieldProps) {
  return (
    <View style={[
      styles.wrap, 
      { 
        backgroundColor: C.card, 
        borderColor: C.border,
        opacity: editable ? 1 : 0.6 // Visual hint: faded when locked
      }
    ]}>
      <Ionicons name={icon as any} size={20} color={C.textMuted} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: C.text, fontFamily: "Inter_400Regular" }]}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        editable={editable} // <-- CRITICAL: Tells the OS if the keyboard can open
      />
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, height: "100%" },
});