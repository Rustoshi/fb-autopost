# Facebook Page Setup Guide - UPDATED

Complete guide to obtaining your Facebook Page Access Token and Page ID for the automation bot.

## Prerequisites

- A Facebook account
- A Facebook Page (create one if you don't have it)
- Basic understanding of Facebook Developer tools

---

## Part 1: Create a Facebook App & Add Pages Product

### Step 1: Go to Facebook Developers

Visit: https://developers.facebook.com/

Click **"My Apps"** in the top right corner.

### Step 2: Create a New App

1. Click **"Create App"**
2. Select **"Business"** as the app type
3. Click **"Next"**

### Step 3: Fill in App Details

- **App Name**: Choose a name (e.g., "Quote Bot")
- **App Contact Email**: Your email
- **Business Account**: Select or create one (optional)

Click **"Create App"**

### Step 4: Add Facebook Login Product

1. In your app dashboard, scroll down to **"Add Products to Your App"**
2. Find **"Facebook Login"** 
3. Click **"Set Up"**
4. Select **"Web"** as the platform
5. Enter your website URL (can be `http://localhost` for testing)
6. Click **"Save"** and **"Continue"**

### Step 5: Configure Facebook Login Settings (Optional)

> [!NOTE]
> You can skip this step if you're only using the Access Token Tool. This is only needed if you plan to use OAuth login flow.

1. In the left sidebar, click **"Facebook Login"** → **"Settings"**
2. Under **"Valid OAuth Redirect URIs"**, you can leave it empty for now or add:
   ```
   https://localhost/
   ```
3. Click **"Save Changes"**

> [!TIP]
> For this bot, you don't need to configure OAuth redirect URIs since we'll use the Access Token Tool to get tokens directly.

---

## Part 2: Get App Credentials

### Step 1: Get App ID and App Secret

1. In the left sidebar, click **"Settings"** → **"Basic"**
2. Copy your **App ID**
3. Click **"Show"** next to **App Secret** and copy it
4. Keep these safe - you'll need them later

---

## Part 3: Get Access Token Using Access Token Tool

> [!IMPORTANT]
> The Graph API Explorer may not show all permissions. Use the Access Token Tool instead.

### Step 1: Visit Access Token Tool

Visit: https://developers.facebook.com/tools/accesstoken/

### Step 2: Generate User Access Token

1. Find your app in the list
2. Click **"Generate Token"** under "User Token"
3. A permissions dialog will appear

### Step 3: Request Page Permissions

In the permissions dialog, search for and select:

- ✅ **pages_manage_posts** (required - allows posting to page)
- ✅ **pages_read_engagement** (optional - for analytics)
- ✅ **pages_show_list** (required - to list your pages)

> [!NOTE]
> If you don't see `pages_manage_posts`, your app may need to be in **Development Mode** or you may need to add your Facebook Page to the app's test users.

### Step 4: Authorize and Copy Token

1. Click **"Generate Access Token"**
2. Authorize the app when prompted
3. Copy the generated token (this is a **short-lived User Access Token**)

---

## Part 4: Exchange for Long-Lived Tokens

### Step 1: Exchange for Long-Lived User Token

Short-lived tokens expire in ~1 hour. Convert it to a long-lived token (60 days):

**Using cURL:**

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_USER_TOKEN"
```

**Using Browser:**

Visit this URL (replace the values):
```
https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_USER_TOKEN
```

**Replace:**
- `YOUR_APP_ID` - Your App ID from Step 2
- `YOUR_APP_SECRET` - Your App Secret from Step 2
- `SHORT_LIVED_USER_TOKEN` - The token from Part 3

**Response:**
```json
{
  "access_token": "LONG_LIVED_USER_TOKEN",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

Copy the `access_token` value.

### Step 2: Get Page Access Token (Never Expires!)

Now exchange the long-lived user token for a **Page Access Token** (which never expires):

**Using cURL:**
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"
```

**Using Browser:**
Visit this URL (replace the token):
```
https://graph.facebook.com/v18.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN
```

**Response:**
```json
{
  "data": [
    {
      "access_token": "PAGE_ACCESS_TOKEN_HERE",
      "category": "Community",
      "name": "Your Page Name",
      "id": "123456789012345",
      "tasks": ["ANALYZE", "ADVERTISE", "MODERATE", "CREATE_CONTENT"]
    }
  ]
}
```

**Important:**
- `access_token` - This is your **FACEBOOK_PAGE_ACCESS_TOKEN** ✅
- `id` - This is your **FACEBOOK_PAGE_ID** ✅

> [!IMPORTANT]
> The Page Access Token does **NOT expire** as long as:
> - Your app remains active
> - You don't change your Facebook password
> - You don't revoke permissions

---

## Alternative Method: Using Graph API Explorer (If Permissions Available)

### Step 1: Open Graph API Explorer

Visit: https://developers.facebook.com/tools/explorer/

### Step 2: Select Your App

In the top right, select the app you created from the dropdown.

### Step 3: Add Permissions

1. Click **"Permissions"** tab
2. Click **"Add a Permission"** dropdown
3. Look under **"Events Groups Pages"** section
4. Select:
   - ✅ `pages_manage_posts`
   - ✅ `pages_read_engagement`
   - ✅ `pages_show_list`

### Step 4: Generate Token

1. Click **"Generate Access Token"**
2. Authorize when prompted
3. Follow the exchange steps from Part 4 above

---

## Part 5: Get Your Facebook Page ID

### Method 1: From Graph API Response

If you used the token exchange method above, your Page ID is in the `id` field of the response.

### Method 2: From Facebook Page

1. Go to your Facebook Page
2. Click **"About"** in the left sidebar
3. Scroll down to the bottom
4. Look for **"Page ID"** or **"Page Transparency"**
5. Copy the numeric ID

### Method 3: From Page URL

If your page URL is: `https://www.facebook.com/YourPageName`

Visit: `https://www.facebook.com/YourPageName/about`

The Page ID will be shown in the "About" section.

### Method 4: Using Graph API

Visit this URL with your user token:
```
https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_USER_TOKEN
```

Find your page in the response and copy the `id` field.

---

## Part 6: Verify Your Tokens

### Test Your Page Access Token

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/PAGE_ID?fields=name,id&access_token=PAGE_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "name": "Your Page Name",
  "id": "123456789012345"
}
```

### Test Posting Permission

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/PAGE_ID/feed?access_token=PAGE_ACCESS_TOKEN&limit=1"
```

If this works without errors, you have the correct permissions!

---

## Part 7: Add to Your .env File

Once you have both values, add them to your `.env` file:

```env
# Facebook Graph API
FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_PAGE_ID=123456789012345
```

---

## Troubleshooting

### Error: "pages_manage_posts permission not available"

**Solution:**
1. Make sure your app is in **Development Mode** (default for new apps)
2. Use the **Access Token Tool** instead of Graph API Explorer
3. Ensure you're an admin of the Facebook Page
4. Try adding the page to your app's test users

### Error: "Invalid OAuth access token"

**Solution:**
- Token might be expired (user tokens expire)
- Make sure you're using the **Page Access Token**, not the User Access Token
- Regenerate the token following the steps above

### Error: "Permissions error"

**Solution:**
- Make sure you selected `pages_manage_posts` permission
- Re-authorize the app with correct permissions
- Check that you're an admin of the Facebook Page

### Error: "Page not found"

**Solution:**
- Verify the Page ID is correct
- Make sure you have admin access to the page
- Check that the page is published (not in draft mode)

### Can't See pages_manage_posts Permission

**Solution:**
1. **Use Access Token Tool** instead of Graph API Explorer
2. Make sure your app has **Facebook Login** product added
3. Ensure you're logged in as a Page admin
4. Try using a different browser or incognito mode
5. Check that your app is in Development Mode

---

## Security Best Practices

> [!CAUTION]
> **Never commit your access token to Git!**

1. ✅ Keep tokens in `.env` file (already in `.gitignore`)
2. ✅ Use environment variables in production
3. ✅ Regenerate tokens if accidentally exposed
4. ✅ Limit app permissions to only what's needed
5. ❌ Never share tokens publicly
6. ❌ Never hardcode tokens in source code

---

## Quick Reference

### What You Need

| Variable | Description | Example |
|----------|-------------|---------|
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Never-expiring Page token | `EAAxxxx...` (long string) |
| `FACEBOOK_PAGE_ID` | Numeric Page ID | `123456789012345` |

### Key URLs

- **Developers Console**: https://developers.facebook.com/
- **Access Token Tool**: https://developers.facebook.com/tools/accesstoken/ ⭐ **Use This**
- **Graph API Explorer**: https://developers.facebook.com/tools/explorer/
- **App Dashboard**: https://developers.facebook.com/apps/

### Required Permissions

- ✅ `pages_manage_posts` - Post to page (REQUIRED)
- ✅ `pages_read_engagement` - Read analytics (optional)
- ✅ `pages_show_list` - List pages (REQUIRED)

---

## Summary - Quick Steps

1. ✅ **Create Facebook App** at developers.facebook.com
2. ✅ **Add Facebook Login** product to your app
3. ✅ **Use Access Token Tool** (not Graph API Explorer)
4. ✅ **Generate User Token** with `pages_manage_posts` permission
5. ✅ **Exchange for Long-Lived User Token** (60 days)
6. ✅ **Exchange for Page Access Token** (never expires)
7. ✅ **Get Page ID** from the response
8. ✅ **Add both to `.env` file**
9. ✅ **Test the bot** with `npm run dev`

---

## Need Help?

If you encounter issues:

1. Check the [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api/)
2. Use [Access Token Tool](https://developers.facebook.com/tools/accesstoken/) instead of Graph API Explorer
3. Verify permissions in your app settings
4. Make sure you're a Page admin
5. Ensure app is in Development Mode

---

**You're all set!** Once you have your tokens in the `.env` file, the bot will be able to post to your Facebook Page automatically.
