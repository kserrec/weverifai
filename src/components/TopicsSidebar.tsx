import { useState, useEffect, useRef } from 'react';
import { getTopTopics } from '@/services/topicService';
import type { Topic } from '@/services/topicService';
import styles from './TopicsSidebar.module.css';
import { useDarkMode } from '@/store/darkMode';

interface TopicsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TopicsSidebar({ isOpen, onClose }: TopicsSidebarProps) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const { darkMode } = useDarkMode();
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            // Only handle click-outside on mobile
            if (window.innerWidth <= 768 && 
                isOpen && 
                sidebarRef.current && 
                !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const fetchTopics = async () => {
            const topTopics = await getTopTopics();
            setTopics(topTopics);
        };

        void fetchTopics();
    }, []);

    return (
        <aside 
            ref={sidebarRef}
            className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${darkMode ? styles.dark : ''}`}
        >
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
    );
} 