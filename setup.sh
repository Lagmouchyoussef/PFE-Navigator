#!/bin/bash

# Scientific Research Portal - Setup and Development Script

set -e

echo "🚀 Scientific Research Portal - Setup Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Setup
echo -e "\n${YELLOW}1. Setting up Backend...${NC}"

if [ ! -d "Backend/venv" ]; then
    echo "Creating virtual environment..."
    cd Backend
    python -m venv venv
    
    # Activate venv
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    pip install -r requirements-dev.txt
    
    cd ..
else
    echo "Virtual environment already exists"
fi

echo -e "${GREEN}✓ Backend setup complete${NC}"

# Frontend Setup
echo -e "\n${YELLOW}2. Setting up Frontend...${NC}"

if [ ! -d "Frontend/node_modules" ]; then
    cd Frontend
    echo "Installing Node dependencies..."
    npm install
    cd ..
else
    echo "Node modules already installed"
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"

# Environment Setup
echo -e "\n${YELLOW}3. Setting up environment files...${NC}"

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}ℹ️  .env file created. Please update with your settings.${NC}"
fi

if [ ! -f "Frontend/.env" ]; then
    echo "VITE_API_BASE_URL=http://localhost:8000/api" > Frontend/.env
    echo "Created Frontend/.env"
fi

echo -e "${GREEN}✓ Environment setup complete${NC}"

# Database Setup
echo -e "\n${YELLOW}4. Setting up Database...${NC}"

cd Backend

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo "Running migrations..."
python manage.py migrate

echo -e "${YELLOW}Create superuser? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

cd ..

echo -e "${GREEN}✓ Database setup complete${NC}"

# Final Summary
echo -e "\n${GREEN}=============================================="
echo "✓ Setup Complete!"
echo "===============================================${NC}"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Backend: cd Backend && python manage.py runserver"
echo "2. Frontend: cd Frontend && npm run dev"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Admin: http://localhost:8000/admin"
echo ""
echo "For more information, see README.md"
