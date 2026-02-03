// import { CanvasRenderingContext2D } from 'canvas';
// Using any for context to support pureimage which matches most of standard API
type Context = any;

export interface WrapTextOptions {
    maxWidth: number;
    lineHeight: number;
}

export interface WrappedText {
    lines: string[];
    totalHeight: number;
}

export function wrapText(
    ctx: Context,
    text: string,
    options: WrapTextOptions
): WrappedText {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > options.maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return {
        lines,
        totalHeight: lines.length * options.lineHeight,
    };
}
