import { Ionicons } from "@expo/vector-icons" // We'll use Ionicons for simplicity
import { Tabs } from "expo-router"
import React from "react"
import { Platform } from "react-native"

const TAB_ICON_SIZE = 24

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // We will manage headers on individual screens
        tabBarActiveTintColor: "#1e3a8a", // Dark blue for active tab
        tabBarInactiveTintColor: "#9ca3af", // Gray for inactive tab
        tabBarStyle: {
          // Apply a slight shadow or border to lift the tab bar
          paddingTop: Platform.OS === "ios" ? 10 : 0,
          paddingBottom: Platform.OS === "ios" ? 20 : 5,
          height: Platform.OS === "ios" ? 85 : 60,
        },
      }}
    >
      <Tabs.Screen
        name="index" // This is the default screen (Dashboard)
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library" // We will create this file next
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // We will create this file next
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-circle-outline"
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />

      {/* This is a common pattern in Expo Router:
        The 'modal' route is not part of the bottom tabs.
        It will be used for actions like 'Upload Book' (UC-2).
        The file is named 'upload-book.tsx' but its path is relative to the (tabs) folder.
      */}
      <Tabs.Screen
        name="upload-book"
        options={{
          href: null, // Hide this tab from the tab bar
          headerShown: true,
          title: "Upload New Book", // Title for the modal header
        }}
      />
    </Tabs>
  )
}
