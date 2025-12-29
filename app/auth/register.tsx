import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { auth, db } from "../../firebaseConfig"

const BASE_URL =
  Platform.OS === "web" ? "http://localhost/reeed" : "http://10.60.11.1/reeed"

interface RegisterComponentProps {
  onSwitchToLogin: () => void
}

const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default function RegisterComponent({
  onSwitchToLogin,
}: RegisterComponentProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async () => {
    setError("")

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      await updateProfile(user, { displayName: name })

      // Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        readingGoal: 30,
        currentStreak: 0,
        totalBooksRead: 0,
        createdAt: new Date().toISOString(),
      })

      // ✅ Add user to MySQL
      const mysqlRes = await fetch(
        `${BASE_URL}/addUserToMysql.php?userId=${encodeURIComponent(
          user.uid
        )}&email=${encodeURIComponent(
          email
        )}&type=normal&fullName=${encodeURIComponent(name)}`
      )
      const mysqlData = await mysqlRes.json()
      console.log("MySQL API response:", mysqlData)

      Alert.alert("Success", `Welcome, ${name}! Your account is ready.`)
    } catch (firebaseError: any) {
      let errorMessage =
        "An unexpected error occurred during registration. Please try again."

      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This email address is already in use by another account."
          break
        case "auth/invalid-email":
          errorMessage = "The email address format is invalid."
          break
        case "auth/weak-password":
          errorMessage =
            "The password is too weak. Please choose a stronger password."
          break
        default:
          console.error("Firebase Registration Error:", firebaseError)
      }
      setError(errorMessage)
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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={(text) => {
          setName(text)
          setError("")
        }}
        placeholderTextColor="#9ca3af"
      />
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
        placeholder="Password (min 6 chars)"
        value={password}
        onChangeText={(text) => {
          setPassword(text)
          setError("")
        }}
        secureTextEntry
        placeholderTextColor="#9ca3af"
      />

      <Button
        title={loading ? "Creating Account..." : "Register"}
        onPress={handleRegister}
        disabled={loading}
        color="#0a7ea4"
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
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
})
