import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

/**
 * Signs up a user with email and password.
 */
export async function signUp(email: string, password: string) {
    const auth = getAuth();
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
    const auth = getAuth();
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
    const auth = getAuth();
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}



// EXAMPLE COMPONENT for use of these functions - put those code in the right ui file 

// import React, { useState } from 'react';
// import { signUp } from '@/services/authService';

// const SignUpPanel: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignUp = async () => {
//     try {
//       const user = await signUp(email, password);
//       console.log('Signed up user:', user);
//     } catch (error) {
//       console.error('Signup failed:', error);
//     }
//   };

//   return (
//     <div>
//       <input 
//         type="email" 
//         placeholder="Email" 
//         onChange={(e) => setEmail(e.target.value)} 
//       />
//       <input 
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleSignUp}>Sign Up</button>
//     </div>
//   );
// };

// export default SignUpPanel;