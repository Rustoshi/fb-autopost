# 📚 Documentation Index

Welcome to the Facebook Automation Bot documentation!

## Quick Links

### 🚀 Getting Started
- **[QUICKSTART.md](QUICKSTART.md)** - Fast setup guide for local development
- **[README.md](README.md)** - Complete project documentation

### 🔑 Setup Guides
- **[FACEBOOK_SETUP.md](FACEBOOK_SETUP.md)** - How to get Facebook Page Access Token and Page ID
- **[GITHUB_ACTIONS.md](GITHUB_ACTIONS.md)** - Deploy with GitHub Actions (serverless)

### 📖 Reference
- **[setup.sh](setup.sh)** - Automated setup script

---

## What is This Bot?

An AI-powered automation bot that:
- ✨ Generates motivational quotes using Anthropic Claude
- 🎨 Creates beautiful quote cards with Canvas
- 📱 Posts automatically to Facebook Pages
- 🔄 Runs on a schedule (3x daily by default)
- 🚫 Prevents duplicate quotes with smart detection

---

## Choose Your Setup Path

### Option 1: Local Development (Recommended for Testing)

**Best for:** Testing, development, customization

1. Read [QUICKSTART.md](QUICKSTART.md)
2. Run `./setup.sh`
3. Configure `.env`
4. Run `npm run dev`

**Requirements:**
- Node.js 18+
- MongoDB (local or cloud)
- API credentials

---

### Option 2: GitHub Actions (Serverless)

**Best for:** Production, no server needed, free hosting

1. Read [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md)
2. Set up MongoDB Atlas (free tier)
3. Add secrets to GitHub
4. Push workflow file

**Requirements:**
- GitHub account
- MongoDB Atlas (free tier)
- API credentials

---

## Getting API Credentials

### Facebook Page Setup
📖 **[FACEBOOK_SETUP.md](FACEBOOK_SETUP.md)** - Complete guide

**You need:**
1. Facebook Page Access Token (never expires)
2. Facebook Page ID

**Time required:** ~10 minutes

### Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Create API key
4. Copy to `.env`

---

## Project Structure

```
fb-autopost/
├── src/
│   ├── config/          # Configuration & environment
│   ├── models/          # MongoDB schemas
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   │   ├── AnthropicService.ts   # Quote generation
│   │   ├── ImageService.ts       # Canvas image creation
│   │   ├── FacebookService.ts    # FB posting
│   │   └── QuoteService.ts       # Orchestration
│   ├── templates/       # Quote card designs
│   ├── utils/           # Helpers (logger, hash, text)
│   ├── scheduler/       # Cron scheduler
│   └── jobs/            # Background jobs
├── .github/workflows/   # GitHub Actions
├── assets/              # Static assets
├── output/              # Generated images
└── docs/                # This documentation
```

---

## Common Tasks

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Test Single Post
Edit `src/index.ts`, uncomment `scheduler.runNow()`, then:
```bash
npm run dev
```

### Add New Category
Edit `src/config/categories.ts`

### Change Quote Card Design
Edit `src/templates/quoteCard.ts`

### Modify Schedule
Edit `.env` → `POSTS_PER_DAY`

---

## Troubleshooting

### Canvas Installation Issues
See [QUICKSTART.md](QUICKSTART.md#troubleshooting)

### Facebook Token Problems
See [FACEBOOK_SETUP.md](FACEBOOK_SETUP.md#troubleshooting)

### GitHub Actions Issues
See [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md#troubleshooting)

### MongoDB Connection
```bash
# Check if running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

---

## Architecture

### Clean Architecture Layers

1. **Config Layer** - Environment, database, categories
2. **Data Layer** - Models, repositories
3. **Service Layer** - Business logic (Anthropic, Image, Facebook)
4. **Job Layer** - Scheduled tasks
5. **Entry Point** - Application bootstrap

### Data Flow

```
Scheduler → Job → QuoteService → [Anthropic, Image, Facebook] → Database
```

---

## Features

✅ **AI-Powered** - Claude 3.5 Sonnet for quote generation  
✅ **Beautiful Images** - Canvas with 5 gradient templates  
✅ **Smart Scheduling** - Configurable posts per day  
✅ **Duplicate Prevention** - SHA-256 + similarity detection  
✅ **Production Ready** - Error handling, retry logic, logging  
✅ **Scalable** - Clean architecture, modular code  
✅ **Flexible Deployment** - Local, server, or GitHub Actions  

---

## Support

### Documentation
- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick setup
- [FACEBOOK_SETUP.md](FACEBOOK_SETUP.md) - Facebook credentials
- [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md) - Serverless deployment

### External Resources
- [Anthropic API Docs](https://docs.anthropic.com)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [MongoDB Docs](https://docs.mongodb.com)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## License

MIT

---

**Ready to get started?** Choose your path above! 🚀
