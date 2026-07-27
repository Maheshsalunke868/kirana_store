import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdZQq9kBwQ-k4GgJkxLtlRYWDn93BLmWc",
  authDomain: "kiranastore-50caa.firebaseapp.com",
  projectId: "kiranastore-50caa",
  storageBucket: "kiranastore-50caa.firebasestorage.app",
  messagingSenderId: "938465026733",
  appId: "1:938465026733:web:e5341389c4d5995ccb1c24",
  measurementId: "G-01VYZMYF84"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Checking connection to Firebase project: kiranastore-50caa ...");

async function testConnection() {
  try {
    const snap = await getDocs(collection(db, "categories"));
    console.log("--------------------------------------------------");
    console.log("SUCCESS: Firebase Database is Connected & Accessible!");
    console.log(`Documents count in 'categories' collection: ${snap.docs.length}`);
    console.log("--------------------------------------------------");
    process.exit(0);
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.log("--------------------------------------------------");
      console.log("STATUS: Firebase Connected, BUT Firestore Rules are Blocking Access.");
      console.log("FIX REQUIRED: Go to Firebase Console -> Firestore Database -> Rules tab");
      console.log("Set rules to: allow read, write: if true;");
      console.log("Link: https://console.firebase.google.com/project/kiranastore-50caa/firestore/rules");
      console.log("--------------------------------------------------");
    } else {
      console.error("FIREBASE CONNECTION ERROR:", error.code, error.message);
    }
    process.exit(1);
  }
}

testConnection();
