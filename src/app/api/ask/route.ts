import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const model = 'gpt-3.5-turbo';

interface RequestBody {
    question: string;
    caller: string;
};

const defaultVotes = {
    upvotes: 0,
    downvotes: 0,
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { question, caller }: RequestBody = await request.json();
        console.log('Question for openAI: ', JSON.stringify(question));

        const completion = await openai.chat.completions.create({
            model,
            messages: [{ role: 'user', content: question }],
        });

        const answer = completion.choices[0].message.content;
        console.log(`Response from ${model}`, JSON.stringify(answer));

        await addDoc(collection(db, 'questions'), {
            answer,
            caller,
            createdAt: Date.now(),
            question,
            model,
            ...defaultVotes,
        });

        return NextResponse.json({ answer });
    } catch (error) {
        console.error('Error in /api/ask:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}