@echo off
REM Scientific Research Portal - Setup Script for Windows

echo.
echo 🚀 Scientific Research Portal - Setup Script (Windows)
echo ======================================================
echo.

REM Backend Setup
echo Setting up Backend...

if not exist "Backend\venv" (
    echo Creating virtual environment...
    cd Backend
    python -m venv venv
    call venv\Scripts\activate.bat
    
    echo Installing Python dependencies...
    pip install -r requirements.txt
    pip install -r requirements-dev.txt
    
    cd ..
) else (
    echo Virtual environment already exists
)

echo ✓ Backend setup complete

REM Frontend Setup
echo.
echo Setting up Frontend...

if not exist "Frontend\node_modules" (
    cd Frontend
    echo Installing Node dependencies...
    call npm install
    cd ..
) else (
    echo Node modules already installed
)

echo ✓ Frontend setup complete

REM Environment Setup
echo.
echo Setting up environment files...

if not exist ".env" (
    copy .env.example .env
    echo ℹ️  .env file created. Please update with your settings.
)

if not exist "Frontend\.env" (
    (echo VITE_API_BASE_URL=http://localhost:8000/api) > Frontend\.env
    echo Created Frontend\.env
)

echo ✓ Environment setup complete

REM Database Setup
echo.
echo Setting up Database...

cd Backend
call venv\Scripts\activate.bat

echo Running migrations...
python manage.py migrate

echo.
set /p CREATE_SUPERUSER="Create superuser? (y/n): "
if /i "%CREATE_SUPERUSER%"=="y" (
    python manage.py createsuperuser
)

cd ..

echo ✓ Database setup complete

REM Final Summary
echo.
echo ======================================================
echo ✓ Setup Complete!
echo ======================================================
echo.
echo Next Steps:
echo   1. Backend: cd Backend ^&^& python manage.py runserver
echo   2. Frontend: cd Frontend ^&^& npm run dev
echo.
echo URLs:
echo   Backend: http://localhost:8000
echo   Frontend: http://localhost:5173
echo   Admin: http://localhost:8000/admin
echo.
echo For more information, see README.md
echo.
pause
