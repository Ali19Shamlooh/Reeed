import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, Stack, useFocusEffect } from "expo-router"
import React, { useCallback, useState } from "react"
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { auth } from "../../firebaseConfig"
import BookBox from "../components/BookBox"

const BASE_URL =
  Platform.OS === "web" ? "http://localhost/reeed" : "http://10.60.11.1/reeed"

type LibraryBook = {
  bookId: number
  title: string
  author: string
  googleId: string
}

type Category = {
  id: number
  name: string
}

async function fetchJson(url: string) {
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) throw new Error(text)
  if (text.trim().startsWith("<"))
    throw new Error("Server returned HTML instead of JSON")
  return JSON.parse(text)
}

export default function LibraryScreen() {
  const [bookDetails, setBookDetails] = useState<LibraryBook[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
  const [userId, setUserId] = useState<number | null>(null)

  useFocusEffect(
    useCallback(() => {
      init()
    }, [])
  )

  const init = async () => {
    const user = auth.currentUser
    if (!user?.uid) return

    const dbUser = await fetchJson(
      `${BASE_URL}/getUserId.php?fireId=${encodeURIComponent(user.uid)}`
    )

    setUserId(dbUser.uId)
    await fetchCategories(dbUser.uId)
    await fetchBooks(dbUser.uId, 0)
  }

  const fetchCategories = async (uId: number) => {
    const res = await fetchJson(
      `${BASE_URL}/getUserCategories.php?userId=${uId}`
    )

    // Extract categories safely
    const catsArray = Array.isArray(res?.categories) ? res.categories : []

    setCategories([{ id: 0, name: "All" }, ...catsArray])
  }

  const fetchBooks = async (uId: number, categoryId: number) => {
    const url =
      categoryId === 0
        ? `${BASE_URL}/getLibraryBooks.php?userId=${uId}`
        : `${BASE_URL}/getUserBooksByCategory.php?userId=${uId}&categoryId=${categoryId}`

    const books = await fetchJson(url)
    setBookDetails(Array.isArray(books) ? books : [])
  }

  const addCategory = () => {
    Alert.prompt("New Category", "Enter category name", async (name) => {
      if (!name || !userId) return

      await fetchJson(
        `${BASE_URL}/addUserCategory.php?userId=${userId}&name=${encodeURIComponent(
          name
        )}`
      )

      fetchCategories(userId)
    })
  }

  const openBook = async (b: LibraryBook) => {
    if (b.googleId === "LOCAL") {
      const uri = await AsyncStorage.getItem(`book_file_${b.bookId}`)
      if (!uri) return Alert.alert("File missing")
      router.push({ pathname: "/reader", params: { uri } })
      return
    }

    router.push({ pathname: "/BookDetails", params: { id: b.googleId } })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Stack.Screen
          options={{
            title: "My Library",
            headerLargeTitle: true,
            headerRight: () => (
              <TouchableOpacity onPress={addCategory}>
                <Ionicons name="add-circle-outline" size={30} color="#1e3a8a" />
              </TouchableOpacity>
            ),
          }}
        />
        {/* Add Category Button */}
        <TouchableOpacity style={styles.addCategoryBtn} onPress={addCategory}>
          <Text style={styles.addCategoryText}>+ Add Category</Text>
        </TouchableOpacity>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        ></ScrollView>
        {categories.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 20, marginVertical: 10 }}
          >
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.categoryBtn,
                  selectedCategoryId === c.id && styles.activeCategory,
                ]}
                onPress={() => {
                  setSelectedCategoryId(c.id)
                  if (userId) fetchBooks(userId, c.id)
                }}
              >
                <Text
                  style={{
                    color: selectedCategoryId === c.id ? "#fff" : "#000",
                    fontWeight: "500",
                  }}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#6b7280" }}>
              You don’t have any categories yet.
            </Text>
          </View>
        )}
        <Text style={styles.header}>Books ({bookDetails.length})</Text>

        {bookDetails.length > 0 ? (
          <BookBox books={bookDetails} onPressBook={openBook} />
        ) : (
          <Text style={styles.emptyText}>No books in this category</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginHorizontal: 6,
    marginVertical: 10,
  },
  activeCategory: {
    backgroundColor: "#1e3a8a",
  },
  addCategoryBtn: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginHorizontal: 20,
    marginTop: 10,
  },
  addCategoryText: {
    color: "#fff",
    fontWeight: "600",
  },
})
