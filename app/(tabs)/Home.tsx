import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native"
// Import the services we just exported
// This path assumes firebaseConfig.js is in the root, and this file is in app/(tabs)/
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../firebaseConfig"

const userId = 1 //to be change

export default function HomeScreen() {
  const [loading, setLoading] = useState(false)
  const [statics, setStatics] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStatics = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost/reeed/getFinishedBooks.php?userId=${userId}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error("error")
        }

        setStatics(data)
      } catch (err) {
        setError(err.message)
        console.log(err)
      }
    }

    fetchStatics()
  }, [])

  const addTestBook = async () => {
    setLoading(true)
    try {
      // Try to add a fake book to a 'books' collection
      const docRef = await addDoc(collection(db, "books"), {
        title: "Test Book Entry",
        author: "Reeed Admin",
        timestamp: new Date().toISOString(),
      })
      Alert.alert("Success!", `Book saved with ID: ${docRef.id}`)
    } catch (error: any) {
      console.error(error)
      Alert.alert(
        "Error",
        "Could not connect to database. Check console for details."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reeed Database Check</Text>
      <Text style={styles.subtitle}>
        Click below to send a test signal to Firebase.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0a7ea4" />
      ) : (
        <Button title="Test Database Connection" onPress={addTestBook} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
})
