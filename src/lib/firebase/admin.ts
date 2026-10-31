import "server-only";
import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

let app: App | null | undefined;

function credentials(): ServiceAccount | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (b64) {
    const json = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    return { projectId: json.project_id, clientEmail: json.client_email, privateKey: json.private_key };
  }
  const { FIREBASE_PROJECT_ID: projectId, FIREBASE_CLIENT_EMAIL: clientEmail, FIREBASE_PRIVATE_KEY: key } = process.env;
  if (projectId && clientEmail && key) return { projectId, clientEmail, privateKey: key.replace(/\\n/g, "\n") };
  return null;
}

/** Returns the Firebase Admin app, or null when the server is not configured (site falls back to bundled content). */
export function adminApp(): App | null {
  if (app !== undefined) return app;
  const existing = getApps()[0];
  if (existing) return (app = existing);
  const creds = credentials();
  if (!creds) return (app = null);
  app = initializeApp({
    credential: cert(creds),
    projectId: creds.projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${creds.projectId}.appspot.com`,
  });
  return app;
}

export const isFirebaseConfigured = () => adminApp() !== null;

export function db(): Firestore {
  const a = adminApp();
  if (!a) throw new Error("FIREBASE_NOT_CONFIGURED");
  return getFirestore(a);
}
export function adminAuth(): Auth {
  const a = adminApp();
  if (!a) throw new Error("FIREBASE_NOT_CONFIGURED");
  return getAuth(a);
}
export function bucket(): ReturnType<Storage["bucket"]> {
  const a = adminApp();
  if (!a) throw new Error("FIREBASE_NOT_CONFIGURED");
  return getStorage(a).bucket();
}

/** Collection names (Section 17). */
export const C = {
  users: "users",
  settings: "school_settings",
  levels: "academic_levels",
  enquiries: "admission_enquiries",
  statusHistory: "admission_status_history",
  appointments: "appointments",
  announcements: "announcements",
  publicDocuments: "public_documents",
  consents: "consent_records",
  audit: "audit_logs",
  notifications: "notification_jobs",
  rateLimits: "rate_limits",
  idempotency: "idempotency_keys",
  counters: "counters",
} as const;
