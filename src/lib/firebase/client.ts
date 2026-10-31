"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";

/** Client SDK is used only on the staff login screen; the ID token is immediately exchanged for an httpOnly session cookie. */
export function clientAuth() {
  const app = getApps()[0] ?? initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  const auth = getAuth(app);
  void setPersistence(auth, inMemoryPersistence);
  return auth;
}
