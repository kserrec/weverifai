"use client";
import { useState, useEffect } from "react";
import { getRecentQuestions, updateVote } from "@/services/questionService";
import type { JSX } from "react";
import type { QuestionResponse } from "@/services/questionService";
import styles from "./home.module.css";
import { FaUser } from "react-icons/fa";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";
import { useDarkMode } from '@/store/darkMode';
import { useAuth } from '@/store/auth';
import Header from "@/components/Header";
import TopicsSidebar from "@/components/TopicsSidebar";

export default function Home(): JSX.Element {
  const { darkMode } = useDarkMode();
  const { isLoggedIn, user } = useAuth();
  const [posts, setPosts] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [votingStates, setVotingStates] = useState<Record<string, { upvoted: boolean; downvoted: boolean }>>({});

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleVote = async (postId: string, voteType: 'upvote' | 'downvote') => {
    if (!isLoggedIn || !user?.email) {
      // Could show a login prompt here
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const currentState = votingStates[postId] || { 
      upvoted: post.upvoters?.includes(user.email) || false,
      downvoted: post.downvoters?.includes(user.email) || false
    };
    
    const isRemovingVote = currentState[voteType === 'upvote' ? 'upvoted' : 'downvoted'];
    
    // Update the UI optimistically
    const newVotingStates = {
      ...votingStates,
      [postId]: {
        upvoted: voteType === 'upvote' ? !currentState.upvoted : false,
        downvoted: voteType === 'downvote' ? !currentState.downvoted : false
      }
    };
    setVotingStates(newVotingStates);

    // Optimistically update the vote count in the UI
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const voteChange = isRemovingVote ? -1 : 1;
        const updatedPost = {
          ...p,
          [voteType === 'upvote' ? 'upvotes' : 'downvotes']: (p[voteType === 'upvote' ? 'upvotes' : 'downvotes'] || 0) + voteChange
        };

        // Update the voters arrays
        if (voteType === 'upvote') {
          updatedPost.upvoters = isRemovingVote 
            ? p.upvoters?.filter(id => id !== user.email)
            : [...(p.upvoters || []), user.email];
        } else {
          updatedPost.downvoters = isRemovingVote
            ? p.downvoters?.filter(id => id !== user.email)
            : [...(p.downvoters || []), user.email];
        }

        return updatedPost;
      }
      return p;
    });
    setPosts(updatedPosts);

    // Update the vote in Firestore without waiting
    void updateVote(postId, user.email, voteType, !isRemovingVote);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const recentPosts = await getRecentQuestions(6);
        console.log('Fetched posts:', recentPosts);
        
        // Initialize voting states from the fetched data
        if (user?.email) {
          const initialVotingStates: Record<string, { upvoted: boolean; downvoted: boolean }> = {};
          recentPosts.forEach(post => {
            initialVotingStates[post.id] = {
              upvoted: post.upvoters?.includes(user.email) || false,
              downvoted: post.downvoters?.includes(user.email) || false
            };
          });
          setVotingStates(initialVotingStates);
        }
        
        setPosts(recentPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, [user?.email]);

  useEffect(() => {
    document.body.classList.toggle(styles.dark, darkMode);
  }, [darkMode]);

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <Header onSidebarToggle={handleSidebarToggle} />
      
      <div className={styles.pageContent}>
        <TopicsSidebar isOpen={sidebarOpen} />
        <main className={styles.mainContent}>
          <section className={styles.forum}>
            {loading ? (
              <div>Loading...</div>
            ) : posts.length > 0 ? (
              <div className={styles.posts}>
                {posts.map((post) => {
                  const voteState = votingStates[post.id] || { upvoted: false, downvoted: false };
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
                        <div className={styles.voteButtons}>
                          <button 
                            className={`${styles.voteButton} ${voteState.upvoted ? styles.upvoted : ''}`}
                            onClick={() => handleVote(post.id, 'upvote')}
                            aria-label="Upvote"
                          >
                            <BiUpArrow />
                          </button>
                          <span className={styles.voteCount}>{post.upvotes || 0}</span>
                          <button 
                            className={`${styles.voteButton} ${voteState.downvoted ? styles.downvoted : ''}`}
                            onClick={() => handleVote(post.id, 'downvote')}
                            aria-label="Downvote"
                          >
                            <BiDownArrow />
                          </button>
                          <span className={styles.voteCount}>{post.downvotes || 0}</span>
                        </div>
                        <div className={styles.metaRight}>
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
