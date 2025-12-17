import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
const userId = 1 //to be change

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost/reeed/testGetBooks.php?userId=${userId}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error("error")
        }

        setBooks(data)
      } catch (err) {
        setError(err.message)
        console.log(err)
      }
    }

    fetchBooksData()
  }, [])

  return (
    <SafeAreaView>
      <View style={styles.listContainer}>
        {books.map((book) => (
          <View key={book.bookId} style={styles.listItem}>
            <Text style={styles.itemText}>{book.bookId}</Text>
            <Text style={styles.itemText}>{book.title}</Text>
            <Text style={styles.bullet}>{book.author}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

export default Books

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  bullet: {
    marginRight: 10,
    fontSize: 16, // Adjust size as needed
    lineHeight: 20, // Ensure alignment with text
  },
  itemText: {
    flex: 1, // Ensures text wraps within its container
    fontSize: 16,
    lineHeight: 20,
  },
})
