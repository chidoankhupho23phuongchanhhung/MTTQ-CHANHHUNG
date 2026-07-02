"use client";

import { useEffect } from 'react';
import { getFirebaseAnalytics } from '@/lib/firebase';

/**
 * Silently initialises Firebase Analytics on first client render.
 * Renders nothing — purely a side-effect component.
 */
export default function FirebaseInit() {
  useEffect(() => {
    getFirebaseAnalytics().catch(() => {
      // Analytics not supported in this browser — silently ignore
    });
  }, []);

  return null;
}
