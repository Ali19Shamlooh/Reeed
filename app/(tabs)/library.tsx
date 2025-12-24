import { Ionicons } from "@expo/vector-icons"
import { Link, router, Stack } from "expo-router"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import BookBox from "../components/BookBox"

const userId = 1

// Mock data for demonstration
const mockBooks = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    progress: 0.65,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    progress: 0.12,
  },
  { id: "3", title: "1984", author: "George Orwell", progress: 1.0 },
]

export default function LibraryScreen() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dbBookIds, setDbBookIds] = useState([])

  useEffect(() => {
    const getUserBookIds = () => {
      const url = `http://localhost/reeed/getUserBooksFromdb.php?userId=${userId}`
      
    }
  }, [])

  // Convert library books to BookBox format
  const bookBoxData = mockBooks.map((b) => ({
    id: b.id,
    title: b.title,
    authors: b.author,
    thumbnail: null, // add cover later if you have it
  }))

  const openBook = (book: { id: string }) => {
    router.push(`/reader/${book.id}`)
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

      <Text style={styles.header}>Your Books ({bookBoxData.length})</Text>

      {bookBoxData.length > 0 ? (
        <BookBox books={bookBoxData} onPressBook={openBook} />
      ) : (
        <View style={styles.emptyContainer}>
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
    alignItems: "center",
    marginTop: 50,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#fff",
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
