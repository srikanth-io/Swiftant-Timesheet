import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyB63x7qhObJS6PZf_B8CpGtLUk1VDqhE_M",
  authDomain: "swiftant-timesheet.firebaseapp.com",
  projectId: "swiftant-timesheet",
  storageBucket: "swiftant-timesheet.firebasestorage.app",
  messagingSenderId: "845230882308",
  appId: "1:845230882308:web:942e85a5b3f5d40610ff51",
  measurementId: "G-26QYGZJD7F"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);