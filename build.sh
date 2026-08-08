```bash
#!/usr/bin/env bash

set -e

echo "========================================"
echo "Starting Nishwa Trips build"
echo "========================================"

echo ""
echo "Installing backend dependencies..."
pip install -r backend/requirements.txt

echo ""
echo "Installing frontend dependencies..."
cd frontend

echo ""
echo "Cleaning old node modules..."
rm -rf node_modules

echo ""
echo "Installing frontend packages..."
npm install --legacy-peer-deps

echo ""
echo "Installing compatible AJV packages..."
npm install --save-dev ajv@8.17.1 ajv-keywords@5.1.0 --legacy-peer-deps

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
echo "========================================"
```
