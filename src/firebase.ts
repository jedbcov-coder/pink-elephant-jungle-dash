import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: The app will break without this line
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    if (typeof window !== "undefined" && window.self !== window.top) {
      throw new Error("Save blocked: Popups are restricted in the preview pane. Please use the 'Open in new tab' button (↗️) in the top right to save your score.");
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (!error.message?.includes("Popups are restricted")) {
      console.error("Login failed", error);
    }
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function submitScore(score: number, displayName: string) {
  const path = 'scores';
  try {
    if (!auth.currentUser) throw new Error("Must be logged in to submit score");
    await addDoc(collection(db, path), {
      uid: auth.currentUser.uid,
      displayName: displayName || "Unknown Elephant",
      score,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchTopScores(maxScores: number = 10) {
  const path = 'scores';
  try {
    const q = query(
      collection(db, path),
      orderBy('score', 'desc'),
      limit(maxScores)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
