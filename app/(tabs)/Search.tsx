import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Keyboard,
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

type SearchMode = "title" | "author";

type BookResult = {
  id: string;
  title: string;
  thumbnail?: string | null;
};

export default function SearchTabScreen() {
  const [mode, setMode] = useState<SearchMode>("title");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<BookResult[]>([]);

  const placeholder = useMemo(() => {
    return mode === "title"
      ? "Search by book title..."
      : "Search by author name...";
  }, [mode]);

  const buildGoogleBooksQuery = (m: SearchMode, q: string) => {
    const clean = q.trim();
    // Google Books query format:
    // title -> intitle:xxx
    // author -> inauthor:xxx
    const operator = m === "title" ? "intitle:" : "inauthor:";
    return `${operator}${clean}`;
  };

  const onSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setLoading(true);
    setErrorMsg(null);

    try {
      const q = buildGoogleBooksQuery(mode, trimmed);
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        q
      )}&maxResults=20`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      const items = Array.isArray(data?.items) ? data.items : [];
      const mapped: BookResult[] = items.map((it: any) => {
        const id = String(it.id ?? Math.random());
        const title = it?.volumeInfo?.title ?? "Untitled";
        const thumb =
          it?.volumeInfo?.imageLinks?.thumbnail ??
          it?.volumeInfo?.imageLinks?.smallThumbnail ??
          null;

        // Google thumbnails sometimes come as http, better convert to https:
        const safeThumb = typeof thumb === "string" ? thumb.replace("http://", "https://") : null;

        return { id, title, thumbnail: safeThumb };
      });

      setResults(mapped);
      if (mapped.length === 0) setErrorMsg("No results found. Try another search.");
    } catch (e) {
      setErrorMsg("Could not load results. Check your internet and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
          <Text style={styles.subtitle}>Find books by title or author.</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={18} color="#6B7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
          <Pressable
            onPress={() => setQuery("")}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            hitSlop={10}
          >
            {query.length > 0 ? (
              <FontAwesome name="times-circle" size={18} color="#9CA3AF" />
            ) : (
              <View style={{ width: 18 }} />
            )}
          </Pressable>
        </View>

        {/* Mode toggle */}
        <View style={styles.toggleRow}>
          <ToggleButton
            label="Title"
            active={mode === "title"}
            onPress={() => setMode("title")}
          />
          <ToggleButton
            label="Author"
            active={mode === "author"}
            onPress={() => setMode("author")}
          />
        </View>

        {/* Search button */}
        <Pressable
          onPress={onSearch}
          disabled={loading}
          style={({ pressed }) => [
            styles.searchButton,
            { opacity: pressed || loading ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.searchButtonText}>
            {loading ? "Searching..." : "Search"}
          </Text>
        </Pressable>

        {/* Results area (same page) */}
        <View style={{ marginTop: 14 }}>
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
              <Text style={styles.loadingText}>Loading results...</Text>
            </View>
          )}

          {errorMsg && !loading && (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{errorMsg}</Text>
            </View>
          )}

          {!loading && results.length > 0 && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>Results</Text>

              <View style={styles.grid}>
                {results.map((b) => (
                  <View key={b.id} style={styles.bookItem}>
                    <View style={styles.coverShadow}>
                      {b.thumbnail ? (
                        <Image
                          source={{ uri: b.thumbnail }}
                          style={styles.cover}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.coverPlaceholder}>
                          <FontAwesome name="book" size={18} color="#9CA3AF" />
                          <Text style={styles.noCoverText}>No cover</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.bookTitle} numberOfLines={2}>
                      {b.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.toggleButton,
        active && styles.toggleButtonActive,
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 14,
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

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    color: TEXT_COLOR,
  },

  toggleRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  toggleButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },

  searchButton: {
    marginTop: 14,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#6B7280",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
  },

  resultsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_COLOR,
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bookItem: {
    width: "31%", // 3 per row
    marginBottom: 14,
  },

  coverShadow: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cover: {
    width: "100%",
    height: 120,
  },
  coverPlaceholder: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  noCoverText: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  bookTitle: {
    marginTop: 6,
    fontSize: 12,
    color: TEXT_COLOR,
    fontWeight: "600",
  },
});
