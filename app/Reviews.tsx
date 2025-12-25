// app/(tabs)/reviews.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
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

  likes: number;
  likedByMe: boolean;
  reportedByMe: boolean;
};

const initialReviews: ReviewItem[] = [
  {
    id: 1,
    bookTitle: "The Alchemist",
    bookAuthor: "Paulo Coelho",
    rating: 5,
    reviewText: "Beautiful story with deep meaning and inspiration.",
    timestamp: "2025-02-01",
    likes: 12,
    likedByMe: false,
    reportedByMe: false,
  },
  {
    id: 2,
    bookTitle: "Atomic Habits",
    bookAuthor: "James Clear",
    rating: 4,
    reviewText: "Very practical and easy to follow. Helped me build better habits.",
    timestamp: "2025-01-20",
    likes: 7,
    likedByMe: true,
    reportedByMe: false,
  },
  {
    id: 3,
    bookTitle: "Deep Work",
    bookAuthor: "Cal Newport",
    rating: 4,
    reviewText: "Strong ideas about focus, a bit dense in some parts.",
    timestamp: "2024-12-15",
    likes: 3,
    likedByMe: false,
    reportedByMe: false,
  },
];

export default function ReviewsTabScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);

  const totalReviews = useMemo(() => reviews.length, [reviews]);

  const toggleLike = (reviewId: ReviewItem["id"]) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;

        const nextLiked = !r.likedByMe;
        const nextLikes = nextLiked ? r.likes + 1 : Math.max(0, r.likes - 1);

        return { ...r, likedByMe: nextLiked, likes: nextLikes };
      })
    );
  };

  const reportReview = (review: ReviewItem) => {
    if (review.reportedByMe) {
      Alert.alert("Already reported", "You already reported this review.");
      return;
    }

    Alert.alert(
      "Report review",
      "Are you sure you want to report this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Report",
          style: "destructive",
          onPress: () => submitReport(review.id),
        },
      ],
      { cancelable: true }
    );
  };

  const submitReport = (reviewId: ReviewItem["id"]) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reportedByMe: true } : r))
    );

    Alert.alert("Report sent", `Thanks. We will review it.`);
  };

  // ✅ NEW: Write review button action
  const goToWriteReview = () => {
    router.push({
      pathname: "/writeReview",
      params: {
        // optional params if you want later
        // bookTitle: "Atomic Habits"
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 🔙 Back Button */}
      <Pressable
        onPress={() => router.push("/(tabs)/Home")}
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
        <Text style={styles.title}>Reviews</Text>
        <Text style={styles.subtitle}>
          All reviews available in Reeed. ({totalReviews})
        </Text>
      </View>

      {/* My Reviews Button */}
      <Pressable
        style={styles.myReviewsButton}
        onPress={() => router.push("/MyReviews")}
      >
        <Text style={styles.myReviewsButtonText}>View My Reviews Only</Text>
      </Pressable>

      {/* ✅ NEW: Write Review Button */}
      <Pressable style={styles.writeReviewButton} onPress={goToWriteReview}>
        <Text style={styles.writeReviewButtonText}>Write a Review</Text>
      </Pressable>

      {/* Empty State */}
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

          {/* ✅ Actions row */}
          <View style={styles.actionsRow}>
            {/* Like */}
            <Pressable
              onPress={() => toggleLike(review.id)}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <FontAwesome
                name={review.likedByMe ? "heart" : "heart-o"}
                size={16}
                color={review.likedByMe ? "#EF4444" : PRIMARY_COLOR}
              />
              <Text style={styles.actionText}>
                {review.likedByMe ? "Liked" : "Like"} · {review.likes}
              </Text>
            </Pressable>

            {/* Report */}
            <Pressable
              onPress={() => reportReview(review)}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <FontAwesome
                name="flag"
                size={16}
                color={review.reportedByMe ? "#6B7280" : PRIMARY_COLOR}
              />
              <Text style={styles.actionText}>
                {review.reportedByMe ? "Reported" : "Report"}
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  contentContainer: { padding: 20, paddingBottom: 40 },

  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { marginLeft: 6, fontSize: 16, fontWeight: "500", color: TEXT_COLOR },

  header: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700", color: TEXT_COLOR },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  myReviewsButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  myReviewsButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },

  // ✅ NEW write review button styles
  writeReviewButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  writeReviewButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "700",
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
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },

  bookTitle: { fontSize: 16, fontWeight: "600", color: TEXT_COLOR },
  bookAuthor: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  ratingRow: { flexDirection: "row" },
  reviewText: { fontSize: 14, color: "#4B5563", marginTop: 4, marginBottom: 8 },
  dateText: { fontSize: 11, color: "#9CA3AF" },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  actionText: { fontSize: 12, fontWeight: "600", color: "#374151" },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: TEXT_COLOR },
  emptyText: { fontSize: 13, color: "#6B7280", textAlign: "center" },
});
