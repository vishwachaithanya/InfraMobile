import { useAuth } from "../context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Index() {
  const { token, isLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("seen_onboarding").then((val) => {
      setHasSeenOnboarding(val === "true");
    });
  }, []);

  if (isLoading || hasSeenOnboarding === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0057FF" />
      </View>
    );
  }

  if (token) return <Redirect href="/(tabs)/dashboard" />;
  if (!hasSeenOnboarding) return <Redirect href="/onboarding" />;
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E1A",
    alignItems: "center",
    justifyContent: "center",
  },
});
