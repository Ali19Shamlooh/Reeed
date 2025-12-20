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
import { auth } from "../../firebaseConfig"

// [UPDATE] Accepts props to handle switching to Register and Forgot Password views
interface LoginComponentProps {
  onSwitchToRegister: () => void
  onSwitchToForgotPassword: () => void
}

const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default function LoginComponent({
  onSwitchToRegister,
  onSwitchToForgotPassword,
}: LoginComponentProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")

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
      // Success triggers listener in app/index.tsx for redirection
    } catch (firebaseError: any) {
      // Firebase Error Handling (Mapping common codes to friendly messages)
      let errorMessage = "An unexpected error occurred. Please try again."
      switch (firebaseError.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
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
        }}
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
        }}
        secureTextEntry
        placeholderTextColor="#9ca3af"
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
        color="#1e3a8a"
      />

      {/* [NEW LINK] Calls the prop handler to switch the view state in app/index.tsx */}
      <TouchableOpacity
        onPress={onSwitchToForgotPassword}
        style={styles.forgotLink}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

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
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 20,
  },
  forgotText: {
    color: "#6b7280",
    fontSize: 14,
  },
  link: {
    marginTop: 10,
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
