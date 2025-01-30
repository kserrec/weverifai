"use client";
import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

const postQuestion = async (caller: string, model: string, question: string) => {
    return await fetch('/api/question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question,
            model,
            caller: caller || 'anonymous',
        }),
    });
};

const CreatePostPage: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        const storedMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(storedMode);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', (!darkMode).toString());
    };

    const handleSignUpClick = () => {
        router.push('/login');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await postQuestion('testing', 'gpt-3.5-turbo', question);
            const data = await res.json();
            if (data.error) {
                console.error('Error:', data.error);
                setResponse('Error getting response');
            } else {
                setResponse(data.answer);
            }
        } catch (error) {
            console.error('Error submitting question:', error);
            setResponse('Error submitting question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
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
                        <Link href="#" className={styles.navItem}>General Discussion</Link><br></br>
                        <Link href="#" className={styles.navItem}>Announcements</Link><br></br>
                        <Link href="#" className={styles.navItem}>Support</Link><br></br>
                        <Link href="#" className={styles.navItem}>Off-Topic</Link><br></br>
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
                        <button type="button" className={styles.navItem} onClick={handleSignUpClick}>Log In</button>
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
                        <button className={styles.dropdownItem} onClick={handleSignUpClick}>Sign Up</button>
                    </div>
                )}
            </header>

            <div className={styles.createPostBox}>
                <h3>Ask GPT</h3>
                <form className={styles.createPostForm} onSubmit={handleSubmit}>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className={styles.inputField}
                        rows={10}
                        placeholder="Write your question here..."
                        required
                    />
                    {loading && <p className={styles.loading}>Getting response...</p>}
                    {response && (
                        <div className={styles.response}>
                            <h4>Response:</h4>
                            <p>{response}</p>
                        </div>
                    )}
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
            </div>

            <footer className={styles.footer}>
                <p>&copy; 2024 WeVerifAI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CreatePostPage;