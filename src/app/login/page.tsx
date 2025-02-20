"use client";
/** @jsxImportSource react */
import { useRouter } from 'next/navigation';
import * as React from "react";
import { useEffect, useState } from "react";
import type { JSX } from "react";
import styles from "./login.module.css";
import { logIn } from "@/services/auth";
import SignUpModal from "@/components/signUpModal";
import { useDarkMode } from '@/store/darkMode';
import { useAuth } from '@/store/auth';
import Header from "@/components/Header";

export default function Login(): JSX.Element {
  const router = useRouter();
  const { isLoggedIn, isLoading, login } = useAuth();
  const { darkMode } = useDarkMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn, isLoading, router]);

  // Don't render the page content while loading or if logged in
  if (isLoading || isLoggedIn) {
    return <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setErrorMessage("");

    try {
      const { user, userData } = await logIn(email, password);
      if (!userData) {
        throw new Error('User data not found');
      }
      login({
        email: user.email!,
        username: userData.username,
        name: user.displayName || undefined
      });
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("Invalid email or password");
      setShowError(true);
    }
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <Header onSidebarToggle={() => {}} />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <span className={styles.accent2}>We</span>Verif
          <span className={styles.accent}>AI</span>
        </h1>
        <p className={styles.heroSubtitle}>
          <span className={styles.accent}>AI</span> Answers - <span className={styles.accent2}>You</span> Respond
        </p>
        <p className={styles.heroSubtitle}>
          Join a collaborative hub shaping a new library of knowledge.
        </p>
      </section>

      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authSections}>
            <div className={styles.authRight}>
              <h3>Log In</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className={styles.inputField}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showError && (
                  <div className={styles.error}>{errorMessage}</div>
                )}
                <button type="submit" className={styles.loginButton}>
                  Log In
                </button>
                <button
                  type="button"
                  className={styles.signupLink}
                  onClick={() => setIsSignUpModalOpen(true)}
                >
                  Don&apos;t have an account? Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}