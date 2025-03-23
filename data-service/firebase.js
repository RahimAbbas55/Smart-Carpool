// main application
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
  measurementId: "G-V94X9N1091",

};
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

// backup application
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBlA6U_fYG07xDZ_MsSiQHqNc2t0GnYNTA",
//   authDomain: "smart-carpool-backup.firebaseapp.com",
//   projectId: "smart-carpool-backup",
//   storageBucket: "smart-carpool-backup.firebasestorage.app",
//   messagingSenderId: "1081491118558",
//   appId: "1:1081491118558:web:22bfd2a3274de6a32e254f",
//   measurementId: "G-8L03G1HL5R"

// };
// export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
// export const db = getFirestore(app);