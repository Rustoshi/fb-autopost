import { PostRepository } from '../repositories/PostRepository';
import { generateHash, calculateSimilarity } from '../utils/hash';
import { logger } from '../utils/logger';

export class UniquenessService {
    private postRepository: PostRepository;
    private readonly similarityThreshold = 0.85; // 85% similarity threshold

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    async isQuoteUnique(quote: string): Promise<boolean> {
        const hash = generateHash(quote);

        // Check exact hash match
        const existingPost = await this.postRepository.findByHash(hash);
        if (existingPost) {
            logger.warn('Quote already exists (exact match)');
            return false;
        }

        // Check similarity with recent posts
        const recentPosts = await this.postRepository.findRecent(100);

        for (const post of recentPosts) {
            const similarity = calculateSimilarity(quote, post.quote);
            if (similarity >= this.similarityThreshold) {
                logger.warn(`Quote too similar to existing post (${(similarity * 100).toFixed(1)}% similar)`);
                return false;
            }
        }

        return true;
    }

    generateQuoteHash(quote: string): string {
        return generateHash(quote);
    }
}
