import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  type: "normal" | "admin";
};

type LeaderBoard = {
  id: number;
  userId: number;
  rank: number;
  booksFinished: number;
  totalPages: number;
  last_updated: string; // datetime as string
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

type Bookmark = {
  bookmarkId: number;
  userId: number;
  bookId: number;
  pageNumber: number;
  timestamp: string;
};

type Review = {
  reviewId: number;
  userId: number;
  bookId: number;
  rating: number;
  reviewText: string;
  timestamp: string;
};

// --- Screen ---

export default function DashboardScreen() {
  // Dummy data mapped to your ERD

  const user: User = {
    userId: 1,
    name: "Hassan",
    email: "hassan@example.com",
    type: "normal",
  };

  const leaderboard: LeaderBoard = {
    id: 10,
    userId: 1,
    rank: 3,
    booksFinished: 7,
    totalPages: 1920,
    last_updated: "2025-02-04T10:30:00Z",
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

  const bookmarks: (Bookmark & { book: Book })[] = [
    {
      bookmarkId: 90,
      userId: 1,
      bookId: 100,
      pageNumber: 120,
      timestamp: "2025-02-04T09:25:00Z",
      book: currentBook,
    },
    {
      bookmarkId: 91,
      userId: 1,
      bookId: 101,
      pageNumber: 45,
      timestamp: "2025-02-02T18:00:00Z",
      book: {
        bookId: 101,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        pageNumber: 200,
      },
    },
  ];

  const latestReview: (Review & { book: Book }) = {
    reviewId: 300,
    userId: 1,
    bookId: 101,
    rating: 5,
    reviewText: "Beautiful story with deep meaning.",
    timestamp: "2025-02-01T20:10:00Z",
    book: {
      bookId: 101,
      title: "The Alchemist",
      author: "Paulo Coelho",
      category: "Fiction",
      pageNumber: 200,
    },
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Simple reading session duration in minutes
  const sessionMinutes = 25; // from the log above

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* USER + LEADERBOARD SUMMARY */}
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
            <Text style={styles.summaryNumber}>#{leaderboard.rank}</Text>
            <Text style={styles.summaryLabel}>Leaderboard rank</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {leaderboard.booksFinished}
            </Text>
            <Text style={styles.summaryLabel}>Books finished</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {leaderboard.totalPages}
            </Text>
            <Text style={styles.summaryLabel}>Total pages read</Text>
          </View>
        </View>
      </View>

      {/* CURRENT READING SESSION (Reading-Logs + Book) */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Current reading session</Text>
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
          <Text style={styles.highlight}>{bookmarks[0].pageNumber}</Text> of{" "}
          {currentBook.pageNumber}
        </Text>

        {/* Simple progress bar based on bookmark */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${
                  Math.min(
                    (bookmarks[0].pageNumber / currentBook.pageNumber) * 100,
                    100
                  ) || 0
                }%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(
            (bookmarks[0].pageNumber / currentBook.pageNumber) * 100
          )}
          % completed
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => {
            // TODO: navigate to reader with bookId + pageNumber
            console.log("Continue reading bookId:", currentBook.bookId);
          }}
        >
          <Text style={styles.primaryButtonText}>Continue reading</Text>
        </Pressable>
      </View>

      {/* NOTIFICATIONS (Notification table) */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <View style={styles.notificationBadgeWrapper}>
            <FontAwesome
              name="bell"
              size={20}
              color={PRIMARY_COLOR}
            />
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
                Type: {notif.type} •{" "}
                {notif.isRead ? "Read" : "Unread"}
              </Text>
            </View>
          </View>
        ))}

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            { marginTop: 10, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => console.log("Open all notifications")}
        >
          <Text style={styles.secondaryButtonText}>View all</Text>
        </Pressable>
      </View>

      {/* BOOKMARKS (Bookmarks + Book) */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Recent bookmarks</Text>
          <FontAwesome name="bookmark" size={20} color={PRIMARY_COLOR} />
        </View>

        {bookmarks.map((bm) => (
          <View key={bm.bookmarkId} style={styles.bookmarkRow}>
            <View style={styles.bookmarkIconCircle}>
              <FontAwesome name="book" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookmarkTitle} numberOfLines={1}>
                {bm.book.title}
              </Text>
              <Text style={styles.bookmarkMeta}>
                Page {bm.pageNumber} / {bm.book.pageNumber}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.bookmarkButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() =>
                console.log(
                  "Go to bookmark",
                  bm.bookId,
                  "page",
                  bm.pageNumber
                )
              }
            >
              <Text style={styles.bookmarkButtonText}>Open</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* LATEST REVIEW (Reviews + Book) */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Your latest review</Text>
          <FontAwesome name="star" size={20} color={PRIMARY_COLOR} />
        </View>

        <Text style={styles.bookTitle}>{latestReview.book.title}</Text>
        <Text style={styles.bookAuthor}>
          by {latestReview.book.author}
        </Text>

        <View style={styles.ratingRow}>
          {Array.from({ length: 5 }).map((_, index) => (
            <FontAwesome
              key={index}
              name={index < latestReview.rating ? "star" : "star-o"}
              size={18}
              color={PRIMARY_COLOR}
            />
          ))}
        </View>

        <Text style={styles.reviewText} numberOfLines={3}>
          “{latestReview.reviewText}”
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            { marginTop: 10, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => router.push ("/Reviews")}
        >
          <Text style={styles.secondaryButtonText}>View all reviews</Text>
        </Pressable>
      </View>

      {/* QUICK ACTIONS – mapped to tables/features */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick actions</Text>
        <View style={styles.quickActionsRow}>
          <QuickActionButton
            icon="book"
            label="Library"
            onPress={() => router.push("/(tabs)/library")}
          />
          <QuickActionButton
            icon="list-ol"
            label="Leaderboard"
            onPress={() =>
              router.push("/Leaderboard")
            }
          />
          <QuickActionButton
            icon="bookmark"
            label="Bookmarks"
            onPress={() =>
              router.push("/Bookmarks")
            }
          />
          <QuickActionButton
            icon="star"
            label="Reviews"
            onPress={() =>
              router.push("/Reviews")
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

// Reusable Quick Action Button
type QuickActionButtonProps = {
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  label: string;
  onPress: () => void;
};

function QuickActionButton({ icon, label, onPress }: QuickActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.quickActionButton,
        { opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={onPress}
    >
      <FontAwesome name={icon} size={20} color={PRIMARY_COLOR} />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
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
  bookmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bookmarkIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  bookmarkTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_COLOR,
  },
  bookmarkMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  bookmarkButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E5F3F8",
    marginLeft: 8,
  },
  bookmarkButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  ratingRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  reviewText: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 8,
    fontStyle: "italic",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  quickActionLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#4B5563",
    textAlign: "center",
  },
});