import { useState, useEffect } from 'react';
import { getTopTopics } from '@/services/topicService';
import type { Topic } from '@/services/topicService';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './TopicsSidebar.module.css';
import { useDarkMode } from '@/store/darkMode';

export default function TopicsSidebar() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode } = useDarkMode();

    useEffect(() => {
        const fetchTopics = async () => {
            const topTopics = await getTopTopics();
            setTopics(topTopics);
        };

        void fetchTopics();
    }, []);

    return (
        <>
            {/* Mobile hamburger button */}
            <button 
                className={styles.hamburger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle sidebar"
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${darkMode ? styles.dark : ''}`}>
                <div className={styles.sidebarContent}>
                    <h2 className={styles.sidebarTitle}>Topics</h2>
                    <ul className={styles.topicsList}>
                        {topics.map((topic) => (
                            <li key={topic.id} className={styles.topicItem}>
                                {topic.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
} 