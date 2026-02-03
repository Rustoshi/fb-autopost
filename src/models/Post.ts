import { ObjectId } from 'mongodb';

export interface Post {
    _id?: ObjectId;
    quote: string;
    category: string;
    figure: string;
    imagePath: string;
    hash: string;
    facebookPostId?: string;
    postedAt: Date;
    createdAt: Date;
    qualityScore?: number;
    viralityScore?: number;
    emotion?: string;
    generatedReason?: string;
    openingWord?: string;
    tone?: string;
}

export interface PostDocument extends Post {
    _id: ObjectId;
}
