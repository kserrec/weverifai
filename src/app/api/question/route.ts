import { OpenAI } from 'openai';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { addNewQuestionDoc, getAllQuestions } from '@/services/questionService';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const askOpenAi35Turbo = async (model: string, question: string): Promise<string|null> => {
    const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: question }],
    });
    return completion.choices[0].message.content;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { caller, model, question } = await req.json();

        const answer = await askOpenAi35Turbo(model, question);
        if (!answer) {
            console.error(`Invalid answer response from ${model}`);
            return NextResponse.json({ error: 'Error in POST /api/ask' }, { status: 500 });
        }

        await addNewQuestionDoc(answer, caller, model, question);
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