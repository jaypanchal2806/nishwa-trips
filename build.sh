#!/usr/bin/env bash

set -e

echo "========================================"
echo "Starting Nishwa Tours & Travels build"
echo "========================================"

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "Installing Node/Yarn dependencies..."
cd frontend

corepack enable
yarn install --frozen-lockfile

echo "Building React application..."
yarn build

if [ ! -f "build/index.html" ]; then
    echo "ERROR: React build failed."
    exit 1
fi

echo "React build completed successfully."

cd ..

echo "========================================"
echo "Build completed successfully"
echo "========================================"
