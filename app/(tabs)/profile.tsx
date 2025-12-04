import { Ionicons } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { signOut } from "firebase/auth"
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
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
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
        // Fallback for users registered without initial profile data
        setProfile({
          name: user.displayName || "Reader",
          email: user.email || "N/A",
          readingGoal: 0,
          currentStreak: 0,
          totalBooksRead: 0,
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

  // Handle Logout (UC-1 sub-flow)
  const handleLogout = async () => {
    try {
      await signOut(auth)
      // auth listener in app/index.tsx handles redirection to login screen
    } catch (error) {
      Alert.alert("Error", "Failed to log out.")
    }
  }

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    )
  }

  const userProfile = profile || {
    name: user?.displayName || "Reader",
    email: user?.email || "N/A",
    readingGoal: 0,
    currentStreak: 0,
    totalBooksRead: 0,
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Profile",
          headerShown: true,
          headerLargeTitle: true,
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color="#1e3a8a"
              onPress={() =>
                Alert.alert("Settings", "Settings screen coming soon!")
              }
            />
          ),
        }}
      />

      <View style={styles.profileHeader}>
        <Ionicons name="person-circle" size={80} color="#1e3a8a" />
        <Text style={styles.nameText}>{userProfile.name}</Text>
        <Text style={styles.emailText}>{userProfile.email}</Text>
        <Text style={styles.userIdText}>
          User ID: {user?.uid.substring(0, 12)}...
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
          <Button
            title="Logout"
            onPress={handleLogout}
            color="#ef4444" // Red for cautionary action
          />
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
})
