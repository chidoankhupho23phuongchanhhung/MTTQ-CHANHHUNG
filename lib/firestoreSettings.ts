// lib/firestoreSettings.ts
// Direct Firestore persistence for MTTQ Settings across all environments (Vercel, local, mobile)

import { app } from '@/lib/firebase';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const SETTINGS_COLLECTION = 'system_settings';
const SETTINGS_DOC_ID = 'main';

export async function fetchCloudSettings(): Promise<any | null> {
  try {
    const db = getFirestore(app);
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('[Firestore] Lỗi đọc cài đặt từ Firestore:', err);
  }
  return null;
}

export async function persistCloudSettings(settings: any): Promise<boolean> {
  try {
    const db = getFirestore(app);
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Lỗi ghi cài đặt lên Firestore:', err);
    return false;
  }
}
