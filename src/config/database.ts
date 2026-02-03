import { MongoClient, Db } from 'mongodb';
import { env } from './env';
import { logger } from '../utils/logger';

class Database {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    async connect(): Promise<Db> {
        if (this.db) {
            return this.db;
        }

        try {
            logger.info('Connecting to MongoDB...');
            this.client = new MongoClient(env.mongodbUri);
            await this.client.connect();

            // Extract database name from URI or use default
            const dbName = this.extractDbName(env.mongodbUri) || 'fb-autopost';
            this.db = this.client.db(dbName);

            logger.info(`Connected to MongoDB database: ${dbName}`);
            return this.db;
        } catch (error) {
            logger.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
            logger.info('Disconnected from MongoDB');
        }
    }

    getDb(): Db {
        if (!this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.db;
    }

    private extractDbName(uri: string): string | null {
        const match = uri.match(/\/([^/?]+)(\?|$)/);
        return match ? match[1] : null;
    }
}

export const database = new Database();
