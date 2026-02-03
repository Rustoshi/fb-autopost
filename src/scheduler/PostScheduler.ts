import cron from 'node-cron';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { createPostJob } from '../jobs/createPost';

export class PostScheduler {
    private tasks: cron.ScheduledTask[] = [];

    start(): void {
        logger.info('Starting post scheduler...');

        const { postsPerDay, minDelayMinutes, maxDelayMinutes } = env;

        // Calculate interval between posts
        const hoursPerDay = 24;
        const intervalHours = hoursPerDay / postsPerDay;

        logger.info(`Scheduling ${postsPerDay} posts per day (every ~${intervalHours.toFixed(1)} hours)`);

        // Schedule posts throughout the day
        for (let i = 0; i < postsPerDay; i++) {
            const baseHour = Math.floor((i * intervalHours) % 24);
            const randomMinutes = this.getRandomDelay(minDelayMinutes, maxDelayMinutes);
            const hour = baseHour;
            const minute = randomMinutes % 60;

            const cronExpression = `${minute} ${hour} * * *`;

            logger.info(`Scheduled post ${i + 1} at ${hour}:${minute.toString().padStart(2, '0')} (cron: ${cronExpression})`);

            const task = cron.schedule(cronExpression, async () => {
                try {
                    await createPostJob();
                } catch (error) {
                    logger.error('Scheduled job failed:', error);
                }
            });

            this.tasks.push(task);
        }

        logger.info('Post scheduler started successfully');
    }

    stop(): void {
        logger.info('Stopping post scheduler...');
        this.tasks.forEach(task => task.stop());
        this.tasks = [];
        logger.info('Post scheduler stopped');
    }

    private getRandomDelay(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // For testing: run a post immediately
    async runNow(): Promise<void> {
        logger.info('Running post job immediately (manual trigger)...');
        await createPostJob();
    }
}
