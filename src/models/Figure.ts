import { ObjectId } from 'mongodb';

export interface Figure {
    _id?: ObjectId;
    name: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    createdAt: Date;
}

export interface FigureDocument extends Figure {
    _id: ObjectId;
}
