import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// NOTE: This file is for SERVER-SIDE use only (e.g., in server actions)
// It uses environment variables and should not be imported into client components.

const initFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Ensure the private key environment variable is correctly formatted
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
      });
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore()
  };
};

export const { auth, db } = initFirebaseAdmin();

