"use client";
/** @jsxImportSource react */
import * as React from "react";
import { useState, useEffect, FormEvent, JSX } from "react";
import styles from "./landing.module.css";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Landing(): JSX.Element {
  // State for dark mode
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load user preference from localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedMode);
  }, []);

  // Toggle function
  const toggleDarkMode = (): void => {
    setDarkMode((prevMode: boolean) => {
      localStorage.setItem("darkMode", (!prevMode).toString());
      return !prevMode;
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<LoginFormElement>): void => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <header className={styles.header}>
        <div className={styles.logo}><span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span></div>
        <nav className={styles.navbar}>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={toggleDarkMode}
            />
            <span className={styles.slider}></span>
          </label>

          <a href="#" className={styles.navItem}>Forum</a>
          <a href="#" className={styles.navItem}>Support</a>
          <button className={styles.navItem}>Sign Up</button>
        </nav>
      </header>

      <section className={styles.hero}>
        <p className={styles.heroSubtitle}>
          Welcome to the most trusted <span className={styles.accent}>AI</span>-powered forum
        </p>
        <p className={styles.heroSubtitle}>
          <span className={styles.accent2}>We</span> Discuss. <span className={styles.accent2}>We</span> Debate. 
        </p>
        <h1 className={styles.heroTitle}>
          <span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span>
        </h1>
      </section>

      <div className={styles.loginBox}>
        <h3>Log In</h3>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            className={styles.inputField}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.inputField}
            required 
          />
          <button type="submit" className={styles.loginButton}>Log In</button>
        </form>
        <p className={styles.registerText}>
          New here? <a href="#">Create an account</a>
        </p>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2024 WeVerifAI. All rights reserved.</p>
      </footer>
    </div>
  );
}