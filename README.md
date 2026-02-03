# Facebook Automation Bot

A production-ready automation bot that generates motivational quotes using Anthropic's Claude API, creates beautiful quote cards, and publishes them to Facebook Pages on a scheduled basis.

## Features

✨ **AI-Powered Quote Generation** - Uses Anthropic Claude to generate unique, contextual motivational quotes  
🎨 **Beautiful Quote Cards** - Creates stunning gradient-based quote images using Canvas  
🔄 **Automated Scheduling** - Posts multiple times per day with configurable intervals  
🚫 **Duplicate Prevention** - SHA-256 hashing and similarity detection to ensure uniqueness  
📊 **MongoDB Storage** - Stores all posts, categories, and figures in MongoDB  
🏗️ **Clean Architecture** - Modular, scalable code with separation of concerns  
🔐 **Production Ready** - Error handling, retry logic, and graceful shutdown  

## Architecture

```
fb-autopost/
├── src/
│   ├── config/          # Configuration and environment
│   ├── models/          # MongoDB schemas
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── templates/       # Quote card templates
│   ├── utils/           # Utility functions
│   ├── scheduler/       # Cron scheduler
│   ├── jobs/            # Background jobs
│   └── index.ts         # Application entry
├── assets/              # Static assets
├── output/              # Generated images
└── package.json
```

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or cloud instance)
- **Anthropic API Key** - Get from [console.anthropic.com](https://console.anthropic.com)
- **Facebook Page Access Token** - Long-lived token with `pages_manage_posts` permission
- **Facebook Page ID** - Your Facebook Page ID

## Installation

### 1. Clone and Install Dependencies

```bash
cd /home/rustoshidev/dev/BOTS/fb-autopost
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fb-autopost

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Facebook Graph API
FACEBOOK_PAGE_ACCESS_TOKEN=your_long_lived_page_access_token
FACEBOOK_PAGE_ID=your_facebook_page_id

# Scheduling Configuration
POSTS_PER_DAY=3
MIN_DELAY_MINUTES=60
MAX_DELAY_MINUTES=180

# Application Settings
NODE_ENV=development
LOG_LEVEL=info

# Image Generation
IMAGE_OUTPUT_DIR=./output/images
BACKGROUND_DIR=./assets/backgrounds
```

### 3. Getting Facebook Credentials

#### Get Page Access Token:

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Click "Get User Access Token"
4. Select permissions: `pages_manage_posts`, `pages_read_engagement`
5. Generate token
6. Exchange for long-lived token using:

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

7. Get Page Access Token:

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"
```

#### Get Page ID:

1. Go to your Facebook Page
2. Click "About"
3. Scroll down to find Page ID

### 4. Start MongoDB

If using local MongoDB:

```bash
# Start MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Usage

### Development Mode

Run with auto-reload:

```bash
npm run dev
```

### Production Mode

Build and run:

```bash
npm run build
npm start
```

### Test Immediate Post

To test the bot without waiting for scheduled time, edit `src/index.ts` and uncomment:

```typescript
// For testing: uncomment to run immediately
await scheduler.runNow();
```

Then run:

```bash
npm run dev
```

## Configuration

### Quote Categories

Edit `src/config/categories.ts` to add or modify categories:

```typescript
export const CATEGORIES: Category[] = [
  {
    name: 'motivation',
    description: 'Drive, ambition, and achievement',
    keywords: ['success', 'ambition', 'goals', 'determination'],
  },
  // Add more categories...
];
```

### Historical Figures

Edit `src/config/categories.ts` to add or modify figures:

```typescript
export const FIGURES: Figure[] = [
  {
    name: 'Marcus Aurelius',
    description: 'Roman Emperor and Stoic philosopher',
    tags: ['stoicism', 'wisdom', 'discipline'],
  },
  // Add more figures...
];
```

### Quote Card Templates

Edit `src/templates/quoteCard.ts` to customize the visual design:

```typescript
export const defaultTemplate: QuoteCardTemplate = {
  width: 1080,
  height: 1080,
  background: {
    type: 'gradient',
    colors: ['#667eea', '#764ba2'], // Change gradient colors
  },
  // Customize fonts, sizes, colors...
};
```

### Scheduling

Adjust posting frequency in `.env`:

```env
POSTS_PER_DAY=3              # Number of posts per day
MIN_DELAY_MINUTES=60         # Minimum delay between posts
MAX_DELAY_MINUTES=180        # Maximum delay between posts
```

## How It Works

1. **Scheduler** triggers at configured intervals
2. **Category & Figure Selection** - Randomly selects from database
3. **Quote Generation** - Anthropic API generates contextual quote
4. **Uniqueness Check** - Verifies quote hasn't been posted before
5. **Image Generation** - Creates quote card using Canvas
6. **Facebook Posting** - Uploads image and publishes to Page
7. **Database Storage** - Saves post data for future reference

## Project Structure

### Configuration Layer
- `config/env.ts` - Environment variable validation
- `config/database.ts` - MongoDB connection management
- `config/categories.ts` - Categories and figures configuration

### Data Layer
- `models/` - TypeScript interfaces for MongoDB documents
- `repositories/` - Data access with repository pattern

### Service Layer
- `services/AnthropicService.ts` - Quote generation via Claude API
- `services/ImageService.ts` - Canvas-based image generation
- `services/FacebookService.ts` - Facebook Graph API integration
- `services/UniquenessService.ts` - Duplicate detection
- `services/QuoteService.ts` - Main orchestration service

### Utilities
- `utils/logger.ts` - Structured logging
- `utils/hash.ts` - SHA-256 hashing and similarity calculation
- `utils/textWrapper.ts` - Text wrapping for Canvas

### Scheduling
- `scheduler/PostScheduler.ts` - Cron-based job scheduler
- `jobs/createPost.ts` - Post creation job

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check connection
mongosh mongodb://localhost:27017/fb-autopost
```

### Facebook API Errors

- Verify your access token is valid and long-lived
- Check token permissions include `pages_manage_posts`
- Ensure Page ID is correct
- Test connection: The bot logs Facebook connection status on startup

### Canvas/Image Generation Issues

If you encounter Canvas installation issues:

```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Reinstall canvas
npm rebuild canvas
```

### Quote Generation Failures

- Verify Anthropic API key is valid
- Check API rate limits
- Review logs for specific error messages

## Logs

The bot provides detailed colored logs:

- 🔵 **DEBUG** - Detailed debugging information
- 🟢 **INFO** - General information and progress
- 🟡 **WARN** - Warnings and non-critical issues
- 🔴 **ERROR** - Errors and failures

Set log level in `.env`:

```env
LOG_LEVEL=info  # debug | info | warn | error
```

## Database Schema

### Posts Collection

```typescript
{
  _id: ObjectId,
  quote: string,
  category: string,
  figure: string,
  imagePath: string,
  hash: string,              // SHA-256 hash for uniqueness
  facebookPostId: string,    // Facebook post ID
  postedAt: Date,
  createdAt: Date
}
```

### Categories Collection

```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  keywords: string[],
  createdAt: Date
}
```

### Figures Collection

```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  imageUrl?: string,
  tags: string[],
  createdAt: Date
}
```

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Build the project
npm run build

# Start with PM2
pm2 start dist/index.js --name fb-autopost

# Save PM2 configuration
pm2 save

# Set up auto-restart on system reboot
pm2 startup
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t fb-autopost .
docker run -d --env-file .env fb-autopost
```

## License

MIT

## Support

For issues or questions, please check:
- Anthropic API documentation: https://docs.anthropic.com
- Facebook Graph API documentation: https://developers.facebook.com/docs/graph-api
- MongoDB documentation: https://docs.mongodb.com

---

**Built with ❤️ using TypeScript, Node.js, MongoDB, Anthropic Claude, and Canvas**
