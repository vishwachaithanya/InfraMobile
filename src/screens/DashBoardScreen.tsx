import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import Animated, { FadeInDown } from "react-native-reanimated";
import { api, DashboardData } from "../../src/services/api";
import { StatCard } from "../../src/components/StatCard";
import { UsageGraph } from "../../src/components/UsageGraph";
import { formatCurrency, formatDate } from "../utils/helper";
import Colors from "../../constants/colors";

const TIME_FILTERS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() == "dark";
  console.log(isDark,"isdrak")
  const C = isDark ? Colors.dark : Colors.light;
  const [filterDays, setFilterDays] = useState(30);
  const [filterLabel, setFilterLabel] = useState("30D");
  const topPad =  insets.top;

  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<DashboardData>({
      queryKey: ["dashboard"],
      queryFn: api.getDashboard,
    });


  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={C.danger} />
        <Text style={[styles.errorMsg, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
          Failed to load dashboard
        </Text>
        <Pressable onPress={() => refetch()} style={[styles.retryBtn, { borderColor: C.primary }]}>
          <Text style={{ color: C.primary, fontFamily: "Inter_500Medium" }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
  style={{ backgroundColor: C.background }}
  contentContainerStyle={{ 
    backgroundColor: C.background,
    paddingBottom: 110 
  }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={C.primary} />
      }
    >
      <View
        style={[styles.hero, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={[styles.greeting, { fontFamily: "Inter_400Regular" }]}>Good day,</Text>
            <Text style={[styles.consumerName, { fontFamily: "Inter_700Bold" }]}>
              {data.consumerName}
            </Text>
          </View>
          <View style={styles.meterTag}>
            <Ionicons name="flash" size={14} color="#0057FF" />
            <Text style={[styles.meterNum, { fontFamily: "Inter_500Medium" }]}>
              {data.meterNumber}
            </Text>
          </View>
        </View>

        <View style={styles.balanceRow}>
          <View>
            <Text style={[styles.balLabel, { fontFamily: "Inter_400Regular" }]}>
              Available Balance
            </Text>
            <Text style={[styles.balValue, { fontFamily: "Inter_700Bold" }]}>
              {formatCurrency(data.balance) ||0}
            </Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={[styles.balLabel, { fontFamily: "Inter_400Regular" }]}>Due Amount</Text>
            <Text style={[styles.dueValue, { fontFamily: "Inter_700Bold" }]}>
              {formatCurrency(data.dueAmount)||0}
            </Text>
            <Text style={[styles.dueDate, { fontFamily: "Inter_400Regular" }]}>
              Due: {formatDate(data.dueDate)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
            Energy Summary
          </Text>
          <View style={styles.statsRow}>
            <StatCard label="Monthly" value={`${data.monthlyUsage} kWh`} icon="flash-outline" color="#0057FF" C={C} />
            <StatCard label="Daily Avg" value={`${data.avgDailyUsage} kWh`} icon="trending-up-outline" color="#10B981" C={C} />
            <StatCard label="Peak" value={`${data.peakUsage} kWh`} icon="flame-outline" color="#F59E0B" C={C} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
              Usage History
            </Text>
            <View style={styles.filterRow}>
              {TIME_FILTERS.map((f) => (
                <Pressable
                  key={f.label}
                  onPress={() => { setFilterDays(f.days); setFilterLabel(f.label); }}
                  style={[styles.filterChip, { backgroundColor: filterLabel === f.label ? C.primary : C.surface }]}
                >
                  <Text style={[styles.filterText, { color: filterLabel === f.label ? "#fff" : C.textSecondary, fontFamily: "Inter_500Medium" }]}>
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <UsageGraph data={data.usageHistory} days={filterDays} C={C} />
          <Text style={[styles.lastComm, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            Last sync: {formatDate(data.lastCommunication, true)}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
            Alerts
          </Text>
          {data?.alerts?.length === 0 ? (
            <View style={[styles.emptyAlerts, { backgroundColor: C.card, borderColor: C.border }]}>
              <Ionicons name="checkmark-circle-outline" size={40} color={C.success} />
              <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                No active alerts
              </Text>
            </View>
          ) : (
            data.alerts.map((alert :any, idx:any) => (
              <View key={alert.id} style={[styles.alertRow, { backgroundColor: C.card, borderColor: C.border }]}>
                <View style={[styles.alertIdx, { backgroundColor: "#EFF6FF" }]}>
                  <Text style={[styles.alertIdxText, { fontFamily: "Inter_700Bold" }]}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.alertType, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                    {alert.alertType}
                  </Text>
                  <Text style={[styles.alertMeter, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                    Meter: {alert.meterSerialNumber}
                  </Text>
                </View>
                <View style={[styles.alertBadge, { backgroundColor: "#FEF3C7" }]}>
                  <Text style={[{ color: "#D97706", fontSize: 11, fontFamily: "Inter_500Medium" }]}>
                    {alert.serialNumber}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorMsg: { fontSize: 16 },
  retryBtn: { borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: '#0057FF',
  },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)"
  },
  consumerName: {
    fontSize: 22,
    color: "#fff"
  },
  sectionTitle: {
    fontSize: 17,
    marginBottom: 12,
  },
  meterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  meterNum: { fontSize: 12, color: "#0057FF" },
  balanceRow: { flexDirection: "row", alignItems: "center" },
  balLabel: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 4 },
  balValue: { fontSize: 28, color: "#fff" },
  dueValue: { fontSize: 22, color: "#fff" },
  dueDate: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  divider: { width: 1, height: 60, backgroundColor: "rgba(255,255,255,0.3)", marginHorizontal: 24 },
  body: { padding: 20, gap: 20 },
  statsRow: { flexDirection: "row", gap: 10 },
  card: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16 },
  filterRow: { flexDirection: "row", gap: 4 },
  filterChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  filterText: { fontSize: 12 },
  lastComm: { fontSize: 11, textAlign: "right" },
  emptyAlerts: { borderWidth: 1, borderRadius: 16, padding: 24, alignItems: "center", gap: 8 },
  emptyText: { fontSize: 14 },
  alertRow: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 8 },
  alertIdx: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  alertIdxText: { fontSize: 13, color: "#0057FF" },
  alertType: { fontSize: 14, marginBottom: 2 },
  alertMeter: { fontSize: 12 },
  alertBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
});
