"use client";
import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './post.module.css';
import { useAuth } from '@/store/auth';
import { useDarkMode } from '@/store/darkMode';
import Header from "@/components/Header";

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
    const { isLoggedIn, user } = useAuth();
    const router = useRouter();
    const { darkMode } = useDarkMode();
    const [question, setQuestion] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.username) return;

        setLoading(true);
        try {
            const res = await postQuestion(user.username, 'gpt-4', question);
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

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <Header onSidebarToggle={handleSidebarToggle} />
            
            <div className={styles.createPostBox}>
                <form onSubmit={handleSubmit} className={styles.createPostForm}>
                    <textarea
                        className={styles.inputField}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
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
    );
};

export default CreatePostPage;