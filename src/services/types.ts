import type { DocumentReference } from 'firebase/firestore';

export interface QuestionDoc {
    id: string;
    answer: string;
    topicRefs: DocumentReference[];
    caller: string;
    createdAt: number;
    downvotes: number;
    question: string;
    model: string;
    upvotes: number;
};