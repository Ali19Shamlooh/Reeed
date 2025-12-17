import { Ionicons } from "@expo/vector-icons"
import { Stack, router } from "expo-router"
import { doc, getDoc } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { auth, db } from "../../firebaseConfig"

// Define the structure for user data
interface UserProfile {
  name: string
  email: string
  readingGoal: number
  currentStreak: number
  totalBooksRead: number
  type?: "normal" | "admin" 
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false) // New state for logout feedback
  const user = auth.currentUser

  // Fetch user data from Firestore
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    try {
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile)
      } else {
        console.log("No such document for user!")
        setProfile({
          name: user.displayName || "Reader",
          email: user.email || "N/A",
          readingGoal: 0,
          currentStreak: 0,
          totalBooksRead: 0,
          type: "normal", // 👈 default type if no doc
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      Alert.alert("Error", "Could not load profile data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await auth.signOut()
      console.log("Sign out successful. Navigating to root...")
      router.replace("/")
    } catch (error) {
      console.error("Logout error:", error)
      Alert.alert("Error", "Failed to log out. Please check your connection.")
      setIsLoggingOut(false)
    }
  }

  // Show spinner during initial profile load OR during logout process
  if (loading || isLoggingOut) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>
          {isLoggingOut ? "Signing Out..." : "Loading Profile..."}
        </Text>
      </View>
    )
  }

  const userProfile: UserProfile = profile || {
    name: user?.displayName || "Reader",
    email: user?.email || "N/A",
    readingGoal: 0,
    currentStreak: 0,
    totalBooksRead: 0,
    type: "normal", // 👈 fallback default type
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Profile",
          headerShown: true,
          headerLargeTitle: true,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* 👇 Role badge next to settings */}
              <Text style={styles.roleBadge}>
                {userProfile.type === "admin" ? "Admin" : "User"}
              </Text>

              <Ionicons
                name="settings-outline"
                size={24}
                color="#1e3a8a"
                onPress={() =>
                  Alert.alert("Settings", "Settings screen coming soon!")
                }
              />
            </View>
          ),
        }}
      />

      <View style={styles.profileHeader}>
        <Ionicons name="person-circle" size={80} color="#1e3a8a" />
        <Text style={styles.nameText}>{userProfile.name}</Text>
        <Text style={styles.emailText}>{userProfile.email}</Text>
        <Text style={styles.userIdText}>
          User ID: {user?.uid ? user.uid.substring(0, 12) + "..." : "Guest"}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userProfile.totalBooksRead}</Text>
          <Text style={styles.statLabel}>Books Read</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userProfile.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userProfile.readingGoal}</Text>
          <Text style={styles.statLabel}>Page Goal</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <Button
          title="Update Profile"
          onPress={() =>
            Alert.alert("Update", "Profile update feature coming soon!")
          }
          color="#0a7ea4"
        />
        <View style={{ marginTop: 15 }}>
          <Button title="Logout" onPress={handleLogout} color="#ef4444" />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1e3a8a",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  emailText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 5,
  },
  userIdText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  roleBadge: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1e3a8a",
    color: "#1e3a8a",
    fontSize: 12,
    fontWeight: "600",
  },
})
