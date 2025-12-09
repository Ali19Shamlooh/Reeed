import { router } from "expo-router"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { auth } from "../firebaseConfig"
// FIX: Updated imports to match lowercase filenames shown in your screenshot
import ForgotPasswordComponent from "./auth/forgot-password"
import LoginComponent from "./auth/login"
import RegisterComponent from "./auth/register"

type ViewState = "login" | "register" | "forgotPassword"
export default function Home() {
  // Use 'undefined' to explicitly track when the authentication state check is pending.
  const [user, setUser] = useState<User | null | undefined>(undefined)

  const [viewState, setViewState] = useState<ViewState>("login")
  useEffect(() => {
    // Set up the Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(
        "Auth State Changed in Index:",
        currentUser ? "User Logged In" : "User Logged Out"
      )
      setUser(currentUser)

      if (currentUser) {
        // User is signed in: Redirect to the dashboard (tabs)
        // We use replace to prevent back-navigation to the login screen

        router.replace("./(tabs)/Home")
      }
      // If currentUser is null, we stay here and render the Login UI.
    })

    // Clean up the listener on component unmount
    return () => unsubscribe()
  }, [])

  // 1. LOADING STATE
  if (user === undefined) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    )
  }

  // 2. AUTHENTICATED STATE (Redirecting)
  // If user is logged in, show a loader while the router redirects to tabs
  if (user) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Redirecting to Dashboard...</Text>

        {/* SAFETY VALVE: If the app gets stuck here or redirects wrongly, this button forces a logout */}
        <View style={{ marginTop: 20 }}>
          <Button
            title="Stuck? Force Logout"
            color="#ef4444"
            onPress={() => signOut(auth).then(() => setUser(null))}
          />
        </View>
      </View>
    )
  }

  const renderContent = () => {
    switch (viewState) {
      case "register":
        // Renders Register, provides handler to switch back to Login
        return (
          <RegisterComponent onSwitchToLogin={() => setViewState("login")} />
        )
      case "forgotPassword":
        // Renders Forgot Password, provides handler to switch back to Login
        return (
          <ForgotPasswordComponent
            onBackToLogin={() => setViewState("login")}
          />
        )
      case "login":
      default:
        return (
          // Renders Login, provides handlers to switch to Register or Forgot Password
          <LoginComponent
            onSwitchToRegister={() => setViewState("register")}
            onSwitchToForgotPassword={() => setViewState("forgotPassword")}
          />
        )
    }
  }
  // 3. UNAUTHENTICATED STATE (Show Login/Register)
  // If we reach here, user is confirmed to be null (Logged Out).
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {renderContent()} {/* Renders the currently active component */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Using a distinct light blue color to differentiate from Dashboard
    backgroundColor: "#eff6ff",
  },
  headerContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e3a8a",
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    paddingBottom: 100, // Push content up slightly
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
})
