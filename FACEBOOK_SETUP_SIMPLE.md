# Complete Facebook Setup - Step by Step

Follow these exact steps to get your Facebook tokens.

---

## Step 1: Create a Facebook Page (if you don't have one)

1. Open your browser
2. Go to: `facebook.com`
3. Click the **menu icon** (9 dots) in the top right
4. Click **"Pages"**
5. Click **"Create new Page"** button
6. Fill in:
   - **Page name**: "Daily Motivation" (or any name you want)
   - **Category**: Type "motivational" and select "Motivational Speaker"
   - **Bio**: "Daily motivational quotes"
7. Click **"Create Page"**
8. **Done!** You now have a Facebook Page

---

## Step 2: Create a Facebook App

1. Go to: `developers.facebook.com`
2. Click **"My Apps"** in top right
3. Click **"Create App"**
4. Select **"Business"** → Click **"Next"**
5. Fill in:
   - **App name**: "Quote Bot"
   - **App contact email**: Your email
6. Click **"Create App"**
7. You'll see your app dashboard

---

## Step 3: Get Your App ID and Secret

1. In the left sidebar, click **"Settings"** → **"Basic"**
2. You'll see:
   - **App ID**: Copy this number (e.g., 1234567890)
   - **App Secret**: Click "Show", then copy it
3. **Save these somewhere** - you'll need them in the next step

---

## Step 4: Get Your Access Token

### Method A: Using Graph API Explorer (Easiest)

1. Go to: `developers.facebook.com/tools/explorer`
2. In the top right, select your app from dropdown
3. Click **"Generate Access Token"** button
4. A popup will appear asking for permissions
5. In the search box, type: **pages_manage_posts**
6. Check these boxes:
   - ✅ pages_manage_posts
   - ✅ pages_read_engagement  
   - ✅ pages_show_list
7. Click **"Generate Access Token"**
8. Click **"Continue as [Your Name]"**
9. Copy the token that appears (starts with "EAAA...")
10. **This is your SHORT-LIVED token** - save it

### Method B: If Method A doesn't show permissions

1. Go to: `developers.facebook.com/tools/explorer`
2. Click **"Get User Access Token"** button
3. Scroll down and expand **"Events Groups Pages"**
4. Check:
   - ✅ pages_manage_posts
   - ✅ pages_read_engagement
   - ✅ pages_show_list
5. Click **"Generate Access Token"**
6. Copy the token

---

## Step 5: Exchange for Long-Lived Token

1. **Copy this URL template:**
   ```
   https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_TOKEN
   ```

2. **Replace these values:**
   - `YOUR_APP_ID` → Your App ID from Step 3
   - `YOUR_APP_SECRET` → Your App Secret from Step 3
   - `YOUR_SHORT_TOKEN` → The token from Step 4

3. **Paste the complete URL in your browser** and press Enter

4. You'll see a response like:
   ```json
   {
     "access_token": "LONG_TOKEN_HERE",
     "token_type": "bearer",
     "expires_in": 5183944
   }
   ```

5. **Copy the access_token value** - this is your long-lived user token

---

## Step 6: Get Your Page Access Token (Final Step!)

1. **Copy this URL template:**
   ```
   https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_LONG_LIVED_TOKEN
   ```

2. **Replace:**
   - `YOUR_LONG_LIVED_TOKEN` → The token from Step 5

3. **Paste in your browser** and press Enter

4. You'll see:
   ```json
   {
     "data": [
       {
         "access_token": "PAGE_TOKEN_HERE",
         "name": "Your Page Name",
         "id": "123456789012345"
       }
     ]
   }
   ```

5. **Copy these two values:**
   - `access_token` → This is your **FACEBOOK_PAGE_ACCESS_TOKEN**
   - `id` → This is your **FACEBOOK_PAGE_ID**

---

## Step 7: Give Me the Tokens

**Paste here in the chat:**

```
FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxx
FACEBOOK_PAGE_ID=123456789012345
```

Then I will:
- ✅ Add them to your .env file
- ✅ Test the connection
- ✅ Verify everything works

---

## Troubleshooting

**If Step 6 shows empty data `[]`:**
- You don't have a Facebook Page → Go back to Step 1
- You're not a page admin → Check facebook.com/pages

**If you get an error:**
- Make sure you replaced ALL the placeholders
- Check there are no extra spaces in the URL
- Make sure you're logged into Facebook

---

## Quick Summary

1. Create Facebook Page
2. Create Facebook App  
3. Get App ID & Secret
4. Generate short token with permissions
5. Exchange for long-lived token
6. Get page token & ID
7. Give me the tokens → I'll set everything up!

---

**Ready? Start with Step 1!**
