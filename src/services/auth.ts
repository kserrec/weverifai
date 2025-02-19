import { auth, db } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { 
    doc, 
    setDoc, 
    getDoc,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';

interface UserData {
    email: string;
    username: string;
    createdAt: number;
}

/**
 * Checks if a username is already taken
 */
export async function isUsernameTaken(username: string): Promise<boolean> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

/**
 * Signs up a user with email, password, and username.
 */
export async function signUp(email: string, password: string, username: string) {
    // First check if username is taken
    if (await isUsernameTaken(username)) {
        throw new Error('Username is already taken');
    }

    try {
        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with username
        await updateProfile(user, {
            displayName: username
        });

        // Create user document in Firestore
        const userData: UserData = {
            email: email,
            username: username,
            createdAt: Date.now()
        };

        await setDoc(doc(db, 'users', user.uid), userData);

        return { user, userData };
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

/**
 * Gets user data from Firestore
 */
export async function getUserData(uid: string) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return docSnap.data() as UserData;
    }
    return null;
}

/**
 * Logs in a user with email and password.
 */
export async function logIn(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = await getUserData(userCredential.user.uid);
        return { user: userCredential.user, userData };
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

/**
 * Logs out the current user.
 */
export async function logOut() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}
