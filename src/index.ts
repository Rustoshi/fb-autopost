import { database } from './config/database';
import { logger } from './utils/logger';
import { PostScheduler } from './scheduler/PostScheduler';
import { PostRepository } from './repositories/PostRepository';
import { CategoryRepository } from './repositories/CategoryRepository';
import { FigureRepository } from './repositories/FigureRepository';
import { CATEGORIES, FIGURES } from './config/categories';

async function seedDatabase(): Promise<void> {
    logger.info('Seeding database...');

    const categoryRepo = new CategoryRepository();
    const figureRepo = new FigureRepository();
    const postRepo = new PostRepository();

    // Seed categories
    const categoryCount = await categoryRepo.count();
    if (categoryCount === 0) {
        logger.info('Seeding categories...');
        await categoryRepo.seedCategories(
            CATEGORIES.map(cat => ({ ...cat, createdAt: new Date() }))
        );
        logger.info(`Seeded ${CATEGORIES.length} categories`);
    }

    // Seed figures
    const figureCount = await figureRepo.count();
    if (figureCount === 0) {
        logger.info('Seeding figures...');
        await figureRepo.seedFigures(
            FIGURES.map(fig => ({ ...fig, createdAt: new Date() }))
        );
        logger.info(`Seeded ${FIGURES.length} figures`);
    }

    // Ensure indexes
    await categoryRepo.ensureIndexes();
    await figureRepo.ensureIndexes();
    await postRepo.ensureIndexes();

    logger.info('Database seeding completed');
}

async function main(): Promise<void> {
    try {
        logger.info('========================================');
        logger.info('Facebook Automation Bot Starting...');
        logger.info('========================================');

        // Connect to database
        await database.connect();

        // Seed initial data
        await seedDatabase();

        // Initialize scheduler
        const scheduler = new PostScheduler();

        // Run once and exit
        logger.info('Running post job immediately (manual trigger)...');
        await scheduler.runNow();

        logger.info('========================================');
        logger.info('Post job completed. Shutting down...');
        logger.info('========================================');

        // Disconnect and exit
        await database.disconnect();
        process.exit(0);
    } catch (error) {
        logger.error('Fatal error:', error);
        await database.disconnect();
        process.exit(1);
    }
}

// Start the application
main();
