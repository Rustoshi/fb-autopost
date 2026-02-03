import { createCanvas } from 'canvas';
import fs from 'fs';

async function testImageGen() {
    console.log('Testing Canvas Image Generation...');

    const width = 1080;
    const height = 1080;
    const canvas = createCanvas(width, height); // alpha: false not supported in type definition in some versions, checking docs
    // actually type def might not allow it in current @types/canvas, but runtime might.
    // Let's stick to default for a moment and try simpler:
    // Maybe just context?
    const ctx = canvas.getContext('2d', { alpha: false });

    // 1. Fill Red Background (Test Basic Drawing)
    console.log('Drawing red background...');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Blue Rectangle in middle
    console.log('Drawing blue rectangle...');
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(200, 200, 680, 680);

    // 3. Draw Text (Test Font)
    console.log('Drawing text...');
    try {
        ctx.font = 'bold 100px sans-serif'; // Generic font
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('TEST IMAGE', width / 2, height / 2);
    } catch (e) {
        console.error('Error drawing text:', e);
    }

    // 4. Inspect Pixels
    const pixel1 = ctx.getImageData(10, 10, 1, 1).data; // Should be Red (255, 0, 0, 255)
    console.log(`Pixel at 10,10 (Background): R=${pixel1[0]} G=${pixel1[1]} B=${pixel1[2]} A=${pixel1[3]}`);

    const pixel2 = ctx.getImageData(500, 500, 1, 1).data; // Should be Blue (0, 0, 255, 255)
    console.log(`Pixel at 500,500 (Rectangle): R=${pixel2[0]} G=${pixel2[1]} B=${pixel2[2]} A=${pixel2[3]}`);

    // 5. Save
    const outPath = 'debug_output.png';
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved to ${outPath}`);
    console.log(`File size: ${buffer.length} bytes`);
}

testImageGen();
