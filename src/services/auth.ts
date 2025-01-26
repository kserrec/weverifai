import { auth } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

/**
 * Signs up a user with email and password.
 */
export async function signUp(email: string, password: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user; // Contains displayedName, uid, etc.
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

/**
 * Logs in a user with email and password.
 */
export async function logIn(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; // Contains various user properties
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
