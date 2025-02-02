"use client";
import { useState, useEffect } from "react";
import { getRecentQuestions } from "@/services/questionService";
import type { JSX } from "react";
import type { QuestionDoc  } from "@/services/types";
import styles from "./home.module.css";
import { useDarkMode } from '@/store/darkMode'

export default function Home(): JSX.Element {
  const { darkMode } = useDarkMode();
  const [posts, setPosts] = useState<QuestionDoc[]>([]);
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
                  <span key={`caller-${post.id}`}>Asked by: {post.caller}</span>
                  <span key={`model-${post.id}`}>Model: {post.model}</span>
                  <span key={`date-${post.id}`}>Posted: {post.createdAt}</span>
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
