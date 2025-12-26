// app/writeReview.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#0a7ea4";
const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";

export default function WriteReviewScreen() {
  const router = useRouter();
  const { bookId, title } = useLocalSearchParams<{
    bookId?: string;
    title?: string;
  }>();

  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");

  const submitReview = () => {
    if (rating === 0 || reviewText.trim() === "") {
      Alert.alert("Missing info", "Please add a rating and a review.");
      return;
    }

    // ✅ DEMO ACTION (later connect to PHP / MySQL)
    Alert.alert(
      "Review submitted",
      "Your review has been submitted successfully.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );

    console.log({
      bookId,
      rating,
      reviewText,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color={TEXT_COLOR} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Header */}
        <Text style={styles.title}>Write a Review</Text>
        {title && <Text style={styles.subtitle}>for “{title}”</Text>}

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.label}>Your Rating</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Pressable key={i} onPress={() => setRating(i + 1)}>
                <FontAwesome
                  name={i < rating ? "star" : "star-o"}
                  size={26}
                  color={PRIMARY_COLOR}
                  style={{ marginRight: 6 }}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Review Text */}
        <View style={styles.section}>
          <Text style={styles.label}>Your Review</Text>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="Write your thoughts about this book..."
            multiline
            style={styles.textArea}
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <Pressable style={styles.submitButton} onPress={submitReview}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  container: { padding: 20 },

  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backText: { marginLeft: 6, fontSize: 16, color: TEXT_COLOR },

  title: { fontSize: 24, fontWeight: "700", color: TEXT_COLOR },
  subtitle: { fontSize: 13, color: "#6B7280", marginBottom: 20 },

  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },

  starsRow: { flexDirection: "row" },

  textArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    height: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
    color: TEXT_COLOR,
  },

  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
