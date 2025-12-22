import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

const TAB_ICON_SIZE = 24;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1e3a8a",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          paddingTop: Platform.OS === "ios" ? 10 : 0,
          paddingBottom: Platform.OS === "ios" ? 20 : 5,
          height: Platform.OS === "ios" ? 85 : 60,
        },
      }}
    >
      {/* Dashboard */}
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />

      {/* Library */}
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />



      {/* Search */}
      <Tabs.Screen
        name="Search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="search-outline"
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      {/* 🔥 Leaderboard */}
      <Tabs.Screen
        name="Leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="trophy-outline"
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      
      {/* Profile */}
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
    </Tabs>
  );
}
