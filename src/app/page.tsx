"use client";
import { useState, useEffect } from "react";
import { getRecentQuestions } from "@/services/questionService";
import type { JSX } from "react";
import type { QuestionResponse } from "@/services/questionService";
import styles from "./home.module.css";
import { FaUser } from "react-icons/fa";
import { useDarkMode } from '@/store/darkMode';
import Header from "@/components/Header";
import TopicsSidebar from "@/components/TopicsSidebar";

export default function Home(): JSX.Element {
  const { darkMode } = useDarkMode();
  const [posts, setPosts] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const recentPosts = await getRecentQuestions(6);
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

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <Header />
      
      <div className={styles.pageContent}>
        <TopicsSidebar />
        <main className={styles.mainContent}>
          <section className={styles.forum}>
            {loading ? (
              <div>Loading...</div>
            ) : posts.length > 0 ? (
              <div className={styles.posts}>
                {posts.map((post) => {
                  // Format the timestamp
                  const date = new Date(post.createdAt);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <div key={post.id} className={styles.post}>
                      <div className={styles.question}>
                        {post.question}
                      </div>
                      <div className={styles.answer}>
                        {post.answer}
                      </div>
                      <div className={styles.postMeta}>
                        <div className={styles.caller}>
                          <FaUser /> {post.caller}
                        </div>
                        <div className={styles.modelBadge}>
                          {post.model}
                        </div>
                        <div className={styles.timestamp}>
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>No posts found</div>
            )}
          </section>
        </main>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerLogo}>
          <span className={styles.footerAccent2}>We</span>Verif<span className={styles.footerAccent}>AI</span>
        </span>
      </footer>
    </div>
  );
}
