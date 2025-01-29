import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { addNewQuestionDoc, getAllQuestions } from '@/services/questionService';

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
async function askModel(model: string, question: string): Promise<string | null> {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: question }],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        return data.choices[0]?.message?.content || null;
    } catch (error) {
        console.error('Error asking model:', error);
        return null;
    }
}
