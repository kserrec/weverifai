import OpenAI from 'openai';

export class ModelError extends Error {
    constructor(
        message: string,
        public readonly modelName: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'ModelError';
    }
}

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
                throw new ModelError("Invalid model for question", model);
        }
    } catch (error) {
        throw new ModelError(
            `Failed to get response from model: ${error instanceof Error ? error.message : 'Unknown error'}`,
            model,
            error
        );
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
        try {
            const response = await askModel(model, question);
            
            if (!response) {
                throw new ModelError("Model returned null response", model);
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
        } catch (error) {
            if (error instanceof ModelError) {
                throw error;
            }
            throw new ModelError(
                `Attempt ${attempt} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                model,
                error
            );
        }
    }

    throw new ModelError(
        "Failed to get properly formatted response from model after maximum retries",
        model
    );
};