import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { addNewQuestionDoc, getAllQuestions } from '@/services/questionService';
import { askModel } from '@/app/api/lib/models';

const getTopicsFromAI = async (question: string, modelResponse: string): Promise<string[]> => {
    const topicsPrompt = `Given the following question and its answer, provide exactly 3 keywords that best represent the main topics. Return only the 3 keywords separated by commas, nothing else.

    Question: ${question}
    Answer: ${modelResponse}`;

    const topicsResponse = await askModel('gpt-4o-mini', topicsPrompt);
    if (!topicsResponse) return [];

    return topicsResponse.split(',').map(topic => topic.trim());
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        // 1. Get request variables
        const { caller, model, question } = await req.json();

        try {
            // 2. Ask model question
            const modelResponse = await askModel(model, question);
            if (!modelResponse) {
                throw new Error('No response from model');
            }

            // 3. Generate topics
            const topics = await getTopicsFromAI(question, modelResponse);

            // 4. Write to database first
            const docRef = await addNewQuestionDoc(
                modelResponse,
                topics,
                caller,
                model,
                question
            );

            // 5. Return both the answer and the database ID
            return NextResponse.json({ 
                answer: modelResponse,
                id: docRef.id
            });

        } catch (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error in POST /api/ask:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
};

export const GET = async (): Promise<NextResponse> => {
    try {
        const questions = await getAllQuestions();
        return NextResponse.json(questions);
    } catch (error) {
        console.error('Error in GET /api/ask:', error);
        return NextResponse.json({ error: 'Error in GET /api/ask' }, { status: 500 });
    }
};
