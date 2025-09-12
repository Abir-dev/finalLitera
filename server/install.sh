#!/bin/bash

echo "🚀 LMS-kinG Backend Installation Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created from template"
    echo "⚠️  Please update .env file with your configuration before running the server"
else
    echo "✅ .env file already exists"
fi

# Check if MongoDB is running (optional)
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand('ping')" --quiet &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running or not accessible"
        echo "   Please start MongoDB or configure MongoDB Atlas connection in .env"
    fi
else
    echo "⚠️  MongoDB client not found. Please ensure MongoDB is installed and running"
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Start MongoDB (if using local instance)"
echo "3. Run 'npm run seed' to populate database with test data"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "🔑 Test accounts will be created after running 'npm run seed':"
echo "   Admin: admin@lms-king.com / admin123"
echo "   Instructor: michael.johnson@example.com / password123"
echo "   Student: john.doe@example.com / password123"
echo ""
echo "📚 API will be available at: http://localhost:5000"
echo "📖 Documentation: See README.md for detailed API documentation"
