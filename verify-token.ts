import axios from 'axios';
import dotenv from 'dotenv';
// import { env } from './src/config/env';

dotenv.config();

async function verifyToken() {
    console.log('Validating Facebook Configuration...');
    console.log('-----------------------------------');

    const pageId = process.env.FACEBOOK_PAGE_ID;
    const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageId || !token) {
        console.error('❌ Missing credentials in .env file');
        return;
    }

    console.log(`Page ID: ${pageId}`);
    console.log(`Token: ${token.substring(0, 10)}...`);

    try {
        // 1. Check Page Access
        console.log('\n1. Checking Page Access...');
        const pageResponse = await axios.get(`https://graph.facebook.com/v18.0/${pageId}?fields=name,access_token&access_token=${token}`);
        console.log('✅ Page Name:', pageResponse.data.name);

        if (pageResponse.data.id !== pageId) {
            console.error('❌ Page ID mismatch!');
        } else {
            console.log('✅ Page ID matches');
        }

        // 2. Check Permissions (Debug Token)
        console.log('\n2. Checking Token Scopes...');
        // We can't easily check 'debug_token' without an app token, but we can try to list permissions via /me/permissions if it was a user token, 
        // but for a page token, let's just try to access the feed which requires pages_manage_posts

        try {
            await axios.get(`https://graph.facebook.com/v18.0/${pageId}/feed?limit=1&access_token=${token}`);
            console.log('✅ Token has read permissions (feed access)');
        } catch (e: any) {
            console.warn('⚠️ Could not read feed (might need pages_read_engagement):', e.message);
        }

        // 3. Dry Run Post (if possible) or just confirm
        console.log('\n-----------------------------------');
        console.log('Diagnostic Result:');
        console.log('The token seems to be valid for basic access.');
        console.log('If posting failed with 403, it is likely missing "pages_manage_posts" permission.');
        console.log('-----------------------------------');

    } catch (error: any) {
        console.error('\n❌ Token Validation Failed!');
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Error:', JSON.stringify(error.response?.data, null, 2));

            const msg = error.response?.data?.error?.message || '';
            if (msg.includes('Session has expired')) {
                console.error('👉 CAUSE: The token has expired.');
            } else if (msg.includes('Error validating access token')) {
                console.error('👉 CAUSE: The token is invalid or malformed.');
            } else if (msg.includes('does not have permission')) {
                console.error('👉 CAUSE: Missing permissions (pages_manage_posts).');
            }
        } else {
            console.error(error);
        }
    }
}

verifyToken();
