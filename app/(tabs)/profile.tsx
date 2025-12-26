import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Stack, router } from "expo-router"
import { doc, getDoc } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { auth, db } from "../../firebaseConfig"

import Constants from "expo-constants"
const BASE_URL =
  // Platform.OS == "web" ?
  "http://localhost/reeed"
// : 'http://192.168.100.8/reeed'
const extra = Constants.expoConfig?.extra ?? {}
const GOOGLE_BOOKS_API_BASE_URL = extra.GOOGLE_BOOKS_API_BASE_URL
const GOOGLE_BOOKS_API_KEY = extra.GOOGLE_BOOKS_API_KEY
const API_BASE_URL = extra.API_BASE_URL

// Define the structure for user data
interface UserProfile {
  name: string
  email: string
  readingGoal: number
  currentStreak: number
  totalBooksRead: number
  type?: "normal" | "admin"
}

const GOAL_KEY = "reeed_page_goal" // local storage key

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // ✅ Goal modal states
  const [goalModalVisible, setGoalModalVisible] = useState(false)
  const [goalInput, setGoalInput] = useState("")

  const [nameModalVisible, setNameModalVisible] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [uId, setUId] = useState(null)

  const user = auth.currentUser

  // Fetch user data from Firestore
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    const fireId = user?.uid
    const getUserId = `${BASE_URL}/getUserId.php?fireId=${fireId}`
    const userIdRes = await fetch(getUserId)
    const dbId = await userIdRes.json()
    const dbUserId = dbId.uId
    setUId(dbUserId)
    try {
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      let baseProfile: UserProfile

      if (docSnap.exists()) {
        baseProfile = docSnap.data() as UserProfile
      } else {
        baseProfile = {
          name: user.displayName || "Reader",
          email: user.email || "N/A",
          readingGoal: 0,
          currentStreak: 0,
          totalBooksRead: 0,
          type: "normal",
        }
      }

      // ✅ Load local goal (if exists) and override
      const localGoal = await AsyncStorage.getItem(GOAL_KEY)
      if (localGoal) {
        const g = Number(localGoal)
        if (Number.isFinite(g) && g >= 0) {
          baseProfile.readingGoal = g
        }
      }

      setProfile(baseProfile)
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
      router.replace("/")
    } catch (error) {
      console.error("Logout error:", error)
      Alert.alert("Error", "Failed to log out. Please check your connection.")
      setIsLoggingOut(false)
    }
  }

  const userProfile: UserProfile = profile || {
    name: user?.displayName || "Reader",
    email: user?.email || "N/A",
    readingGoal: 0,
    currentStreak: 0,
    totalBooksRead: 0,
    type: "normal",
  }

  // ✅ Open goal modal
  const openGoalModal = () => {
    setGoalInput(String(userProfile.readingGoal ?? 0))
    setGoalModalVisible(true)
  }

  // ✅ Save goal locally (and optionally Firestore)
  const saveGoal = async () => {
    const num = Number(goalInput)

    if (!Number.isFinite(num) || num < 0) {
      Alert.alert("Invalid", "Please enter a valid number (0 or more).")
      return
    }

    try {
      // 1) Save locally
      await AsyncStorage.setItem(GOAL_KEY, String(num))

      // 2) Update UI immediately
      setProfile((prev) =>
        prev
          ? { ...prev, readingGoal: num }
          : { ...userProfile, readingGoal: num }
      )

      // 3) OPTIONAL: Save to Firestore too (uncomment if you want)
      // if (user) {
      //   await updateDoc(doc(db, "users", user.uid), { readingGoal: num });
      // }

      setGoalModalVisible(false)
      Alert.alert("Saved", `Your page goal is now ${num}.`)
    } catch (e) {
      console.error(e)
      Alert.alert("Error", "Could not save goal.")
    }
  }

  const saveName = async () => {
    if (!user) return

    const trimmed = nameInput.trim()

    if (trimmed.length < 2) {
      Alert.alert("Invalid name", "Name must be at least 2 characters.")
      return
    }

    try {
      setSavingName(true)

      console.log(uId)
      const response = await fetch(
        `${BASE_URL}/UpdateUserName.php?uId=${uId}&newName=${trimmed}`
      )

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Update failed")
      }

      // ✅ Update UI immediately
      setProfile((prev) => (prev ? { ...prev, name: trimmed } : prev))

      setNameModalVisible(false)
      Alert.alert("Success", "Name updated successfully.")
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Could not update name.")
    } finally {
      setSavingName(false)
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Profile",
          headerShown: true,
          headerLargeTitle: true,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        <Pressable
          onPress={() => {
            setNameInput(userProfile.name)
            setNameModalVisible(true)
          }}
        >
          <Text style={styles.nameText}>{userProfile.name}</Text>
          <Text style={styles.editHint}>Tap to edit</Text>
        </Pressable>
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

        {/* ✅ Tap to edit goal */}
        <Pressable
          style={styles.statCard}
          onPress={openGoalModal}
          android_ripple={{ color: "#E5E7EB" }}
        >
          <Text style={styles.statNumber}>{userProfile.readingGoal}</Text>
          <Text style={styles.statLabel}>Page Goal</Text>
          <Text style={styles.editHint}>Tap to edit</Text>
        </Pressable>
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

      {/* ✅ Goal Modal */}
      <Modal
        visible={goalModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Page Goal</Text>
            <Text style={styles.modalSubtitle}>
              Enter how many pages you want to read.
            </Text>

            <TextInput
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="number-pad"
              placeholder="e.g. 30"
              style={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setGoalModalVisible(false)}
                style={({ pressed }) => [
                  styles.modalBtn,
                  styles.modalBtnSecondary,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={saveGoal}
                style={({ pressed }) => [
                  styles.modalBtn,
                  styles.modalBtnPrimary,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.modalBtnPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <Text style={styles.modalSubtitle}>
              This name will be visible on your profile.
            </Text>

            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Your name"
              style={styles.modalInput}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setNameModalVisible(false)}
                style={({ pressed }) => [
                  styles.modalBtn,
                  styles.modalBtnSecondary,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={saveName}
                disabled={savingName}
                style={({ pressed }) => [
                  styles.modalBtn,
                  styles.modalBtnPrimary,
                  { opacity: pressed || savingName ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.modalBtnPrimaryText}>
                  {savingName ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#1e3a8a" },

  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  nameText: { fontSize: 24, fontWeight: "bold", marginTop: 10, color: "#333" },
  emailText: { fontSize: 14, color: "#6b7280", marginTop: 5 },
  userIdText: { fontSize: 12, color: "#9ca3af", marginTop: 5 },

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
  statNumber: { fontSize: 28, fontWeight: "bold", color: "#1e3a8a" },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 5,
  },
  editHint: { fontSize: 10, color: "#9ca3af", marginTop: 4 },

  section: { paddingHorizontal: 20 },
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

  // ✅ Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  modalSubtitle: { marginTop: 6, fontSize: 13, color: "#6b7280" },
  modalInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 14 },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnPrimary: { backgroundColor: "#0a7ea4" },
  modalBtnPrimaryText: { color: "#fff", fontWeight: "800" },
  modalBtnSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalBtnSecondaryText: { color: "#111827", fontWeight: "800" },
})
