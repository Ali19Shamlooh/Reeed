// app/BookDetails.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Constants from "expo-constants"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { auth } from "../firebaseConfig"

// ✅ Use ONE base URL for all your PHP calls (PC IP for iPhone)
// Make sure this matches your folder name exactly (reeed vs REEED)
const BASE_URL =
  Platform.OS == "web" ? "http://localhost/reeed" : "http://10.60.11.1/reeed"

const extra = Constants.expoConfig?.extra ?? {}
const GOOGLE_BOOKS_API_BASE_URL = extra.GOOGLE_BOOKS_API_BASE_URL
const GOOGLE_BOOKS_API_KEY = extra.GOOGLE_BOOKS_API_KEY

const COLORS = {
  primary: "#0a7ea4",
  background: "#F9FAFB",
  text: "#1F2937",
  secondaryText: "#6B7280",
  chipBg: "#E5F3F8",
  cardBg: "#FFFFFF",
  placeholder: "#9CA3AF",
}

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
type Category = {
  id: number
  name: string
}
export default function BookDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [book, setBook] = useState<BookDetails | null>(null)

  const [categories, setCategories] = useState<Category[]>([])
  let bookId
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
          pageCount: info.pageCount ?? "N/A",
          publishedDate: info.publishedDate ?? "N/A",
          isbn13,
          previewLink: info.previewLink ?? null,
          webReaderLink: data.accessInfo?.webReaderLink ?? null,
        })
      } catch (e) {
        setErrorMsg("Could not load book details.")
        setBook(null)
      } finally {
        setLoading(false)
      }
    }

    loadBook()
    fetchCategories()
  }, [id])

  const getMysqlDateTime = () => {
    return new Date().toISOString().slice(0, 19).replace("T", " ")
  }

  const stime = getMysqlDateTime()

  const openReader = () => {
    if (!book) return

    const url = book.webReaderLink ?? book.previewLink
    if (!url) {
      Alert.alert("Not available", "No preview or web reader link.")
      return
    }

    router.push({
      pathname: "/BookWebReader",
      params: { url, title: book.title, bookId: book.id, start_time: stime },
    })
  }

  // ✅ safer JSON helper
  const safeJson = (text: string) => {
    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }

  const addToLibrary = async () => {
    if (!book) return

    try {
      // ✅ must be logged in
      const user = auth.currentUser
      if (!user?.uid) {
        Alert.alert("Error", "You are not logged in.")
        router.push("/login") // change route if yours is different
        return
      }

      // ✅ get DB uId using firebase uid
      const getUserIdUrl = `${BASE_URL}/getUserId.php?fireId=${encodeURIComponent(
        user.uid
      )}`
      console.log("getUserIdUrl:", getUserIdUrl)

      const userIdRes = await fetch(getUserIdUrl)
      const userIdText = await userIdRes.text()
      console.log("getUserId status:", userIdRes.status)
      console.log("getUserId raw:", userIdText)

      const dbId = safeJson(userIdText)
      const dbUserId = dbId?.uId

      if (!userIdRes.ok || !dbUserId) {
        throw new Error(dbId?.error || "User id not found in database.")
      }

      // ✅ build request safely
      const thumbnail = book.thumbnail ?? "" // avoid null in encodeURIComponent
      const pageCount = book.pageCount ?? 0

      const insertUrl =
        `${BASE_URL}/insertGoogleBook.php?` +
        `title=${encodeURIComponent(book.title)}` +
        `&author=${encodeURIComponent(book.authors)}` +
        `&category=${encodeURIComponent(book.categories)}` +
        `&pageCount=${encodeURIComponent(String(pageCount))}` +
        `&googleId=${encodeURIComponent(book.id)}` +
        `&userId=${encodeURIComponent(String(dbUserId))}` +
        `&thumbnail=${encodeURIComponent(thumbnail)}`

      console.log("insertUrl:", insertUrl)

      const res = await fetch(insertUrl)
      const text = await res.text()
      console.log("insert status:", res.status)
      console.log("insert raw:", text)

      const data = safeJson(text)

      if (!res.ok) {
        throw new Error(data?.error || "Request failed (insertGoogleBook.php).")
      }

      if (data?.error) {
        throw new Error(data.error)
      }

      Alert.alert("Added", `Book "${book.title}" added to your library.`)
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message ?? "Could not add the book to your library."
      )
    }
  }
  const fetchCategories = async () => {
    const user = auth.currentUser
    if (!user?.uid) return

    const userIdRes = await fetch(
      `${BASE_URL}/getUserId.php?fireId=${encodeURIComponent(user.uid)}`
    )
    const dbId = await userIdRes.json()
    const dbUserId = dbId?.uId
    if (!dbUserId) return

    const res = await fetch(
      `${BASE_URL}/getUserCategories.php?userId=${dbUserId}`
    )
    const data = await res.json()

    // Extract categories array
    if (data?.success && Array.isArray(data.categories)) {
      setCategories(data.categories)
    }
  }

  const assignToCategory = async () => {
    if (!book) return

    // Ensure book is in library first
    const assignedBookId = book.bookId ?? (await addToLibrary())
    if (!assignedBookId) return

    await fetchCategories()

    if (categories.length === 0) {
      Alert.alert("No Categories", "Please create a category first.")
      return
    }

    Alert.alert(
      "Assign to Category",
      "Choose a category",
      categories.map((c) => ({
        text: c.name,
        onPress: async () => {
          try {
            const user = auth.currentUser
            if (!user?.uid) return

            const userIdRes = await fetch(
              `${BASE_URL}/getUserId.php?fireId=${encodeURIComponent(user.uid)}`
            )
            const dbId = await userIdRes.json()
            const dbUserId = dbId?.uId

            const url =
              `${BASE_URL}/assignBookToCategory.php?` +
              `userId=${dbUserId}` +
              `&bookId=${assignedBookId}` +
              `&categoryId=${c.id}`

            const res = await fetch(url)
            const data = await res.json()

            if (!res.ok || data?.error) throw new Error(data?.error || "Failed")

            Alert.alert("Success", `Assigned to "${c.name}"`)
          } catch (e: any) {
            Alert.alert("Error", e.message)
          }
        },
      }))
    )
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

            {/* Info row */}
            <View style={styles.infoRow}>
              <InfoChip icon="tag" text={book.categories} />
              {book.pageCount != null && (
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

            {/* Reviews */}
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
            <Pressable
              style={styles.secondaryButton}
              onPress={assignToCategory}
            >
              <Text style={styles.secondaryButtonText}>Assign to Category</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function InfoChip({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.chip}>
      <FontAwesome name={icon} size={12} color={COLORS.primary} />
      <Text style={styles.chipText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  )
}

function stripHtml(html: string) {
  return String(html ?? "").replace(/<\/?[^>]+(>|$)/g, "")
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

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
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
