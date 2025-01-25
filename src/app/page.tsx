"use client";
import { useState, useEffect } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./home.module.css";
import { FaBars, FaTimes, FaUserCircle, FaCommentAlt, FaPlus } from "react-icons/fa";

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  timePosted: string;
  commentCount: number;
}

export default function Home(): JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.toggle(styles.dark, darkMode);
  }, [darkMode]);

  const generateMockPosts = (): Post[] => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      title: `Sample Forum Post ${i + 1}`,
      author: `User${i + 1}`,
      content: "This is a placeholder for a forum post. Here you can write a discussion topic or question.",
      timePosted: "2 hours ago",
      commentCount: Math.floor(Math.random() * 30)
    }));
  };

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(generateMockPosts());
  }, []);

  const handleSignUpClick = () => {
    router.push("/login");
  };

  const handleCreatePostClick = () => {
    router.push("/post");
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
          <nav className={styles.navbar}>
            <button 
              className={styles.closeButton} 
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
            <Link href="#" className={styles.navItem}>General Discussion</Link>
            <Link href="#" className={styles.navItem}>Announcements</Link>
            <Link href="#" className={styles.navItem}>Support</Link>
            <Link href="#" className={styles.navItem}>Off-Topic</Link>
          </nav>
        </div>

        <div className={styles.logo}>
          <span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span>
        </div>

        <div className={styles.navright}>
          <div className={styles.toggleWrapper}>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={() => setDarkMode(!darkMode)} 
                aria-label="Toggle dark mode"
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <button className={styles.createPostBtn} onClick={handleCreatePostClick}>
            <FaPlus /> UVerifAI
          </button>
          <Link href="#" className={styles.navright}>Forum</Link>
          <Link href="#" className={styles.navright}>Support</Link>
          <button className={styles.signupBtn} onClick={handleSignUpClick}>Sign Up</button>
        </div>
      </header>

      <section className={styles.forum}>
        <h1 className={styles.forumTitle}>Recent Discussions</h1>
        <div className={styles.posts}>
          {posts.map((post) => (
            <div key={post.id} className={styles.post}>
              <div className={styles.postHeader}>
                <FaUserCircle className={styles.userIcon} />
                <div className={styles.postInfo}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postMeta}>Posted by {post.author} · {post.timePosted}</p>
                </div>
              </div>
              <p className={styles.postContent}>{post.content}</p>
              <div className={styles.postFooter}>
                <FaCommentAlt className={styles.commentIcon} />
                <span className={styles.commentCount}>{post.commentCount} comments</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>© 2025 ForumName. All rights reserved.</footer>
    </div>
  );
};
