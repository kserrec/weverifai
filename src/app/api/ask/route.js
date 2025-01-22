import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // No "NEXT_PUBLIC_" so it's server-only
});

export async function POST(request) {
    console.log("request!: ", request);
  try {
    const { question } = await request.json();
    console.log('question!: ', JSON.stringify(question));

    // Use the new 'chat.completions.create(...)' method
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    });

    const answer = completion.choices[0].message.content;

    // Optionally store in Firestore
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