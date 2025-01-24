import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const openAiModel = 'gpt-3.5-turbo';

interface RequestBody {
    question: string;
}

export async function POST(request: NextRequest) {
    try {
        const { question }: RequestBody = await request.json();
        console.log('Question for openAI: ', JSON.stringify(question));

        const completion = await openai.chat.completions.create({
            model: openAiModel,
            messages: [{ role: 'user', content: question }],
        });

        const answer = completion.choices[0].message.content;
        console.log(`Response from ${openAiModel}`, JSON.stringify(answer));

        await addDoc(collection(db, 'questions'), {
            question,
            answer,
            createdAt: Date.now(),
        });

        return NextResponse.json({ answer });
    } catch (error) {
        console.error('Error in /api/ask:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}