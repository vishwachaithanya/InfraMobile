import React, { useState, useEffect } from "react";
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
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, UserProfile } from "../../src/services/api";
import { InputField } from "../../src/components/InputField";
import { AlertBanner } from "../../src/components/AlertBanner";
import { getInitials } from "../utils/helper";
import Colors from "../../constants/colors";

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: api.getProfile,
  });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      console.log(profile,"profile")
      setName(profile.name ?? "");
      setPhone(profile.phone ?? "");
      setAddress(profile.address ?? "");
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: { name?: string; phone?: string; address?: string }) =>
      api.updateProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
      setEditing(false);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    },
  });

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setName(profile.name ?? "");
      setPhone(profile.phone ?? "");
      setAddress(profile.address ?? "");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(name || "U")}</Text>
        </View>
        <Text style={styles.headerName}>{name}</Text>
        <Text style={styles.headerEmail}>{profile?.email}</Text>
      </View>

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : undefined}
>
<ScrollView
  contentContainerStyle={[styles.form, { flexGrow: 1 }]}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  keyboardDismissMode="interactive"
>           <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Account Details</Text>
            {!editing ? (
              <Pressable onPress={() => setEditing(true)} style={[styles.editBtn, { backgroundColor: C.surface }]}>
                <Feather name="edit-2" size={14} color={C.primary} />
                <Text style={{ color: C.primary }}>Edit</Text>
              </Pressable>
            ) : (
              <Pressable onPress={handleCancel} style={[styles.editBtn, { backgroundColor: "#FEE2E2" }]}>
                <Feather name="x" size={14} color="#EF4444" />
                <Text style={{ color: "#EF4444" }}>Cancel</Text>
              </Pressable>
            )}
          </View>

          {success ? <AlertBanner type="success" message={success} /> : null}

          {/* 1. FULL NAME (Editable) */}
          <View>
            <Text style={[styles.fieldLabel, { color: C.textMuted }]}>Full Name</Text>
            <InputField icon="person-outline" value={name} onChangeText={setName} editable={editing} C={C} />
          </View>

          {/* 2. EMAIL (Always Read-Only) */}
          <View>
            <Text style={[styles.fieldLabel, { color: C.textMuted }]}>Email</Text>
            <InputField icon="mail-outline" value={profile?.email ?? ""} editable={false} C={C} />
          </View>

          {/* 3. METER NUMBER (Always Read-Only) */}
          <View>
            <Text style={[styles.fieldLabel, { color: C.textMuted }]}>Meter Number</Text>
            <InputField icon="flash-outline" value={profile?.meterNumber ?? "N/A"} editable={false} C={C} />
          </View>

          {/* 4. PHONE (Editable) */}
          <View>
            <Text style={[styles.fieldLabel, { color: C.textMuted }]}>Phone</Text>
            <InputField icon="call-outline" value={phone} onChangeText={setPhone} editable={editing} keyboardType="phone-pad" C={C} />
          </View>

          {/* 5. ADDRESS (Editable) */}
          <View>
            <Text style={[styles.fieldLabel, { color: C.textMuted }]}>Address</Text>
            <InputField icon="location-outline" value={address} onChangeText={setAddress} editable={editing} C={C} />
          </View>

          {editing && (
            <Pressable onPress={() => mutation.mutate({ name, phone, address })} disabled={mutation.isPending} style={{ marginTop: 10 }}>
              <View style={styles.saveBtn}>
                {mutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </View>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", paddingBottom: 30, backgroundColor: "#11998E", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  avatarText: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  headerName: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  headerEmail: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  form: { 
    padding: 20, 
    gap: 15,
    paddingBottom: 100, // Add this! It ensures the last input isn't hidden by the keyboard/tab bar
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 5, padding: 8, borderRadius: 8 },
  fieldLabel: { fontSize: 12, marginBottom: 4, fontWeight: "600" },
  saveBtn: { height: 50, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#11998E" },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});