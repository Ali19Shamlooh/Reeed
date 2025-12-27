import { SplashScreen, Stack } from "expo-router"
import { onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Platform, View } from "react-native"
import { auth } from "../firebaseConfig"

// ✅ Notifications
import * as Notifications from "expo-notifications"

SplashScreen.preventAutoHideAsync()

// ✅ Show notifications even when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }
  },
})


function RootLayout() {
  const [isAuthReady, setIsAuthReady] = useState(false)

  // ✅ Fast & easy daily reminder
  const setupDailyReadingReminder = async () => {
    try {
      const permission = await Notifications.requestPermissionsAsync()
      if (permission.status !== "granted") return

      // Android needs channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        })
      }

      // Prevent duplicate notifications
      await Notifications.cancelAllScheduledNotificationsAsync()

      // ⏰ Every day at 9 PM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reading Goal 📚",
          body: "You haven't completed your reading goal today.",
        },
        trigger: {
          hour: 21,
          minute: 0,
          repeats: true,
        },
      })
    } catch (e) {
      console.log("Notification error:", e)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isAuthReady) {
        // ✅ schedule reminder once after login
        await setupDailyReadingReminder()

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

export default function Layout() {
  return <RootLayout />
}
