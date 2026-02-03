import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    // MongoDB
    mongodbUri: string;

    // Groq
    groqApiKey: string;
    groqModel: string;

    // Facebook
    facebookPageAccessToken: string;
    facebookPageId: string;

    // Scheduling
    postsPerDay: number;
    minDelayMinutes: number;
    maxDelayMinutes: number;

    // Application
    nodeEnv: string;
    logLevel: string;

    // Paths
    imageOutputDir: string;
    backgroundDir: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function getEnvNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue;
}

export const env: EnvConfig = {
    mongodbUri: getEnvVar('MONGODB_URI'),
    groqApiKey: getEnvVar('GROQ_API_KEY'),
    groqModel: getEnvVar('GROQ_MODEL', 'llama-3.1-70b-versatile'),
    facebookPageAccessToken: getEnvVar('FACEBOOK_PAGE_ACCESS_TOKEN'),
    facebookPageId: getEnvVar('FACEBOOK_PAGE_ID'),
    postsPerDay: getEnvNumber('POSTS_PER_DAY', 3),
    minDelayMinutes: getEnvNumber('MIN_DELAY_MINUTES', 60),
    maxDelayMinutes: getEnvNumber('MAX_DELAY_MINUTES', 180),
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    logLevel: getEnvVar('LOG_LEVEL', 'info'),
    imageOutputDir: getEnvVar('IMAGE_OUTPUT_DIR', './output/images'),
    backgroundDir: getEnvVar('BACKGROUND_DIR', './assets/backgrounds'),
};
