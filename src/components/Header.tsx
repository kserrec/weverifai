"use client";
import { useState } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaBars, FaTimes, FaPlus } from "react-icons/fa";
import { useDarkMode } from '@/store/darkMode';
import { useAuth } from '@/store/auth';
import { logOut } from "@/services/auth";
import styles from "./Header.module.css";

export default function Header(): JSX.Element {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleLoginClick = async () => {
    if (isLoggedIn) {
      await logOut();
      return;
    } else {
      router.push('/login');
    }
  };

  const handleCreatePostClick = () => {
    router.push("/post");
  };

  return (
    <header className={`${styles.header} ${darkMode ? styles.dark : ""}`}>
      <button 
        className={styles.menuButton} 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`${styles.sidebar} ${menuOpen ? styles.open : ""} ${darkMode ? styles.dark : ""}`}>
        <div className={styles.sidebarOverlay} onClick={() => setMenuOpen(false)}></div>
        <nav className={styles.navbar}>
          <button 
            className={styles.closeButton} 
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </nav>
      </div>

      <Link href="/" className={styles.logo}>
        <span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span>
      </Link>

      <div className={styles.navright}>
        <div className={styles.essentialControls}>
          <div className={styles.toggleWrapper}>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={toggleDarkMode} 
                aria-label="Toggle dark mode"
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <button className={styles.createPostBtn} onClick={handleCreatePostClick}>
            <FaPlus /> <span className={styles.createPostText}>UVerifAI</span>
          </button>
        </div>
        
        <div className={styles.navLinks}>
          <button type="button" className={styles.signupBtn} onClick={handleLoginClick}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </button>
        </div>

        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="Toggle mobile menu"
        >
          <FaBars />
        </button>
      </div>

      {dropdownOpen && (
        <div className={styles.dropdownMenu}>
          <button type="button" className={styles.dropdownItem} onClick={handleLoginClick}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </button>
        </div>
      )}
    </header>
  );
} 