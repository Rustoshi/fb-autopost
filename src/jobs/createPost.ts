import { database } from '../config/database';
import { QuoteService } from '../services/QuoteService';
import { logger } from '../utils/logger';

/**
 * Standalone job for creating and publishing a single post.
 * Can be run directly or via GitHub Actions.
 */
async function runJob(): Promise<void> {
    logger.info('========================================');
    logger.info('Starting post creation job...');
    logger.info('========================================');

    const quoteService = new QuoteService();

    try {
        const result = await quoteService.createAndPublishPost();

        logger.info('========================================');
        logger.info('Post creation job completed successfully!');
        logger.info(`Quote: "${result.quote}"`);
        logger.info(`Category: ${result.category}`);
        logger.info(`Attribution: ${result.attribution}`);
        logger.info(`Facebook Post ID: ${result.facebookPostId}`);
        logger.info('========================================');
    } catch (error) {
        logger.error('========================================');
        logger.error('Post creation job failed:', error);
        logger.error('========================================');
        throw error;
    }
}

// If running as standalone script (e.g., GitHub Actions)
if (require.main === module) {
    (async () => {
        try {
            // Connect to database
            await database.connect();

            // Run the job
            await runJob();

            // Disconnect
            await database.disconnect();

            process.exit(0);
        } catch (error) {
            logger.error('Fatal error in standalone job:', error);
            await database.disconnect();
            process.exit(1);
        }
    })();
}

// Export for use in scheduler
export { runJob as createPostJob };
