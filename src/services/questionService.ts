import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, orderBy, limit, getDoc } from 'firebase/firestore';
import type { QuestionDoc } from './types';
import { getOrCreateTopics, incrementTopicQuestionCounts } from './topicService';

interface QuestionResponse extends Omit<QuestionDoc, 'topicRefs'> {
    topics: string[];
}

export const getRecentQuestions = async (postAmount: number): Promise<QuestionResponse[]> => {
    try {
        const querySnapshot = await getDocs(query(
            collection(db, 'questions'),
            orderBy('createdAt', 'desc'),
            limit(postAmount)
        ));

        // Get all questions with their topic references
        const questionsWithRefs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }) as QuestionDoc);

        // Fetch topic names for each question
        const questionsWithTopics = await Promise.all(
            questionsWithRefs.map(async (question) => {
                const topicDocs = await Promise.all(
                    question.topicRefs.map(ref => getDoc(ref))
                );
                
                const topics = topicDocs.map(doc => doc.data()?.name || 'Unknown Topic');
                
                return {
                    ...question,
                    topics,
                };
            })
        );

        return questionsWithTopics;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
};

// adds new document to firebase questions collection
export const addNewQuestionDoc = async (
    answer: string,
    topics: string[],
    caller: string,
    model: string,
    question: string
): Promise<void> => {
    // First, get or create topic references
    const topicRefs = await getOrCreateTopics(topics);

    // Add the question document with topic references
    await addDoc(collection(db, 'questions'), {
        answer,
        topicRefs,
        caller,
        createdAt: Date.now(),
        downvotes: 0,
        question,
        model,
        upvotes: 0,
    });

    // Increment question count for each topic
    await incrementTopicQuestionCounts(topicRefs);
};

// Gets all questions from the 'questions' collection
export const getAllQuestions = async (): Promise<QuestionResponse[]> => {
    const querySnapshot = await getDocs(collection(db, 'questions'));
    const questionsWithRefs = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }) as QuestionDoc);

    // Fetch topic names for each question
    const questionsWithTopics = await Promise.all(
        questionsWithRefs.map(async (question) => {
            const topicDocs = await Promise.all(
                question.topicRefs.map(ref => getDoc(ref))
            );
            
            const topics = topicDocs.map(doc => doc.data()?.name || 'Unknown Topic');
            
            return {
                ...question,
                topics,
            };
        })
    );

    return questionsWithTopics;
};