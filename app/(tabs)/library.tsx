import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as DocumentPicker from "expo-document-picker"
import { router, Stack, useFocusEffect } from "expo-router"
import React, { useCallback, useState } from "react"
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { auth } from "../../firebaseConfig"
import BookBox from "../components/BookBox"

// importing global variables
import { View } from "@/components/Themed"

const BASE_URL =
  Platform.OS == "web" ? "http://localhost/reeed" : "http://172.20.10.2/reeed"

type LibraryBook = {
  bookId: number
  title: string
  author: string
  googleId: string
}

async function fetchJson(url: string) {
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}\n${text}`)
  }
  if (text.trim().startsWith("<")) {
    throw new Error("Server returned HTML instead of JSON")
  }

  return JSON.parse(text)
}

export default function LibraryScreen() {
  const [loading, setLoading] = useState(true)
  const [bookDetails, setBookDetails] = useState<LibraryBook[]>([])
  const [userId, setUserId] = useState(null)

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  const fetchData = async () => {
    const User = auth.currentUser
    const fireId = User?.uid
    const getUserId = `${BASE_URL}/getUserId.php?fireId=${fireId}`

    const userIdRes = await fetch(getUserId)
    if (!userIdRes.ok) throw new Error("Failed to load user ID")

    const dbId = await userIdRes.json()
    const dbUserId = dbId.uId
    setUserId(dbUserId)
    try {
      setLoading(true)

      const user = auth.currentUser
      if (!user?.uid) {
        setBookDetails([])
        return
      }

      // 1️⃣ Get DB user id
      const dbUser = await fetchJson(
        `${BASE_URL}/getUserId.php?fireId=${encodeURIComponent(user.uid)}`
      )

      const dbUserId = dbUser?.uId
      if (!dbUserId) {
        setBookDetails([])
        return
      }

      // 2️⃣ Fetch library
      const books = await fetchJson(
        `${BASE_URL}/getLibraryBooks.php?userId=${dbUserId}`
      )

      setBookDetails(Array.isArray(books) ? books : [])
    } catch (e: any) {
      console.error(e)
      Alert.alert("Error", e.message ?? "Failed to load library")
      setBookDetails([])
    } finally {
      setLoading(false)
    }
  }

  const openBook = async (b: LibraryBook) => {
    // 🔑 if uploaded book → open local reader

    if (b.googleId === "LOCAL") {
      const uri = await AsyncStorage.getItem(`book_file_${b.bookId}`)
      if (!uri) {
        Alert.alert("File missing", "Local book file not found.")
        return
      }
      router.push({
        pathname: "/reader",
        params: { uri },
      })
      return
    }

    // Google book
    router.push({
      pathname: "/BookDetails",
      params: { id: b.googleId },
    })
  }

  // 📁 Pick local book
  const pickBookFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/epub+zip"],
      copyToCacheDirectory: true,
    })

    if (result.canceled) return

    const file = result.assets[0]

    // Simple metadata prompt (can be replaced with modal later)
    Alert.prompt("Book title", "Enter book title", async (title) => {
      if (!title) return

      try {
        const user = auth.currentUser
        if (!user?.uid) return Alert.alert("Error", "User not logged in")

        const dbUserRes = await fetch(
          `${BASE_URL}/getUserId.php?fireId=${encodeURIComponent(user.uid)}`
        )
        const dbUser = await dbUserRes.json()
        const dbUserId = dbUser?.uId
        if (!dbUserId) return Alert.alert("Error", "User ID not found")

        const res = await fetchJson(
          `${BASE_URL}/addLocalBook.php?` +
            `title=${encodeURIComponent(title)}` +
            `&author=Unknown` +
            `&uploaded=1` +
            `&userId=${encodeURIComponent(dbUserId)}` +
            `&googleId=LOCAL`
        )

        const bookId = res.bookId

        // 💾 Save file URI locally
        await AsyncStorage.setItem(`book_file_${bookId}`, file.uri)

        Alert.alert("Success", "Book added to your library")
        fetchData()
      } catch (e: any) {
        Alert.alert("Error", e.message ?? "Failed to add book")
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Library",
          headerShown: true,
          headerLargeTitle: true,
          headerRight: () => (
            <TouchableOpacity onPress={pickBookFile}>
              <Ionicons name="add-circle-outline" size={30} color="#1e3a8a" />
            </TouchableOpacity>
          ),
        }}
      />

      <Text style={styles.header}>Your Books ({bookDetails.length})</Text>

      {bookDetails.length > 0 ? (
        <BookBox books={bookDetails} onPressBook={openBook} />
      ) : (
        <View>
          <Text style={styles.emptyText}>
            Your library is empty. Upload a book to get started!
          </Text>

          <TouchableOpacity style={styles.uploadButton} onPress={pickBookFile}>
            <Text style={styles.uploadButtonText}>Upload Book</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  uploadButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
