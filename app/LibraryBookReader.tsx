import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#0a7ea4";
const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";

export default function LibraryBookReader() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    authors?: string;
  }>();

  const title = params.title ?? "Library Book";
  const authors = params.authors ?? "Unknown author";

  // ✅ Demo pages (replace later with real content/PDF)
  const pages = useMemo(
    () => [
      "Page 1\n\nThis is a demo reader view for library books.\n\nLater, replace this with your real content (PDF/text/preview).",
      "Page 2\n\nYou can track progress here.\n\nNext/Previous buttons work now.",
      "Page 3\n\nWhen you connect real book content, update the `pages` array or load from DB.",
    ],
    []
  );

  const [pageIndex, setPageIndex] = useState(0);

  const goPrev = () => setPageIndex((p) => Math.max(0, p - 1));
  const goNext = () => setPageIndex((p) => Math.min(pages.length - 1, p + 1));

  const progress = Math.round(((pageIndex + 1) / pages.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <FontAwesome name="chevron-left" size={18} color={TEXT_COLOR} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {authors}
            </Text>
          </View>

          <View style={styles.progressPill}>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>

        {/* Reading area */}
        <ScrollView style={styles.reader} contentContainerStyle={styles.readerContent}>
          <Text style={styles.pageLabel}>
            Page {pageIndex + 1} / {pages.length}
          </Text>

          <Text style={styles.pageText}>{pages[pageIndex]}</Text>
        </ScrollView>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={goPrev}
            disabled={pageIndex === 0}
            style={({ pressed }) => [
              styles.controlBtn,
              pageIndex === 0 && styles.controlDisabled,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <FontAwesome name="angle-left" size={18} color="#fff" />
            <Text style={styles.controlText}>Prev</Text>
          </Pressable>

          <Pressable
            onPress={goNext}
            disabled={pageIndex === pages.length - 1}
            style={({ pressed }) => [
              styles.controlBtn,
              pageIndex === pages.length - 1 && styles.controlDisabled,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.controlText}>Next</Text>
            <FontAwesome name="angle-right" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { fontSize: 15, fontWeight: "600", color: TEXT_COLOR },

  headerTitle: { fontSize: 16, fontWeight: "800", color: TEXT_COLOR },
  headerSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  progressPill: {
    backgroundColor: "#E5F3F8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  progressText: { color: PRIMARY_COLOR, fontWeight: "800", fontSize: 12 },

  reader: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  readerContent: { padding: 16, paddingBottom: 24 },

  pageLabel: { fontSize: 12, color: "#9CA3AF", marginBottom: 10 },
  pageText: { fontSize: 15, color: "#111827", lineHeight: 22 },

  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    padding: 16,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  controlText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  controlDisabled: { opacity: 0.4 },
});
