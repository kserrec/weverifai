export interface ModelConfig {
    modelName: string;
    displayName: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
    { modelName: 'all', displayName: 'ALL MODELS' },
    { modelName: 'gpt-4o', displayName: 'gpt-4o' },
    { modelName: 'gpt-4o-mini', displayName: 'gpt-4o-mini' },
    // { modelName: 'o3-mini', displayName: 'o3-mini' },
    // { modelName: 'claude-3', displayName: 'CLAUDE-3' }
]; 