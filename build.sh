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

npm install --legacy-peer-deps

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
