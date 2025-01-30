import OpenAI from 'openai';

// models with api keys
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ask specific ai model - openai-3-5 turbo
const askOpenAi35Turbo = async (model:string, question: string):Promise<string|null> => {
    const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: question }],
    });
    return completion.choices[0].message.content;
};

// handles logic to ask specific model
export const askModel = async (model:string, question:string): Promise<string|null> => {
    console.log(`Question for ${model}: ${question}`);
    switch (model) {
        case 'gpt-3.5-turbo':
            return await askOpenAi35Turbo(model, question);
        // case 'gpt-other-model':
        //     return await askOpenAiOtherModel(question, model);
        // case 'claude-model':
        //     return await askClaude(question, model);
        default: 
            throw new Error("Invalid model for question");
    }
};