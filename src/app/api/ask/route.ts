import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { RequestBody } from './types';

// models with api keys
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// adds new document to firebase questions collection
const addNewQuestionDoc = async (model:string, question:string, answer:string, caller:string):Promise<void> => {
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

const askOpenAi35Turbo = async (question: string, model:string):Promise<string|null> => {
    const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: question }],
    });
    return completion.choices[0].message.content;
};

const askModel = async (question: string, model: string): Promise<string|null> => {
    console.log(`Question for ${model}: ${question}`);
    switch (model) {
        case 'gpt-3.5-turbo':
            return await askOpenAi35Turbo(question, model);
        // case 'gpt-other-model':
        //     return await askOpenAiOtherModel(question, model);
        // case 'claude-model':
        //     return await askClaude(question, model);
        default: 
            throw new Error("Invalid model for question");
    }
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
    try {
        // 1. Get request variables
        const { question, caller, model }: RequestBody = await request.json();

        // 2. Ask model question
        const answer = await askModel(question, model);
        if (!answer) {
            console.log("Invalid response from OpenAI");
            return NextResponse.json({ error: 'Invalid response from OpenAI' }, { status: 500 });
        };

        // 3. Add question with response and metadata to questions collection
        await addNewQuestionDoc(model, question, answer, caller);

        // 4. Return response
        return NextResponse.json({ answer });
    } catch (error) {
        console.error('Error in /api/ask:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
};