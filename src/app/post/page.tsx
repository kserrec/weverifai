"use client";
import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './post.module.css';
import { useDarkMode } from '@/store/darkMode';
import { useAuth } from '@/store/auth';

const postQuestion = async (caller: string, model: string, question: string) => {
    return await fetch('/api/question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question,
            model,
            caller: caller || 'anonymous',
        }),
    });
};

const CreatePostPage: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [question, setQuestion] = useState('');
    const { darkMode } = useDarkMode();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        if (isLoggedIn === false) {
            console.log("wooo were NOT logged in")
          router.push('/login');
        }
      }, [isLoggedIn, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await postQuestion('testing', 'gpt-3.5-turbo', question);
            const data = await res.json();
            if (data.error) {
                console.error('Error:', data.error);
                setResponse('Error getting response');
            } else {
                setResponse(data.answer);
            }
        } catch (error) {
            console.error('Error submitting question:', error);
            setResponse('Error submitting question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
            <div className={styles.createPostBox}>
                <h3>Ask GPT</h3>
                <form className={styles.createPostForm} onSubmit={handleSubmit}>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className={styles.inputField}
                        rows={10}
                        placeholder="Write your question here..."
                        required
                    />
                    {loading && <p className={styles.loading}>Getting response...</p>}
                    {response && (
                        <div className={styles.response}>
                            <h4>Response:</h4>
                            <p>{response}</p>
                        </div>
                    )}
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
            </div>

            <footer className={styles.footer}>
                <p>&copy; 2024 WeVerifAI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CreatePostPage;