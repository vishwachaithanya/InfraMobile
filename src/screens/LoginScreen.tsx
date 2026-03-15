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
import { useAuth } from "../../context/AuthContext";
import { api } from "../services/api";
import { InputField } from "../../src/components/InputField";
import { AlertBanner } from "../../src/components/AlertBanner";
import { ROUTES } from "../../src/navigation/types";
import Colors from "../../constants/colors";

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topPad =  insets.top;
  const botPad = insets.bottom;

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      console.log("vccc")
      const res = await api.login(email.trim().toLowerCase(), password);
      console.log(res,"ress")
      await login(res.token, res.consumerName, res.userId);
      router.replace(ROUTES.TABS.DASHBOARD);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View
        style={[styles.header, { paddingTop: topPad + 20 }]}
      >
        <View style={styles.logoWrap}>
          <Ionicons name="flash" size={40} color="#fff" />
        </View>
        <Text style={[styles.appName, { fontFamily: "Inter_700Bold" }]}>
          Best Infra
        </Text>
        <Text style={[styles.tagline, { fontFamily: "Inter_400Regular" }]}>
          Consumer Portal
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.form,
            { paddingBottom: botPad + 20 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Sign in to your account
          </Text>

          {error ? <AlertBanner type="error" message={error} /> : null}

          <InputField
            icon="mail-outline"
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            C={C}
          />

          <InputField
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            C={C}
            rightElement={
              <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={C.textMuted}
                />
              </Pressable>
            }
          />

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <View
              style={styles.loginBtn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.loginBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                  Sign In
                </Text>
              )}
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push(ROUTES.REGISTER)}
            style={styles.registerLink}
          >
            <Text style={[styles.registerText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Don't have an account?{" "}
              <Text style={{ color: C.primary, fontFamily: "Inter_600SemiBold" }}>
                Register
              </Text>
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
  alignItems: "center",
  paddingHorizontal: 24,
  paddingBottom: 40,
  borderBottomLeftRadius: 36,
  borderBottomRightRadius: 36,
  backgroundColor: "#0057FF",
},
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appName: { fontSize: 28, color: "#fff" },
  tagline: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  form: { paddingHorizontal: 24, paddingTop: 32, gap: 16 },
  title: { fontSize: 26 },
  subtitle: { fontSize: 15, marginBottom: 8 },
  eyeBtn: { padding: 4 },
  loginBtn: {
  height: 56,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 8,
  backgroundColor: "#0057FF",
},
  loginBtnText: { fontSize: 17, color: "#fff" },
  registerLink: { alignItems: "center", paddingVertical: 8 },
  registerText: { fontSize: 14 },
});
