// app/leaderboard.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type LeaderboardUser = {
  id: number;
  name: string;
  pages: number;
};

const PRIMARY_COLOR = "#0a7ea4";
const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";

// Dummy leaderboard data
const USERS: LeaderboardUser[] = [
  { id: 1, name: "Hodges", pages: 12323 },
  { id: 2, name: "Johnny Rios", pages: 23131 },
  { id: 3, name: "Hammond", pages: 6878 },
  { id: 4, name: "Dora Hines", pages: 6432 },
  { id: 5, name: "Carolyn Francis", pages: 5322 },
  { id: 6, name: "Isaiah Gomez", pages: 5200 },
  { id: 7, name: "Mark Holmes", pages: 4987 },
  { id: 8, name: "Georgie Clayton", pages: 4432 },
  { id: 9, name: "Alta Koch", pages: 3878 },
];

export default function LeaderboardScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <FontAwesome name="chevron-left" size={20} color={TEXT_COLOR} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>
          See who has read the most pages in Reeed.
        </Text>
      </View>

      {/* 🔥 All Readers Only — Top 3 Removed */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>All readers</Text>
          <FontAwesome name="list-ol" size={18} color={PRIMARY_COLOR} />
        </View>

        {USERS.map((user, index) => (
          <View key={user.id} style={styles.row}>
            <Text
              style={[
                styles.rowRank,
                index === 0 && styles.rowRankHighlight,
              ]}
            >
              #{index + 1}
            </Text>

            <View style={styles.rowAvatar}>
              <Text style={styles.rowAvatarInitials}>
                {user.name.charAt(0)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.rowName} numberOfLines={1}>
                {user.name}
              </Text>
            </View>

            <View style={styles.rowScoreBadge}>
              <FontAwesome
                name="book"
                size={11}
                color="#FFF"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.rowScoreText}>{user.pages}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// --- styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "500",
    color: TEXT_COLOR,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
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
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  rowRank: {
    width: 32,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  rowRankHighlight: {
    color: PRIMARY_COLOR,
  },
  rowAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rowAvatarInitials: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  rowName: {
    fontSize: 14,
    color: TEXT_COLOR,
    fontWeight: "500",
  },
  rowScoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBBF24",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rowScoreText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
