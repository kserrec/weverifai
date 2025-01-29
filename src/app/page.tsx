"use client";
import { useState, useEffect } from "react";
import { getRecentPosts } from "@/services/questionService";
import type { ChangeEvent } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./home.module.css";
import { FaBars, FaTimes, FaPlus } from "react-icons/fa";

interface Post {
  id: string;
  question: string;
  answer: string;
  caller: string;
  model: string;
  timestamp: string;
}
export default function Home(): JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const recentPosts = await getRecentPosts(6);
        console.log('Fetched posts:', recentPosts);
        setPosts(recentPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, []);

  useEffect(() => {
    document.body.classList.toggle(styles.dark, darkMode);
  }, [darkMode]);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    // Only set if there's a stored preference
    if (storedMode !== null) {
      setDarkMode(storedMode === "true");
    }
  }, []);

  const handleSignUpClick = () => {
    router.push("/login");
  };

  const handleCreatePostClick = () => {
    router.push("/post");
  };

  const toggleDarkMode = (event: ChangeEvent<HTMLInputElement>): void => {
    const newDarkMode = event.target.checked;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <header className={styles.header}>
        <button 
          className={styles.menuButton} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
          <div className={styles.sidebarOverlay} onClick={() => setMenuOpen(false)}></div>
          <nav className={styles.navbar}>
            <button 
              className={styles.closeButton} 
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
            <Link href="#" className={styles.navItem}>General Discussion</Link><br></br>
            <Link href="#" className={styles.navItem}>Announcements</Link><br></br>
            <Link href="#" className={styles.navItem}>Support</Link><br></br>
            <Link href="#" className={styles.navItem}>Off-Topic</Link><br></br>
          </nav>
        </div>

        <div className={styles.logo}>
          <span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span>
        </div>

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
            <Link href="#" className={styles.navItem}>Forum</Link>
            <Link href="#" className={styles.navItem}>Support</Link>
            <button className={styles.signupBtn} onClick={handleSignUpClick}>Sign Up</button>
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

      <section className={styles.forum}>
        <h1 className={styles.forumTitle}>Recent Questions</h1>
        {loading ? (
          <div>Loading...</div>
        ) : posts.length > 0 ? (
          <div className={styles.posts}>
            {posts.map((post) => (
              <div key={post.id} className={styles.post}>
                <div className={styles.postHeader}>
                  <h3 className={styles.question}>Q: {post.question}</h3>
                  <p className={styles.answer}>A: {post.answer}</p>
                </div>
                <div className={styles.postMeta}>
                  <span>Asked by: {post.caller}</span>
                  <span>Model: {post.model}</span>
                  <span>Posted: {post.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No posts found</div>
        )}
      </section>

      <footer className={styles.footer}>© 2025 ForumName. All rights reserved.</footer>
    </div>
  );
}
