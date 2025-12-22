// app/(tabs)/search.tsx  (or whatever your file name is)
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
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

// ✅ change this
const API_BASE_URL = "https://YOUR-DOMAIN.com/api";

type Mode = "title" | "author" | "users";

type BookResult = {
  id: string;
  title: string;
  authors: string;
  thumbnail?: string | null;
};

type UserResult = {
  id: string; // userId from MySQL
  name: string;
  email: string;
  type: string; // admin/normal
};

export default function SearchTabScreen() {
  const [mode, setMode] = useState<Mode>("title");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [bookResults, setBookResults] = useState<BookResult[]>([]);
  const [userResults, setUserResults] = useState<UserResult[]>([]);

  const placeholder =
    mode === "title"
      ? "Search by title..."
      : mode === "author"
      ? "Search by author..."
      : "Search users by name...";

  const searchBooks = async (m: "title" | "author", q: string) => {
    const operator = m === "title" ? "intitle:" : "inauthor:";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      operator + q
    )}&maxResults=12`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Google Books failed");

    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    return items.map((it: any) => {
      const id = String(it.id);
      const title = it?.volumeInfo?.title ?? "Untitled";
      const authorsArr: string[] = it?.volumeInfo?.authors ?? [];
      const authors = authorsArr.length ? authorsArr.join(", ") : "Unknown author";

      const thumb =
        it?.volumeInfo?.imageLinks?.thumbnail ??
        it?.volumeInfo?.imageLinks?.smallThumbnail ??
        null;

      const safeThumb = typeof thumb === "string" ? thumb.replace("http://", "https://") : null;

      return { id, title, authors, thumbnail: safeThumb };
    });
  };

  const searchUsers = async (q: string) => {
    const url = `${API_BASE_URL}/search_users.php?q=${encodeURIComponent(q)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Users API failed");

    const data = await res.json();
    const items = Array.isArray(data) ? data : [];

    return items.map((u: any) => ({
      id: String(u.userId),
      name: u.name ?? "Unknown",
      email: u.email ?? "",
      type: u.type ?? "normal",
    }));
  };

  const onSearch = async () => {
    const q = query.trim();
    if (!q) return;

    Keyboard.dismiss();
    setLoading(true);
    setErrorMsg(null);

    // clear old results
    setBookResults([]);
    setUserResults([]);

    try {
      if (mode === "users") {
        const users = await searchUsers(q);
        setUserResults(users);
        if (!users.length) setErrorMsg("No users found.");
      } else {
        const books = await searchBooks(mode, q);
        setBookResults(books);
        if (!books.length) setErrorMsg("No books found.");
      }
    } catch (e) {
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const openBook = (b: BookResult) => {
    router.push({ pathname: "/BookDetails", params: { id: b.id } });
  };

  const openUser = (u: UserResult) => {
    router.push({ pathname: "/userdetails", params: { id: u.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Search books or users.</Text>

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
        </View>

        {/* Mode buttons */}
        <View style={styles.toggleRow}>
          <ModeBtn label="Title" active={mode === "title"} onPress={() => setMode("title")} />
          <ModeBtn label="Author" active={mode === "author"} onPress={() => setMode("author")} />
          <ModeBtn label="Users" active={mode === "users"} onPress={() => setMode("users")} />
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
          <Text style={styles.searchButtonText}>{loading ? "Searching..." : "Search"}</Text>
        </Pressable>

        {/* Loading / error */}
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {errorMsg && !loading && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{errorMsg}</Text>
          </View>
        )}

        {/* BOOK RESULTS */}
        {!loading && bookResults.length > 0 && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Books</Text>
            <View style={styles.grid}>
              {bookResults.map((b) => (
                <Pressable key={b.id} onPress={() => openBook(b)} style={styles.bookItem}>
                  {b.thumbnail ? (
                    <Image source={{ uri: b.thumbnail }} style={styles.cover} />
                  ) : (
                    <View style={styles.coverPlaceholder}>
                      <FontAwesome name="book" size={18} color="#9CA3AF" />
                      <Text style={styles.noCoverText}>No cover</Text>
                    </View>
                  )}
                  <Text style={styles.bookTitle} numberOfLines={2}>{b.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* USER RESULTS */}
        {!loading && userResults.length > 0 && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Users</Text>
            {userResults.map((u) => (
              <Pressable key={u.id} onPress={() => openUser(u)} style={styles.userRow}>
                <FontAwesome name="user" size={16} color={PRIMARY_COLOR} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <Text style={styles.userMeta}>{u.type} • {u.email}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ModeBtn({
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
      style={[styles.modeBtn, active && styles.modeBtnActive]}
    >
      <Text style={[styles.modeText, active && styles.modeTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  contentContainer: { padding: 20, paddingBottom: 40 },

  title: { fontSize: 24, fontWeight: "700", color: TEXT_COLOR },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2, marginBottom: 12 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: TEXT_COLOR },

  toggleRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  modeBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modeBtnActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  modeText: { fontSize: 13, fontWeight: "700", color: "#374151" },
  modeTextActive: { color: "#fff" },

  searchButton: {
    marginTop: 12,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  searchButtonText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  loadingText: { fontSize: 13, color: "#6B7280" },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 14,
  },
  infoText: { fontSize: 13, color: "#6B7280" },

  resultsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultsTitle: { fontSize: 16, fontWeight: "800", color: TEXT_COLOR, marginBottom: 10 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  bookItem: { width: "31%", marginBottom: 14 },
  cover: { width: "100%", height: 120, borderRadius: 12, backgroundColor: "#F3F4F6" },
  coverPlaceholder: {
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  noCoverText: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
  bookTitle: { marginTop: 6, fontSize: 12, color: TEXT_COLOR, fontWeight: "700" },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  userName: { fontSize: 14, fontWeight: "700", color: TEXT_COLOR },
  userMeta: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});
