```bash
#!/usr/bin/env bash

set -e

echo "Starting Nishwa Trips build"

echo "Installing backend dependencies"
pip install -r backend/requirements.txt

echo "Installing frontend dependencies"
cd frontend

rm -rf node_modules

echo "Installing npm packages"
npm install --legacy-peer-deps

echo "Building React application"
npm run build

if [ ! -d "build" ]; then
    echo "ERROR: frontend/build was not created"
    exit 1
fi

echo "Build completed successfully"
```
