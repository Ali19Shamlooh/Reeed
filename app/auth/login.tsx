import { router } from "expo-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { auth } from "../../firebaseConfig" // Access the auth instance

// Define a type for the component's props
interface LoginComponentProps {
  onSwitchToRegister: () => void
}

// Simple email validation regex
const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default function LoginComponent({
  onSwitchToRegister,
}: LoginComponentProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Handle the login process
  const handleLogin = async () => {
    setError("") // Clear previous error

    // Client-Side Validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Success is handled by the onAuthStateChanged listener in app/index.tsx
    } catch (firebaseError: any) {
      // Firebase Error Handling (Mapping common codes to friendly messages)
      let errorMessage = "An unexpected error occurred. Please try again."

      switch (firebaseError.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password."
          break
        case "auth/invalid-email":
          errorMessage = "The email address format is invalid."
          break
        case "auth/user-disabled":
          errorMessage = "Your account has been disabled."
          break
        default:
          console.error("Firebase Login Error:", firebaseError)
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
      router.navigate("../(tabs)/Home")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Sign in to access your library and stats.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text)
          setError("")
        }} // Clear error on change
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9ca3af"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text)
          setError("")
        }} // Clear error on change
        secureTextEntry
        placeholderTextColor="#9ca3af"
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
        color="#1e3a8a" // Primary brand color
      />

      <TouchableOpacity onPress={onSwitchToRegister} style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? Register Now</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#1e3a8a"
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
    color: "#1e3a8a",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "600",
    paddingHorizontal: 10,
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
    color: "#0a7ea4",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
})
