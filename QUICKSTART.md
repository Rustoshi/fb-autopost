# 🚀 Quick Start Guide

How to run your Facebook Automation Bot.

## Prerequisities

1. **MongoDB** must be running
   ```bash
   sudo systemctl start mongod
   ```

2. **.env file** must be configured
   - `OPENROUTER_API_KEY` (Get from [openrouter.ai](https://openrouter.ai/keys))
   - `FACEBOOK_PAGE_ACCESS_TOKEN`
   - `FACEBOOK_PAGE_ID`

## 🏃‍♂️ Running the Bot

### Option 1: Development Mode (Recommended for testing)
Runs the bot directly with TypeScript (logs to console).

```bash
npm run dev
```

### Option 2: Production Mode
Builds the project and runs the compiled JavaScript.

```bash
npm run build
npm start
```

## 🧪 Testing a Single Post

To test everything **immediately** (without waiting for the schedule):

1. Edit [`src/index.ts`](src/index.ts)
2. Uncomment the line: `// await scheduler.runNow();`
3. Run `npm run dev`

The bot will perform one immediate post cycle and then continue with the schedule.

## 📝 Checking Logs

The bot logs everything to the console.

- **[INFO]** Normal operations
- **[ERROR]** Something went wrong (check tokens/keys)

## 🛑 Stopping the Bot

Press `Ctrl + C` in the terminal.
