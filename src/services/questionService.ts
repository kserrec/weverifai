import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import type { QuestionDoc } from './types';

// models with api keys
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// adds new document to firebase questions collection
export const addNewQuestionDoc = async (answer:string, caller:string, model:string, question:string):Promise<void> => {
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

// ask specific ai model - openai-3-5 turbo
const askOpenAi35Turbo = async (model:string, question: string):Promise<string|null> => {
    const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: question }],
    });
    return completion.choices[0].message.content;
};

// handles logic to ask specific model
export const askModel = async (model:string, question:string): Promise<string|null> => {
    console.log(`Question for ${model}: ${question}`);
    switch (model) {
        case 'gpt-3.5-turbo':
            return await askOpenAi35Turbo(model, question);
        // case 'gpt-other-model':
        //     return await askOpenAiOtherModel(question, model);
        // case 'claude-model':
        //     return await askClaude(question, model);
        default: 
            throw new Error("Invalid model for question");
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