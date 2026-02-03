import { Collection } from 'mongodb';
import { database } from '../config/database';
import { Figure, FigureDocument } from '../models/Figure';

export class FigureRepository {
    private collection: Collection<Figure>;

    constructor() {
        this.collection = database.getDb().collection<Figure>('figures');
    }

    async create(figure: Omit<Figure, '_id'>): Promise<FigureDocument> {
        const result = await this.collection.insertOne(figure as Figure);
        return { ...figure, _id: result.insertedId } as FigureDocument;
    }

    async findByName(name: string): Promise<FigureDocument | null> {
        return await this.collection.findOne({ name }) as FigureDocument | null;
    }

    async findAll(): Promise<FigureDocument[]> {
        return await this.collection.find().toArray() as FigureDocument[];
    }

    async getRandom(): Promise<FigureDocument | null> {
        const figures = await this.collection.aggregate<FigureDocument>([
            { $sample: { size: 1 } }
        ]).toArray();
        return figures[0] || null;
    }

    async count(): Promise<number> {
        return await this.collection.countDocuments();
    }

    async seedFigures(figures: Omit<Figure, '_id'>[]): Promise<void> {
        const count = await this.count();
        if (count === 0) {
            await this.collection.insertMany(figures as Figure[]);
        }
    }

    async ensureIndexes(): Promise<void> {
        await this.collection.createIndex({ name: 1 }, { unique: true });
    }
}
