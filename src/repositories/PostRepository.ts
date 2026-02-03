import { Collection } from 'mongodb';
import { database } from '../config/database';
import { Post, PostDocument } from '../models/Post';

export class PostRepository {
    private collection: Collection<Post>;

    constructor() {
        this.collection = database.getDb().collection<Post>('posts');
    }

    async create(post: Omit<Post, '_id'>): Promise<PostDocument> {
        const result = await this.collection.insertOne(post as Post);
        return { ...post, _id: result.insertedId } as PostDocument;
    }

    async findByHash(hash: string): Promise<PostDocument | null> {
        return await this.collection.findOne({ hash }) as PostDocument | null;
    }

    async findRecent(limit: number = 100): Promise<PostDocument[]> {
        return await this.collection
            .find()
            .sort({ postedAt: -1 })
            .limit(limit)
            .toArray() as PostDocument[];
    }

    async count(): Promise<number> {
        return await this.collection.countDocuments();
    }

    async ensureIndexes(): Promise<void> {
        await this.collection.createIndex({ hash: 1 }, { unique: true });
        await this.collection.createIndex({ postedAt: -1 });
        await this.collection.createIndex({ category: 1 });
    }
}
