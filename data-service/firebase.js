import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwCS1Q0Hfi1i-zUu5q01hAMQqhhpzBDf8",
  authDomain: "smart-carpool-c3687.firebaseapp.com",
  projectId: "smart-carpool-c3687",
  storageBucket: "smart-carpool-c3687.firebasestorage.app",
  messagingSenderId: "69855439872",
  appId: "1:69855439872:web:c8ef6b28650ee96fb9bce5",
  measurementId: "G-V94X9N1091"
};
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);