import OpenAI from 'openai';

// models with api keys
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ask specific ai model - openai-3-5 turbo
const askOpenAi = async (model:string, question: string):Promise<string|null> => {
    const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: question }],
    });
    return completion.choices[0].message.content;
};

// handles logic to ask specific model
export const askModel = async (model:string, question:string): Promise<string|null> => {
    console.log(`Question for ${model}: ${question}`);
    try {
        switch (model) {
            case 'gpt-4o':
                return await askOpenAi(model, question);
            case 'gpt-4o-mini':
                return await askOpenAi(model, question);
            case 'o3-mini':
                return await askOpenAi(model, question);
            // case 'gpt-other-model':
            //     return await askOpenAiOtherModel(question, model);
            // case 'claude-model':
            //     return await askClaude(question, model);
            default: 
                throw new Error(`Invalid model for question: ${model}`);
        }
    } catch (error) {
        throw new Error(`Failed to get response from model ${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};