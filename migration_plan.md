# OpenRouter Integration Plan

Migrate from direct Anthropic integration to OpenRouter to support multiple LLMs.

## Required Changes

### Configuration
- [ ] Update `env.ts` to replace `ANTHROPIC_API_KEY` with `OPENROUTER_API_KEY`
- [ ] Add `OPENROUTER_MODEL` configuration (default: `anthropic/claude-3-5-sonnet`)

### Services
- [ ] Create `OpenRouterService.ts` to handle API requests
- [ ] Remove `AnthropicService.ts`
- [ ] Update `QuoteService.ts` to use `OpenRouterService`

### Dependencies
- [ ] Uninstall `@anthropic-ai/sdk`
- [ ] OpenRouter uses standard OpenAI-compatible API, so we can use `axios` directly or `openai` package. We'll use `axios` for simplicity as we already have it.

## Implementation Details

`OpenRouterService` will mirror the existing `AnthropicService` interface (`generateQuote`) so the migration is smooth.
