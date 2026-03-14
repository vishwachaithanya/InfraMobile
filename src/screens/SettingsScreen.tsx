import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../src/navigation/types";
import Colors from "../../constants/colors";

interface SettingRowProps {
  icon: string;
  label: string;
  sublabel?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
  C: typeof Colors.light;
}

function SettingRow({ icon, label, sublabel, rightElement, onPress, danger, C }: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: C.card, borderColor: C.border, opacity: pressed && onPress ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: danger ? "#FEE2E2" : C.surface }]}>
        <Ionicons name={icon as any} size={20} color={danger ? "#EF4444" : C.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: danger ? "#EF4444" : C.text, fontFamily: "Inter_500Medium" }]}>
          {label}
        </Text>
        {sublabel ? (
          <Text style={[styles.rowSub, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            {sublabel}
          </Text>
        ) : null}
      </View>
      {rightElement ?? (onPress ? <Feather name="chevron-right" size={18} color={C.textMuted} /> : null)}
    </Pressable>
  );
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const { logout, consumerName } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View
        style={[styles.header, { paddingTop: topPad + 16 }]}>

     
        <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>Settings</Text>
        <Text style={[styles.headerSub, { fontFamily: "Inter_400Regular" }]}>{consumerName}</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 120 : 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: C.textMuted, fontFamily: "Inter_500Medium" }]}>
          Preferences
        </Text>
        <View style={styles.group}>
          <SettingRow icon="moon-outline" label="Dark Mode" sublabel="Follows system appearance" C={C}
            rightElement={
              <View style={[styles.sysBadge, { backgroundColor: C.surface }]}>
                <Text style={[styles.sysText, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>System</Text>
              </View>
            }
          />
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <SettingRow icon="notifications-outline" label="Push Notifications" sublabel="Alerts for bills and payments" C={C}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={(v) => { setNotifications(v);  }}
                trackColor={{ false: C.border, true: "#0057FF40" }}
                thumbColor={notifications ? "#0057FF" : "#9CA3AF"}
              />
            }
          />
        </View>

        <Text style={[styles.sectionLabel, { color: C.textMuted, fontFamily: "Inter_500Medium" }]}>Account</Text>
        <View style={styles.group}>
          <SettingRow icon="person-outline" label="Edit Profile" sublabel="Name, phone, address" onPress={() => router.push(ROUTES.TABS.PROFILE)} C={C} />
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <SettingRow icon="shield-checkmark-outline" label="Security" sublabel="Password & authentication" C={C} />
        </View>

        <Text style={[styles.sectionLabel, { color: C.textMuted, fontFamily: "Inter_500Medium" }]}>Support</Text>
        <View style={styles.group}>
          <SettingRow icon="help-circle-outline" label="Help & FAQ" C={C} />
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <SettingRow icon="chatbubble-ellipses-outline" label="Contact Support" C={C} />
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <SettingRow icon="document-text-outline" label="Privacy Policy" C={C} />
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <SettingRow icon="information-circle-outline" label="About Best Infra" sublabel="Version 1.0.0" C={C} />
        </View>

        <Text style={[styles.sectionLabel, { color: C.textMuted, fontFamily: "Inter_500Medium" }]}>Session</Text>
        <View style={styles.group}>
          <SettingRow icon="log-out-outline" label="Logout" sublabel="Sign out of your account" onPress={handleLogout} danger C={C} />
        </View>

        <Text style={[styles.version, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
          Best Infra Consumer App v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 24, 
    paddingBottom: 28, 
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32, 
    gap: 6,
    backgroundColor: "#0057FF",
  },
  headerTitle: { fontSize: 28, color: "#fff" },
  headerSub: { fontSize: 14, color: "rgba(255,255,255,0.75)" },
  content: { padding: 20, gap: 8 },
  sectionLabel: { 
    fontSize: 12, 
    textTransform: "uppercase", 
    letterSpacing: 0.8, 
    marginTop: 12, 
    marginBottom: 4 
  },
  group: { 
    borderRadius: 16, 
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 14, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    borderWidth: 1 
  },
  rowIcon: { 
    width: 38, 
    height: 38, 
    borderRadius: 10, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  rowLabel: { fontSize: 15 },
  rowSub: { fontSize: 12, marginTop: 1 },
  divider: { height: 1, marginLeft: 68 },
  sysBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sysText: { fontSize: 12 },
  version: { textAlign: "center", fontSize: 12, marginTop: 16 },
});
