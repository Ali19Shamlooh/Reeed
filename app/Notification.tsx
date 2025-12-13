// app/notifications.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 👈 NEW

const PRIMARY_COLOR = "#0a7ea4";
const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";

type NotificationItem = {
  id: number | string;
  message: string;
  type: "leaderboard" | "system" | "reminder" | "achievement";
  isRead: boolean;
  timestamp: string;
};

// 🔔 Dummy notifications – you can replace with real DB data later
const dummyNotifications: NotificationItem[] = [
  {
    id: 1,
    message: "You moved up to rank #3 on the leaderboard! 🎉",
    type: "leaderboard",
    isRead: false,
    timestamp: "2025-02-04 09:40",
  },
  {
    id: 2,
    message: "New fantasy book added to your library.",
    type: "system",
    isRead: true,
    timestamp: "2025-02-03 15:10",
  },
  {
    id: 3,
    message: "You completed 30 minutes of focused reading today. Great job!",
    type: "achievement",
    isRead: false,
    timestamp: "2025-02-03 09:15",
  },
  {
    id: 4,
    message: "Don’t forget to continue reading “Atomic Habits” today.",
    type: "reminder",
    isRead: true,
    timestamp: "2025-02-02 20:30",
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const notifications = dummyNotifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]} // 👈 keeps away from notch
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 🔙 Back Button */}
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

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>
            Stay updated with your reading progress and app activity.
          </Text>
        </View>

        {/* Empty state */}
        {notifications.length === 0 && (
          <View style={styles.emptyCard}>
            <FontAwesome
              name="bell-o"
              size={28}
              color={PRIMARY_COLOR}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              As you read more and use the app, your notifications will appear
              here.
            </Text>
          </View>
        )}

        {/* Notifications list */}
        {notifications.map((notif) => (
          <View
            key={notif.id}
            style={[
              styles.notificationRow,
              !notif.isRead && styles.notificationUnread,
            ]}
          >
            {/* Icon based on type */}
            <View style={styles.iconCircle}>
              {notif.type === "leaderboard" && (
                <FontAwesome name="trophy" size={16} color="#FFFFFF" />
              )}
              {notif.type === "system" && (
                <FontAwesome name="info" size={16} color="#FFFFFF" />
              )}
              {notif.type === "reminder" && (
                <FontAwesome name="clock-o" size={16} color="#FFFFFF" />
              )}
              {notif.type === "achievement" && (
                <FontAwesome name="star" size={16} color="#FFFFFF" />
              )}
            </View>

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
                {notif.type} • {notif.timestamp}
              </Text>
            </View>

            {!notif.isRead && <View style={styles.unreadDot} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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

  // Back button
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "500",
    color: TEXT_COLOR,
  },

  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  unreadBadge: {
    marginLeft: 8,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },

  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  notificationUnread: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  notificationMessage: {
    fontSize: 14,
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
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_COLOR,
    marginLeft: 8,
    marginTop: 6,
  },
});
