import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { QuestionDoc } from './types';

interface Post {
  id: string;
  question: string;
  answer: string;
  caller: string;
  model: string;
  timestamp: string;
}

export const getRecentPosts = async (): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, 'questions'),
      orderBy('createdAt', 'desc'),
      limit(6)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        question: data.question || 'No question provided',
        answer: data.answer || 'No answer available',
        caller: data.caller || 'Anonymous',
        model: data.model || 'Unknown model',
        timestamp: data.createdAt ? new Date(data.createdAt).toLocaleString() : 'No date'
      };
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Gets all questions from the 'questions' collection
export const getAllQuestions = async ():Promise<QuestionDoc[]> => {
    const querySnapshot = await getDocs(collection(db, 'questions'));
    const questions: QuestionDoc[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data() as QuestionDoc;
        questions.push({ ...data, id: doc.id });
    });
    return questions;
};