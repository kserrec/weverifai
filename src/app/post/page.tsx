"use client";
import React, { useEffect, useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './post.module.css';
import { useAuth } from '@/store/auth';
import { useDarkMode } from '@/store/darkMode';
import Header from "@/components/Header";
import TopicsSidebar from "@/components/TopicsSidebar";

const postQuestion = async (caller: string, model: string, question: string) => {
    return await fetch('/api/question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question,
            model,
            caller,
        }),
    });
};

const CreatePostPage: React.FC = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { darkMode } = useDarkMode();
    const [question, setQuestion] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [question]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.username) return;

        setLoading(true);
        try {
            const res = await postQuestion(user.username, 'gpt-3.5-turbo', question);
            if (res.ok) {
                router.push('/');
            } else {
                setResponse('Failed to post question. Please try again.');
            }
        } catch (error) {
            console.error('Error posting question:', error);
            setResponse('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(e.target.value);
    };

    // Show loading state while auth is being determined
    if (isLoading) {
        return (
            <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
                <Header onSidebarToggle={handleSidebarToggle} />
                <div className={styles.pageContent}>
                    <div className={styles.createPostBox}>
                        <div className={styles.loading}>Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <Header onSidebarToggle={handleSidebarToggle} />
            
            <div className={styles.pageContent}>
                {isMobile && (
                    <TopicsSidebar 
                        isOpen={sidebarOpen} 
                        onClose={() => setSidebarOpen(false)} 
                    />
                )}
                <div className={styles.createPostBox}>
                    <form onSubmit={handleSubmit} className={styles.createPostForm}>
                        <textarea
                            ref={textareaRef}
                            className={styles.inputField}
                            value={question}
                            onChange={handleQuestionChange}
                            placeholder="Ask your question..."
                            required
                        />
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={loading || !user?.username}
                        >
                            {loading ? 'Posting...' : 'Post Question'}
                        </button>
                    </form>
                    {loading && <div className={styles.loading}>Posting your question...</div>}
                    {response && <div className={styles.response}>{response}</div>}
                </div>
            </div>
        </div>
    );
};

export default CreatePostPage;