import { db } from '@/lib/firebase';
import type {
    DocumentReference} from 'firebase/firestore';
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    addDoc,
    increment,
    writeBatch
} from 'firebase/firestore';

export interface Topic {
    id: string;
    name: string;
    questionCount: number;
    createdAt: number;
}

// Get or create topics, returning their document references
export const getOrCreateTopics = async (topicNames: string[]): Promise<DocumentReference[]> => {
    const topicsCollection = collection(db, 'topics');
    const topicRefs: DocumentReference[] = [];

    // Convert topic names to lowercase for consistency
    const normalizedTopicNames = topicNames.map(name => name.toLowerCase().trim());

    // Check which topics already exist
    const existingTopicsQuery = query(
        topicsCollection,
        where('name', 'in', normalizedTopicNames)
    );
    const existingTopicsSnapshot = await getDocs(existingTopicsQuery);
    
    // Create a map of existing topic names to their references
    const existingTopicMap = new Map<string, DocumentReference>();
    existingTopicsSnapshot.forEach(doc => {
        const topicData = doc.data();
        existingTopicMap.set(topicData.name, doc.ref);
    });

    // Process each topic
    for (const topicName of normalizedTopicNames) {
        if (existingTopicMap.has(topicName)) {
            // Use existing topic reference
            topicRefs.push(existingTopicMap.get(topicName)!);
        } else {
            // Create new topic
            const newTopicRef = await addDoc(topicsCollection, {
                name: topicName,
                questionCount: 0,
                createdAt: Date.now()
            });
            topicRefs.push(newTopicRef);
        }
    }

    return topicRefs;
};

// Increment the question count for given topic references
export const incrementTopicQuestionCounts = async (topicRefs: DocumentReference[]): Promise<void> => {
    const batch = writeBatch(db);
    
    for (const ref of topicRefs) {
        batch.update(ref, {
            questionCount: increment(1)
        });
    }

    await batch.commit();
}; 