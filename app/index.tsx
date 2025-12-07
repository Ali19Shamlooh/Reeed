import { Redirect, Stack } from "expo-router"
import { onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { auth } from "../firebaseConfig"; // Import your initialized auth service

// Import the components we just created
import LoginComponent from "../components/auth/login"
import RegisterComponent from "../components/auth/register"

export default function IndexScreen() {
  const [user, setUser] = useState<any>(null) // null means checking/logged out, object means logged in
  const [isLoading, setIsLoading] = useState(true) // Initial load flag
  const [isLoginView, setIsLoginView] = useState(true) // Toggle between Login and Register

  // This useEffect mimics the listener from _layout, but specifically for this index file
  // to determine if we should redirect the user.
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    return () => unsubscribe() // Cleanup the listener
  }, [])

  // Custom function to toggle between the two forms
  const toggleView = () => setIsLoginView(!isLoginView)

  // --- RENDERING LOGIC ---

  // 1. Show loading screen while Firebase checks auth status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Loading application state...</Text>
      </View>
    )
  }

  // 2. If user is logged in, redirect them to the main tabs (Dashboard)
  if (user) {
    // We redirect the user to the default tabs screen
    return <Redirect href="/(tabs)" />
  }

  // 3. If user is logged out, show the login or register form
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen options={{ title: "Reeed", headerShown: false }} />
      <View style={styles.contentContainer}>
        {isLoginView ? (
          <LoginComponent onSwitchToRegister={toggleView} />
        ) : (
          <RegisterComponent onSwitchToLogin={toggleView} />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1e3a8a",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#e0f2fe", // Light blue background for auth screen
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
})
