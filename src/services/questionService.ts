import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, orderBy, limit, getDoc, doc, updateDoc, increment, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { QuestionDoc } from './types';
import { getOrCreateTopics, incrementTopicQuestionCounts } from './topicService';

export interface QuestionResponse extends Omit<QuestionDoc, 'topicRefs'> {
    topics: string[];
    upvotes: number;
    downvotes: number;
    upvoters?: string[];
    downvoters?: string[];
}

export const getRecentQuestions = async (postAmount: number, userId?: string): Promise<QuestionResponse[]> => {
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
        }) as QuestionDoc & { upvoters?: string[], downvoters?: string[] });

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

export const updateVote = async (questionId: string, userId: string, voteType: 'upvote' | 'downvote', value: boolean) => {
    try {
        const questionRef = doc(db, 'questions', questionId);
        const votersField = voteType === 'upvote' ? 'upvoters' : 'downvoters';
        const countField = voteType === 'upvote' ? 'upvotes' : 'downvotes';

        if (value) {
            // Adding vote
            await updateDoc(questionRef, {
                [votersField]: arrayUnion(userId),
                [countField]: increment(1)
            });
        } else {
            // Removing vote
            await updateDoc(questionRef, {
                [votersField]: arrayRemove(userId),
                [countField]: increment(-1)
            });
        }
        return true;
    } catch (error) {
        console.error('Error updating vote:', error);
        return false;
    }
};