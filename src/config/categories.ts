export interface Category {
    name: string;
    description: string;
    keywords: string[];
}

export interface Figure {
    name: string;
    description: string;
    imageUrl?: string;
    tags: string[];
}

export const CATEGORIES: Category[] = [
    {
        name: 'relationship_conflict',
        description: 'Navigating disagreements and finding understanding',
        keywords: ['conflict', 'understanding', 'patience', 'resolution', 'communication'],
    },
    {
        name: 'breakup_healing',
        description: 'Recovering from heartbreak and finding self again',
        keywords: ['healing', 'letting go', 'heartbreak', 'recovery', 'strength'],
    },
    {
        name: 'self_worth',
        description: 'Recognizing your own value and standards',
        keywords: ['value', 'standards', 'respect', 'confidence', 'authenticity'],
    },
    {
        name: 'loyalty_and_trust',
        description: 'The importance of faithfulness and honesty',
        keywords: ['loyalty', 'trust', 'faithfulness', 'honesty', 'integrity'],
    },
    {
        name: 'effort_imbalance',
        description: 'Addressing one-sided relationships',
        keywords: ['effort', 'reciprocity', 'balance', 'fairness', 'investment'],
    },
    {
        name: 'moving_on',
        description: 'The courage to leave what no longer serves you',
        keywords: ['growth', 'change', 'past', 'future', 'courage'],
    },
    {
        name: 'toxic_relationships',
        description: 'Identifying and escaping unhealthy patterns',
        keywords: ['boundaries', 'red flags', 'health', 'distance', 'protection'],
    },
    {
        name: 'self_growth',
        description: 'The journey of becoming your best self',
        keywords: ['growth', 'learning', 'evolution', 'potential', 'becoming'],
    },
    {
        name: 'discipline',
        description: 'Doing what needs to be done',
        keywords: ['discipline', 'consistency', 'habits', 'focus', 'willpower'],
    },
    {
        name: 'financial_mindset',
        description: 'Thinking correctly about wealth and success',
        keywords: ['money', 'wealth', 'abundance', 'freedom', 'investment'],
    },
    {
        name: 'success_drive',
        description: 'The ambition to achieve greatness',
        keywords: ['ambition', 'drive', 'goals', 'achievement', 'hustle'],
    },
    {
        name: 'friendship_truths',
        description: 'Real talk about friends and circles',
        keywords: ['friendship', 'circle', 'loyalty', 'support', 'truth'],
    },
    {
        name: 'love_and_commitment',
        description: 'Deep dedication in partnership',
        keywords: ['commitment', 'dedication', 'partnership', 'forever', 'choice'],
    },
    {
        name: 'personal_boundaries',
        description: 'Protecting your energy and space',
        keywords: ['boundaries', 'space', 'energy', 'protection', 'limits'],
    },
    {
        name: 'dating_realities',
        description: 'The modern truth about seeking love',
        keywords: ['dating', 'modern love', 'expectations', 'reality', 'search'],
    },
];

export const FIGURES: Figure[] = [
    {
        name: 'Marcus Aurelius',
        description: 'Roman Emperor and Stoic philosopher',
        tags: ['stoicism', 'wisdom', 'discipline', 'leadership'],
    },
    {
        name: 'Maya Angelou',
        description: 'Poet and civil rights activist',
        tags: ['resilience', 'courage', 'self-growth', 'healing'],
    },
    {
        name: 'Rumi',
        description: 'Persian poet and Sufi mystic',
        tags: ['love', 'spirituality', 'wisdom', 'healing'],
    },
    {
        name: 'Eleanor Roosevelt',
        description: 'Former First Lady and human rights advocate',
        tags: ['courage', 'leadership', 'self-growth', 'empowerment'],
    },
    {
        name: 'Seneca',
        description: 'Stoic philosopher',
        tags: ['stoicism', 'wisdom', 'discipline', 'life'],
    },
    {
        name: 'Buddha',
        description: 'Spiritual teacher and founder of Buddhism',
        tags: ['wisdom', 'peace', 'mindfulness', 'healing'],
    },
    {
        name: 'Oprah Winfrey',
        description: 'Media mogul and philanthropist',
        tags: ['success', 'empowerment', 'self-growth', 'motivation'],
    },
    {
        name: 'Nelson Mandela',
        description: 'Anti-apartheid revolutionary and former President',
        tags: ['courage', 'leadership', 'resilience', 'healing'],
    },
    {
        name: 'Lao Tzu',
        description: 'Ancient Chinese philosopher',
        tags: ['wisdom', 'simplicity', 'balance', 'life'],
    },
    {
        name: 'Brené Brown',
        description: 'Research professor and author',
        tags: ['vulnerability', 'courage', 'connection', 'self-growth'],
    },
];
