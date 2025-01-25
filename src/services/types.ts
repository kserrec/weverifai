export interface QuestionDoc {
    id: string;
    answer: string;
    caller: string;
    createdAt: number;
    downvotes: number;
    question: string;
    model: string;
    upvotes: number;
};