# Architecture du Projet - Scientific Research Portal

## Vue d'ensemble

Application web fullstack pour la gestion de projets de recherche scientifique avec authentification par rôles.

---

## Architecture Backend (Django/Python)

```
Backend/
├── core/                    # Configuration principale
│   ├── settings.py          # Django settings (DRF, CORS, JWT)
│   ├── urls.py              # URL routing principal
│   └── wsgi/asgi.py
│
├── apps/
│   ├── users/               # Authentification & gestion utilisateurs
│   │   ├── models.py        # User (AbstractUser) - roles: admin, supervisor, jury, student
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── students/            # Profils étudiants
│   │   └── models.py        # Student (enrollment_number, specialization, academic_year)
│   │
│   ├── supervisors/         # Profils superviseurs
│   │   └── models.py        # Supervisor (employee_id, department, specialization_areas)
│   │
│   ├── juries/              # Profils membres jury
│   │   └── models.py        # Jury (employee_id, expertise_areas, institution)
│   │
│   ├── projects/            # Gestion des projets de recherche
│   │   └── models.py
│   │       ├── Project              # title, description, status, student, supervisor
│   │       ├── JuryAssignment       # Assignment jury → projet
│   │       ├── ProjectMilestone     # Étapes du projet
│   │       ├── Document             # Fichiers (target: supervisor/jury/admin)
│   │       ├── DocumentRemark       # Commentaires/notes sur documents
│   │       ├── Appointment          # Réunions/deadlines
│   │       ├── Evaluation           # Scores (supervisor + jury avec poids)
│   │       └── Feedback             # Retours des évaluateurs
│   │
│   ├── communications/      # Système de messagerie
│   │   └── models.py
│   │       ├── Message              # Messages directs entre utilisateurs
│   │       ├── Notification         # Notifications système (info, success, warning, error, grade, document...)
│   │       ├── AdministrativeNote    # Notes publiées par admin (audience: all/students/supervisors/juries)
│   │       └── Resource             # Ressources partagées (type: report/template/guide/project)
│   │
│   ├── student/             # API endpoints étudiants
│   ├── supervisor/          # API endpoints superviseurs
│   ├── jury/                # API endpoints jury
│   └── administration/      # API endpoints administration
│
├── shared/                  # Code partagé
│   ├── permissions.py
│   ├── utils.py
│   └── middleware.py
│
├── seed_*.py                # Scripts de seed
└── manage.py
```

### Modèle de données principal

```
User (AUTH_USER_MODEL)
├── Student (OneToOne) → projects (ForeignKey)
├── Supervisor (OneToOne)
└── Jury (OneToOne)

Project
├── JuryAssignment (jury_member → User, role)
├── ProjectMilestone (title, status, due_date, order)
├── Document (file, target, status, version)
├── DocumentRemark (author → User, comment, score)
├── Appointment (title, date, time, type, status)
├── Evaluation (supervisor_score, jury_score, final_score)
└── Feedback (author → User, title, comment)

Message (sender → User, recipient → User, content)
Notification (recipient → User, type, title, message)
AdministrativeNote (author → User, audience)
Resource (uploaded_by → User, type, file/url)
```

---

## Architecture Frontend (React/TypeScript/Vite)

```
Frontend/
├── src/
│   ├── App.tsx              # Routing principal avec React Router v7
│   ├── main.tsx             # Entry point
│   │
│   ├── components/
│   │   ├── shared/          # Composants réutilisables
│   │   │   ├── SidebarLink.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── StatCard.tsx
│   │   └── features/        # Composants métier
│   │       ├── student/
│   │       ├── supervisor/
│   │       └── jury/
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   └── Login/       # LoginPage, AdminLoginPage
│   │   ├── Student/
│   │   │   └── Dashboard/
│   │   ├── Supervisor/
│   │   │   ├── Dashboard/, StudentsList/, Planning/, Evaluations/, Messages/
│   │   ├── Jury/
│   │   │   └── Dashboard/, Projects/, Schedule/, Evaluation/, Documents/
│   │   ├── Admin/
│   │   │   ├── Dashboard/, Users/, Projects/, Jury/, Analytics/, Resources/
│   │   └── Common/
│   │       ├── Messages/, Notifications/, Settings/, AdministrativeNotes/
│   │
│   ├── api/                 # Clients API
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── students.ts
│   │   ├── supervisors.ts
│   │   ├── projects.ts
│   │   └── communications.ts
│   │
│   ├── context/
│   │   └── AppContext.tsx   # State global (user, theme, notifications, messages)
│   │
│   ├── types/
│   │   └── index.ts         # Types TypeScript (UserRole, etc.)
│   │
│   └── config/
│       ├── endpoints.ts     # URLs API
│       └── constants.ts
│
├── package.json             # React 19, Vite 8, TypeScript 6
└── vite.config.ts
```

---

## Stack Technique

### Backend
- Framework: Django 6+, Django REST Framework
- Base de données: SQLite (développement), extensible à PostgreSQL
- Auth: Token Authentication, Session Authentication
- Middleware: CORS, Security headers

### Frontend
- Framework: React 19 + TypeScript 6 + Vite 8
- UI: React Bootstrap 5, Framer Motion
- Icons: Lucide React
- Charts: Recharts
- Routing: React Router v7

---

## API Endpoints Principaux

```
/api/auth/          # Authentification (login, logout, register)
/api/users/         # Gestion utilisateurs
/api/students/      # CRUD étudiants
/api/supervisors/   # CRUD superviseurs
/api/juries/        # CRUD jury
/api/projects/      # CRUD projets + documents + évaluations + rendez-vous
/api/communications/ # Messages, notifications, ressources, notes admin
```

---

## Fonctionnalités clés

- Étudiants: Soumission documents, suivi milestones, réception feedback
- Superviseurs: Évaluation documents, planification, suivi étudiants
- Jury: Évaluation finale projets, notation
- Admin: Gestion utilisateurs, ressources, analytics, notes administratives