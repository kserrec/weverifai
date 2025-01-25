"use client";
import type { FormEvent } from 'react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { FaBars, FaTimes } from "react-icons/fa";
import Link from 'next/link';

const CreatePostPage: React.FC = () => {
    const [content, setContent] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const storedMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(storedMode);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", (!darkMode).toString());
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Handle post submission logic here
        console.log('Post submitted:', { content });
    };

    const handleSignUpClick = () => {
        router.push("/login");
    };

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <header className={styles.header}>
                <button 
                    className={styles.menuButton} 
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
                    <nav className={styles.navbar}>
                        <button 
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
                <nav className={styles.navright}>
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
                    <button className={styles.navItem} onClick={handleSignUpClick}>Sign Up</button>
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

            <div className={styles.createPostBox}>
                <h3>Ask GPT</h3>
                <form className={styles.createPostForm} onSubmit={handleSubmit}>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={styles.inputField}
                        rows={10}
                        placeholder="Write your post here..."
                        required
                    />
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
            </div><br></br><br></br><br></br>

            <footer className={styles.footer}>
                <p>&copy; 2024 WeVerifAI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CreatePostPage;