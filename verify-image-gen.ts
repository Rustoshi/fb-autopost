import { ImageService } from './src/services/ImageService';


async function testImageService() {
    console.log('Testing ImageService...');
    const service = new ImageService();

    try {
        const imagePath = await service.generateQuoteCard({
            quote: "The only limit to our realization of tomorrow will be our doubts of today.",
            brandName: "Franklin D. Roosevelt",
            handle: "franklinroosevelt",
            showVerified: true,
            // optional profileImageUrl
        });

        console.log('Successfully generated quote card at:', imagePath);
    } catch (error) {
        console.error('Failed to generate image:', error);
    }
}

testImageService();
