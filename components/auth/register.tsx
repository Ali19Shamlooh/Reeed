import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { auth, db } from "../../firebaseConfig" // Access both services

// Define a type for the component's props
interface RegisterComponentProps {
  onSwitchToLogin: () => void
}

export default function RegisterComponent({
  onSwitchToLogin,
}: RegisterComponentProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Function to handle the registration and initial data setup
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.")
      return
    }

    setLoading(true)
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      // 2. Set the display name
      await updateProfile(user, { displayName: name })

      // 3. Create the initial user document in Firestore (for tracking goals/stats)
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        readingGoal: 30, // Default pages per day
        currentStreak: 0,
        totalBooksRead: 0,
        createdAt: new Date().toISOString(),
      })

      Alert.alert("Success", `Welcome, ${name}! Your account is ready.`)
      // Success is handled by the onAuthStateChanged listener in _layout.tsx
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message)
      console.error("Registration Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Reeed</Text>
      <Text style={styles.subtitle}>
        Start tracking your reading journey today.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#9ca3af"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9ca3af"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 chars)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#9ca3af"
      />

      <Button
        title={loading ? "Creating Account..." : "Register"}
        onPress={handleRegister}
        disabled={loading}
        color="#0a7ea4" // Secondary action color
      />

      <TouchableOpacity onPress={onSwitchToLogin} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0a7ea4"
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0a7ea4",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9fafb",
    color: "#374151",
  },
  link: {
    marginTop: 20,
    padding: 5,
    alignSelf: "center",
  },
  linkText: {
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
})
