import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_REVIEWS 
} from '../data/mockData';

// Collections mapping
export const COLLECTIONS = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  REVIEWS: 'reviews'
};

/**
 * Seed Firebase Firestore with initial mock data if collections are empty.
 */
export const seedInitialDataIfEmpty = async () => {
  try {
    const seedCollection = async (collName, initialItems) => {
      const snap = await getDocs(collection(db, collName));
      if (snap.empty && initialItems && initialItems.length > 0) {
        console.log(`Seeding ${collName} into Firebase Firestore...`);
        for (const item of initialItems) {
          const docId = String(item.id);
          await setDoc(doc(db, collName, docId), item);
        }
      }
    };

    await Promise.all([
      seedCollection(COLLECTIONS.CATEGORIES, INITIAL_CATEGORIES),
      seedCollection(COLLECTIONS.PRODUCTS, INITIAL_PRODUCTS),
      seedCollection(COLLECTIONS.ORDERS, INITIAL_ORDERS),
      seedCollection(COLLECTIONS.CUSTOMERS, INITIAL_CUSTOMERS),
      seedCollection(COLLECTIONS.REVIEWS, INITIAL_REVIEWS)
    ]);
  } catch (error) {
    console.warn("Firestore seeding notice (if rules are restricted):", error);
  }
};

/**
 * Subscribe to real-time updates for a Firestore collection
 */
export const subscribeToCollection = (collName, onUpdate, onError) => {
  try {
    const collRef = collection(db, collName);
    return onSnapshot(
      collRef,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        onUpdate(items);
      },
      (err) => {
        console.warn(`Firestore subscription error for ${collName}:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn(`Failed to set up listener for ${collName}:`, err);
    return () => {};
  }
};

/**
 * Save or update a document in Firestore
 */
export const saveItemToFirestore = async (collName, item) => {
  try {
    const docId = String(item.id);
    await setDoc(doc(db, collName, docId), item, { merge: true });
    return true;
  } catch (err) {
    console.error(`Error saving item to ${collName}:`, err);
    return false;
  }
};

/**
 * Delete a document from Firestore
 */
export const deleteItemFromFirestore = async (collName, id) => {
  try {
    const docId = String(id);
    await deleteDoc(doc(db, collName, docId));
    return true;
  } catch (err) {
    console.error(`Error deleting item from ${collName}:`, err);
    return false;
  }
};
