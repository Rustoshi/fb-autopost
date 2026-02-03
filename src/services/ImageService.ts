import * as PImage from 'pureimage';
import fs from 'fs';
import path from 'path';

import { env } from '../config/env';
import { logger } from '../utils/logger';
import { wrapText } from '../utils/textWrapper';

export interface QuoteCardData {
    quote: string;
    brandName: string;
    handle: string;
    profileImageUrl?: string;
    showVerified?: boolean;
}

export class ImageService {
    private fontsLoaded = false;
    private cacheDir = path.join(process.cwd(), 'tmp', 'profile-cache');

    constructor() {
        this.ensureDirs();
    }

    private async ensureDirs() {
        await fs.promises.mkdir(env.imageOutputDir, { recursive: true });
        await fs.promises.mkdir(this.cacheDir, { recursive: true });
    }

    private async ensureFontsLoaded(): Promise<void> {
        if (this.fontsLoaded) return;

        try {
            const fontsDir = path.join(process.cwd(), 'assets/fonts');

            // Lato for Quote
            const fontBold = PImage.registerFont(path.join(fontsDir, 'Lato-Bold.ttf'), 'Lato-Bold', 700, 'normal', 'normal');

            // DejaVu Serif for Name (Using local system font as fallback for Playfair)
            // This satisfies the "Serif" requirement using a reliable local file
            const fontPlayfair = PImage.registerFont('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', 'Playfair', 700, 'normal', 'normal');

            await Promise.all([fontBold.load(), fontPlayfair.load()]);
            this.fontsLoaded = true;
            logger.info('Fonts loaded successfully for PureImage');
        } catch (error) {
            logger.error('Failed to load fonts:', error);
            throw error;
        }
    }

    async generateQuoteCard(data: QuoteCardData): Promise<string> {
        await this.ensureFontsLoaded();

        const width = 1080;
        const height = 1080;
        const bitmap = PImage.make(width, height);
        const ctx = bitmap.getContext('2d');

        // 1. Background (Solid Black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // 2. Layout Constants
        const padding = 100;

        // 3. Prepare Text Content
        const quoteSize = 64;   // Larger font size
        const nameSize = 48;    // Name size

        ctx.font = `${quoteSize}pt Lato-Bold`;

        // Wrap Quote
        const wrappedQuote = wrapText(ctx, data.quote, {
            maxWidth: width - (padding * 2),
            lineHeight: quoteSize * 1.4
        });

        // 4. Calculate Vertical Centering
        // Height = Quote Block + Gap + Name Block
        const quoteHeight = wrappedQuote.lines.length * (quoteSize * 1.4);
        const gap = 60;
        const nameHeight = nameSize * 1.4; // approx

        const totalContentHeight = quoteHeight + gap + nameHeight;
        const startY = (height - totalContentHeight) / 2;

        // 5. Draw Quote
        ctx.fillStyle = '#ffffff';
        ctx.font = `${quoteSize}pt Lato-Bold`;
        ctx.textAlign = 'center';

        const centerX = width / 2;

        wrappedQuote.lines.forEach((line, i) => {
            ctx.fillText(line, centerX, startY + (i * quoteSize * 1.4) + quoteSize);
        });

        // 6. Draw Name (Quoter)
        const nameY = startY + quoteHeight + gap + nameSize; // Base line approx

        ctx.font = `${nameSize}pt Playfair`;
        ctx.fillStyle = '#dddddd'; // Slightly softer white
        ctx.textAlign = 'center';

        // Draw Name
        const nameText = `— ${data.brandName}`;
        ctx.fillText(nameText, centerX, nameY);

        // 7. Save
        const filename = `quote_${Date.now()}.png`;
        const filepath = path.join(env.imageOutputDir, filename);

        const writeStream = fs.createWriteStream(filepath);
        await PImage.encodePNGToStream(bitmap, writeStream);

        logger.info(`Quote card generated: ${filepath}`);
        return filepath;
    }
}
