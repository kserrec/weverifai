import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { QuestionDoc } from './types';

export const getRecentQuestions = async (postAmount:number): Promise<QuestionDoc[]> => {
    try {
        const querySnapshot = await getDocs(query(
            collection(db, 'questions'),
            orderBy('createdAt', 'desc'),
            limit(postAmount)
        ));

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }) as QuestionDoc);
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
};

// adds new document to firebase questions collection
export const addNewQuestionDoc = async (answer: string, caller: string, model: string, question: string): Promise<void> => {
    await addDoc(collection(db, 'questions'), {
        answer,
        caller,
        createdAt: Date.now(),
        downvotes: 0,
        question,
        model,
        upvotes: 0,
    });
};

// Gets all questions from the 'questions' collection
export const getAllQuestions = async (): Promise<QuestionDoc[]> => {
    const querySnapshot = await getDocs(collection(db, 'questions'));
    const questions: QuestionDoc[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data() as QuestionDoc;
        questions.push({ ...data, id: doc.id });
    });
    return questions;
};