import { StyleSheet, TouchableOpacity } from "react-native"
import { Text, View } from "@/components/Themed"
import { auth } from "../../firebaseConfig.js"
import { getAuth } from "firebase/auth"

export default function TabOneScreen() {
  getAuth //start Here //video time 3:00 //https://www.youtube.com/watch?v=a0KJ7l5sNGw
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Out</Text>
      <TouchableOpacity onPress={() => auth.signOut()}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})
