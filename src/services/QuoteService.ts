import { OpenRouterService } from './OpenRouterService';
import { ImageService } from './ImageService';
import { FacebookService } from './FacebookService';
import { UniquenessService } from './UniquenessService';
import { PostRepository } from '../repositories/PostRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { logger } from '../utils/logger';

// Brand attributions for quote cards
const BRAND_ATTRIBUTIONS = [
    'Anonymous',
    'Modern Life Notes',
    'Relationship Truths',
    'Daily Reminder',
    'Real Talk'
];

export interface QuotePostResult {
    quote: string;
    category: string;
    attribution: string;
    imagePath: string;
    facebookPostId: string;
}

export class QuoteService {
    private openRouterService: OpenRouterService;
    private imageService: ImageService;
    private facebookService: FacebookService;
    private uniquenessService: UniquenessService;
    private postRepository: PostRepository;
    private categoryRepository: CategoryRepository;

    constructor() {
        this.openRouterService = new OpenRouterService();
        this.imageService = new ImageService();
        this.facebookService = new FacebookService();
        this.postRepository = new PostRepository();
        this.categoryRepository = new CategoryRepository();
        this.uniquenessService = new UniquenessService(this.postRepository);
    }

    async createAndPublishPost(): Promise<QuotePostResult> {
        const maxAttempts = 5;
        let attempt = 0;

        while (attempt < maxAttempts) {
            attempt++;
            logger.info(`Creating post (attempt ${attempt}/${maxAttempts})...`);

            try {
                // Step 1: Select weighted category and random brand attribution
                const category = await this.selectWeightedCategory();
                const attribution = BRAND_ATTRIBUTIONS[Math.floor(Math.random() * BRAND_ATTRIBUTIONS.length)];

                if (!category) {
                    throw new Error('Failed to select category');
                }

                logger.info(`Selected category: ${category.name}, attribution: ${attribution}`);

                // Step 2: Generate quote
                const generated = await this.openRouterService.generateQuoteWithRetry({
                    category: category.name,
                    categoryKeywords: category.keywords,
                });

                const { quote, qualityScore, viralityScore, emotion, reason } = generated;

                logger.info(`Generated quote: "${quote}" (Quality: ${qualityScore}, Virality: ${viralityScore})`);

                // Step 3: Check uniqueness and Structural Diversity
                const isUnique = await this.uniquenessService.isQuoteUnique(quote);
                if (!isUnique) {
                    logger.warn('Quote is not unique, retrying...');
                    continue;
                }

                // Structural Diversity: Opening Word Check
                const openingWord = quote.trim().split(' ')[0].replace(/[^a-zA-Z]/g, ''); // Remove punctuation
                const bannedOpenings = ['Sometimes', 'One', 'Stop', 'Walk', 'Never', 'Always'];

                if (bannedOpenings.includes(openingWord)) {
                    logger.warn(`Quote starts with banned word "${openingWord}", retrying for diversity...`);
                    continue;
                }

                // Check against recent posts
                const recentPosts = await this.postRepository.findRecent(10);
                const recentOpenings = recentPosts.map(p => p.openingWord); // Assumes we save this now

                if (recentOpenings.includes(openingWord)) {
                    logger.warn(`Quote starts with repeated opening word "${openingWord}" (used recently), retrying...`);
                    continue;
                }

                // Step 4: Generate image
                const imagePath = await this.imageService.generateQuoteCard({
                    quote,
                    brandName: 'Limitless Mindset',
                    handle: 'limitlessmindset',
                    showVerified: true
                });

                // Step 5: Create caption
                const caption = this.createCaption(quote, category.name, 'Limitless Mindset');

                // Step 6: Publish to Facebook
                const { postId } = await this.facebookService.publishPost(imagePath, caption);

                // Step 7: Save to database
                const hash = this.uniquenessService.generateQuoteHash(quote);
                await this.postRepository.create({
                    quote,
                    category: category.name,
                    figure: attribution,
                    imagePath,
                    hash,
                    facebookPostId: postId,
                    postedAt: new Date(),
                    createdAt: new Date(),
                    qualityScore,
                    viralityScore,
                    emotion,
                    generatedReason: reason,
                    openingWord: quote.trim().split(' ')[0].replace(/[^a-zA-Z]/g, '')
                });

                logger.info('Post created and published successfully!');

                return {
                    quote,
                    category: category.name,
                    attribution: attribution,
                    imagePath,
                    facebookPostId: postId,
                };
            } catch (error) {
                logger.error(`Attempt ${attempt} failed: ${error instanceof Error ? error.stack : JSON.stringify(error)}`);
                if (attempt >= maxAttempts) {
                    throw error;
                }
            }
        }

        throw new Error('Failed to create post after maximum attempts');
    }

    private async selectWeightedCategory() {
        // Weighted distribution:
        // 40% Relationship
        // 25% Self-worth
        // 15% Ambition & Discipline
        // 10% Friendship
        // 10% Healing

        const rand = Math.random() * 100;
        let group = '';

        if (rand < 40) group = 'relationship';
        else if (rand < 65) group = 'self_worth';
        else if (rand < 80) group = 'ambition';
        else if (rand < 90) group = 'friendship';
        else group = 'healing';

        // Map groups to actual categories (matching categories.ts names exactly)
        const categoryMap: Record<string, string[]> = {
            'relationship': ['relationship_conflict', 'love_and_commitment', 'effort_imbalance', 'dating_realities', 'toxic_relationships'],
            'self_worth': ['self_worth', 'self_growth', 'personal_boundaries'],
            'ambition': ['success_drive', 'discipline', 'financial_mindset'],
            'friendship': ['friendship_truths', 'loyalty_and_trust'],
            'healing': ['breakup_healing', 'moving_on'] // Fixed: 'healing' doesn't exist, use breakup_healing
        };

        const targetCategories = categoryMap[group];
        const selectedName = targetCategories[Math.floor(Math.random() * targetCategories.length)];

        // Try DB first
        const dbCategory = await this.categoryRepository.findByName(selectedName);
        if (dbCategory) {
            return dbCategory;
        }

        // Fallback to in-memory categories
        const { CATEGORIES } = require('../config/categories');
        const memCategory = CATEGORIES.find((c: any) => c.name === selectedName);
        if (memCategory) {
            logger.warn(`Category "${selectedName}" not in DB, using in-memory fallback`);
            return memCategory;
        }

        // Last resort: return any random category from memory
        logger.warn(`Category "${selectedName}" not found anywhere, using random fallback`);
        return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    }

    private createCaption(quote: string, category: string, figureName: string): string {
        return `${quote}

— Inspired by ${figureName}

#${category} #motivation #inspiration #quotes #dailywisdom`;
    }
}
