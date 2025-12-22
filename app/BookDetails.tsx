import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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

type BookDetails = {
  id: string;
  title: string;
  authors: string;
  description: string;
  thumbnail?: string | null;
  categories: string;
  pageCount?: number;
  publishedDate?: string;
  isbn13?: string | null; // ✅ ADD THIS HERE
};

export default function BookDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [book, setBook] = useState<BookDetails | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        if (!id) throw new Error("Missing book id");

        const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
          id
        )}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Request failed");

        const data = await res.json();
        const info = data?.volumeInfo ?? {};

        const thumb =
          info?.imageLinks?.thumbnail ??
          info?.imageLinks?.smallThumbnail ??
          null;

        const safeThumb =
          typeof thumb === "string" ? thumb.replace("http://", "https://") : null;

        // ✅ Extract ISBN-13
        const identifiers = Array.isArray(info?.industryIdentifiers)
          ? info.industryIdentifiers
          : [];

        const isbn13Obj = identifiers.find((x: any) => x.type === "ISBN_13");
        const isbn13 = isbn13Obj?.identifier ?? null;

        setBook({
          id: String(data?.id ?? id),
          title: info?.title ?? "Untitled",
          authors: Array.isArray(info?.authors)
            ? info.authors.join(", ")
            : "Unknown author",
          description: info?.description ?? "No description available.",
          thumbnail: safeThumb,
          categories: Array.isArray(info?.categories)
            ? info.categories.join(", ")
            : "N/A",
          pageCount: info?.pageCount,
          publishedDate: info?.publishedDate,
          isbn13, // ✅ put it like this
        });
      } catch (e) {
        setErrorMsg("Could not load book details. Please try again.");
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Back */}
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

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
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
                <Image
                  source={{ uri: book.thumbnail }}
                  style={styles.cover}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <FontAwesome name="book" size={22} color="#9CA3AF" />
                  <Text style={styles.noCoverText}>No cover</Text>
                </View>
              )}
            </View>

            {/* Title + Author */}
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>by {book.authors}</Text>

              {/* ✅ ISBN-13 */}
            <Text style={styles.author}>
              GoogleBookID: {book.id }
            </Text>


            {/* ✅ ISBN-13 */}
            <Text style={styles.author}>
              ISBN-13: {book.isbn13 ?? "Not available"}
            </Text>

            {/* Small info row */}
            <View style={styles.infoRow}>
              <InfoChip icon="tag" text={book.categories} />
              {book.pageCount ? (
                <InfoChip icon="file-text-o" text={`${book.pageCount} pages`} />
              ) : null}
              {book.publishedDate ? (
                <InfoChip icon="calendar" text={book.publishedDate} />
              ) : null}
            </View>

            {/* Description */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Description</Text>
              <Text style={styles.desc}>{stripHtml(book.description)}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => console.log("Add to library:", book.id)}
            >
              <Text style={styles.primaryButtonText}>Add to My Library</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoChip({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.chip}>
      <FontAwesome name={icon} size={12} color={PRIMARY_COLOR} />
      <Text style={styles.chipText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function stripHtml(html: string) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  contentContainer: { padding: 20, paddingBottom: 40 },

  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { marginLeft: 6, fontSize: 16, fontWeight: "500", color: TEXT_COLOR },

  center: { marginTop: 40, alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 13, color: "#6B7280" },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoText: { fontSize: 13, color: "#6B7280" },

  coverWrap: {
    alignSelf: "center",
    width: 160,
    height: 230,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginTop: 6,
  },
  cover: { width: "100%", height: "100%" },
  coverPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center", gap: 6 },
  noCoverText: { fontSize: 12, color: "#9CA3AF" },

  title: { fontSize: 22, fontWeight: "800", color: TEXT_COLOR, marginTop: 14, textAlign: "center" },
  author: { fontSize: 13, color: "#6B7280", marginTop: 4, textAlign: "center" },

  infoRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E5F3F8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: "90%",
  },
  chipText: { fontSize: 12, color: "#374151", fontWeight: "600" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: TEXT_COLOR, marginBottom: 8 },
  desc: { fontSize: 13, color: "#374151", lineHeight: 19 },

  primaryButton: {
    marginTop: 14,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
