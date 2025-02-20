import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, orderBy, limit, getDoc, doc, updateDoc, increment, arrayUnion, arrayRemove, where, startAfter, QueryDocumentSnapshot, QueryConstraint } from 'firebase/firestore';
import type { QuestionDoc } from './types';
import { getOrCreateTopics, incrementTopicQuestionCounts } from './topicService';

export interface QuestionResponse extends Omit<QuestionDoc, 'topicRefs'> {
    topics: string[];
    upvotes: number;
    downvotes: number;
    upvoters?: string[];
    downvoters?: string[];
    spicyScore?: number;
}

export const getRecentQuestions = async (
    postAmount: number,
    lastDoc?: QueryDocumentSnapshot
): Promise<{ questions: QuestionResponse[]; lastDoc: QueryDocumentSnapshot | null }> => {
    try {
        let queryConstraints: QueryConstraint[] = [
            orderBy('createdAt', 'desc'),
            limit(postAmount)
        ];

        if (lastDoc) {
            queryConstraints.push(startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(query(
            collection(db, 'questions'),
            ...queryConstraints
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

        return {
            questions: questionsWithTopics,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
        };
    } catch (error) {
        console.error('Error fetching questions:', error);
        return { questions: [], lastDoc: null };
    }
};

export const getTopQuestions = async (
    postAmount: number,
    lastDoc?: QueryDocumentSnapshot
): Promise<{ questions: QuestionResponse[]; lastDoc: QueryDocumentSnapshot | null }> => {
    try {
        let queryConstraints: QueryConstraint[] = [
            orderBy('upvotes', 'desc'),
            limit(postAmount)
        ];

        if (lastDoc) {
            queryConstraints.push(startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(query(
            collection(db, 'questions'),
            ...queryConstraints
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

        return {
            questions: questionsWithTopics,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
        };
    } catch (error) {
        console.error('Error fetching top questions:', error);
        return { questions: [], lastDoc: null };
    }
};

export const getHotQuestions = async (
    postAmount: number,
    lastDoc?: QueryDocumentSnapshot
): Promise<{ questions: QuestionResponse[]; lastDoc: QueryDocumentSnapshot | null }> => {
    try {
        // Calculate timestamp for 2 days ago
        const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);

        let queryConstraints: QueryConstraint[] = [
            where('createdAt', '>=', twoDaysAgo),
            orderBy('createdAt', 'desc'),
            orderBy('upvotes', 'desc'),
            limit(postAmount)
        ];

        if (lastDoc) {
            queryConstraints.push(startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(query(
            collection(db, 'questions'),
            ...queryConstraints
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

        return {
            questions: questionsWithTopics,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
        };
    } catch (error) {
        console.error('Error fetching hot questions:', error);
        return { questions: [], lastDoc: null };
    }
};

export const getSpicyQuestions = async (
    postAmount: number,
    lastDoc?: QueryDocumentSnapshot
): Promise<{ questions: QuestionResponse[]; lastDoc: QueryDocumentSnapshot | null }> => {
    try {
        let queryConstraints: QueryConstraint[] = [
            orderBy('spicyScore', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(postAmount)
        ];

        if (lastDoc) {
            queryConstraints.push(startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(query(
            collection(db, 'questions'),
            ...queryConstraints
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

        return {
            questions: questionsWithTopics,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
        };
    } catch (error) {
        console.error('Error fetching spicy questions:', error);
        return { questions: [], lastDoc: null };
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
        spicyScore: 0,
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

export const updateVote = async (
    questionId: string,
    userId: string,
    voteType: 'upvote' | 'downvote',
    isAdding: boolean
): Promise<void> => {
    const questionRef = doc(db, 'questions', questionId);
    const questionDoc = await getDoc(questionRef);
    
    if (!questionDoc.exists()) {
        throw new Error('Question not found');
    }

    const data = questionDoc.data();
    const upvotes = (data.upvotes || 0) + (voteType === 'upvote' ? (isAdding ? 1 : -1) : 0);
    const downvotes = (data.downvotes || 0) + (voteType === 'downvote' ? (isAdding ? 1 : -1) : 0);
    
    // Calculate spicy score
    const totalVotes = upvotes + downvotes;
    let spicyScore = 0;
    
    if (totalVotes >= 3 && upvotes > 0 && downvotes > 0) {
        const ratio = upvotes / totalVotes;
        const balanceScore = Math.abs(0.5 - ratio);
        spicyScore = (totalVotes * (1 - balanceScore * 2)) * Math.min(upvotes, downvotes) / Math.max(upvotes, downvotes);
    }

    const updates: { [key: string]: any } = {
        [voteType === 'upvote' ? 'upvotes' : 'downvotes']: increment(isAdding ? 1 : -1),
        [`${voteType}rs`]: isAdding ? arrayUnion(userId) : arrayRemove(userId),
        spicyScore
    };

    // Remove from opposite vote array if necessary
    const oppositeVoters = voteType === 'upvote' ? data.downvoters : data.upvoters;
    if (oppositeVoters?.includes(userId)) {
        updates[`${voteType === 'upvote' ? 'downvoters' : 'upvoters'}`] = arrayRemove(userId);
        updates[voteType === 'upvote' ? 'downvotes' : 'upvotes'] = increment(-1);
    }

    await updateDoc(questionRef, updates);
};