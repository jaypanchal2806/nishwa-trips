```bash
#!/usr/bin/env bash

set -e

echo "Starting Nishwa Trips build"

echo "Installing backend dependencies"
pip install -r backend/requirements.txt

echo "Installing frontend dependencies"
cd frontend

echo "Cleaning node_modules"
rm -rf node_modules

echo "Installing npm packages"
npm install --legacy-peer-deps

echo "Installing compatible AJV packages"
npm install ajv@8.17.1 ajv-keywords@5.1.0 --save-dev --legacy-peer-deps

echo "Building React application"
npm run build

echo "Checking build folder"

if [ ! -d "build" ]; then
    echo "ERROR: frontend/build was not created"
    exit 1
fi

echo "Nishwa Trips frontend build completed successfully"
```
