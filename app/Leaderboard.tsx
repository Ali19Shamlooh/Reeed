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
  const top3 = USERS.slice(0, 3);
  const others = USERS.slice(3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 🔙 Back Button - same style as reviews */}
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

      {/* Header - similar to reviews */}
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>
          See who has read the most pages in Reeed.
        </Text>
      </View>

      {/* Card: Top 3 section */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Top 3 readers</Text>
          <FontAwesome name="trophy" size={20} color={PRIMARY_COLOR} />
        </View>

        <View style={styles.top3Row}>
          {top3.map((user, index) => {
            const rank = index + 1;
            return (
              <View key={user.id} style={styles.topUserContainer}>
                <View style={styles.topAvatarCircle}>
                  <Text style={styles.topAvatarText}>
                    {user.name.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.topUserName} numberOfLines={1}>
                  {user.name}
                </Text>
                <Text style={styles.topUserPages}>{user.pages} pages</Text>
                <View style={[styles.rankBadge, rank === 1 && styles.rankBadgeFirst]}>
                  <Text style={[styles.rankBadgeText, rank === 1 && styles.rankBadgeTextFirst]}>
                    #{rank}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Card: Full leaderboard list */}
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

  // Back button (same pattern as reviews)
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

  // Top 3 section
  top3Row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  topUserContainer: {
    flex: 1,
    alignItems: "center",
  },
  topAvatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#E5F3F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  topAvatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: PRIMARY_COLOR,
  },
  topUserName: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_COLOR,
    textAlign: "center",
  },
  topUserPages: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  rankBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  rankBadgeFirst: {
    backgroundColor: PRIMARY_COLOR,
  },
  rankBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  rankBadgeTextFirst: {
    color: "#FFFFFF",
  },

  // List section
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
