import { database } from '../config/database';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { CATEGORIES } from '../config/categories';
import { logger } from '../utils/logger';

async function seedDatabase() {
    try {
        logger.info('Connecting to MongoDB...');
        await database.connect();

        const categoryRepo = new CategoryRepository();

        // Seed categories
        const categoryCount = await categoryRepo.count();
        if (categoryCount === 0) {
            logger.info('Seeding categories...');
            const categoriesWithDates = CATEGORIES.map(c => ({ ...c, createdAt: new Date() }));
            await categoryRepo.seedCategories(categoriesWithDates);
            logger.info(`Seeded ${CATEGORIES.length} categories`);
        } else {
            logger.info(`Categories already exist (${categoryCount} found), skipping seed`);
        }

        // Create indexes
        logger.info('Ensuring indexes...');
        await categoryRepo.ensureIndexes();

        logger.info('Database seeding complete!');
    } catch (error) {
        logger.error(`Seed failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        throw error;
    } finally {
        await database.disconnect();
    }
}

// Run if executed directly
seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
