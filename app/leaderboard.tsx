// components/LeaderboardCard.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const PRIMARY_COLOR = "#0a7ea4";
const TEXT_COLOR = "#1F2937";

export type LeaderboardCardProps = {
  rank: number;
  booksFinished: number;
  totalPages: number;
  lastUpdated: string; // string for now (e.g. "2025-02-04")
  onViewFull?: () => void;
};

export default function LeaderboardCard({
  rank,
  booksFinished,
  totalPages,
  lastUpdated,
  onViewFull,
}: LeaderboardCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your Leaderboard Rank</Text>
        <FontAwesome name="trophy" size={22} color={PRIMARY_COLOR} />
      </View>

      <View style={styles.row}>
        <View style={styles.rankCircle}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statText}>
            Books finished: <Text style={styles.highlight}>{booksFinished}</Text>
          </Text>
          <Text style={styles.statText}>
            Total pages read: <Text style={styles.highlight}>{totalPages}</Text>
          </Text>
          <Text style={styles.updatedText}>Updated: {lastUpdated}</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={onViewFull ?? (() => router.push("/leaderboard"))}
      >
        <Text style={styles.buttonText}>View full leaderboard</Text>
      </Pressable>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  stats: {
    flex: 1,
    marginLeft: 12,
  },
  statText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  highlight: {
    color: PRIMARY_COLOR,
    fontWeight: "700",
  },
  updatedText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
});
