/**
 * Firestore Service
 * Generic helper for Firestore CRUD operations
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { logger } from '../utils/logger';

/**
 * Get all documents from a collection
 */
export async function getCollection<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  try {
    const ref = collection(db, collectionName);
    const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
  } catch (error) {
    logger.error(`Error reading collection ${collectionName}`, { error });
    return [];
  }
}

/**
 * Get a single document by ID
 */
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const ref = doc(db, collectionName, docId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as T;
  } catch (error) {
    logger.error(`Error reading doc ${collectionName}/${docId}`, { error });
    return null;
  }
}

/**
 * Set (create or overwrite) a document with a specific ID
 */
export async function saveDocument<T extends Record<string, unknown>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  try {
    const ref = doc(db, collectionName, docId);
    // Remove the `id` field before saving — Firestore uses the doc ID
    const { id: _id, ...rest } = data;
    await setDoc(ref, rest);
  } catch (error) {
    logger.error(`Error writing doc ${collectionName}/${docId}`, { error });
    throw error;
  }
}

/**
 * Delete a document by ID
 */
export async function removeDocument(collectionName: string, docId: string): Promise<void> {
  try {
    const ref = doc(db, collectionName, docId);
    await deleteDoc(ref);
  } catch (error) {
    logger.error(`Error deleting doc ${collectionName}/${docId}`, { error });
    throw error;
  }
}

export { orderBy };
