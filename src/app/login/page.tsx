"use client";
/** @jsxImportSource react */
import * as React from "react";
import { useState, useEffect } from "react";
import type { FormEvent, JSX } from "react";
import styles from "./landing.module.css";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Landing(): JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

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

  const handleSubmit = (e: FormEvent<LoginFormElement>): void => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span>
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
          <button className={styles.navItem}>Sign Up</button>
          
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
            <button className={styles.dropdownItem}>Sign Up</button>
          </div>
        )}
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
          <button type="submit" className={styles.loginBtn}>Log In</button>
        </form>
      </div>
    </div>
  );
}