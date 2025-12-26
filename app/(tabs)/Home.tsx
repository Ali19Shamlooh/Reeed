import { MaterialCommunityIcons } from "@expo/vector-icons"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { auth } from "../../firebaseConfig"
const BASE_URL =
  // Platform.OS == "web" ?
  "http://localhost/reeed"
// : 'http://192.168.100.8/reeed'

// Colors
const PRIMARY_COLOR = "#0a7ea4"
const BACKGROUND_COLOR = "#F9FAFB"
const TEXT_COLOR = "#1F2937"

// --- Types matching ERD ---
export type BookmarkItem = {
  id: number | string
  bookTitle: string
  currentPage: number
  totalPages: number
}
export type BookmarksCardProps = {
  bookmarks?: BookmarkItem[]
  onOpenBookmark?: (bookmark: BookmarkItem) => void
}

// ---- DUMMY BOOKMARKS ----
const dummyBookmarks: BookmarkItem[] = [
  {
    id: 1,
    bookTitle: "Atomic Habits",
    currentPage: 120,
    totalPages: 280,
  },
  {
    id: 2,
    bookTitle: "The Alchemist",
    currentPage: 45,
    totalPages: 200,
  },
  {
    id: 3,
    bookTitle: "Rich Dad Poor Dad",
    currentPage: 72,
    totalPages: 207,
  },
]

type Notification = {
  notifId: number
  userId: number
  message: string
  type: string
  isRead: boolean
  timestamp: string
}

// --- Screen ---

export default function DashboardScreen({
  bookmarks = dummyBookmarks,
  onOpenBookmark,
}: BookmarksCardProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ✅ now these are OBJECTS, not strings
  const [statics, setStatics] = useState<FinishedBooksResponse | null>(null)
  const [lastSessionData, setLastSessionData] =
    useState<LastSessionResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        const User = auth.currentUser
        const fireId = User?.uid
        const getUserId = `${BASE_URL}/getUserId.php?fireId=${fireId}`

        const userIdRes = await fetch(getUserId)
        const dbId = await userIdRes.json()
        const dbUserId = dbId.uId

        const finishedUrl = `${BASE_URL}/getFinishedBooks.php?userId=${dbUserId}`
        const sessionUrl = `${BASE_URL}/getLastReadinSession.php?userId=${dbUserId}`

        const [finishedRes, sessionRes] = await Promise.all([
          fetch(finishedUrl),
          fetch(sessionUrl),
        ])

        if (!finishedRes.ok) throw new Error("Failed to load finished books")
        if (!sessionRes.ok) throw new Error("Failed to load last session")

        const finishedBooksData: FinishedBooksResponse =
          await finishedRes.json()
        const sessionData: LastSessionResponse = await sessionRes.json()

        setStatics(finishedBooksData)
        setLastSessionData(sessionData)
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const notifications: Notification[] = [
    {
      notifId: 1,
      userId: 1,
      message: "You moved up to rank #3 on the leaderboard!",
      type: "leaderboard",
      isRead: false,
      timestamp: "2025-02-04T09:40:00Z",
    },
    {
      notifId: 2,
      userId: 1,
      message: "New fantasy book added to the library.",
      type: "system",
      isRead: true,
      timestamp: "2025-02-03T15:10:00Z",
    },
  ]

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length

  // Progress % safely
  const progressPct =
    lastSessionData && lastSessionData.pageCount > 0
      ? Math.min(
          (lastSessionData.pageNumber / lastSessionData.pageCount) * 100,
          100
        )
      : 0

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Loading / Error */}
        {loading && (
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={{ marginTop: 10, color: "#6B7280" }}>Loading...</Text>
          </View>
        )}

        {!!error && !loading && (
          <View
            style={[styles.card, { borderWidth: 1, borderColor: "#FCA5A5" }]}
          >
            <Text style={{ color: "#B91C1C", fontWeight: "600" }}>{error}</Text>
          </View>
        )}

        {/* USER SUMMARY */}
        {!loading && statics && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.welcomeText}>
                  Welcome back, {statics.userName} 👋
                </Text>
                <Text style={styles.subText}>
                  Keep climbing the leaderboard and finishing books.
                </Text>
              </View>

              <Pressable onPress={() => router.push("/profile")}>
                <FontAwesome
                  name="user-circle"
                  size={36}
                  color={PRIMARY_COLOR}
                />
              </Pressable>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {statics.finishedBooks}
                </Text>
                <Text style={styles.summaryLabel}>Books finished</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{statics.pagesRead}</Text>
                <Text style={styles.summaryLabel}>Total pages read</Text>
              </View>
            </View>
          </View>
        )}

        {/* LAST READING SESSION */}
        {!loading && lastSessionData && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Last Reading Session</Text>
              <MaterialCommunityIcons
                name="progress-clock"
                size={24}
                color={PRIMARY_COLOR}
              />
            </View>

            <Text style={styles.bookTitle}>{lastSessionData.title}</Text>
            <Text style={styles.bookAuthor}>by {lastSessionData.author}</Text>

            <Text style={styles.infoText}>
              Last session: {lastSessionData.period} minutes •{" "}
              {lastSessionData.pagesRead} pages
            </Text>

            <Text style={styles.infoText}>
              You are on page{" "}
              <Text style={styles.highlight}>{lastSessionData.pageNumber}</Text>{" "}
              of {lastSessionData.pageCount}
            </Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[styles.progressBarFill, { width: `${progressPct}%` }]}
              />
            </View>

            <Text style={styles.progressText}>
              {Math.round(progressPct)}% completed
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() => {
                console.log("Continue reading bookId:", lastSessionData.bookId)
                // router.push({ pathname: "/reader", params: { bookId: String(lastSessionData.bookId) } });
              }}
            >
              <Text style={styles.primaryButtonText}>Continue reading</Text>
            </Pressable>
          </View>
        )}

        {/* BOOKMARKS */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Recent bookmarks</Text>
            <FontAwesome name="bookmark" size={20} color={PRIMARY_COLOR} />
          </View>

          {bookmarks.map((bm) => (
            <View key={bm.id} style={styles.bookmarkRow}>
              <View style={styles.iconCircle}>
                <FontAwesome name="book" size={16} color="#FFFFFF" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {bm.bookTitle}
                </Text>
                <Text style={styles.meta}>
                  Page {bm.currentPage} / {bm.totalPages}
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.openButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => onOpenBookmark?.(bm)}
              >
                <Text style={styles.openButtonText}>Open</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* NOTIFICATIONS */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <View style={styles.notificationBadgeWrapper}>
              <FontAwesome name="bell" size={20} color={PRIMARY_COLOR} />
              {unreadNotificationsCount > 0 && (
                <View style={styles.notificationDot}>
                  <Text style={styles.notificationDotText}>
                    {unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {notifications.map((notif) => (
            <View
              key={notif.notifId}
              style={[
                styles.notificationRow,
                !notif.isRead && styles.notificationUnread,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.notificationMessage,
                    !notif.isRead && styles.notificationMessageUnread,
                  ]}
                >
                  {notif.message}
                </Text>
                <Text style={styles.notificationMeta}>
                  {notif.timestamp.substring(11, 16)}
                </Text>
              </View>
            </View>
          ))}

          <Pressable
            onPress={() => router.push("/notifications")}
            style={{ marginTop: 6 }}
          >
            <Text style={{ color: PRIMARY_COLOR, fontWeight: "600" }}>
              View all
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },

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

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  welcomeText: { fontSize: 20, fontWeight: "700", color: TEXT_COLOR },
  subText: { fontSize: 13, color: "#6B7280", marginTop: 4 },

  summaryRow: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryNumber: { fontSize: 20, fontWeight: "700", color: PRIMARY_COLOR },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },

  cardTitle: { fontSize: 18, fontWeight: "700", color: TEXT_COLOR },

  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 4,
  },
  bookAuthor: { fontSize: 13, color: "#6B7280", marginBottom: 8 },

  infoText: { fontSize: 13, color: "#4B5563", marginBottom: 4 },
  highlight: { color: PRIMARY_COLOR, fontWeight: "700" },

  progressBarBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    marginTop: 6,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: PRIMARY_COLOR,
  },
  progressText: { fontSize: 12, color: "#6B7280", marginTop: 6 },

  primaryButton: {
    marginTop: 12,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },

  notificationBadgeWrapper: { position: "relative" },
  notificationDot: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  notificationDotText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },

  notificationRow: { flexDirection: "row", paddingVertical: 8 },
  notificationUnread: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  notificationMessage: { fontSize: 13, color: "#374151" },
  notificationMessageUnread: { fontWeight: "600" },
  notificationMeta: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "700", color: TEXT_COLOR },

  bookmarkRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  meta: { fontSize: 12, color: "#6B7280" },

  openButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E5F3F8",
    marginLeft: 8,
  },
  openButtonText: { fontSize: 11, fontWeight: "600", color: PRIMARY_COLOR },
})
