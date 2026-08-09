```bash
#!/usr/bin/env bash

set -o errexit

echo "========================================"
echo "Starting Nishwa Tours & Travels build"
echo "========================================"

# ------------------------------------------------------------
# Backend dependencies
# ------------------------------------------------------------

echo "Installing Python dependencies..."

pip install --upgrade pip

pip install -r backend/requirements.txt


# ------------------------------------------------------------
# Frontend dependencies
# ------------------------------------------------------------

echo "Installing frontend dependencies..."

cd frontend

npm install --legacy-peer-deps


# ------------------------------------------------------------
# Build React frontend
# ------------------------------------------------------------

echo "Building React frontend..."

npm run build


# ------------------------------------------------------------
# Finish
# ------------------------------------------------------------

cd ..

echo "========================================"
echo "Build completed successfully"
echo "========================================"

echo "Frontend build location:"
echo "frontend/build"

ls -la frontend/build || true
```
