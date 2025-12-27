// app/reportedReviews.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PRIMARY_COLOR = "#0a7ea4";
const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";

type ReviewItem = {
  id: number | string;
  bookTitle: string;
  bookAuthor: string;
  rating: number;
  reviewText: string;
  timestamp: string;
  reportedByMe: boolean;
};

// 🔹 Dummy data — ONLY reported reviews
const reportedDummyReviews: ReviewItem[] = [
  {
    id: 1,
    bookTitle: "The Alchemist",
    bookAuthor: "Paulo Coelho",
    rating: 5,
    reviewText: "This review contains inappropriate content.",
    timestamp: "2025-02-01",
    reportedByMe: true,
  },
  {
    id: 2,
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    rating: 4,
    reviewText: "Spam-like review with unrelated links.",
    timestamp: "2025-01-22",
    reportedByMe: true,
  },
];

export default function ReportedReviewsScreen() {
  const router = useRouter();

  // ✅ filter just in case (future-safe)
  const reviews = reportedDummyReviews.filter((r) => r.reportedByMe);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 🔙 Back Button */}
      <Pressable
        onPress={() => router.push("/Reviews")}
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
        <Text style={styles.title}>Reported Reviews</Text>
        <Text style={styles.subtitle}>
          Reviews you have reported for moderation.
        </Text>
      </View>

      {/* Empty state */}
      {reviews.length === 0 && (
        <View style={styles.emptyCard}>
          <FontAwesome
            name="flag-o"
            size={28}
            color={PRIMARY_COLOR}
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.emptyTitle}>No reported reviews</Text>
          <Text style={styles.emptyText}>
            You haven’t reported any reviews yet.
          </Text>
        </View>
      )}

      {/* Reviews list */}
      {reviews.map((review) => (
        <View key={review.id} style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookTitle}>{review.bookTitle}</Text>
              <Text style={styles.bookAuthor}>by {review.bookAuthor}</Text>
            </View>

            <View style={styles.ratingRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesome
                  key={i}
                  name={i < review.rating ? "star" : "star-o"}
                  size={16}
                  color={PRIMARY_COLOR}
                />
              ))}
            </View>
          </View>

          <Text style={styles.reviewText}>{review.reviewText}</Text>
          <Text style={styles.dateText}>
            Reported on {review.timestamp}
          </Text>

          {/* Status badge */}
          <View style={styles.reportedBadge}>
            <FontAwesome name="flag" size={12} color="#ef4444" />
            <Text style={styles.reportedText}>Reported</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

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
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_COLOR,
  },
  bookAuthor: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
  },
  reviewText: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  reportedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  reportedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ef4444",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
});
