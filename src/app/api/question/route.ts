import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { addNewQuestionDoc, getAllQuestions } from '@/services/questionService';
import { askModelWithRetries, ModelError } from '@/app/api/lib/models';
import { reformatQuestion } from '@/helpers/models';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        // 1. Get request variables
        const { caller, model, question } = await req.json();

        // 2. Ask model question with retry logic for proper formatting
        try {
            const modelResponse = await askModelWithRetries(model, reformatQuestion(question));
            
            // 3. Add question with response and metadata to questions collection
            await addNewQuestionDoc(
                modelResponse.answer,
                modelResponse.topics,
                caller,
                model,
                question
            );

            // 4. Return only the answer to the user
            return NextResponse.json({ answer: modelResponse.answer });
        } catch (error) {
            if (error instanceof ModelError) {
                console.error(`Model error for ${error.modelName}: ${error.message}`);
                if (error.cause) {
                    console.error('Caused by:', error.cause);
                }
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                );
            }
            throw error; // Re-throw unexpected errors
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
