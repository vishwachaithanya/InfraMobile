import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/colors";

interface UsagePoint {
  date: string;
  value: number;
}

interface UsageGraphProps {
  data: UsagePoint[];
  days: number;
  C: typeof Colors.light;
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const h = max > 0 ? (value / max) * 50 : 0;
  return (
    <View
      style={{
        width: 6,
        height: 50,
        borderRadius: 3,
        backgroundColor: `${color}20`,
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      <View
        style={{ height: Math.max(h, 3), backgroundColor: color, borderRadius: 3 }}
      />
    </View>
  );
}

export function UsageGraph({ data, days, C }: UsageGraphProps) {
  const sliced = data.slice(-days);
  const max = Math.max(...sliced.map((d) => d.value), 1);
  const skip = Math.max(1, Math.floor(sliced.length / 20));

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 3, height: 60 }}>
        {sliced
          .filter((_, i) => i % skip === 0)
          .map((pt, i) => (
            <MiniBar key={i} value={pt.value} max={max} color="#0057FF" />
          ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
        <Text style={[styles.label, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
          {sliced[0]?.date ?? ""}
        </Text>
        <Text style={[styles.label, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
          {sliced[sliced.length - 1]?.date ?? ""}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  label: { fontSize: 10 },
});
