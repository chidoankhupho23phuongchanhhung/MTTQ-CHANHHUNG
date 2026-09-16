// lib/firebase.ts
// Firebase configuration for MTTQ Phường Chánh Hưng

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey:            'AIzaSyBQtowTk48KCJV2NKVnIIiCWEPGSPCXUkg',
  authDomain:        'mttq-5032d.firebaseapp.com',
  projectId:         'mttq-5032d',
  storageBucket:     'mttq-5032d.firebasestorage.app',
  messagingSenderId: '11767850205',
  appId:             '1:11767850205:web:d43d3ef18735116b686734',
  measurementId:     'G-YJ45N56FB3',
};

// Singleton — prevents re-initializing on hot reload
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { app, firebaseConfig };

/* ─── Analytics (client-only — never call on server) ─── */
export async function getFirebaseAnalytics() {
  if (typeof window === 'undefined') return null;
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(app);
}

/* ─── Firestore (lazy-loaded) ─── */
export async function getFirestore() {
  const { getFirestore: _getFirestore } = await import('firebase/firestore');
  return _getFirestore(app);
}

/* ─── Auth (lazy-loaded) ─── */
export async function getAuth() {
  const { getAuth: _getAuth } = await import('firebase/auth');
  return _getAuth(app);
}
