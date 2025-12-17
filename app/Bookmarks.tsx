// components/BookmarksCard.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router"; // ← ADD THIS
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const PRIMARY_COLOR = "#0a7ea4";
const TEXT_COLOR = "#1F2937";

export type BookmarkItem = {
  id: number | string;
  bookTitle: string;
  currentPage: number;
  totalPages: number;
};

export type BookmarksCardProps = {
  bookmarks?: BookmarkItem[];
  onOpenBookmark?: (bookmark: BookmarkItem) => void;
};

// ---- DUMMY DATA ADDED HERE ----
const dummyBookmarks: BookmarkItem[] = [
  {
    id: 1,
    bookTitle: "Atomic Habits",
    currentPage: 120,
    totalPages: 280,
  },
  {
    id: 2,
    bookTitle: "The Alchemist",
    currentPage: 45,
    totalPages: 200,
  },
  {
    id: 3,
    bookTitle: "Rich Dad Poor Dad",
    currentPage: 72,
    totalPages: 207,
  },
];

export default function BookmarksCard({
  bookmarks = dummyBookmarks, // default dummy
  onOpenBookmark,
}: BookmarksCardProps) {
  return (
    <View style={styles.card}>
      
      {/* 🔙 BACK BUTTON */}
      <Pressable
        onPress={() => router.push("/(tabs)/Home")}
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <FontAwesome name="chevron-left" size={18} color={TEXT_COLOR} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent bookmarks</Text>
        <FontAwesome name="bookmark" size={20} color={PRIMARY_COLOR} />
      </View>

      {bookmarks.map((bm) => (
        <View key={bm.id} style={styles.bookmarkRow}>
          <View style={styles.iconCircle}>
            <FontAwesome name="book" size={16} color="#FFFFFF" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle} numberOfLines={1}>
              {bm.bookTitle}
            </Text>
            <Text style={styles.meta}>
              Page {bm.currentPage} / {bm.totalPages}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.openButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => onOpenBookmark && onOpenBookmark(bm)}
          >
            <Text style={styles.openButtonText}>Open</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  /* 🔙 Back Button Styles */
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "500",
    color: TEXT_COLOR,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  bookmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_COLOR,
  },
  meta: {
    fontSize: 12,
    color: "#6B7280",
  },
  openButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E5F3F8",
    marginLeft: 8,
  },
  openButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
});
