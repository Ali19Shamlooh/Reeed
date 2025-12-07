// app/(tabs)/reviews.tsx
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
  rating: number; // 1–5
  reviewText: string;
  timestamp: string; // e.g. "2025-02-01"
};

// TODO: replace with real data from your DB later
const dummyReviews: ReviewItem[] = [
  {
    id: 1,
    bookTitle: "The Alchemist",
    bookAuthor: "Paulo Coelho",
    rating: 5,
    reviewText: "Beautiful story with deep meaning and inspiration.",
    timestamp: "2025-02-01",
  },
  {
    id: 2,
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    rating: 4,
    reviewText:
      "Very practical and easy to follow. Helped me build better habits.",
    timestamp: "2025-01-20",
  },
  {
    id: 3,
    bookTitle: "Deep Work",
    bookAuthor: "Cal Newport",
    rating: 4,
    reviewText: "Strong ideas about focus, a bit dense in some parts.",
    timestamp: "2024-12-15",
  },
];

export default function ReviewsTabScreen() {
  const reviews = dummyReviews;
  const router = useRouter(); // 👈 to navigate to myreview

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        <Text style={styles.subtitle}>
          All reviews available in Reeed.
        </Text>
      </View>

      {/* 🔘 Button: go to "My Reviews" page (only this user's reviews) */}
      <Pressable
        style={styles.myReviewsButton}
        onPress={() => router.push("/myReviews")} // 👈 adjust route if file name different
      >
        <Text style={styles.myReviewsButtonText}>View My Reviews Only</Text>
      </Pressable>

      {/* Empty state */}
      {reviews.length === 0 && (
        <View style={styles.emptyCard}>
          <FontAwesome
            name="star-o"
            size={28}
            color={PRIMARY_COLOR}
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.emptyTitle}>No reviews yet</Text>
          <Text style={styles.emptyText}>
            Start reading a book and leave your first review to see it here.
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
          <Text style={styles.dateText}>Reviewed on {review.timestamp}</Text>
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

  // 🔘 My Reviews button styles
  myReviewsButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  myReviewsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
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
