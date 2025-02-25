"use client";
import React, { useEffect, useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './post.module.css';
import { useAuth } from '@/store/auth';
import { useDarkMode } from '@/store/darkMode';
import Header from "@/components/Header";
import TopicsSidebar from "@/components/TopicsSidebar";
import { BiCaretDown } from 'react-icons/bi';
import { AVAILABLE_MODELS, type ModelConfig } from '@/lib/constants';

const generateModelOptions = (
    models: ModelConfig[],
    selectedModel: string,
    onModelClick: (model: string) => void
) => {
    return models
        .filter(model => model.modelName !== 'all')
        .map((model) => (
            <div 
                key={model.modelName}
                className={`${styles.filterOption} ${selectedModel === model.modelName ? styles.selected : ''}`}
                onClick={() => onModelClick(model.modelName)}
            >
                {model.displayName}
            </div>
        ));
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
    const [modelDropdownOpen, setModelDropdownOpen] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS.filter(m => m.modelName !== 'all')[0].modelName);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const modelButtonRef = useRef<HTMLButtonElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelDropdownRef.current && 
                !modelDropdownRef.current.contains(event.target as Node) &&
                !modelButtonRef.current?.contains(event.target as Node)) {
                setModelDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleModelClick = (model: string) => {
        setSelectedModel(model);
        setModelDropdownOpen(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.username) return;

        setLoading(true);
        try {
            const res = await fetch('/api/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    model: selectedModel,
                    caller: user.username,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to post question');
            }

            const data = await res.json();
            router.push(`/post/${data.id}`);
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
                <div className={styles.mainContent}>
                    <div className={styles.filterBar}>
                        <button 
                            ref={modelButtonRef}
                            className={styles.filterButton}
                            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                        >
                            {AVAILABLE_MODELS.find(m => m.modelName === selectedModel)?.displayName || selectedModel.toUpperCase()} <BiCaretDown />
                        </button>
                        {modelDropdownOpen && (
                            <div 
                                ref={modelDropdownRef}
                                className={styles.filterDropdown}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {generateModelOptions(AVAILABLE_MODELS, selectedModel, handleModelClick)}
                            </div>
                        )}
                    </div>
                    <div className={styles.createPostBox}>
                        <form onSubmit={handleSubmit} className={styles.createPostForm}>
                            <textarea
                                ref={textareaRef}
                                className={styles.inputField}
                                value={question}
                                onChange={handleQuestionChange}
                                placeholder={`Ask ${AVAILABLE_MODELS.find(m => m.modelName === selectedModel)?.displayName || selectedModel.toUpperCase()} anything...`}
                                required
                            />
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={loading || !user?.username}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </button>
                        </form>
                        {loading && <div className={styles.loading}>Posting your question...</div>}
                        {response && <div className={styles.response}>{response}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostPage;