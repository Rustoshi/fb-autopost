#!/bin/bash

# Facebook Automation Bot - Setup Script
# This script helps set up the bot with all required dependencies

set -e

echo "=========================================="
echo "Facebook Automation Bot - Setup"
echo "=========================================="
echo ""

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "⚠️  Warning: This script is designed for Linux (Ubuntu/Debian)"
    echo "   For other systems, please install Canvas dependencies manually"
    echo "   See: https://github.com/Automattic/node-canvas#compiling"
    echo ""
fi

# Step 1: Install system dependencies for Canvas
echo "Step 1: Installing Canvas system dependencies..."
echo "This requires sudo privileges."
echo ""

if command -v apt-get &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y \
        build-essential \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg-dev \
        libgif-dev \
        librsvg2-dev \
        pkg-config
    echo "✅ System dependencies installed"
else
    echo "⚠️  apt-get not found. Please install Canvas dependencies manually:"
    echo "   - build-essential"
    echo "   - libcairo2-dev"
    echo "   - libpango1.0-dev"
    echo "   - libjpeg-dev"
    echo "   - libgif-dev"
    echo "   - librsvg2-dev"
    echo "   - pkg-config"
    exit 1
fi

echo ""

# Step 2: Install Node.js dependencies
echo "Step 2: Installing Node.js dependencies..."
npm install
echo "✅ Node.js dependencies installed"
echo ""

# Step 3: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Step 3: Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your credentials:"
    echo "   - ANTHROPIC_API_KEY"
    echo "   - FACEBOOK_PAGE_ACCESS_TOKEN"
    echo "   - FACEBOOK_PAGE_ID"
    echo "   - MONGODB_URI"
else
    echo "Step 3: .env file already exists, skipping..."
fi

echo ""

# Step 4: Check MongoDB
echo "Step 4: Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
    
    # Check if MongoDB is running
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Start it with:"
        echo "   sudo systemctl start mongod"
    fi
else
    echo "⚠️  MongoDB not found. Install it or use Docker:"
    echo "   Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env with your API credentials"
echo "2. Ensure MongoDB is running"
echo "3. Run the bot:"
echo "   npm run dev    (development mode)"
echo "   npm run build && npm start    (production mode)"
echo ""
echo "For detailed instructions, see README.md"
echo ""
