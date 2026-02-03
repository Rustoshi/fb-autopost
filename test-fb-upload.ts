import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

async function testUpload() {
    console.log('Testing Facebook Photo Upload...');

    // 1. Create a dummy image if needed, or use existing one
    const imagePath = 'test_image.png';
    if (!fs.existsSync(imagePath)) {
        console.log('Creating dummy image...');
        // Create a small random file
        fs.writeFileSync(imagePath, Buffer.alloc(1024));
    }

    const url = `https://graph.facebook.com/v18.0/${PAGE_ID}/photos`;
    console.log(`Target URL: ${url}`);

    const formData = new FormData();
    formData.append('source', fs.createReadStream(imagePath));
    formData.append('caption', 'Test Upload');
    formData.append('published', 'false');
    formData.append('access_token', ACCESS_TOKEN);

    try {
        console.log('Uploading... (timeout set to 60s)');
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
            timeout: 60000, // 60 seconds
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });
        console.log('Upload Success!', response.data);
    } catch (error: any) {
        console.error('Upload Failed!');
        if (axios.isAxiosError(error)) {
            console.error('Code:', error.code);
            console.error('Message:', error.message);
            console.error('Response:', error.response?.data);
        } else {
            console.error(error);
        }
    }
}

testUpload();
