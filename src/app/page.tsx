"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getRecentQuestions, getTopQuestions, getHotQuestions, getSpicyQuestions, updateVote, getQuestionById } from "@/services/questionService";
import type { JSX } from "react";
import type { QuestionResponse } from "@/services/questionService";
import styles from "./home.module.css";
import { FaUser } from "react-icons/fa";
import { BiUpArrow, BiDownArrow, BiCaretDown } from "react-icons/bi";
import { useDarkMode } from '@/store/darkMode';
import { useAuth } from '@/store/auth';
import Header from "@/components/Header";
import TopicsSidebar from "@/components/TopicsSidebar";
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import { AVAILABLE_MODELS } from '@/lib/constants';
import Link from 'next/link';

export default function Home(): JSX.Element {
  const { darkMode } = useDarkMode();
  const { isLoggedIn, user } = useAuth();
  const [posts, setPosts] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [modelFilterOpen, setModelFilterOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>('New');
  const [currentModel, setCurrentModel] = useState<string>('all');
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());
  const lastDocRef = useRef<QueryDocumentSnapshot | null>(null);
  const hasMoreRef = useRef<boolean>(true);
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modelFilterRef = useRef<HTMLDivElement>(null);
  const modelButtonRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [votingStates, setVotingStates] = useState<Record<string, { upvoted: boolean; downvoted: boolean }>>({});
  const fetchingRef = useRef<boolean>(false);
  const votingInProgress = useRef<Set<string>>(new Set());

  const fetchPosts = useCallback(async (filter: string, isInitial: boolean = false) => {
    if (fetchingRef.current || (!isInitial && !hasMoreRef.current)) return;
    
    try {
      fetchingRef.current = true;
      if (isInitial) {
        setLoading(true);
        lastDocRef.current = null;
        setPosts([]);
      }

      let result;
      const currentLastDoc = isInitial ? undefined : (lastDocRef.current || undefined);
      const modelFilter = currentModel === 'all' ? undefined : currentModel;
      
      switch (filter) {
        case 'Top':
          result = await getTopQuestions(10, currentLastDoc, modelFilter);
          break;
        case 'Hot':
          result = await getHotQuestions(10, currentLastDoc, modelFilter);
          break;
        case 'Spicy':
          result = await getSpicyQuestions(10, currentLastDoc, modelFilter);
          break;
        default:
          result = await getRecentQuestions(10, currentLastDoc, modelFilter);
      }
      
      const { questions: newPosts, lastDoc: newLastDoc } = result;
      
      if (user?.email) {
        const newVotingStates: Record<string, { upvoted: boolean; downvoted: boolean }> = {};
        newPosts.forEach(post => {
          newVotingStates[post.id] = {
            upvoted: post.upvoters?.includes(user.email) || false,
            downvoted: post.downvoters?.includes(user.email) || false
          };
        });
        setVotingStates(prev => ({ ...prev, ...newVotingStates }));
      }
      
      setPosts(prev => isInitial ? newPosts : [...prev, ...newPosts]);
      lastDocRef.current = newLastDoc;
      hasMoreRef.current = newPosts.length === 10;
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [user?.email, currentModel]);

  // Initial load and filter changes
  useEffect(() => {
    hasMoreRef.current = true;
    void fetchPosts(currentFilter, true);
  }, [currentFilter, currentModel, fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMoreRef.current && !fetchingRef.current && !loading) {
        void fetchPosts(currentFilter);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px',
      threshold: 0.1
    });

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => observer.disconnect();
  }, [currentFilter, fetchPosts, loading]);

  // Click outside handler for both dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (filterOpen && 
          !buttonRef.current?.contains(event.target as Node) && 
          !filterRef.current?.contains(event.target as Node)) {
        setFilterOpen(false);
      }
      if (modelFilterOpen && 
          !modelButtonRef.current?.contains(event.target as Node) && 
          !modelFilterRef.current?.contains(event.target as Node)) {
        setModelFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [filterOpen, modelFilterOpen]);

  const handleFilterClick = (filter: string) => {
    if (filter === currentFilter) return;
    setCurrentFilter(filter);
    setFilterOpen(false);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleVote = async (postId: string, voteType: 'upvote' | 'downvote') => {
    if (!isLoggedIn || !user?.email || votingInProgress.current.has(postId)) {
      console.log('Vote blocked:', { 
        isLoggedIn, 
        hasUser: !!user?.email, 
        voteInProgress: votingInProgress.current.has(postId) 
      });
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Add post to voting in progress set
    votingInProgress.current.add(postId);

    // Keep original states for error recovery
    const originalVotingStates = { ...votingStates };
    const originalPosts = posts.map(p => ({ ...p })); // Deep copy

    try {
      const currentState = votingStates[postId] || { 
        upvoted: post.upvoters?.includes(user.email) || false,
        downvoted: post.downvoters?.includes(user.email) || false
      };

      // Check for opposite vote in local state
      const hasOppositeVote = voteType === 'upvote' ? currentState.downvoted : currentState.upvoted;
      if (hasOppositeVote) {
        console.log('Vote blocked: Already voted in opposite direction');
        return;
      }
      
      const isRemovingVote = currentState[voteType === 'upvote' ? 'upvoted' : 'downvoted'];

      // Check if removing vote would cause negative count
      const currentCount = post[voteType === 'upvote' ? 'upvotes' : 'downvotes'] || 0;
      if (isRemovingVote && currentCount <= 0) {
        console.log('Vote blocked: Would cause negative count');
        return;
      }
      
      // Update the UI optimistically
      const newVotingStates = {
        ...votingStates,
        [postId]: {
          upvoted: voteType === 'upvote' ? !currentState.upvoted : false,
          downvoted: voteType === 'downvote' ? !currentState.downvoted : false
        }
      };
      setVotingStates(newVotingStates);

      // Update posts state optimistically
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          const voteChange = isRemovingVote ? -1 : 1;
          const updatedPost = {
            ...p,
            [voteType === 'upvote' ? 'upvotes' : 'downvotes']: 
              Math.max(0, (p[voteType === 'upvote' ? 'upvotes' : 'downvotes'] || 0) + voteChange)
          };

          if (voteType === 'upvote') {
            updatedPost.upvoters = isRemovingVote 
              ? (p.upvoters || []).filter(id => id !== user.email)
              : [...(p.upvoters || []), user.email];
            updatedPost.downvoters = p.downvoters || [];
          } else {
            updatedPost.downvoters = isRemovingVote
              ? (p.downvoters || []).filter(id => id !== user.email)
              : [...(p.downvoters || []), user.email];
            updatedPost.upvoters = p.upvoters || [];
          }

          return updatedPost;
        }
        return { ...p }; // Deep copy other posts
      });
      setPosts(updatedPosts);

      // Update the vote in Firestore without waiting
      await updateVote(postId, user.email, voteType, !isRemovingVote);

      // Optionally fetch fresh post data to ensure consistency
      const updatedPost = await getQuestionById(postId);
      if (updatedPost) {
        // Ensure counts never go negative even if database returns negative
        const sanitizedPost = {
          ...updatedPost,
          upvotes: Math.max(0, updatedPost.upvotes || 0),
          downvotes: Math.max(0, updatedPost.downvotes || 0),
          upvoters: updatedPost.upvoters || [],
          downvoters: updatedPost.downvoters || []
        };
        setPosts(posts.map(p => p.id === postId ? sanitizedPost : p));
        setVotingStates(prev => ({
          ...prev,
          [postId]: {
            upvoted: sanitizedPost.upvoters.includes(user.email) || false,
            downvoted: sanitizedPost.downvoters.includes(user.email) || false
          }
        }));
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      // Revert to original states on error
      setVotingStates(originalVotingStates);
      setPosts(originalPosts);
    } finally {
      // Remove post from voting in progress set
      votingInProgress.current.delete(postId);
    }
  };

  useEffect(() => {
    document.body.classList.toggle(styles.dark, darkMode);
  }, [darkMode]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilterOpen(!filterOpen);
    setModelFilterOpen(false);
  };

  const handleModelButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModelFilterOpen(!modelFilterOpen);
    setFilterOpen(false);
  };

  const handleModelClick = (modelName: string) => {
    if (modelName === currentModel) return;
    setCurrentModel(modelName);
    setModelFilterOpen(false);
  };

  const toggleAnswer = (postId: string) => {
    setExpandedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <Header onSidebarToggle={handleSidebarToggle} />
      
      <div className={styles.pageContent}>
        <TopicsSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        <main className={styles.mainContent}>
          <div className={styles.filterBar}>
            <div style={{ position: 'relative' }}>
              <button 
                ref={buttonRef}
                className={styles.filterButton}
                onClick={handleButtonClick}
              >
                {currentFilter.toUpperCase()} POSTS <BiCaretDown />
              </button>
              {filterOpen && (
                <div 
                  ref={filterRef}
                  className={styles.filterDropdown}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div 
                    className={`${styles.filterOption} ${currentFilter === 'New' ? styles.selected : ''}`}
                    onClick={() => handleFilterClick('New')}
                  >
                    New
                  </div>
                  <div 
                    className={`${styles.filterOption} ${currentFilter === 'Top' ? styles.selected : ''}`}
                    onClick={() => handleFilterClick('Top')}
                  >
                    Top
                  </div>
                  <div 
                    className={`${styles.filterOption} ${currentFilter === 'Hot' ? styles.selected : ''}`}
                    onClick={() => handleFilterClick('Hot')}
                  >
                    Hot
                  </div>
                  <div 
                    className={`${styles.filterOption} ${currentFilter === 'Spicy' ? styles.selected : ''}`}
                    onClick={() => handleFilterClick('Spicy')}
                  >
                    Spicy
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <button 
                ref={modelButtonRef}
                className={styles.filterButton}
                onClick={handleModelButtonClick}
              >
                {AVAILABLE_MODELS.find(m => m.modelName === currentModel)?.displayName || 'ALL'} <BiCaretDown />
              </button>
              {modelFilterOpen && (
                <div 
                  ref={modelFilterRef}
                  className={styles.filterDropdown}
                  onClick={(e) => e.stopPropagation()}
                >
                  {AVAILABLE_MODELS.map((model) => (
                    <div 
                      key={model.modelName}
                      className={`${styles.filterOption} ${currentModel === model.modelName ? styles.selected : ''}`}
                      onClick={() => handleModelClick(model.modelName)}
                    >
                      {model.displayName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <section className={styles.forum}>
            {loading && posts.length === 0 ? (
              <div>Loading...</div>
            ) : posts.length > 0 ? (
              <div className={styles.posts}>
                {posts.map((post) => (
                  <div key={post.id} className={styles.post} onClick={() => toggleAnswer(post.id)}>
                    <Link href={`/post/${post.id}`} className={styles.questionLink} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.question}>
                        {post.question}
                      </div>
                    </Link>
                    <div className={`${styles.answer} ${expandedAnswers.has(post.id) ? styles.expanded : ''}`}>
                      {post.answer}
                    </div>
                    <div className={styles.postMeta} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.voteButtons}>
                        <button 
                          className={`${styles.voteButton} ${votingStates[post.id]?.upvoted ? styles.upvoted : ''}`}
                          onClick={() => handleVote(post.id, 'upvote')}
                          aria-label="Upvote"
                        >
                          <BiUpArrow />
                        </button>
                        <span className={styles.voteCount}>{post.upvotes || 0}</span>
                        <button 
                          className={`${styles.voteButton} ${votingStates[post.id]?.downvoted ? styles.downvoted : ''}`}
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
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {hasMoreRef.current && (
                  <div ref={loadingRef} className={styles.loadingMore}>
                    {fetchingRef.current ? 'Loading more...' : ''}
                  </div>
                )}
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