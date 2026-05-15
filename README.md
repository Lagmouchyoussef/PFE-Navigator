# Scientific Research Portal

A professional, enterprise-grade platform for managing scientific research projects, student evaluations, and academic communications.

## 🎯 Project Overview

The Scientific Research Portal is a comprehensive web application designed to streamline the management of research projects at educational institutions. It provides role-based access for administrators, supervisors, jury members, and students to collaborate on project development, evaluation, and documentation.

### Key Features

- **User Management**: Role-based access control (Admin, Supervisor, Jury, Student)
- **Project Management**: Create, track, and manage research projects
- **Evaluation System**: Comprehensive grading and evaluation framework
- **Document Management**: Upload and manage project documents
- **Communication**: Built-in messaging and notification system
- **Analytics**: Real-time dashboards and performance metrics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📋 Architecture

### Technology Stack

**Backend**
- Python 3.10+
- Django 6.0.5
- Django REST Framework
- SQLite/PostgreSQL
- JWT Authentication

**Frontend**
- React 19
- TypeScript
- Vite
- Bootstrap 5
- Tailwind CSS (optional)

### Project Structure

```
├── Backend/                    # Django REST API
│   ├── core/                  # Main configuration
│   ├── apps/                  # Application modules
│   │   ├── core/             # Shared functionality
│   │   ├── users/            # User management
│   │   ├── students/         # Student module
│   │   ├── supervisors/      # Supervisor module
│   │   ├── juries/           # Jury module
│   │   └── projects/         # Project management
│   ├── shared/               # Shared utilities
│   └── manage.py
│
├── Frontend/                  # React TypeScript Application
│   ├── src/
│   │   ├── config/           # Configuration & constants
│   │   ├── modules/          # Feature modules
│   │   ├── common/           # Shared components & utilities
│   │   ├── context/          # Global state management
│   │   ├── styles/           # Global styles
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── Documentation/            # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pfe-navigator.git
   cd pfe-navigator
   ```

2. **Create Python virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp ../.env.example ../.env
   # Edit .env with your settings
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### User Endpoints
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `GET /api/users/profile/` - Get current user profile

### Student Endpoints
- `GET /api/students/` - List all students
- `GET /api/students/{id}/` - Get student details
- `GET /api/students/{id}/projects/` - Get student's projects

### Project Endpoints
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}/` - Get project details
- `POST /api/projects/{id}/submit/` - Submit project

## 🛠️ Development

### Backend Development

**Run tests**
```bash
cd Backend
pytest
```

**Format code**
```bash
black .
isort .
```

**Lint code**
```bash
flake8 .
pylint apps/
```

### Frontend Development

**Run tests**
```bash
cd Frontend
npm test
```

**Format code**
```bash
npm run lint
```

**Build for production**
```bash
npm run build
```

## 📖 Documentation

- [Architecture Guide](ARCHITECTURE.md) - Detailed system architecture
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [API Reference](docs/API.md) - Complete API documentation
- [Database Schema](docs/DATABASE.md) - Database design

## 🔐 Security

- All passwords are hashed using Django's default PBKDF2
- CORS headers configured securely
- CSRF protection enabled
- SQL injection protection through Django ORM
- XSS protection through template escaping
- HTTPS recommended for production

## 📝 Database Schema

### Core Models

**User**
- Custom extended user model with role-based access
- Fields: id, username, email, role, institutional_id, phone_number

**Student**
- Extends User model
- Fields: enrollment_number, specialization, academic_year

**Supervisor**
- Extends User model
- Fields: employee_id, department, specialization_areas

**Jury**
- Extends User model
- Fields: employee_id, expertise_areas, institution

**Project**
- Fields: title, description, status, start_date, end_date, student, supervisor

**Evaluation**
- Fields: project, evaluator, grade, comments

## 🔄 Workflow

### Project Lifecycle

1. **Draft** - Initial project creation
2. **Submitted** - Student submits project
3. **Under Review** - Supervisor/Jury reviewing
4. **Approved** - Project approved
5. **In Progress** - Active research phase
6. **Completed** - Project finished
7. **Rejected** - Project rejected

## 📊 Dashboard Features

**Student Dashboard**
- Project overview
- Evaluation status
- Document uploads
- Communication center
- Schedule management

**Supervisor Dashboard**
- Assigned students list
- Project tracking
- Evaluation submission
- Resource management

**Jury Dashboard**
- Projects to evaluate
- Evaluation interface
- Performance analytics
- Planning tools

**Admin Dashboard**
- User management
- System analytics
- Configuration settings
- Batch operations

## 🐛 Troubleshooting

### Backend Issues

**Database errors**
```bash
python manage.py migrate --run-syncdb
```

**Permission errors**
```bash
python manage.py createsuperuser
```

### Frontend Issues

**Port already in use**
```bash
npm run dev -- --port 3000
```

**Module not found**
```bash
rm -rf node_modules
npm install
```

## 📞 Support & Contact

For issues and questions:
- GitHub Issues: [Open an issue](https://github.com/yourusername/pfe-navigator/issues)
- Email: support@example.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Project Lead**: Your Name
- **Backend Engineer**: Your Name
- **Frontend Engineer**: Your Name
- **DevOps Engineer**: Your Name

## 🙏 Acknowledgments

Thanks to all contributors and the open-source community for their support.

---

**Last Updated**: December 2024  
**Version**: 1.0.0
