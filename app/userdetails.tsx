import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#0a7ea4";
const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";



const User = {
  userId: "2",
  name: "Hasan Taleb",
  email: "Hasan@gmail.com",
  type: "User",
};

const demoBooks = [
  {
    id: "zyTCAlFPjgYC",
    title: "Atomic Habits",
    authors: "James Clear",
    thumbnail: "https://covers.openlibrary.org/b/id/11153250-L.jpg",
  },
  {
    id: "OEBPS",
    title: "The Alchemist",
    authors: "Paulo Coelho",
    thumbnail: "https://covers.openlibrary.org/b/id/10958334-L.jpg",
  },
  {
    id: "deepwork",
    title: "Deep Work",
    authors: "Cal Newport",
    thumbnail: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
  },
];

export default function UserDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // user id (unused for demo)

  const openBook = (bookId: string) => {
    router.push({
      pathname: "/BookDetails",
      params: { id: bookId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Back */}
        <Pressable
          onPress={() => router.push("/(tabs)/Search")}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}  
        >
          <FontAwesome name="chevron-left" size={20} color={TEXT_COLOR} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* USER PROFILE */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <FontAwesome name="user-circle" size={60} color={PRIMARY_COLOR} />
            <View style={{ marginLeft: 14 }}>
              <Text style={styles.name}>{User.name}</Text>
              <Text style={styles.email}>{User.email}</Text>
              <Text style={styles.role}>{User.type.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* BOOK LIST */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Books</Text>

          {demoBooks.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => openBook(b.id)}
              style={({ pressed }) => [
                styles.bookRow,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              {b.thumbnail ? (
                <Image source={{ uri: b.thumbnail }} style={styles.bookCover} />
              ) : (
                <View style={styles.bookCoverPlaceholder}>
                  <FontAwesome name="book" size={16} color="#9CA3AF" />
                </View>
              )}

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {b.title}
                </Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>
                  {b.authors}
                </Text>
              </View>

              <FontAwesome
                name="chevron-right"
                size={16}
                color="#9CA3AF"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  contentContainer: { padding: 20, paddingBottom: 40 },

  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { marginLeft: 6, fontSize: 16, fontWeight: "500", color: TEXT_COLOR },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },

  name: { fontSize: 18, fontWeight: "800", color: TEXT_COLOR },
  email: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  role: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: "700",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT_COLOR,
    marginBottom: 10,
  },

  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  bookCover: {
    width: 44,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  bookCoverPlaceholder: {
    width: 44,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  bookTitle: { fontSize: 14, fontWeight: "700", color: TEXT_COLOR },
  bookAuthor: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});
