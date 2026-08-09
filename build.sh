#!/usr/bin/env bash

set -e

echo "========================================"
echo "Starting Nishwa Tours & Travels build"
echo "========================================"

echo "Installing Python dependencies..."

pip install --upgrade pip
pip install -r backend/requirements.txt


echo "Installing React dependencies..."

cd frontend

# Remove old dependency tree
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
npm install --legacy-peer-deps

# Fix AJV compatibility
npm install --save-dev ajv@8.17.1 ajv-keywords@5.1.0 --legacy-peer-deps

echo "Building React application..."

npm run build


if [ ! -f "build/index.html" ]; then
    echo "ERROR: React build failed."
    echo "frontend/build/index.html was not created."
    exit 1
fi

echo "React build completed successfully."

cd ..

echo "========================================"
echo "Build completed successfully"
echo "========================================"
