import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { api, Notification } from "../../src/services/api";
import { formatDateTime } from "../utils/helper";
import Colors from "../../constants/colors";

const NOTIF_META: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  bill_due: { icon: "receipt-outline", color: "#F59E0B", bg: "#FEF3C7", label: "Bill Due" },
  payment_confirmation: { icon: "checkmark-circle-outline", color: "#10B981", bg: "#D1FAE5", label: "Payment" },
  low_balance: { icon: "battery-dead-outline", color: "#EF4444", bg: "#FEE2E2", label: "Low Balance" },
  system_alert: { icon: "warning-outline", color: "#6366F1", bg: "#EEF2FF", label: "System" },
  ticket_update: { icon: "chatbubble-ellipses-outline", color: "#0057FF", bg: "#EFF6FF", label: "Ticket" },
};

function NotifCard({ item, C }: { item: Notification; C: typeof Colors.light }) {
  const meta = NOTIF_META[item.type] ?? {
    icon: "notifications-outline",
    color: "#6B7280",
    bg: "#F3F4F6",
    label: "Alert",
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: C.card, borderColor: item.isRead ? C.border : "#0057FF33" },
        !item.isRead && { borderLeftWidth: 3, borderLeftColor: "#0057FF" },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon as any} size={22} color={meta.color} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[styles.title, { color: C.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.dot} />}
        </View>
        <Text style={[styles.desc, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={[styles.badge, { backgroundColor: meta.bg }]}>
            <Text style={[styles.badgeText, { color: meta.color, fontFamily: "Inter_500Medium" }]}>
              {meta.label}
            </Text>
          </View>
          <Text style={[styles.time, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            {formatDateTime(item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { data = { notifications: [], unreadCount: 0 }, isLoading, isError, refetch, isFetching } = useQuery<{ notifications: Notification[]; unreadCount: number }>({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
  });

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>Notifications</Text>
          {data && data.unreadCount > 0 && (<View style={styles.unreadBadge}>
              <Text style={[styles.unreadText, { fontFamily: "Inter_700Bold" }]}>
                {data.unreadCount} new
              </Text>
            </View>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={C.danger} />
          <Text style={[{ color: C.text, fontFamily: "Inter_500Medium" }]}>Failed to load</Text>
          <Pressable onPress={() => refetch()} style={[styles.retryBtn, { borderColor: C.primary }]}>
            <Text style={{ color: C.primary, fontFamily: "Inter_500Medium" }}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data?.notifications ?? []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 120 : 110 }]}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={C.primary} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={60} color={C.textMuted} />
              <Text style={[styles.emptyText, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                No notifications yet
              </Text>
            </View>
          }
          renderItem={({ item }) => <NotifCard item={item} C={C} />}
        />
      )}
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
    backgroundColor: "#667EEA", 
  },
  headerTitle: { fontSize: 26, color: "#fff" },
unreadBadge: { 
    backgroundColor: "rgba(255,255,255,0.25)", 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20 
  },  
  unreadText: { color: "#fff", fontSize: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  retryBtn: { 
    borderWidth: 1, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 12,
    borderColor: "#667EEA", 
  },
  list: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  card: { flexDirection: "row", gap: 12, borderWidth: 1, borderRadius: 16, padding: 14, alignItems: "flex-start" },
  icon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 15, flex: 1 },
  desc: { fontSize: 13, lineHeight: 19 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11 },
  time: { fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#0057FF" },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16 },
});
