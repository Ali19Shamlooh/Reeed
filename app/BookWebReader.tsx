import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { auth } from "../firebaseConfig";
const BASE_URL =
Platform.OS == "web"?
"http://localhost/reeed"
: 'http://10.60.11.1/reeed'

const BACKGROUND_COLOR = "#F9FAFB";
const TEXT_COLOR = "#1F2937";
const PRIMARY_COLOR = "#0a7ea4";

export default function BookWebReader() {
  const router = useRouter();
  const { url, title, bookId, start_time } = useLocalSearchParams<{ url: string; title?: string; bookId: string, start_time: string}>();

  const [showPopup, setShowPopup] = useState(false);
  const [pageNumber, setPageNumber] = useState("");

  const getMysqlDateTime = () => {
    return new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  };

  const startingtime = start_time;
  console.log( "startingtime = " + startingtime)



  if (!url) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.error}>Missing reader URL.</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

   // ✅ safer JSON helper
  const safeJson = (text: string) => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const onFinishReading = () => {
    setPageNumber("");
    setShowPopup(true);
  };

  const savePageNumber = async () => {
    if (!pageNumber.trim()) return;

    // ✅ Later connect to DB
    console.log("Stopped at page:", pageNumber);





    try {

          const endingtime = getMysqlDateTime();
          console.log("endingtime = " + endingtime);

          // ✅ must be logged in
          const user = auth.currentUser;
          if (!user?.uid) {
            Alert.alert("Error", "You are not logged in.");
            router.push("/login"); // change route if yours is different
            return;
          }

          // ✅ get DB uId using firebase uid
          const getUserIdUrl = `${BASE_URL}/getUserId.php?fireId=${encodeURIComponent(user.uid)}`;
          console.log("getUserIdUrl:", getUserIdUrl);

          const userIdRes = await fetch(getUserIdUrl);
          const userIdText = await userIdRes.text();
          console.log("getUserId status:", userIdRes.status);
          console.log("getUserId raw:", userIdText);

          const dbId = safeJson(userIdText);
          const dbUserId = dbId?.uId;

          if (!userIdRes.ok || !dbUserId) {
            throw new Error(dbId?.error || "User id not found in database.");
          }



          const insertUrl =
            `${BASE_URL}/addreadinglog.php?` +
            `&startingtime=${encodeURIComponent(String(startingtime))}` +
            `&endingtime=${encodeURIComponent(String(endingtime))}` +
            `&pageNumber=${encodeURIComponent(pageNumber)}` +
            `&googleId=${encodeURIComponent(bookId)}` +
            `&userId=${encodeURIComponent(String(dbUserId))}` ;

          console.log("insertUrl:", insertUrl);

          const res = await fetch(insertUrl);
          const text = await res.text();
          console.log("insert status:", res.status);
          console.log("insert raw:", text);

          const data = safeJson(text);

          if (!res.ok) {
            throw new Error(data?.error || "Request failed (addreadinglog.php).");
          }

          if (data?.error) {
            throw new Error(data.error);
          }

          Alert.alert("Saved", `Readig Book "${title}" log saved successfully as well as bookmark`);
          console.log(data)
        } catch (error: any) {
          Alert.alert("Error", error?.message ?? "Could not save reading log ");
        }

    setShowPopup(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBack}>
          <FontAwesome name="chevron-left" size={18} color={TEXT_COLOR} />
          <Text style={styles.headerBackText}>Back</Text>
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title ?? "Reader"}
        </Text>


        {/* ✅ Finish Button */}
        <Pressable onPress={onFinishReading} style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>Finish</Text>
        </Pressable>
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: String(url) }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={styles.loadingText}>Loading book...</Text>
          </View>
        )}
      />

      {/* ✅ Popup */}
      <Modal transparent visible={showPopup} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Finish Reading</Text>
            <Text style={styles.modalText}>
              Enter the page number you stopped at
            </Text>

            <TextInput
              value={pageNumber}
              onChangeText={setPageNumber}
              keyboardType="number-pad"
              placeholder="e.g. 45"
              style={styles.input}
            />

            <View style={styles.modalRow}>
              <Pressable
                onPress={() => setShowPopup(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable onPress={savePageNumber} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },

  header: {
    height: 52,
    backgroundColor: BACKGROUND_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
  },
  headerBack: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerBackText: { color: TEXT_COLOR, fontSize: 15, fontWeight: "500" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    color: TEXT_COLOR,
  },

  finishBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  finishBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  loadingOverlay: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, color: "#6B7280" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: TEXT_COLOR },
  modalText: { fontSize: 13, color: "#6B7280", marginTop: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },

  modalRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: { fontWeight: "700", color: TEXT_COLOR },
  saveText: { fontWeight: "700", color: "#fff" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: TEXT_COLOR, marginBottom: 12 },
  backBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: { color: "#fff", fontWeight: "700" },
});

