import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { addNewQuestionDoc, askModel, getAllQuestions } from '@/services/questionService';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        // 1. Get request variables
        const { caller, model, question } = await req.json();

        // 2. Ask model question
        const answer = await askModel(model, question);
        if (!answer) {
            console.error(`Invalid answer response from ${model}`);
            return NextResponse.json({ error: 'Error in POST /api/ask' }, { status: 500 });
        }

        // 3. Add question with response and metadata to questions collection
        await addNewQuestionDoc(answer, caller, model, question);

        // 4. Return response
        return NextResponse.json({ answer });
    } catch (error) {
        console.error('Error in POST /api/ask:', error);
        return NextResponse.json({ error: 'Error in POST /api/ask' }, { status: 500 });
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