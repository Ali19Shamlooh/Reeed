import { SplashScreen, Stack } from "expo-router"
import { onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { auth } from "../firebaseConfig"

SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isAuthReady) {
        SplashScreen.hideAsync()
        setIsAuthReady(true)
      }
    })
    return () => unsubscribe()
  }, [])

  if (!isAuthReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#eef2ff",
        }}
      >
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    )
  }

  return (
    // FIX: Apply 'headerShown: false' globally to screenOptions.
    // This removes the native header bar from ALL screens in the stack.
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

export default function Layout() {
  return <RootLayout />
}
