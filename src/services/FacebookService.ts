import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import https from 'https';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// Force IPv4 to avoid connectivity issues
const httpsAgent = new https.Agent({ family: 4 });

export interface FacebookPostResult {
    postId: string;
}

export class FacebookService {
    private readonly baseUrl = 'https://graph.facebook.com/v18.0';
    private readonly pageId: string;
    private readonly accessToken: string;

    constructor() {
        this.pageId = env.facebookPageId;
        this.accessToken = env.facebookPageAccessToken;
    }

    async publishPost(imagePath: string, caption: string): Promise<FacebookPostResult> {
        try {
            logger.info('Publishing post to Facebook...');

            // Step 1: Upload photo
            const photoId = await this.uploadPhoto(imagePath, caption);

            // Step 2: Publish the photo
            const postId = await this.publishPhoto(photoId);

            logger.info(`Post published successfully: ${postId}`);
            return { postId };
        } catch (error) {
            logger.error('Failed to publish Facebook post:', error);
            throw new Error('Facebook posting failed');
        }
    }

    private async uploadPhoto(imagePath: string, caption: string): Promise<string> {
        const url = `${this.baseUrl}/${this.pageId}/photos`;

        const formData = new FormData();
        formData.append('source', fs.createReadStream(imagePath));
        formData.append('caption', caption);
        formData.append('published', 'false'); // Upload but don't publish yet
        formData.append('access_token', this.accessToken);

        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
            timeout: 60000, // 60 seconds
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            httpsAgent,
        });

        if (!response.data.id) {
            throw new Error('Failed to upload photo to Facebook');
        }

        logger.info(`Photo uploaded: ${response.data.id}`);
        return response.data.id;
    }

    private async publishPhoto(photoId: string): Promise<string> {
        const url = `${this.baseUrl}/${this.pageId}/feed`;

        const response = await axios.post(url, {
            attached_media: [{ media_fbid: photoId }],
            access_token: this.accessToken,
        }, { httpsAgent });

        if (!response.data.id) {
            throw new Error('Failed to publish photo on Facebook');
        }

        return response.data.id;
    }

    async testConnection(): Promise<boolean> {
        try {
            const url = `${this.baseUrl}/${this.pageId}`;
            const response = await axios.get(url, {
                params: {
                    fields: 'name,id',
                    access_token: this.accessToken,
                },
                httpsAgent,
            });

            logger.info(`Connected to Facebook Page: ${response.data.name}`);
            return true;
        } catch (error) {
            logger.error('Facebook connection test failed:', error);
            return false;
        }
    }
}
