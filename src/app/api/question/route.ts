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

        // 2. Ask model question
        try {
            const modelResponse = await askModel(model, question);
            if (!modelResponse) {
                throw new Error('No response from model');
            }

            // 3. Immediately return the answer for UI update
            const response = NextResponse.json({ answer: modelResponse });

            // 4. Asynchronously handle topic generation and database update
            getTopicsFromAI(question, modelResponse)
                .then(topics => {
                    return addNewQuestionDoc(
                        modelResponse,
                        topics,
                        caller,
                        model,
                        question
                    );
                })
                .catch(error => {
                    console.error('Error in background processing:', error);
                });

            return response;
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
