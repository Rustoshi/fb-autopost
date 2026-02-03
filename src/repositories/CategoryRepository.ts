import { Collection } from 'mongodb';
import { database } from '../config/database';
import { Category, CategoryDocument } from '../models/Category';

export class CategoryRepository {
    private collection: Collection<Category>;

    constructor() {
        this.collection = database.getDb().collection<Category>('categories');
    }

    async create(category: Omit<Category, '_id'>): Promise<CategoryDocument> {
        const result = await this.collection.insertOne(category as Category);
        return { ...category, _id: result.insertedId } as CategoryDocument;
    }

    async findByName(name: string): Promise<CategoryDocument | null> {
        return await this.collection.findOne({ name }) as CategoryDocument | null;
    }

    async findAll(): Promise<CategoryDocument[]> {
        return await this.collection.find().toArray() as CategoryDocument[];
    }

    async getRandom(): Promise<CategoryDocument | null> {
        const categories = await this.collection.aggregate<CategoryDocument>([
            { $sample: { size: 1 } }
        ]).toArray();
        return categories[0] || null;
    }

    async count(): Promise<number> {
        return await this.collection.countDocuments();
    }

    async seedCategories(categories: Omit<Category, '_id'>[]): Promise<void> {
        const count = await this.count();
        if (count === 0) {
            await this.collection.insertMany(categories as Category[]);
        }
    }

    async ensureIndexes(): Promise<void> {
        await this.collection.createIndex({ name: 1 }, { unique: true });
    }
}
