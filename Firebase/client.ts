// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics is not used, can be added later

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ88G-Mn8saEs9URb0PtHoTUdElimOZ3c",
  authDomain: "prepwise-78aba.firebaseapp.com",
  projectId: "prepwise-78aba",
  storageBucket: "prepwise-78aba.firebasestorage.app",
  messagingSenderId: "124226274980",
  appId: "1:124226274980:web:8740095c5d0958e4e88831",
  measurementId: "G-W3D8CTJ85N"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app); // You can uncomment this if you need analytics

// Export the initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);

