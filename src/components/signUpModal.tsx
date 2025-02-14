"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { signUp } from "@/services/auth";
import styles from "./signUpModal.module.css";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean; 
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, darkMode }) => {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  type AuthError = {
    code?: string;
    message?: string;
    name?: string;
  };

  const getErrorMessage = (error: AuthError) => {
    const errorCode = error?.code || '';
    const errorMessage = error?.message || '';
    
    switch (errorCode) {
      case 'auth/missing-password':
        return 'Please enter a password';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      default:
        if (errorMessage.includes('Username is already taken')) {
          return 'This username is already taken';
        }
        return error?.message || 'Sign up failed';
    }
  };

  const validateUsername = (username: string): boolean => {
    // Username should be 3-20 characters and only contain letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate username
    if (!validateUsername(username)) {
      setError('Username must be 3-20 characters long and can only contain letters, numbers, and underscores');
      setLoading(false);
      return;
    }

    try {
      await signUp(newEmail, newPassword, username);
      setSuccess(`Welcome, ${username}!`);
      setNewEmail("");
      setNewPassword("");
      setUsername("");
      router.push('/');
    } catch (err: unknown) {
      setError(getErrorMessage(err as AuthError));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignUp();
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${darkMode ? styles.dark : ""}`}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Sign Up</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className={styles.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.inputField}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={styles.authButton}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className={styles.hint}>
          Username must be 3-20 characters long and can only contain letters, numbers, and underscores.
        </p>
      </div>
    </div>
  );
};

export default SignUpModal;