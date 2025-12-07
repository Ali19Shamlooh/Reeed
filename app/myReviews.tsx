// components/MyReviewsCard.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PRIMARY_COLOR = "#0a7ea4";
const TEXT_COLOR = "#1F2937";

export type MyReviewsCardProps = {
  bookTitle: string;
  bookAuthor: string;
  rating: number; // 1–5
  reviewText: string;
  onViewAll?: () => void;
};

export default function MyReviewsCard({
  bookTitle,
  bookAuthor,
  rating,
  reviewText,
  onViewAll,
}: MyReviewsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My latest review</Text>
        <FontAwesome name="star-half-full" size={22} color={PRIMARY_COLOR} />
      </View>

      <Text style={styles.bookTitle}>{bookTitle}</Text>
      <Text style={styles.bookAuthor}>by {bookAuthor}</Text>

      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesome
            key={i}
            name={i < rating ? "star" : "star-o"}
            size={18}
            color={PRIMARY_COLOR}
          />
        ))}
      </View>

      <Text style={styles.reviewText} numberOfLines={3}>
        “{reviewText}”
      </Text>

      
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
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginTop: 4,
  },
  bookAuthor: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 13,
    color: "#4B5563",
    fontStyle: "italic",
    marginTop: 4,
  },
  button: {
    marginTop: 10,
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
