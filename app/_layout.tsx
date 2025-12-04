import { SplashScreen, Stack } from "expo-router"
import { onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { auth } from "../firebaseConfig" // Import your initialized auth service

// Prevent the splash screen from auto-hiding before we fetch the auth state
SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const [user, setUser] = useState<any>(null) // State to hold the user object or null
  const [isAuthReady, setIsAuthReady] = useState(false) // Flag to ensure auth check is complete

  useEffect(() => {
    // 1. Set up the authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // 2. This callback runs immediately, and then every time the user logs in/out.
      setUser(currentUser)
      // Once we have checked the state once, we can hide the splash screen
      if (!isAuthReady) {
        SplashScreen.hideAsync()
        setIsAuthReady(true)
      }
    })

    // 3. Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [])

  // Show a loading screen while we are waiting for the initial Firebase check
  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    )
  }

  // Use the auth state to decide which screen stack to show
  return (
    <Stack>
      {user ? (
        // User is logged in: show the main application flow (tabs, dashboard, etc.)
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        // User is logged out: show the authentication flow
        <Stack.Screen name="(_auth)" options={{ headerShown: false }} />
      )}

      {/* Ensure the initial index file is hidden, as it's not a main auth/tab screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}

// Export the RootLayout as the default export for Expo Router
export default function Layout() {
  return <RootLayout />
}
