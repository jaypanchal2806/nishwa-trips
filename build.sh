```bash
#!/usr/bin/env bash

set -o errexit

echo "========================================"
echo "Starting Nishwa Trips build..."
echo "========================================"

echo ""
echo "Installing backend dependencies..."
pip install -r backend/requirements.txt

echo ""
echo "Installing frontend dependencies..."
cd frontend

echo ""
echo "Running npm install with legacy peer dependencies..."
npm install --legacy-peer-deps

echo ""
echo "Building React frontend..."
npm run build

echo ""
echo "Checking React build..."

if [ ! -d "build" ]; then
    echo "ERROR: React build folder was not created."
    exit 1
fi

echo ""
echo "========================================"
echo "Frontend build completed successfully!"
echo "Build folder found: frontend/build"
echo "========================================"
```
