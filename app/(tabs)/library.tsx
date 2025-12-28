import { Ionicons } from "@expo/vector-icons"
import { Link, router, Stack, useFocusEffect } from "expo-router"
import React, { useCallback, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { auth } from "../../firebaseConfig"
import BookBox from "../components/BookBox"

// importing global variables
import { View } from "@/components/Themed"
import Constants from "expo-constants"

const BASE_URL =
  // Platform.OS == "web" ?
  "http://localhost/reeed"
// : 'http://192.168.100.8/reeed'

const extra = Constants.expoConfig?.extra ?? {}
const GOOGLE_BOOKS_API_BASE_URL = extra.GOOGLE_BOOKS_API_BASE_URL
const GOOGLE_BOOKS_API_KEY = extra.GOOGLE_BOOKS_API_KEY
const API_BASE_URL = extra.API_BASE_URL

type BookResult = {
  id: string
  title: string
  authors: string
  thumbnail?: string | null
  googleId: string
}

type LibraryBook = {
  bookId: number
  title: string
  author: string
  id?: string | number
  googleId: string
}

async function fetchJson(url: string) {
  const res = await fetch(url)
  const text = await res.text()

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}\n${text}`)
  }

  // If server returned HTML (common on PHP errors/404), prevent JSON parse crash
  if (text.trim().startsWith("<")) {
    throw new Error(
      `Server returned HTML (not JSON) from ${url}\n${text.slice(0, 200)}`
    )
  }

  return JSON.parse(text)
}

export default function LibraryScreen() {
  const [loading, setLoading] = useState(true)
  const [bookDetails, setBookDetails] = useState<LibraryBook[]>([])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  const fetchData = async () => {
    try {
      setLoading(true)

      const user = auth.currentUser
      if (!user?.uid) {
        setBookDetails([])
        Alert.alert("Error", "You are not logged in.")
        return
      }

      // 1) Get DB user id using Firebase uid
      const getUserIdUrl = `${BASE_URL}/getUserId.php?fireId=${encodeURIComponent(
        user.uid
      )}`

      const dbId = await fetchJson(getUserIdUrl)

      // If your PHP returns { uId: 2 } this is fine:
      const dbUserId = dbId?.uId

      if (!dbUserId) {
        setBookDetails([])
        Alert.alert("Error", "User id not found in database.")
        return
      }

      // 2) Fetch library books
      const libraryUrl = `${BASE_URL}/getLibraryBooks.php?userId=${dbUserId}`
      const jsonData = await fetchJson(libraryUrl)

      // If your PHP returns { error: "..." }
      if (jsonData?.error) {
        setBookDetails([])
        Alert.alert("Error", String(jsonData.error))
        return
      }

      // Expecting array
      setBookDetails(Array.isArray(jsonData) ? jsonData : [])
    } catch (error: any) {
      console.error("LibraryScreen error:", error)
      Alert.alert("Error", error?.message ?? "Failed to load library.")
      setBookDetails([])
    } finally {
      setLoading(false)
    }
  }

  const openBook = (b: any) => {
    // BookDetails expects googleId in params as "id"
    router.push({
      pathname: "/BookDetails",
      params: { id: String(b.googleId) },
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
            <Link href="/(tabs)/upload-book" asChild>
              <TouchableOpacity>
                <Ionicons name="add-circle-outline" size={30} color="#1e3a8a" />
              </TouchableOpacity>
            </Link>
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

          <Link href="/(tabs)/upload-book" asChild>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload Book</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 20,
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
