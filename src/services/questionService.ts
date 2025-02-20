import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, orderBy, limit, getDoc, doc, updateDoc, increment, arrayUnion, arrayRemove, where } from 'firebase/firestore';
import type { QuestionDoc } from './types';
import { getOrCreateTopics, incrementTopicQuestionCounts } from './topicService';

export interface QuestionResponse extends Omit<QuestionDoc, 'topicRefs'> {
    topics: string[];
    upvotes: number;
    downvotes: number;
    upvoters?: string[];
    downvoters?: string[];
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

export const getTopQuestions = async (postAmount: number): Promise<QuestionResponse[]> => {
    try {
        const querySnapshot = await getDocs(query(
            collection(db, 'questions'),
            orderBy('upvotes', 'desc'),
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
        console.error('Error fetching top questions:', error);
        return [];
    }
};

export const getHotQuestions = async (postAmount: number): Promise<QuestionResponse[]> => {
    try {
        // Calculate timestamp for 2 days ago
        const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);

        const querySnapshot = await getDocs(query(
            collection(db, 'questions'),
            where('createdAt', '>=', twoDaysAgo),
            orderBy('createdAt', 'desc')
        ));

        // Get all questions with their topic references
        const questionsWithRefs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }) as QuestionDoc & { upvoters?: string[], downvoters?: string[] });

        // Sort by upvotes in memory
        const sortedQuestions = questionsWithRefs.sort((a, b) => 
            (b.upvotes || 0) - (a.upvotes || 0)
        ).slice(0, postAmount);

        // Fetch topic names for each question
        const questionsWithTopics = await Promise.all(
            sortedQuestions.map(async (question) => {
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
        console.error('Error fetching hot questions:', error);
        return [];
    }
};

export const getSpicyQuestions = async (postAmount: number): Promise<QuestionResponse[]> => {
    try {
        // Get all questions
        const querySnapshot = await getDocs(query(
            collection(db, 'questions')
        ));

        // Get all questions with their topic references
        const questionsWithRefs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }) as QuestionDoc & { upvoters?: string[], downvoters?: string[] });

        // Calculate controversy score for each post
        const scoredQuestions = questionsWithRefs.map(question => {
            const upvotes = question.upvotes || 0;
            const downvotes = question.downvotes || 0;
            const totalVotes = upvotes + downvotes;
            
            // Skip posts with very low engagement or no votes in either direction
            if (totalVotes < 3 || upvotes === 0 || downvotes === 0) {
                return { ...question, controversyScore: 0 };
            }
            
            // Calculate the balance ratio (0.5 means perfectly balanced)
            const ratio = upvotes / totalVotes;
            const balanceScore = Math.abs(0.5 - ratio);
            
            // Controversy score formula:
            // Higher when:
            // 1. Total votes is higher
            // 2. Ratio is closer to 0.5 (balanced upvotes/downvotes)
            // 3. Both upvotes and downvotes are present
            const controversyScore = (totalVotes * (1 - balanceScore * 2)) * Math.min(upvotes, downvotes) / Math.max(upvotes, downvotes);
            
            return { ...question, controversyScore };
        });

        // Sort by controversy score and take top N
        const sortedQuestions = scoredQuestions
            .sort((a, b) => (b.controversyScore || 0) - (a.controversyScore || 0))
            .slice(0, postAmount);

        // Fetch topic names for each question
        const questionsWithTopics = await Promise.all(
            sortedQuestions.map(async (question) => {
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
        console.error('Error fetching spicy questions:', error);
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