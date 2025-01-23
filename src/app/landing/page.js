"use client";
import { useState, useEffect } from "react";
import styles from "./landing.module.css";

export default function Landing() {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Load user preference from localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedMode);
  }, []);

  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      localStorage.setItem("darkMode", !prevMode);
      return !prevMode;
    });
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}><span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span></div>
        <nav className={styles.navbar}>

          {/* Dark Mode Toggle */}
          <label className={styles.switch}>
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className={styles.slider}></span>
          </label>

          <a href="#" className={styles.navItem}>Forum</a>
          <a href="#" className={styles.navItem}>Support</a>
          <button className={styles.signupBtn}>Sign Up</button>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className={styles.hero}>
      <p className={styles.heroSubtitle}>
          Welcome to the most trusted <span className={styles.accent}>AI</span>-powered forum
        </p>
        <p className={styles.heroSubtitle}>
        <span className={styles.accent2}>We</span> Discuss. <span className={styles.accent2}>We</span> Debate. 
        </p>
        <h1 className={styles.heroTitle}><span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span></h1>
        
      </section>

      {/* LOGIN BOX */}
      <div className={styles.loginBox}>
        <h3>Log In</h3>
        <form className={styles.loginForm}>
          <input type="email" placeholder="Email" className={styles.inputField} />
          <input type="password" placeholder="Password" className={styles.inputField} />
          <button type="submit" className={styles.loginButton}>Log In</button>
        </form>
        <p className={styles.registerText}>
          New here? <a href="#">Create an account</a>
        </p>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>&copy; 2024 WeVerifAI. All rights reserved.</p>
      </footer>
    </div>
  );
}