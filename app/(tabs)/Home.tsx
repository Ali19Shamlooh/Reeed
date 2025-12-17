import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useEffect, useState } from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 👈 NEW

// Colors
const PRIMARY_COLOR = "#0a7ea4";
const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";

// --- Types matching your ERD ---

type User = {
  userId: number;
  name: string;
  email: string;
  avatar?: string;
  type: "normal" | "admin"; // 👈 changed to match the value you use
};

type Book = {
  bookId: number;
  title: string;
  author: string;
  category: string;
  cover?: string;
  pageNumber: number;
};

type ReadingLog = {
  logId: number;
  userId: number;
  bookId: number;
  startTime: string;
  endTime: string;
  pagesRead: number;
};

type Notification = {
  notifId: number;
  userId: number;
  message: string;
  type: string;
  isRead: boolean;
  timestamp: string;
};

type DashboardStats = {
  totalBooksFinished: number;
  totalPagesRead: number;
};

// --- Screen ---

export default function HomeScreen() {
  const [loading, setLoading] = useState(false)
  const [statics, setStatics] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStatics = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost/reeed/getFinishedBooks.php?userId=${userId}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error("error")
        }

        setStatics(data)
      } catch (err) {
        setError(err.message)
        console.log(err)
      }
    }

    fetchStatics()
  }, [])

  const addTestBook = async () => {
    setLoading(true)
    try {
      // Try to add a fake book to a 'books' collection
      const docRef = await addDoc(collection(db, "books"), {
        title: "Test Book Entry",
        author: "Reeed Admin",
        timestamp: new Date().toISOString(),
      })
      Alert.alert("Success!", `Book saved with ID: ${docRef.id}`)
    } catch (error: any) {
      console.error(error)
      Alert.alert(
        "Error",
        "Could not connect to database. Check console for details."
      )
    } finally {
      setLoading(false)
    }
  }
export default function DashboardScreen() {
  // Dummy data mapped to your ERD

  const user: User = {
    userId: 1,
    name: "Hassan",
    email: "hassan@example.com",
    type: "normal",
  };

  const stats: DashboardStats = {
    totalBooksFinished: 7,
    totalPagesRead: 1920,
  };

  const currentBook: Book = {
    bookId: 100,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    pageNumber: 280,
  };

  const lastReadingLog: ReadingLog = {
    logId: 501,
    userId: 1,
    bookId: 100,
    startTime: "2025-02-04T09:00:00Z",
    endTime: "2025-02-04T09:25:00Z",
    pagesRead: 18,
  };

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
  ];

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Simple reading session duration in minutes
  const sessionMinutes = 25;

  // Dummy current page instead of bookmark table
  const currentPage = 120;

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]} // 👈 keeps away from notch
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* USER SUMMARY */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.welcomeText}>
                Welcome back, {user.name} 👋
              </Text>
              <Text style={styles.subText}>
                Keep climbing the leaderboard and finishing books.
              </Text>
            </View>
            <FontAwesome name="user-circle" size={36} color={PRIMARY_COLOR} />
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {stats.totalBooksFinished}
              </Text>
              <Text style={styles.summaryLabel}>Books finished</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {stats.totalPagesRead}
              </Text>
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

          <Text style={styles.bookTitle}>{currentBook.title}</Text>
          <Text style={styles.bookAuthor}>by {currentBook.author}</Text>

          <Text style={styles.infoText}>
            Last session: {sessionMinutes} minutes • {lastReadingLog.pagesRead} pages
          </Text>

          <Text style={styles.infoText}>
            You are on page{" "}
            <Text style={styles.highlight}>{currentPage}</Text> of{" "}
            {currentBook.pageNumber}
          </Text>

          {/* Simple progress bar based on current page */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${
                    Math.min(
                      (currentPage / currentBook.pageNumber) * 100,
                      100
                    ) || 0
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((currentPage / currentBook.pageNumber) * 100)}% completed
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              console.log("Continue reading bookId:", currentBook.bookId);
            }}
          >
            <Text style={styles.primaryButtonText}>Continue reading</Text>
          </Pressable>
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
            style={({ pressed }) => [
              styles.secondaryButton,
              { marginTop: 10, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => router.push("/Notification")}
          >
            <Text style={styles.secondaryButtonText}>View all</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
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
})

