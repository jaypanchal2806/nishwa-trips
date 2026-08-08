#!/usr/bin/env bash
set -o errexit

echo "Installing backend dependencies..."
pip install -r backend/requirements.txt

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Building React frontend..."
npm run build

echo "Frontend build completed."
