"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import styles from './header.module.css';
import { useDarkMode } from '@/store/darkMode'
import { useAuth } from '@/store/auth';
import { logOut } from "@/services/auth";

export const Header = () => {
    const { isLoggedIn } = useAuth();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    const handleLoginClick = async () => {
        if (isLoggedIn) {
            await logOut();
            return;
        } else {
            router.push('/login');
        }
    };

    return (
        <header className={styles.header}>
            <button
                type="button"
                className={styles.menuButton}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
                <nav className={styles.navbar}>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={() => setMenuOpen(false)}
                    >
                        <FaTimes />
                    </button>
                    <Link href="#" className={styles.navItem}>General Discussion</Link><br />
                    <Link href="#" className={styles.navItem}>Announcements</Link><br />
                    <Link href="#" className={styles.navItem}>Support</Link><br />
                    <Link href="#" className={styles.navItem}>Off-Topic</Link><br />
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
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>

                <div className={styles.navLinks}>
                    <Link href="#" className={styles.navItem}>Forum</Link>
                    <Link href="#" className={styles.navItem}>Support</Link>
                    <button type="button" className={styles.navItem} onClick={handleLoginClick}>
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
                    <Link href="#" className={styles.dropdownItem}>Forum</Link>
                    <Link href="#" className={styles.dropdownItem}>Support</Link>
                    <button className={styles.dropdownItem} onClick={handleLoginClick}>Log In</button>
                </div>
            )}
        </header>
    );
};

export default Header;