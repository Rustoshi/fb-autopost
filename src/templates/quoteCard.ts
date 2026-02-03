export interface QuoteCardTemplate {
    width: number;
    height: number;
    background: {
        type: 'gradient' | 'solid';
        colors: string[];
    };
    quote: {
        font: string;
        fontSize: number;
        color: string;
        maxWidth: number;
        lineHeight: number;
    };
    figure: {
        imageSize: number;
        nameFont: string;
        nameFontSize: number;
        nameColor: string;
    };
    branding: {
        text: string;
        font: string;
        fontSize: number;
        color: string;
    };
    padding: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}

export const defaultTemplate: QuoteCardTemplate = {
    width: 1080,
    height: 1080,
    background: {
        type: 'gradient',
        colors: ['#667eea', '#764ba2'], // Purple gradient
    },
    quote: {
        font: 'bold 48pt Lato',
        fontSize: 48,
        color: '#ffffff',
        maxWidth: 900,
        lineHeight: 65,
    },
    figure: {
        imageSize: 100,
        nameFont: 'italic 32pt Lato',
        nameFontSize: 32,
        nameColor: '#f0f0f0',
    },
    branding: {
        text: 'Daily Motivation',
        font: '24pt Lato',
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    padding: {
        top: 80,
        bottom: 80,
        left: 90,
        right: 90,
    },
};

// Alternative templates for variety
export const templates: QuoteCardTemplate[] = [
    defaultTemplate,
    {
        ...defaultTemplate,
        background: {
            type: 'gradient',
            colors: ['#f093fb', '#f5576c'], // Pink gradient
        },
    },
    {
        ...defaultTemplate,
        background: {
            type: 'gradient',
            colors: ['#4facfe', '#00f2fe'], // Blue gradient
        },
    },
    {
        ...defaultTemplate,
        background: {
            type: 'gradient',
            colors: ['#43e97b', '#38f9d7'], // Green gradient
        },
    },
    {
        ...defaultTemplate,
        background: {
            type: 'gradient',
            colors: ['#fa709a', '#fee140'], // Sunset gradient
        },
    },
];

export function getRandomTemplate(): QuoteCardTemplate {
    return templates[Math.floor(Math.random() * templates.length)];
}
