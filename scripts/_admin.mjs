import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export function init() {
  let creds;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const j = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8"));
    creds = { projectId: j.project_id, clientEmail: j.client_email, privateKey: j.private_key };
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    creds = { projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") };
  } else {
    console.error("Missing Firebase Admin credentials. Fill .env.local (see .env.example).");
    process.exit(1);
  }
  const app = initializeApp({ credential: cert(creds), projectId: creds.projectId });
  console.log(`→ Firebase project: ${creds.projectId}`);
  return { db: getFirestore(app), auth: getAuth(app) };
}
