import { ObjectId } from 'mongodb';

export interface Category {
    _id?: ObjectId;
    name: string;
    description: string;
    keywords: string[];
    createdAt: Date;
}

export interface CategoryDocument extends Category {
    _id: ObjectId;
}
