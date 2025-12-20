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
        name="Home" // This is the default screen (Dashboard)
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
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
      <Tabs.Screen
        name="LeaderBoard"
        options={{
          title: "LeaderBoard",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-circle-outline"
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
