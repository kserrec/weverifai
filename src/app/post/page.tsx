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
    const [question, setQuestion] = useState('');
    const { darkMode } = useDarkMode();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.username) {
            console.error('Username not found');
            return;
        }
        
        setLoading(true);
        try {
            const response = await postQuestion(user.username, 'gpt-3.5-turbo', question);
            if (response.ok) {
                const data = await response.json();
                setResponse(data.answer);
                router.push('/');
            } else {
                console.error('Failed to post question');
            }
        } catch (error) {
            console.error('Error posting question:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <Header />
            
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