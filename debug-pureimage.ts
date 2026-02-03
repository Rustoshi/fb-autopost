import * as PImage from 'pureimage';
import fs from 'fs';
import path from 'path';

async function testPureImage() {
    console.log('Testing PureImage Generation (With Lato Fonts)...');

    // 1. Load Fonts (Use Bold for both since Regular is broken)
    const fontBold = PImage.registerFont(path.join(process.cwd(), 'assets/fonts/Lato-Bold.ttf'), 'Lato', 700, 'normal', 'normal');
    const fontReg = PImage.registerFont(path.join(process.cwd(), 'assets/fonts/Lato-Bold.ttf'), 'Lato', 400, 'normal', 'normal');

    await fontBold.load();
    await fontReg.load();
    console.log('Fonts loaded');

    // 2. Create Canvas
    const width = 1080;
    const height = 1080;
    const bitmap = PImage.make(width, height);
    const ctx = bitmap.getContext('2d');

    // 3. Fill Red Background
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, width, height);

    // 4. Draw Blue Rectangle
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(200, 200, 680, 680);

    // 5. Draw Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '100pt Lato';
    ctx.textAlign = 'center';

    // Simple text measuring check
    const metrics = ctx.measureText('TEST');
    console.log('Text Metrics:', metrics);

    ctx.fillText('TEST IMAGE', width / 2, height / 2);

    // 6. Save
    const outPath = 'debug_pure_output.png';
    await PImage.encodePNGToStream(bitmap, fs.createWriteStream(outPath));
    console.log(`Saved to ${outPath}`);

    const stats = fs.statSync(outPath);
    console.log(`File size: ${stats.size} bytes`);
}

testPureImage();
