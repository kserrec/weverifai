"use client";
import { useState, useRef, useEffect } from "react";
import type { JSX } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FaBars, FaPlus } from "react-icons/fa";
import { useDarkMode } from '@/store/darkMode';
import { useAuth } from '@/store/auth';
import { logOut } from "@/services/auth";
import styles from "./Header.module.css";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownOpen && 
          !menuButtonRef.current?.contains(event.target as Node) && 
          !dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [dropdownOpen]);

  const isLoginPage = pathname === '/login';

  const handleLoginClick = async () => {
    if (isLoggedIn) {
      await logOut();
      return;
    } else {
      router.push('/login');
    }
  };

  const handleCreatePostClick = () => {
    router.push('/post');
  };

  return (
    <header className={`${styles.header} ${darkMode ? styles.dark : ""}`}>
      {!isLoginPage && (
        <button 
          className={`${styles.topicsMenuBtn} topicsMenuBtn`}
          onClick={onSidebarToggle}
          aria-label="Toggle topics sidebar"
        >
          <FaBars />
        </button>
      )}
      
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
          {!isLoginPage && (
            <button className={styles.createPostBtn} onClick={handleCreatePostClick}>
              <FaPlus /> <span className={styles.createPostText}>Ask AI</span>
              <span className={styles.createPostTextMobile}>Ask</span>
            </button>
          )}
        </div>
        
        {!isLoginPage && (
          <>
            <div className={styles.navLinks}>
              <button type="button" className={styles.signupBtn} onClick={handleLoginClick}>
                {isLoggedIn ? 'Log Out' : 'Log In'}
              </button>
            </div>

            <button 
              ref={menuButtonRef}
              className={styles.mobileMenuBtn}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Toggle mobile menu"
            >
              <FaBars />
            </button>
          </>
        )}
      </div>

      {dropdownOpen && !isLoginPage && (
        <div 
          ref={dropdownRef}
          className={styles.dropdownMenu}
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className={styles.dropdownItem} onClick={handleLoginClick}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </button>
        </div>
      )}
    </header>
  );
} 