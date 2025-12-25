import { Ionicons } from "@expo/vector-icons"
import { Link, router, Stack } from "expo-router"
import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import BookBox from "../components/BookBox"

//importing global variables
import Constants from "expo-constants"
const extra = Constants.expoConfig?.extra ?? {}
const GOOGLE_BOOKS_API_BASE_URL = extra.GOOGLE_BOOKS_API_BASE_URL
const GOOGLE_BOOKS_API_KEY = extra.GOOGLE_BOOKS_API_KEY
const API_BASE_URL = extra.API_BASE_URL

const userId = 1

type BookResult = {
  id: string
  title: string
  authors: string
  thumbnail?: string | null
  googleId: string
}

export default function LibraryScreen() {
  const [loading, setLoading] = useState(true)
  const [bookDetails, setBookDetails] = useState([])

  useEffect(() => {
    //retrieving bookIds from the userBook table in db
    const fetchData = async () => {
      try {
        setLoading(true)

        // 1️⃣ Fetch my book list  from your DB

        const response = await fetch(
          `http://localhost/reeed/getLibraryBooks.php?userId=${userId}`
        )

        if (!response) {
          throw new Error("Network Error was no ok ")
        }

        const jsonData = await response.json()
        setBookDetails(jsonData)
        console.log(jsonData)
        setLoading(false)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Convert library books to BookBox format
  const bookBoxData = bookDetails.map((b) => ({
    bookId: b.bookId,
    title: b.title,
    authors: b.author,
    id: b.id,
    googleId: b.googleId,
    thumbnail: null, // add cover later if you have it
  }))

  const openBook = (b: BookResult) => {
    router.push({ pathname: "/BookDetails", params: { id: b.googleId } })
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
        <ScrollView
          style={styles.emptyContainer}
          contentContainerStyle={styles.emptyContent}
        >
          <Text style={styles.emptyText}>
            Your library is empty. Upload a book to get started!
          </Text>

          <Link href="/(tabs)/upload-book" asChild>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload Book</Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
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
    marginTop: 10,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e3a8a",
  },
  bookAuthor: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0a7ea4",
    marginRight: 8,
  },
  completeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
    marginRight: 8,
  },
  emptyContainer: {
    padding: 40,
    flex: 1,
    marginTop: 50,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
