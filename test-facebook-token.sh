#!/bin/bash

# Facebook Token Test Script
# This script helps you verify your Facebook tokens and permissions

echo "=========================================="
echo "Facebook Token Verification"
echo "=========================================="
echo ""

# Check if token is provided
if [ -z "$1" ]; then
    echo "Usage: ./test-facebook-token.sh YOUR_ACCESS_TOKEN"
    echo ""
    echo "Example:"
    echo "  ./test-facebook-token.sh EAAxxxxxxxxxxxx"
    exit 1
fi

TOKEN="$1"

echo "Testing token..."
echo ""

# Test 1: Get user info
echo "1. Testing user info..."
curl -s "https://graph.facebook.com/v18.0/me?access_token=$TOKEN" | jq '.'
echo ""

# Test 2: Get token info (permissions)
echo "2. Checking token permissions..."
curl -s "https://graph.facebook.com/v18.0/me/permissions?access_token=$TOKEN" | jq '.'
echo ""

# Test 3: Get pages
echo "3. Fetching your pages..."
PAGES_RESPONSE=$(curl -s "https://graph.facebook.com/v18.0/me/accounts?access_token=$TOKEN")
echo "$PAGES_RESPONSE" | jq '.'
echo ""

# Check if pages were found
PAGE_COUNT=$(echo "$PAGES_RESPONSE" | jq '.data | length')

if [ "$PAGE_COUNT" -eq 0 ]; then
    echo "=========================================="
    echo "⚠️  NO PAGES FOUND"
    echo "=========================================="
    echo ""
    echo "Possible reasons:"
    echo "1. You don't have a Facebook Page"
    echo "2. You're not an admin of any page"
    echo "3. Missing 'pages_show_list' permission"
    echo ""
    echo "Solutions:"
    echo "1. Create a page at: https://www.facebook.com/pages/create"
    echo "2. Check your pages at: https://www.facebook.com/pages"
    echo "3. Regenerate token with 'pages_show_list' permission"
else
    echo "=========================================="
    echo "✅ FOUND $PAGE_COUNT PAGE(S)"
    echo "=========================================="
    echo ""
    echo "Your pages:"
    echo "$PAGES_RESPONSE" | jq -r '.data[] | "- \(.name) (ID: \(.id))"'
    echo ""
    echo "Page Access Tokens:"
    echo "$PAGES_RESPONSE" | jq -r '.data[] | "\(.name): \(.access_token)"'
fi

echo ""
echo "=========================================="
echo "Test Complete"
echo "=========================================="
