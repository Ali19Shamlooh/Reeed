import { Text, View } from "@/components/Themed"
import { auth } from "@/firebaseConfig"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Out</Text>
      <TouchableOpacity onPress={() => auth.signOut()}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator, Alert } from 'react-native';
// Import the services we just exported
// This path assumes firebaseConfig.js is in the root, and this file is in app/(tabs)/
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const addTestBook = async () => {
    setLoading(true);
    try {
      // Try to add a fake book to a 'books' collection
      const docRef = await addDoc(collection(db, "books"), {
        title: "Test Book Entry",
        author: "Reeed Admin",
        timestamp: new Date().toISOString(),
      });
      Alert.alert("Success!", `Book saved with ID: ${docRef.id}`);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Could not connect to database. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reeed Database Check</Text>
      <Text style={styles.subtitle}>Click below to send a test signal to Firebase.</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0a7ea4" />
      ) : (
        <Button title="Test Database Connection" onPress={addTestBook} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})
