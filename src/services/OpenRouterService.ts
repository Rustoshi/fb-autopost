import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface QuoteGenerationParams {
    category: string;
    categoryKeywords: string[];
    figureName?: string;
    figureDescription?: string;
}

export interface GeneratedQuoteResult {
    quote: string;
    qualityScore: number;
    viralityScore: number;
    emotion: string;
    reason: string;
}

interface QualityCheckResult {
    score: number;
    reason: string;
    approved: boolean;
}

interface ViralityScoreResult {
    virality_score: number;
    emotion: string;
    likely_audience_reaction: string;
}

export class OpenRouterService {

    async generateQuote(params: QuoteGenerationParams): Promise<GeneratedQuoteResult> {

        // 1. Generate Quote (Master Prompt)
        const quote = await this.stepGenerateQuote(params);
        logger.info(`Generated raw quote: "${quote}"`);

        // 2. Quality Filter
        const quality = await this.stepQualityCheck(quote);
        logger.info(`Quality Score: ${quality.score}/10 (${quality.approved ? 'Approved' : 'Rejected'}) - ${quality.reason}`);

        if (!quality.approved) {
            throw new Error(`Quote rejected by quality filter: ${quality.reason}`);
        }

        // 3. Virality Score
        const virality = await this.stepViralityScore(quote);
        logger.info(`Virality Score: ${virality.virality_score}/10 - ${virality.emotion}`);

        return {
            quote,
            qualityScore: quality.score,
            viralityScore: virality.virality_score,
            emotion: virality.emotion,
            reason: virality.likely_audience_reaction
        };
    }

    private async stepGenerateQuote(params: QuoteGenerationParams): Promise<string> {
        const prompt = `You are generating short, modern, highly relatable social media quotes for Facebook and Instagram audiences.

Goal:
Produce quotes that feel emotional, simple, and easy to understand, written in modern everyday language.

The quote must encourage engagement (shares, comments, tagging friends or partners).

Structural Diversity Rules:
- **DO NOT start with these overused words**: "Sometimes", "One day", "Stop", "Walk away", "Never", "Always"
- **Use different sentence structures** each time
- **Vary your opening** - be creative with how you begin the quote
- Rotate between different tones and styles

Content Rules:
- **MUST describe real-life situations** people experience in relationships or life.
- **Avoid abstract motivation.** Focus on specific emotional moments.
- Use simple modern English.
- No philosophical or ancient wording.
- No parables or poetic metaphors.
- No Shakespeare or scripture tone.
- Avoid complex vocabulary.
- Maximum 18 words.
- Minimum 8 words.
- Sound like real relationship or life advice people say today.
- Make it emotionally relatable.
- Avoid clichés or generic motivation.
- Avoid repeating common quote phrases.
- Output only the quote text.

Tone Rotation (pick ONE for this quote):
- **Advice**: Direct guidance ("Protect your peace even if it disappoints others.")
- **Observation**: Stating a truth ("People show their true colors when they think they don't need you.")
- **Encouragement**: Uplifting support ("You bring more value than you think.")
- **Warning**: Cautionary insight ("Love shouldn't cost your self-respect.")
- **Realization**: Moment of clarity ("The moment you stop chasing, you start attracting.")
- **Reflection**: Thoughtful insight ("Silence speaks when words can't heal.")
- **Confidence**: Self-assured statement ("Your energy is too valuable to waste on doubt.")
- **Humor**: Light but real ("Funny how they remember you when they need something.")
- **Tough Love**: Hard truth ("If they wanted to, they would.")

Specific Themes to Target:
- Being ignored or undervalued
- Giving too much effort in a one-sided relationship
- Losing trust and the pain of betrayal
- The peace of moving on
- Feeling unappreciated
- Self-worth realizations
- Ambition and discipline
- Friendship dynamics
- Personal boundaries
- Financial mindset

Tone Examples (Do not copy, just match this vibe):
- "People show their true colors when they think they don't need you."
- "Protect your peace even if it disappoints others."
- "You bring more value than you think."
- "Your future changes the day your habits change."
- "Love shouldn't cost your self-respect."

Context:
Quote category: ${params.category}
${params.figureName ? `Inspired by thinking style of: ${params.figureName}` : 'Write in a modern, authentic voice.'}
But written in modern language.

Tone:
Direct, emotional, relatable, social-media friendly.

Return only one quote.`;

        return this.callLlm(prompt, 0.9);
    }

    private async stepQualityCheck(quote: string): Promise<QualityCheckResult> {
        const prompt = `Evaluate the quote for social media engagement potential.

Quote:
"${quote}"

Score the quote from 1 to 10 based on:

1. Emotional relatability
2. Simplicity of language
3. Modern conversational tone
4. Shareability
5. Likelihood people tag someone

Return JSON:
{
  "score": number,
  "reason": "short explanation",
  "approved": true/false
}

Approve only if score >= 7.`;

        const response = await this.callLlm(prompt, 0.1); // JSON mode implied by instruction, but we parse text
        try {
            // Attempt to find JSON in response if it includes markdown code blocks
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : response;
            return JSON.parse(jsonStr);
        } catch (e) {
            logger.warn('Failed to parse quality check JSON, default approve to avoid blockage:', e);
            return { score: 7, reason: "Parse error fallback", approved: true };
        }
    }

    private async stepViralityScore(quote: string): Promise<ViralityScoreResult> {
        const prompt = `Estimate the virality potential of this quote for Facebook audiences.

Quote:
"${quote}"

Score from 1–10 considering:
- Emotional impact
- Share likelihood
- Relatable situations
- Tagging potential
- Simplicity

Return JSON:
{
  "virality_score": number,
  "emotion": "main emotion triggered",
  "likely_audience_reaction": "brief explanation"
}`;

        const response = await this.callLlm(prompt, 0.1);
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : response;
            return JSON.parse(jsonStr);
        } catch (e) {
            return { virality_score: 5, emotion: "neutral", likely_audience_reaction: "average" };
        }
    }

    private async callLlm(prompt: string, temperature: number): Promise<string> {
        try {
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: env.groqModel,
                    messages: [
                        { role: 'system', content: 'You are a social media expert writer.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: temperature,
                    max_tokens: 300,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${env.groqApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 60000, // 60s timeout
                    // Force IPv4 to avoid IPv6 connectivity issues
                    httpAgent: new (require('http').Agent)({ family: 4 }),
                    httpsAgent: new (require('https').Agent)({ family: 4 }),
                }
            );

            const content = response.data?.choices?.[0]?.message?.content;
            if (!content) {
                throw new Error('Empty response from Groq');
            }
            return this.cleanText(content);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status || 'no response';
                const data = error.response?.data ? JSON.stringify(error.response.data) : 'no data';
                const code = error.code || 'no code';
                const msg = error.message || 'no message';
                logger.error(`Groq API error - Status: ${status}, Code: ${code}, Message: ${msg}, Data: ${data}`);
            } else if (error instanceof Error) {
                logger.error(`Groq API error: ${error.message}`);
            } else {
                logger.error('Groq API unknown error:', error);
            }
            throw new Error('LLM Call failed');
        }
    }

    private cleanText(text: string): string {
        return text.trim().replace(/^["']|["']$/g, '');
    }

    async generateQuoteWithRetry(
        params: QuoteGenerationParams,
        maxRetries: number = 3
    ): Promise<GeneratedQuoteResult> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.generateQuote(params);
            } catch (error: any) {
                lastError = error;
                logger.warn(`Quote generation attempt ${attempt} failed: ${error.message}`);

                // If rejection, we can retry. If API error, we also retry.
                await this.delay(1000 * attempt);
            }
        }

        throw lastError || new Error('Quote generation failed after retries');
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
