import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { api } from "../services/api";
import { InputField } from "../../src/components/InputField";
import { AlertBanner } from "../../src/components/AlertBanner";
import { ROUTES } from "../../src/navigation/types";
import Colors from "../../constants/colors";

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const C = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const topPad = insets.top;
  const botPad = insets.bottom;

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
     let res = await api.register(name, email.trim().toLowerCase(), password, confirmPassword);
     console.log(res,"reeeeeeeeees") 
     setSuccess("Account created! Redirecting to login...");
      setTimeout(() => router.replace(ROUTES.LOGIN), 1500);
    } catch (err: any) {
      console.log(err,"error")
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>
          Create Account
        </Text>
        <Text style={[styles.headerSub, { fontFamily: "Inter_400Regular" }]}>
          Join Best Infra Consumer Portal
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[styles.form, { paddingBottom: botPad + 20 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {error ? <AlertBanner type="error" message={error} /> : null}
          {success ? <AlertBanner type="success" message={success} /> : null}

          <InputField icon="person-outline" placeholder="Full Name" value={name} onChangeText={setName} autoCapitalize="words" C={C} />
          <InputField icon="mail-outline" placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" C={C} />
          <InputField
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            C={C}
            rightElement={
              <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={20} color={C.textMuted} />
              </Pressable>
            }
          />
          <InputField icon="lock-closed-outline" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPass} C={C} />

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, marginTop: 8 }]}
          >
            <View style={styles.registerBtn}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <Text style={[styles.registerBtnText, { fontFamily: "Inter_600SemiBold" }]}>Create Account</Text>
              )}
            </View>
          </Pressable>

          <Pressable onPress={() => router.replace(ROUTES.LOGIN)} style={styles.loginLink}>
            <Text style={[styles.loginLinkText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Already have an account?{" "}
              <Text style={{ color: "#667EEA", fontFamily: "Inter_600SemiBold" }}>Sign In</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    backgroundColor: "#667EEA", 
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  headerTitle: { fontSize: 28, color: "#fff" },
  headerSub: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 6 },
  form: { paddingHorizontal: 24, paddingTop: 32, gap: 14 },
  eyeBtn: { padding: 4 },
 registerBtn: { 
    height: 56, 
    borderRadius: 16, 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "#667EEA", 
    shadowColor: "#000",        
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,             
  },
  registerBtnText: { 
    fontSize: 17, 
    color: "#fff",
    fontWeight: '600'
  },
  loginLink: { alignItems: "center", paddingVertical: 8 },
  loginLinkText: { fontSize: 14 },
});
