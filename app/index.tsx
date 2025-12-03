import React, { useState } from "react"
import {
  Text,
  Touchable,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
} from "react-native"
import { auth } from "../firebaseConfig.js"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

const Index = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) router.replace("/(tabs)")
    } catch (error) {
      console.log(error)
      alert("Sign In Failed" + error.message)
    }
  }
  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) router.replace("/(tabs)")
    } catch (error) {
      console.log(error)
      alert("Sign In Failed" + error.message)
    }
  }

  return (
    <SafeAreaView style={style.container}>
      <Text>Login</Text>
      <TextInput placeholder="email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={signIn}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signUp}>
        <Text>Make Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Index

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
})
