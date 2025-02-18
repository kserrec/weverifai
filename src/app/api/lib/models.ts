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

interface ModelResponse {
    answer: string;
    topics: string[];
}

const isValidModelResponse = (response: string): boolean => {
    try {
        const parsed = JSON.parse(response) as ModelResponse;
        return (
            typeof parsed.answer === 'string' &&
            Array.isArray(parsed.topics) &&
            parsed.topics.length === 3 &&
            parsed.topics.every(topic => typeof topic === 'string')
        );
    } catch {
        return false;
    }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ModelReturnType {
    answer: string;
    topics: string[];
}

export const askModelWithRetries = async (model: string, question: string): Promise<ModelReturnType> => {
    const maxRetries = 3;
    const minDelayMs = 200; // minimum delay between retries

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const response = await askModel(model, question);
        
        if (!response) {
            throw new Error("Model returned null response");
        }

        if (isValidModelResponse(response)) {
            const parsedResponse = JSON.parse(response) as ModelResponse;
            return {
                answer: parsedResponse.answer,
                topics: parsedResponse.topics
            };
        }

        if (attempt < maxRetries) {
            await delay(minDelayMs * attempt); // Exponential backoff
            console.log(`Retry attempt ${attempt} for model response validation`);
        }
    }

    throw new Error("Failed to get properly formatted response from model after maximum retries");
};