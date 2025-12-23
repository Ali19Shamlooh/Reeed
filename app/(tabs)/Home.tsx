import { MaterialCommunityIcons } from "@expo/vector-icons"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const userId = 1

// Colors
const PRIMARY_COLOR = "#0a7ea4"
const BACKGROUND_COLOR = "#F9FAFB"
const TEXT_COLOR = "#1F2937"

// --- Types matching your ERD ---
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

// ---- DUMMY DATA ADDED HERE ----
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

type User = {
  userId: number
  name: string
  email: string
  avatar?: string
  type: "normal" | "admin" // 👈 changed to match the value you use
}

type Book = {
  bookId: number
  title: string
  author: string
  category: string
  cover?: string
  pageNumber: number
}

type ReadingLog = {
  logId: number
  userId: number
  bookId: number
  startTime: string
  endTime: string
  pagesRead: number
}

type Notification = {
  notifId: number
  userId: number
  message: string
  type: string
  isRead: boolean
  timestamp: string
}

type DashboardStats = {
  totalBooksFinished: number
  totalPagesRead: number
}

// --- Screen ---

export default function DashboardScreen({
  bookmarks = dummyBookmarks, // default dummy
  onOpenBookmark,
}: BookmarksCardProps) {
  const [loading, setLoading] = useState(false)
  const [statics, setStatics] = useState("")
  const [error, setError] = useState("")
  const [lastSessionData, setLastSessionData] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          `http://localhost/reeed/getFinishedBooks.php?userId=${userId}`,
          `http://localhost/reeed/getLastReadinSession.php?userId=${userId}`,
        ]

        setLoading(true)
        const responses = await Promise.all(urls.map((url) => fetch(url)))

        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`HTTP error`)
          }
        }

        const [finishedBooksData, sessionData] = await Promise.all(
          responses.map((response) => response.json())
        )

        setStatics(finishedBooksData)
        setLastSessionData(sessionData)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        console.log(err)
      }
    }
    fetchData()
  }, [])

  // Dummy data mapped to your ERD

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

  // Simple reading session duration in minutes
  const sessionMinutes = (lastSessionData as any).period

  // Dummy current page instead of bookmark table
  const currentPage = 120

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]} // 👈 keeps away from notch
    >
      <ScrollView>
        {/* USER SUMMARY */}
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
            <Pressable
              onPress={() => {
                console.log("Go to profile page")
              }}
            >
              <FontAwesome name="user-circle" size={36} color={PRIMARY_COLOR} />
            </Pressable>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{statics.finishedBooks}</Text>
              <Text style={styles.summaryLabel}>Books finished</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{statics.PagesRead}</Text>
              <Text style={styles.summaryLabel}>Total pages read</Text>
            </View>
          </View>
        </View>

        {/* LAST READING SESSION */}
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
            Last session: {sessionMinutes} minutes • {lastSessionData.pagesRead}{" "}
            pages
          </Text>

          <Text style={styles.infoText}>
            You are on page{" "}
            <Text style={styles.highlight}>{lastSessionData.pageNumber}</Text>{" "}
            of {lastSessionData.pageCount}
          </Text>

          {/* Simple progress bar based on current page */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${
                    Math.min(
                      (lastSessionData.pageNumber / lastSessionData.pageCount) *
                        100,
                      100
                    ) || 0
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(
              (lastSessionData.pageNumber / lastSessionData.pageCount) * 100
            )}
            % completed
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              console.log(
                "Continue reading bookId:",
                (lastSessionData as any).bookId
              )
            }}
          >
            <Text style={styles.primaryButtonText}>Continue reading</Text>
          </Pressable>
        </View>

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
                onPress={() => onOpenBookmark && onOpenBookmark(bm)}
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

          <Pressable onPress={() => router.push("./Notifications")}>
            <Text>View all</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// --- Styles ---

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
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  subText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY_COLOR,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  highlight: {
    color: PRIMARY_COLOR,
    fontWeight: "700",
  },
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
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  notificationBadgeWrapper: {
    position: "relative",
  },
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
  notificationDotText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  notificationRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  notificationUnread: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  notificationMessage: {
    fontSize: 13,
    color: "#374151",
  },
  notificationMessageUnread: {
    fontWeight: "600",
  },
  notificationMeta: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
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
  bookmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  meta: {
    fontSize: 12,
    color: "#6B7280",
  },
  openButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E5F3F8",
    marginLeft: 8,
  },
  openButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
})
