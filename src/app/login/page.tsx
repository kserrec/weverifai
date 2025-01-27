"use client";
/** @jsxImportSource react */
import { useRouter } from 'next/navigation';
import * as React from "react";
import { useState, useEffect } from "react";
import type { JSX } from "react";
import styles from "./landing.module.css";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import {logIn } from "@/services/auth";
import SignUpModal from "@/components/signUpModal";

export default function Landing(): JSX.Element {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);

  const handleLogIn = async () => {
    try {
      const user = await logIn(email, password);
      console.log("Logged in user:", user);
      router.push('/');
    } catch (error) {
      console.error("Login failed!!! :", error);
      
    }
  };

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedMode);
  }, []);

  const toggleDarkMode = (): void => {
    setDarkMode((prevMode: boolean) => {
      localStorage.setItem("darkMode", (!prevMode).toString());
      return !prevMode;
    });
  };

  const openSignUpModal = (): void => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = (): void => {
    setIsSignUpModalOpen(false);
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <span className={styles.accent2}>We</span>Verif
          <span className={styles.accent}>AI</span>
        </Link>
        <nav className={styles.navbar}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className={styles.slider}></span>
          </label>
          <Link href="#" className={styles.navItem}>Forum</Link>
          <Link href="#" className={styles.navItem}>Support</Link>
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Toggle mobile menu"
          >
            {dropdownOpen ? <FaTimes /> : <FaBars />}
          </button>
        </nav>
        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            <Link href="#" className={styles.dropdownItem}>Forum</Link>
            <Link href="#" className={styles.dropdownItem}>Support</Link>
          </div>
        )}
      </header>

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
            {/* Log In Section */}
            <div className={styles.authRight}>
              <h3>Log In</h3>
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
              <button type="button" onClick={handleLogIn} className={styles.authButton}>
                Log In
              </button>

              {/* Sign Up Modal Button */}
              <button
                type="button"
                onClick={openSignUpModal}
                className={styles.authButtonSecondary}
              >
                Not a user yet? Click here to sign up.
              </button>
            </div>
          </div>

          {/* Continue as Guest */}
          <div className={styles.authFooter}>
            <button className={styles.guestButton}>
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
      
      {/* Sign Up Modal */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
    </div>
  );
}