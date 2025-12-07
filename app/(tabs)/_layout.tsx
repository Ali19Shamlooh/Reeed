import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0a7ea4",
      }}
    >
      {/* 1. Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />

      {/* 2. Library */}
      <Tabs.Screen
        name="library"
        options={{
          title: "My Library",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" color={color} size={size} />
          ),
        }}
      />

      {/* 3. Reviews */}
      <Tabs.Screen
        name="reviews"
        options={{
          title: "Reviews",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="star" color={color} size={size} />
          ),
        }}
      />

      {/* 4. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />

      {/* 5. Menu (was 'two') */}
      <Tabs.Screen
        name="Menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bars" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
