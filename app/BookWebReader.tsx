import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";
const PRIMARY_COLOR = "#0a7ea4";

export default function BookWebReader() {
  const router = useRouter();
  const { url, title } = useLocalSearchParams<{ url: string; title?: string }>();

  if (!url) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.error}>Missing reader URL.</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBack}>
          <FontAwesome name="chevron-left" size={18} color={TEXT_COLOR} />
          <Text style={styles.headerBackText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title ?? "Reader"}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: String(url) }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={styles.loadingText}>Loading book...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  header: {
    height: 52,
    backgroundColor: BACKGROUND_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
  },
  headerBack: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerBackText: { color: TEXT_COLOR, fontSize: 15, fontWeight: "500" },
  headerTitle: { flex: 1, textAlign: "center", color: TEXT_COLOR, fontWeight: "700" },
  loadingOverlay: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, color: "#6B7280" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  error: { color: TEXT_COLOR, fontSize: 14, marginBottom: 12 },
  backBtn: { backgroundColor: PRIMARY_COLOR, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  backBtnText: { color: "#fff", fontWeight: "700" },
});
