import { sendPasswordResetEmail } from "firebase/auth"
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
import { auth } from "../../firebaseConfig"

interface ForgotPasswordProps {
  onBackToLogin: () => void
}

export default function ForgotPasswordComponent({
  onBackToLogin,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      await sendPasswordResetEmail(auth, email)

      // On success, show a success message and allow user to go back to login
      setMessage("Check your email! A password reset link has been sent.")
      Alert.alert("Success", "Password reset email sent.")
    } catch (error: any) {
      console.error(error)
      let errMsg = "Failed to send reset email."
      if (error.code === "auth/user-not-found")
        errMsg = "No account found with this email."
      if (error.code === "auth/invalid-email") errMsg = "Invalid email format."
      Alert.alert("Error", errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive a reset link.
      </Text>

      {message ? <Text style={styles.successText}>{message}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9ca3af"
      />

      <Button
        title={loading ? "Sending..." : "Send Reset Link"}
        onPress={handleReset}
        disabled={loading}
        color="#1e3a8a"
      />

      <TouchableOpacity onPress={onBackToLogin} style={styles.link}>
        <Text style={styles.linkText}>Back to Login</Text>
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
  successText: {
    color: "#16a34a",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
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
  },
})
