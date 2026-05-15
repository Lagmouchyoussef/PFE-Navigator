# Getting Started - Post-Refactoring Guide

Welcome to the professionally refactored Scientific Research Portal! This guide will help you get started with the new structure.

## 🎯 What's Changed?

Your project has been completely reorganized into a professional, enterprise-grade architecture. All code is now in English, properly organized, and ready for production.

### Key Changes:
- ✅ Backend: Django apps renamed and reorganized
- ✅ Frontend: Module-based structure implemented
- ✅ Language: All French names converted to English
- ✅ Documentation: Professional README, ARCHITECTURE, CONTRIBUTING guides
- ✅ Configuration: Environment-based settings and centralized config
- ✅ Code Quality: Clean, maintainable, professional structure

## 📚 Documentation Files

Read these in order:

1. **README.md** - Start here! Project overview and setup instructions
2. **ARCHITECTURE.md** - System design and technical details
3. **CONTRIBUTING.md** - How to write code and contribute
4. **REFACTORING_SUMMARY.md** - Detailed list of all changes made
5. **MIGRATIONS.md** - Database migration guide
6. **CLEANUP.md** - Instructions for removing old prototype files

## 🚀 Quick Start (5 minutes)

### Option 1: Automated Setup (Recommended)

**On Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```cmd
setup.bat
```

This will:
- Create Python virtual environment
- Install all dependencies
- Create database
- Prompt for superuser creation

### Option 2: Manual Setup

**Backend:**
```bash
cd Backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend (in new terminal):**
```bash
cd Frontend
npm install
npm run dev
```

## 🌐 Access the Application

After setup:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Health**: http://localhost:8000/api/core/health/

## 📁 Project Structure Overview

```
Projet Recherche Scientifique/
├── Backend/                 # Django REST API
│   ├── core/               # Configuration (NEW)
│   ├── apps/               # Applications (REORGANIZED)
│   │   ├── core/           # Shared functionality (NEW)
│   │   ├── users/          # User management (renamed from authentication)
│   │   ├── students/       # Students (renamed from student)
│   │   ├── supervisors/    # Supervisors (renamed from supervisor)
│   │   ├── juries/         # Jury (renamed from jury)
│   │   └── projects/       # Projects (new, consolidated)
│   ├── shared/             # Utilities (NEW)
│   ├── manage.py
│   └── requirements.txt
│
├── Frontend/                # React Application (REORGANIZED)
│   ├── src/
│   │   ├── config/         # Configuration (NEW)
│   │   ├── modules/        # Features (NEW structure)
│   │   ├── common/         # Shared code (NEW)
│   │   ├── context/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── README.md               # Project overview (NEW)
├── ARCHITECTURE.md         # System design (NEW)
├── CONTRIBUTING.md         # Development guide (NEW)
├── REFACTORING_SUMMARY.md  # Detailed changes (NEW)
├── MIGRATIONS.md           # Database guide (NEW)
├── CLEANUP.md              # Cleanup instructions (NEW)
├── .env.example            # Environment template (NEW)
├── setup.sh                # Linux/Mac setup (NEW)
├── setup.bat               # Windows setup (NEW)
└── .gitignore             # Git ignore (UPDATED)
```

## 🔑 Key Features of New Structure

### Backend
✅ **Layered Architecture**
- Core configuration separated
- Shared utilities centralized
- Each app is self-contained

✅ **Security**
- Environment-based configuration
- Role-based permissions
- Custom exception handling
- CORS properly configured

✅ **Scalability**
- Clean separation of concerns
- Easy to add new features
- Database-agnostic design
- Ready for PostgreSQL migration

### Frontend
✅ **Module Organization**
- Feature-based structure
- Shared components separate
- Centralized API configuration
- Reusable utilities and hooks

✅ **Type Safety**
- Full TypeScript support
- Proper interfaces defined
- No `any` types used

✅ **Maintainability**
- Clear naming conventions
- All English terminology
- Easy to understand
- Professional structure

## 🛠️ Common Development Tasks

### Adding a New Feature

**Backend:**
1. Create app: `python manage.py startapp feature_name`
2. Add models in `models.py`
3. Create serializer in `serializers.py`
4. Create views in `views.py`
5. Add URLs in `urls.py`
6. Create tests in `tests.py`
7. Run migration: `python manage.py makemigrations && migrate`

**Frontend:**
1. Create module in `src/modules/feature_name/`
2. Add components, hooks, services
3. Update routing in `App.tsx`
4. Create tests

### Working with Database

**Create migrations:**
```bash
cd Backend
python manage.py makemigrations
python manage.py migrate
```

**Create superuser:**
```bash
cd Backend
python manage.py createsuperuser
```

**Access admin panel:**
Visit http://localhost:8000/admin

### Running Tests

**Backend:**
```bash
cd Backend
pytest
```

**Frontend:**
```bash
cd Frontend
npm test
```

### Code Quality

**Format Python code:**
```bash
cd Backend
black .
isort .
```

**Lint Python code:**
```bash
cd Backend
flake8 .
```

**Format TypeScript:**
```bash
cd Frontend
npm run lint
```

## 📋 Checklist for Getting Started

- [ ] Read README.md
- [ ] Run setup script (setup.sh or setup.bat)
- [ ] Verify backend runs at localhost:8000
- [ ] Verify frontend runs at localhost:5173
- [ ] Login to admin panel
- [ ] Read ARCHITECTURE.md
- [ ] Read CONTRIBUTING.md
- [ ] Familiarize yourself with new structure
- [ ] Make a test feature branch
- [ ] Review the code organization

## 🎓 Learning Resources

### Backend (Django/Python)
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Best Practices](https://docs.djangoproject.com/en/stable/intro/install/)

### Frontend (React/TypeScript)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Tools
- [Git Documentation](https://git-scm.com/doc)
- [REST API Best Practices](https://restfulapi.net/)
- [RESTful Architecture](https://en.wikipedia.org/wiki/Representational_state_transfer)

## 🐛 Troubleshooting

### Port Already in Use

**Backend:**
```bash
python manage.py runserver 8001
```

**Frontend:**
```bash
npm run dev -- --port 3000
```

### Database Errors

```bash
cd Backend
python manage.py migrate --run-syncdb
```

### Module Not Found

```bash
# Backend
pip install -r requirements.txt

# Frontend
rm -rf node_modules
npm install
```

### Permission Denied on setup.sh

```bash
chmod +x setup.sh
./setup.sh
```

## 💡 Pro Tips

1. **Use Git frequently** - Commit small, logical changes
2. **Follow naming conventions** - Makes code searchable
3. **Write tests first** - Test-driven development
4. **Document complex logic** - Help future developers
5. **Keep it simple** - KISS principle
6. **DRY** - Don't Repeat Yourself
7. **Use type hints** - Frontend and backend
8. **Review PRs carefully** - Code quality matters

## 🤝 Getting Help

- Check documentation files (README, ARCHITECTURE, CONTRIBUTING)
- Search existing issues on GitHub
- Ask in project discussions
- Review similar code in the codebase
- Read error messages carefully

## ✨ Next Steps

1. **Backend Development**
   - Explore the apps/ folder structure
   - Review models and serializers
   - Understand the permissions system

2. **Frontend Development**
   - Explore the modules/ folder
   - Understand the component structure
   - Review the context API setup

3. **Database**
   - Learn about migrations
   - Understand the data model
   - Practice adding new fields

4. **Testing**
   - Write your first test
   - Run the test suite
   - Check code coverage

## 📞 Support

For issues:
1. Check TROUBLESHOOTING section in README.md
2. Review relevant documentation file
3. Search project issues
4. Ask in discussions or contact team

---

**Welcome to the team! You're all set to start developing! 🚀**

For detailed information, read the documentation files:
- README.md
- ARCHITECTURE.md
- CONTRIBUTING.md

Happy coding! 🎉
