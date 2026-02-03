# GitHub Actions Setup Guide

This bot can run automatically every 2 hours using GitHub Actions.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier)
   - Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string (format: `mongodb+srv://user:pass@cluster.mongodb.net/fb-autopost`)
   - **Important**: Add `0.0.0.0/0` to Network Access to allow GitHub Actions

2. **Groq API Key** (Free tier)
   - Sign up at [console.groq.com](https://console.groq.com)
   - Create an API key from the dashboard

3. **Facebook Page Access Token**
   - Follow instructions in `FACEBOOK_SETUP.md`

## Setting Up GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GROQ_API_KEY` | Your Groq API key (starts with `gsk_`) |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Long-lived Facebook page access token |
| `FACEBOOK_PAGE_ID` | Your Facebook Page ID |

## Workflow Schedule

The workflow runs:
- **Automatically**: Every 2 hours (cron: `0 */2 * * *`)
- **Manually**: Click "Run workflow" button in Actions tab

## Testing

1. Push your code to GitHub
2. Go to **Actions** tab
3. Select **Scheduled Quote Post** workflow
4. Click **Run workflow** to test manually

## Monitoring

- Check the **Actions** tab for run history
- Each run logs the generated quote and Facebook post ID
- Failed runs will show error details

## Customizing Schedule

Edit `.github/workflows/post.yml` and modify the cron expression:

```yaml
schedule:
  - cron: '0 */2 * * *'  # Every 2 hours
  # - cron: '0 */4 * * *'  # Every 4 hours
  # - cron: '0 9,15,21 * * *'  # At 9am, 3pm, 9pm
```

## Notes

- GitHub Actions has a monthly free tier of 2,000 minutes for private repos
- Public repos have unlimited free minutes
- Each run takes approximately 30-60 seconds
