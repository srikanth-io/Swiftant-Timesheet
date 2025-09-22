import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
// import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

// Firebase init (make sure you initialize Firebase elsewhere in your project)
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export const settingsController = {
  async getAccountDetails() {
    const user = auth.currentUser;
    if (!user) return null;

    const docRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  },

  async updateProfilePicture(base64: string): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
    await uploadString(storageRef, base64, "base64");
    const downloadUrl = await getDownloadURL(storageRef);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { photoUrl: downloadUrl });

    return downloadUrl;
  },

  async updateUsername(newUsername: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { username: newUsername });
  },

  // async enableNotifications() {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   if (status !== "granted") {
  //     alert("Notification permissions not granted!");
  //     return;
  //   }
  //   const token = (await Notifications.getExpoPushTokenAsync()).data;
  //   console.log("Expo Push Token:", token);
  //   alert("Notifications enabled!");
  // },

//   async shareApp() {
//     const content = "Hey! Check out this cool app 🚀";
//     // const fileUri = FileSystem.cacheDirectory + "share.txt";
//     await FileSystem.writeAsStringAsync(fileUri, content);

//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(fileUri);
//     } else {
//       alert("Sharing not available on this device");
//     }
//   },

  async logout() {
    await signOut(auth);
    alert("Logged out successfully");
  },
};
