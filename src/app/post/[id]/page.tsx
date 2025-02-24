"use client";
import { useState, useEffect } from "react";
import type { JSX } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getQuestionById, updateVote } from "@/services/questionService";
import type { QuestionResponse } from "@/services/questionService";
import styles from "../../home.module.css";
import { FaUser } from "react-icons/fa";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";
import { useDarkMode } from '@/store/darkMode';
import { useAuth } from '@/store/auth';
import Header from "@/components/Header";
import TopicsSidebar from "@/components/TopicsSidebar";

export default function PostPage(): JSX.Element {
    const { id } = useParams();
    const { darkMode } = useDarkMode();
    const { isLoggedIn, user } = useAuth();
    const [post, setPost] = useState<QuestionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isInDatabase, setIsInDatabase] = useState<boolean>(false);
    const [votingState, setVotingState] = useState<{ upvoted: boolean; downvoted: boolean }>({
        upvoted: false,
        downvoted: false
    });

    useEffect(() => {
        const fetchPost = async () => {
            if (typeof id !== 'string') return;
            
            try {
                // Try database first
                const fetchedPost = await getQuestionById(id);
                if (fetchedPost) {
                    console.log('Found post in database:', fetchedPost);
                    setPost(fetchedPost);
                    setIsInDatabase(true);
                    if (user?.email) {
                        const newVotingState = {
                            upvoted: fetchedPost.upvoters?.includes(user.email) || false,
                            downvoted: fetchedPost.downvoters?.includes(user.email) || false
                        };
                        setVotingState(newVotingState);
                    }
                    setLoading(false);
                    return;
                }

                // If not in database, start polling
                let attempts = 0;
                const maxAttempts = 10;
                const interval = setInterval(async () => {
                    attempts++;
                    console.log('Polling attempt:', attempts);
                    
                    const dbPost = await getQuestionById(id);
                    if (dbPost) {
                        console.log('Found post in database after polling:', dbPost);
                        setPost(dbPost);
                        setIsInDatabase(true);
                        if (user?.email) {
                            setVotingState({
                                upvoted: dbPost.upvoters?.includes(user.email) || false,
                                downvoted: dbPost.downvoters?.includes(user.email) || false
                            });
                        }
                        clearInterval(interval);
                    } else if (attempts >= maxAttempts) {
                        clearInterval(interval);
                    }
                }, 1000);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching post:', error);
                setLoading(false);
            }
        };

        void fetchPost();
    }, [id, user?.email]);

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        if (!isLoggedIn || !user?.email || !post || !isInDatabase) {
            console.log('Vote blocked:', { isLoggedIn, hasUser: !!user?.email, hasPost: !!post, isInDatabase });
            return;
        }

        // Check current local state for opposite vote
        const hasOppositeVote = voteType === 'upvote' 
            ? votingState.downvoted
            : votingState.upvoted;

        if (hasOppositeVote) {
            console.log('Vote blocked: Already voted in opposite direction');
            return;
        }

        // Use local state to determine if removing vote
        const isRemovingVote = voteType === 'upvote' ? votingState.upvoted : votingState.downvoted;

        // Update UI immediately
        setVotingState(prevState => ({
            upvoted: voteType === 'upvote' ? !prevState.upvoted : false,
            downvoted: voteType === 'downvote' ? !prevState.downvoted : false
        }));

        // Update post state optimistically
        const originalPost = post; // Keep a copy for error recovery
        setPost(prevPost => {
            if (!prevPost) return null;
            
            const updatedPost = {
                ...prevPost,
                [voteType === 'upvote' ? 'upvotes' : 'downvotes']: 
                    (prevPost[voteType === 'upvote' ? 'upvotes' : 'downvotes'] || 0) + (isRemovingVote ? -1 : 1)
            };

            if (voteType === 'upvote') {
                updatedPost.upvoters = isRemovingVote 
                    ? (prevPost.upvoters || []).filter(id => id !== user.email)
                    : [...(prevPost.upvoters || []), user.email];
            } else {
                updatedPost.downvoters = isRemovingVote
                    ? (prevPost.downvoters || []).filter(id => id !== user.email)
                    : [...(prevPost.downvoters || []), user.email];
            }

            return updatedPost;
        });

        try {
            // Update database in background
            await updateVote(post.id, user.email, voteType, !isRemovingVote);

            // Optionally fetch latest state after successful update
            const updatedPost = await getQuestionById(post.id);
            if (updatedPost) {
                setPost(updatedPost);
                setVotingState({
                    upvoted: updatedPost.upvoters?.includes(user.email) || false,
                    downvoted: updatedPost.downvoters?.includes(user.email) || false
                });
            }
        } catch (error) {
            console.error('Error updating vote:', error);
            // Revert to original state on error
            setPost(originalPost);
            setVotingState({
                upvoted: originalPost.upvoters?.includes(user.email) || false,
                downvoted: originalPost.downvoters?.includes(user.email) || false
            });
        }
    };

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        document.body.classList.toggle(styles.dark, darkMode);
    }, [darkMode]);

    if (loading) {
        return (
            <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
                <Header onSidebarToggle={handleSidebarToggle} />
                <div className={styles.pageContent}>
                    <div className={styles.mainContent}>
                        <div>Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
                <Header onSidebarToggle={handleSidebarToggle} />
                <div className={styles.pageContent}>
                    <div className={styles.mainContent}>
                        <div>Post not found</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <Header onSidebarToggle={handleSidebarToggle} />
            
            <div className={styles.pageContent}>
                <TopicsSidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                />
                <main className={styles.mainContent}>
                    <section className={styles.forum}>
                        <div className={styles.posts}>
                            <div className={styles.post}>
                                <div className={styles.question}>
                                    {post.question}
                                </div>
                                <div className={styles.answer}>
                                    {post.answer}
                                </div>
                                <div className={styles.postMeta}>
                                    <div className={styles.voteButtons}>
                                        <button 
                                            className={`${styles.voteButton} ${votingState.upvoted ? styles.upvoted : ''} ${!isInDatabase ? styles.disabled : ''}`}
                                            onClick={() => handleVote('upvote')}
                                            aria-label="Upvote"
                                            disabled={!isInDatabase}
                                            title={!isInDatabase ? "Voting will be enabled once the post is ready" : ""}
                                        >
                                            <BiUpArrow />
                                        </button>
                                        <span className={styles.voteCount}>{post.upvotes || 0}</span>
                                        <button 
                                            className={`${styles.voteButton} ${votingState.downvoted ? styles.downvoted : ''} ${!isInDatabase ? styles.disabled : ''}`}
                                            onClick={() => handleVote('downvote')}
                                            aria-label="Downvote"
                                            disabled={!isInDatabase}
                                            title={!isInDatabase ? "Voting will be enabled once the post is ready" : ""}
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
                        </div>
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