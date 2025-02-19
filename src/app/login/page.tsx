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

  const handleLogIn = async () => {
    try {
      setShowError(false);
      setErrorMessage("");
      const { user, userData } = await logIn(email, password);
      if (!userData) {
        throw new Error('User data not found');
      }
      login({
        email: user.email!,
        username: userData.username,
        name: user.displayName || undefined
      });
      console.log("Logged in user:", user);
      router.replace('/');
    } catch (error: unknown) {
      const typedError = error as { code?: string; name?: string };
      console.log("Login Error: ", JSON.stringify(error));
      if (typedError.code === 'auth/invalid-credential') {
        setErrorMessage("Wrong credentials, please try again.");
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
      setShowError(true);
    }
  };

  const openSignUpModal = (): void => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = (): void => {
    setIsSignUpModalOpen(false);
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <Header />

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
              <form onSubmit={async (e) => {
                e.preventDefault();
                await handleLogIn();
              }}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.inputField}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.inputField}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className={styles.loginButton}>
                  Log In
                </button>
                {showError && (
                  <div className="text-red-500 mt-2 text-sm">
                    {errorMessage}
                  </div>)}

                <button
                  type="button"
                  onClick={openSignUpModal}
                  className={styles.signupLink}
                >
                  Not a user yet? Sign up here
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={closeSignUpModal}
        darkMode={darkMode}
      />
    </div>
  );
}