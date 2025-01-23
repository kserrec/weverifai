// "use client";
// import { useState, useEffect } from "react";
// import styles from "./home.module.css";  // Ensure it's referencing home.module.css

// export default function Home() {
//   // State for dark mode
//   const [darkMode, setDarkMode] = useState(false);

//   // Load user preference from localStorage
//   useEffect(() => {
//     const storedMode = localStorage.getItem("darkMode") === "true";
//     setDarkMode(storedMode);
//   }, []);

//   // Toggle function
//   const toggleDarkMode = () => {
//     setDarkMode((prevMode) => {
//       localStorage.setItem("darkMode", !prevMode);
//       return !prevMode;
//     });
//   };

//   return (
//     <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
//       {/* HEADER */}
//       <header className={styles.header}>
//         <div className={styles.logo}><span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span></div>
//         <nav className={styles.navbar}>
//           {/* Dark Mode Toggle */}
//           <label className={styles.switch}>
//             <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
//             <span className={styles.slider}></span>
//           </label>
//           <a href="#" className={styles.navItem}>Forum</a>
//           <a href="#" className={styles.navItem}>Support</a>
//           <button className={styles.signupBtn}>Sign Up</button>
//         </nav>
//       </header>

//       {/* MAIN CONTENT */}
//       <div className={styles.mainContent}>
//         {/* LEFT COLUMN (CATEGORIES) */}
//         <aside className={styles.leftColumn}>
//           <h3 className={styles.categoriesTitle}>Categories</h3>
//           <ul className={styles.categoriesList}>
//             <li><a href="#">AI & Machine Learning</a></li>
//             <li><a href="#">Technology</a></li>
//             <li><a href="#">Science</a></li>
//             <li><a href="#">Business</a></li>
//             <li><a href="#">Education</a></li>
//           </ul>
//         </aside>

//         {/* RIGHT COLUMN (USER QUESTIONS AND RESPONSES) */}
//         <section className={styles.rightColumn}>
//           <div className={styles.queryCard}>
//             <h4 className={styles.queryTitle}>What is the future of AI?</h4>
//             <p className={styles.queryAnswer}>AI has the potential to revolutionize many industries...</p>
//             <div className={styles.queryStats}>
//               <span>Upvotes: 120</span>
//               <span>Comments: 34</span>
//             </div>
//           </div>

//           <div className={styles.queryCard}>
//             <h4 className={styles.queryTitle}>How does quantum computing work?</h4>
//             <p className={styles.queryAnswer}>Quantum computing harnesses the principles of quantum mechanics...</p>
//             <div className={styles.queryStats}>
//               <span>Upvotes: 98</span>
//               <span>Comments: 22</span>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* FOOTER */}
//       <footer className={styles.footer}>
//         <p>&copy; 2024 WeVerifAI. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import styles from "./home.module.css";
import { FaBars, FaTimes, FaUserCircle, FaCommentAlt } from "react-icons/fa";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle(styles.dark, darkMode);
  }, [darkMode]);

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      {/* Header */}
      <header className={styles.header}>
        {/* Left - Expandable Menu */}
        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Sidebar Menu */}
        <div className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
          <nav className={styles.navbar}>
            <button className={styles.closeButton} onClick={() => setMenuOpen(false)}>
              <FaTimes />
            </button>
            <a href="#" className={styles.navItem}>General Discussion</a><br></br>
            <a href="#" className={styles.navItem}>Announcements</a><br></br>
            <a href="#" className={styles.navItem}>Support</a><br></br>
            <a href="#" className={styles.navItem}>Off-Topic</a><br></br>
          </nav>
        </div>

        {/* Center - Logo */}
        <div className={styles.logo}>
            <span className={styles.accent2}>We</span>Verif<span className={styles.accent}>AI</span>
        </div>

          {/* Right - Dark Mode Toggle & Nav Items */}
          <div className={styles.navright}>
          <div className={styles.toggleWrapper}>
            <label className={styles.switch}>
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className={styles.slider}></span>
            </label>
          </div>
          <a href="#" className={styles.navright}>Forum</a>
          <a href="#" className={styles.navright}>Support</a>
          <button className={styles.signupBtn}>Sign Up</button>
        </div>
      </header>
        

      ,{/* Forum Post Section */}
      <section className={styles.forum}>
        <h1 className={styles.forumTitle}>Recent Discussions</h1>
        <div className={styles.posts}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.post}>
              <div className={styles.postHeader}>
                <FaUserCircle className={styles.userIcon} />
                <div className={styles.postInfo}>
                  <h2 className={styles.postTitle}>Sample Forum Post {i + 1}</h2>
                  <p className={styles.postMeta}>Posted by User{i + 1} · 2 hours ago</p>
                </div>
              </div>
              <p className={styles.postContent}>
                This is a placeholder for a forum post. Here you can write a discussion topic or question.
              </p>
              <div className={styles.postFooter}>
                <FaCommentAlt className={styles.commentIcon} />
                <span className={styles.commentCount}>{Math.floor(Math.random() * 30)} comments</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>© 2025 ForumName. All rights reserved.</footer>
    </div>
  );
}