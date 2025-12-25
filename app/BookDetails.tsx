// app/BookDetails.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Constants from "expo-constants"
const extra = Constants.expoConfig?.extra ?? {}
const GOOGLE_BOOKS_API_BASE_URL = extra.GOOGLE_BOOKS_API_BASE_URL
const GOOGLE_BOOKS_API_KEY = extra.GOOGLE_BOOKS_API_KEY
const API_BASE_URL = extra.API_BASE_URL

const COLORS = {
  primary: "#0a7ea4",
  background: "#F9FAFB",
  text: "#1F2937",
  secondaryText: "#6B7280",
  chipBg: "#E5F3F8",
  cardBg: "#FFFFFF",
  placeholder: "#9CA3AF",
}

const userId = 1

type BookDetails = {
  id: string
  title: string
  authors: string
  description: string
  thumbnail?: string | null
  categories: string
  pageCount?: number
  publishedDate?: string
  isbn13?: string | null
  previewLink?: string | null
  webReaderLink?: string | null
}

export default function BookDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [book, setBook] = useState<BookDetails | null>(null);

  useEffect(() => {
    if (!id) return

    const loadBook = async () => {
      setLoading(true)
      setErrorMsg(null)
      try {
        const res = await fetch(
          `${GOOGLE_BOOKS_API_BASE_URL}${encodeURIComponent(
            id
          )}?key=${GOOGLE_BOOKS_API_KEY}`
        )
        if (!res.ok) throw new Error("Failed to fetch book")
        const data = await res.json()
        const info = data.volumeInfo ?? {}

        const thumb =
          info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null

        const isbn13 =
          info.industryIdentifiers?.find((x: any) => x.type === "ISBN_13")
            ?.identifier ?? null

        setBook({
          id: data.id ?? id,
          title: info.title ?? "Untitled",
          authors: info.authors?.join(", ") ?? "Unknown author",
          description: info.description ?? "No description available.",
          thumbnail: thumb?.replace("http://", "https://") ?? null,
          categories: info.categories?.join(", ") ?? "N/A",
          pageCount: info.pageCount,
          publishedDate: info.publishedDate,
          isbn13,
          previewLink: info.previewLink ?? null,
          webReaderLink: data.accessInfo?.webReaderLink ?? null,
        })
      } catch (e) {
        setErrorMsg("Could not load book details.")
        setBook(null)
      } finally {
        setLoading(false);
      }
    };

    loadBook()
  }, [id])

  const openReader = () => {
    if (!book) return
    const url = book.webReaderLink ?? book.previewLink
    if (!url) {
      Alert.alert("Not available", "No preview or web reader link.")
      return
    }
    router.push({
      pathname: "/BookWebReader",
      params: { url, title: book.title },
    });
  };

  const coverPage = book?.thumbnail
  console.log("coverPage : ", coverPage)

  const addToLibrary = async () => {
    if (!book) return
    try {
      const res = await fetch(
        `http://localhost/reeed/insertGoogleBook.php?title=${encodeURIComponent(
          book.title
        )}&author=${encodeURIComponent(
          book.authors
        )}&category=${encodeURIComponent(book.categories)}&pageCount=${
          book.pageCount
        }&googleId=${encodeURIComponent(book.id)}&userId=${encodeURIComponent(
          userId
        )}&thumbnail=${encodeURIComponent(book.thumbnail)}`
      )
      console.log(book.thumbnail)
      const insRes = await res.json()

      if (!res.ok) {
        throw new Error("Request failed")
      } else {
        Alert.alert("Added", `Book "${book.title}" added to your library.`)
      }
    } catch (error) {
      Alert.alert("Error", "Could not add the book to your library.")
    } finally {
    }

    //check if the book exists in our database
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={20} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading details...</Text>
          </View>
        )}

        {errorMsg && !loading && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{errorMsg}</Text>
          </View>
        )}

        {!loading && book && (
          <>
            {/* Cover */}
            <View style={styles.coverWrap}>
              {book.thumbnail ? (
                <Image source={{ uri: book.thumbnail }} style={styles.cover} />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <FontAwesome
                    name="book"
                    size={22}
                    color={COLORS.placeholder}
                  />
                  <Text style={styles.noCoverText}>No cover</Text>
                </View>
              )}
            </View>

            {/* Title & Author */}
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>by {book.authors}</Text>
            <Text style={styles.author}>GoogleBookID: {book.id}</Text>
            <Text style={styles.author}>ISBN-13: {book.isbn13 ?? "N/A"}</Text>
            <Text style={styles.author}>
              Thumbnail: {book.thumbnail ?? "N/A"}
            </Text>

            {/* Info row */}
            <View style={styles.infoRow}>
              <InfoChip icon="tag" text={book.categories} />
              {book.pageCount && (
                <InfoChip icon="file-text-o" text={`${book.pageCount} pages`} />
              )}
              {book.publishedDate && (
                <InfoChip icon="calendar" text={book.publishedDate} />
              )}
            </View>

            {/* Description */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Description</Text>
              <Text style={styles.desc}>{stripHtml(book.description)}</Text>
            </View>

            {/* Actions */}
            <Pressable style={styles.primaryButton} onPress={openReader}>
              <Text style={styles.primaryButtonText}>Read Now</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={addToLibrary}>
              <Text style={styles.secondaryButtonText}>Add to My Library</Text>
            </Pressable>

            {/* ✅ See Reviews */}
            {/* See Reviews */}
<Pressable
  style={({ pressed }) => [
    styles.secondaryButton,
    { opacity: pressed ? 0.85 : 1 },
  ]}
  onPress={() =>
    router.push({
      pathname: "/Reviews",
      params: { bookId: book.id, title: book.title },
    })
  }
>
  <Text style={styles.secondaryButtonText}>See Reviews</Text>
</Pressable>

          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoChip({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.chip}>
      <FontAwesome name={icon} size={12} color={COLORS.primary} />
      <Text style={styles.chipText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function stripHtml(html: string) {
  return String(html ?? "").replace(/<\/?[^>]+(>|$)/g, "");
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, paddingBottom: 40 },

  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },

  center: { marginTop: 40, alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 13, color: COLORS.secondaryText },

  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoText: { fontSize: 13, color: COLORS.secondaryText },

  coverWrap: {
    alignSelf: "center",
    width: 160,
    height: 230,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    marginTop: 6,
  },
  cover: { width: "100%", height: "100%" },
  coverPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  noCoverText: { fontSize: 12, color: COLORS.placeholder },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 14,
    textAlign: "center",
  },
  author: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 4,
    textAlign: "center",
  },

  infoRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.chipBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: "90%",
  },
  chipText: { fontSize: 12, color: "#374151", fontWeight: "600" },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  desc: { fontSize: 13, color: "#374151", lineHeight: 19 },

  primaryButton: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },

  secondaryButton: {
    marginTop: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
})
