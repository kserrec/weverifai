"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { signUp } from "@/services/auth";
import styles from "./signUpModal.module.css"; // Create and style this CSS module as needed

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const user = await signUp(newEmail, newPassword);
      setSuccess(`Signed up as ${user.email}`);
      setNewEmail("");
      setNewPassword("");
      // Optionally close the modal after successful sign-up
      // onClose();
      router.push('/post');
    } catch (err: unknown) {
      setError((err instanceof Error) ? err.message : "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
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