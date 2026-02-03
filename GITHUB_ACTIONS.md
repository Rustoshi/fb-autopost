# GitHub Actions Deployment Guide

This guide explains how to run the Facebook automation bot using GitHub Actions for scheduled posting.

## Overview

GitHub Actions can run your bot on a schedule **without needing a server**. The workflow will:
- Run 3 times per day (configurable)
- Install all dependencies (including Canvas)
- Generate and post quotes to Facebook
- Store generated images as artifacts

## Advantages

✅ **No server required** - Runs on GitHub's infrastructure  
✅ **Free tier available** - 2,000 minutes/month for free  
✅ **Automatic scheduling** - Cron-based triggers  
✅ **Secure secrets** - Environment variables stored securely  
✅ **Logs and artifacts** - View execution logs and generated images  

## Limitations

⚠️ **MongoDB requirement** - You need a cloud MongoDB instance (MongoDB Atlas free tier works)  
⚠️ **Stateless execution** - Each run is independent (database provides state)  
⚠️ **Rate limits** - GitHub Actions has usage limits  
⚠️ **No persistent storage** - Generated images are temporary (uploaded as artifacts)  

---

## Setup Instructions

### Step 1: Use Cloud MongoDB

GitHub Actions can't run a local MongoDB, so you need a cloud instance.

#### Option A: MongoDB Atlas (Recommended - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster (M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/fb-autopost?retryWrites=true&w=majority
   ```

#### Option B: Other Cloud MongoDB Providers

- Railway.app
- Render.com
- DigitalOcean Managed MongoDB

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Your Facebook Page access token |
| `FACEBOOK_PAGE_ID` | Your Facebook Page ID |

> [!IMPORTANT]
> Never commit these values to your repository! Always use GitHub Secrets.

### Step 3: Push Workflow to GitHub

The workflow file is already created at `.github/workflows/post-quote.yml`.

```bash
git add .github/workflows/post-quote.yml
git commit -m "Add GitHub Actions workflow for automated posting"
git push origin main
```

### Step 4: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. If prompted, click **"I understand my workflows, go ahead and enable them"**

### Step 5: Verify Workflow

1. Go to **Actions** tab
2. You should see "Facebook Auto Post" workflow
3. Click on it to view scheduled runs

---

## Workflow Configuration

### Current Schedule

The workflow runs **3 times per day**:

```yaml
schedule:
  - cron: '0 8 * * *'   # 8:00 AM UTC
  - cron: '0 14 * * *'  # 2:00 PM UTC
  - cron: '0 20 * * *'  # 8:00 PM UTC
```

### Customize Schedule

Edit `.github/workflows/post-quote.yml` and modify the cron expressions:

```yaml
schedule:
  - cron: '0 */4 * * *'  # Every 4 hours
  - cron: '0 9,15,21 * * *'  # 9 AM, 3 PM, 9 PM UTC
  - cron: '30 6 * * *'  # 6:30 AM UTC daily
```

**Cron format:** `minute hour day month weekday`

Examples:
- `0 * * * *` - Every hour
- `0 0 * * *` - Once per day at midnight
- `0 */6 * * *` - Every 6 hours
- `0 9 * * 1-5` - 9 AM on weekdays only

> [!NOTE]
> GitHub Actions cron uses UTC timezone. Convert your local time to UTC.

### Manual Trigger

You can also trigger the workflow manually:

1. Go to **Actions** tab
2. Click **"Facebook Auto Post"**
3. Click **"Run workflow"**
4. Select branch and click **"Run workflow"**

---

## How It Works

### Workflow Steps

1. **Checkout code** - Downloads your repository
2. **Setup Node.js** - Installs Node.js 18
3. **Install Canvas dependencies** - Installs system libraries
4. **Install npm packages** - Runs `npm ci`
5. **Build TypeScript** - Compiles to JavaScript
6. **Run posting job** - Executes the quote generation and posting
7. **Upload artifacts** - Saves generated images

### Execution Flow

```mermaid
graph LR
    A[GitHub Actions Trigger] --> B[Install Dependencies]
    B --> C[Build TypeScript]
    C --> D[Run Job]
    D --> E{Success?}
    E -->|Yes| F[Upload Images]
    E -->|No| G[Log Error]
    F --> H[Complete]
    G --> H
```

### Environment Variables

The workflow sets these automatically:

```yaml
env:
  MONGODB_URI: ${{ secrets.MONGODB_URI }}
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  FACEBOOK_PAGE_ACCESS_TOKEN: ${{ secrets.FACEBOOK_PAGE_ACCESS_TOKEN }}
  FACEBOOK_PAGE_ID: ${{ secrets.FACEBOOK_PAGE_ID }}
  POSTS_PER_DAY: 1
  NODE_ENV: production
```

---

## Viewing Logs and Artifacts

### View Execution Logs

1. Go to **Actions** tab
2. Click on a workflow run
3. Click on the **"post-quote"** job
4. Expand steps to see detailed logs

### Download Generated Images

1. Go to a completed workflow run
2. Scroll to **"Artifacts"** section at the bottom
3. Download **"quote-images-XXX"** zip file
4. Images are kept for 7 days

---

## Troubleshooting

### Workflow Not Running

**Check:**
- GitHub Actions is enabled in repository settings
- Workflow file is in `.github/workflows/` directory
- Cron syntax is correct
- Repository is not archived

### Canvas Installation Fails

**Solution:**
The workflow already includes Canvas dependencies. If it still fails:

```yaml
- name: Install system dependencies for Canvas
  run: |
    sudo apt-get update
    sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev pkg-config
```

### MongoDB Connection Error

**Check:**
- MongoDB Atlas cluster is running
- Connection string is correct in secrets
- IP whitelist includes `0.0.0.0/0` (allow all IPs) in MongoDB Atlas

### Facebook API Error

**Check:**
- Page Access Token is valid and not expired
- Token has `pages_manage_posts` permission
- Page ID is correct

### Secrets Not Working

**Verify:**
- Secret names match exactly (case-sensitive)
- Secrets are set in repository settings
- No extra spaces in secret values

---

## Cost Considerations

### GitHub Actions Free Tier

- **2,000 minutes/month** for free (public repos get unlimited)
- Each run takes ~2-3 minutes
- 3 runs/day × 30 days = 90 runs/month = ~270 minutes
- **Well within free tier!** ✅

### MongoDB Atlas Free Tier

- **512 MB storage** (plenty for this use case)
- **Shared cluster** (sufficient performance)
- **No credit card required**

### Total Cost

**$0/month** if using free tiers! 🎉

---

## Alternative: Self-Hosted Runner

If you want to run on your own server:

1. Set up a self-hosted runner
2. Modify workflow to use: `runs-on: self-hosted`
3. Use local MongoDB instead of cloud

---

## Comparison: GitHub Actions vs. Server

| Feature | GitHub Actions | Self-Hosted Server |
|---------|---------------|-------------------|
| **Cost** | Free (within limits) | $5-10/month |
| **Setup** | Easy | Moderate |
| **Maintenance** | None | Required |
| **MongoDB** | Cloud required | Can use local |
| **Reliability** | High | Depends on server |
| **Scaling** | Automatic | Manual |

---

## Best Practices

1. ✅ **Use MongoDB Atlas free tier** for database
2. ✅ **Set up monitoring** - Check Actions tab regularly
3. ✅ **Test manually first** - Use workflow_dispatch trigger
4. ✅ **Monitor API usage** - Check Anthropic and Facebook quotas
5. ✅ **Review logs** - Check for errors after each run
6. ✅ **Backup data** - Export MongoDB data periodically

---

## Summary

**To run with GitHub Actions:**

1. ✅ Create MongoDB Atlas free cluster
2. ✅ Add secrets to GitHub repository
3. ✅ Push workflow file to GitHub
4. ✅ Enable GitHub Actions
5. ✅ Monitor execution in Actions tab

**The bot will now post automatically 3 times per day!**

---

## Need Help?

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cron Expression Generator](https://crontab.guru/)

---

**You're ready to automate your Facebook posts with GitHub Actions!** 🚀
