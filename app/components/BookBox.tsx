import FontAwesome from "@expo/vector-icons/FontAwesome"
import React from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

type BookResult = {
  [x: string]: Key | null | undefined
  id: string
  title: string
  authors: string
  thumbnail?: string | null
}

type Props = {
  books: BookResult[]
  onPressBook: (book: BookResult) => void
}

const fetchImage = async (imageUrl: string) => {
  return await fetch(imageUrl)
}
export default function BookBox({ books, onPressBook }: Props) {
  if (!books.length) return null

  return (
    <View style={styles.resultsCard}>
      <Text style={styles.resultsTitle}>Books</Text>

      <View style={styles.grid}>
        {books.map((b) => (
          <Pressable
            key={b.bookId}
            onPress={() => onPressBook(b)}
            style={styles.bookItem}
          >
            {b.thumbnail ? (
              <Image source={{ uri: b.thumbnail }} style={styles.cover} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <FontAwesome name="book" size={18} color="#9CA3AF" />
                <Text style={styles.noCoverText}>No cover</Text>
              </View>
            )}

            <Text style={styles.bookTitle} numberOfLines={2}>
              {b.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  resultsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bookItem: {
    width: "31%",
    marginBottom: 14,
  },
  cover: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  coverPlaceholder: {
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  noCoverText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  bookTitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "700",
  },
})
