import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Storage } from "../utils/storage";
import { ROUTES } from "../../src/navigation/types";
import Colors from "../../constants/colors";

const { width, height } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconSet: "ionicons" | "material" | "feather";
  gradient: [string, string, ...string[]];
}

const slides: Slide[] = [
  {
    id: "1",
    title: "Monitor Your Usage",
    description:
      "Track your electricity consumption in real-time with detailed insights and usage graphs.",
    icon: "flash",
    iconSet: "ionicons",
    gradient: ["#0057FF", "#00C6FF"],
  },
  {
    id: "2",
    title: "Stay On Top of Bills",
    description:
      "Get timely alerts for due bills, low balance, and payment confirmations — all in one place.",
    icon: "receipt",
    iconSet: "material",
    gradient: ["#667EEA", "#764BA2"],
  },
  {
    id: "3",
    title: "Manage Your Account",
    description:
      "Update your profile, view meter details, and access support anytime, anywhere.",
    icon: "user-check",
    iconSet: "feather",
    gradient: ["#11998E", "#38EF7D"],
  },
];

function SlideIcon({ slide }: { slide: Slide }) {
  const size = 80;
  if (slide.iconSet === "ionicons")
    return <Ionicons name={slide.icon as any} size={size} color="#fff" />;
  if (slide.iconSet === "material")
    return <MaterialCommunityIcons name={slide.icon as any} size={size} color="#fff" />;
  return <Feather name={slide.icon as any} size={size} color="#fff" />;
}

export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDark = useColorScheme() === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const goToLogin = async () => {
    await Storage.markOnboardingSeen();
    router.replace(ROUTES.LOGIN);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <FlatList
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View
              style={[styles.heroSection, { paddingTop: topPad + 20 }]}
            >
              <Animated.View
                entering={FadeInUp.delay(100).duration(600)}
                style={styles.iconContainer}
              >
                <SlideIcon slide={item} />
              </Animated.View>
            </View>

            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.textSection}
            >
              <Text
                style={[
                  styles.title,
                  { color: C.text, fontFamily: "Inter_700Bold" },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: C.textSecondary, fontFamily: "Inter_400Regular" },
                ]}
              >
                {item.description}
              </Text>
            </Animated.View>
          </View>
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
      />

      <View
        style={[
          styles.footer,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 },
        ]}
      >
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex
                      ? "#0057FF"
                      : isDark
                      ? "#374151"
                      : "#D1D5DB",
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {currentIndex < slides.length - 1 ? (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <View
              style={styles.primaryBtn}
            >
              <Text style={[styles.primaryBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                Next
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={goToLogin}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <View
              style={styles.primaryBtn}
            >
              <Text style={[styles.primaryBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                Get Started
              </Text>
              <Ionicons name="flash" size={20} color="#fff" />
            </View>
          </Pressable>
        )}

        <Pressable onPress={goToLogin} style={styles.secondaryBtn}>
          <Text
            style={[
              styles.secondaryBtnText,
              { color: C.textSecondary, fontFamily: "Inter_500Medium" },
            ]}
          >
            Already have an account? Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
 heroSection: {
    height: height * 0.52,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: "#0057FF",
  },
  
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtn: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
    backgroundColor: "#0057FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  primaryBtnText: { 
    fontSize: 17, 
    color: "#fff",
    fontWeight: '600' 
  },
  textSection: { padding: 32, paddingTop: 40 },
  title: { fontSize: 30, marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 26 },
  footer: { paddingHorizontal: 24, gap: 16 },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: { height: 8, borderRadius: 4 },
  secondaryBtn: { alignItems: "center", paddingVertical: 8 },
  secondaryBtnText: { fontSize: 14 },
});
