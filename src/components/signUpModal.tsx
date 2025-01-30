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
        return error?.message || 'Sign up failed';
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const user = await signUp(newEmail, newPassword);
      setSuccess(`Signed up as ${user.email}`);
      setNewEmail("");
      setNewPassword("");
      router.push('/');
    } catch (err: unknown) {
      setError(getErrorMessage(err as AuthError));
    } finally {
      setLoading(false);
    }
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
          onClick={handleSignUp}
          className={styles.authButton}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SignUpModal;