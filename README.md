<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=36&pause=1000&color=4F46E5&center=true&vCenter=true&width=900&lines=PFE+Management+Platform;Final+Year+Project+System;EMSI+Research+Project+Manager" alt="Typing SVG" />

<br/>

[![Django](https://img.shields.io/badge/Django-5.2.1-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br/>

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Made for EMSI](https://img.shields.io/badge/Made%20for-EMSI-purple?style=flat-square)](https://emsi.ma)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)]()

<br/>

> **A full-stack platform managing the entire lifecycle of Final Year Projects (PFE)**  
> From topic selection to grade publication — one system, four roles, zero paperwork.

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features by Role](#-features-by-role)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ System Architecture](#️-system-architecture)
- [🗄️ Data Model](#️-data-model)
- [🔄 Key Business Flows](#-key-business-flows)
- [📂 Project Structure](#-project-structure)
- [🚀 Installation & Setup](#-installation--setup)
- [🔐 Authentication & Security](#-authentication--security)
- [📡 API Reference](#-api-reference)
- [🎨 User Interface](#-user-interface)
- [⚙️ Configuration](#️-configuration)

---

## 🎯 Overview

The **PFE Management Platform** is a full-stack web application built for **EMSI** that automates and centralizes the management of final year research projects. It covers the entire lifecycle:

```
Topic Creation  →  Student Selection  →  Tracking & Documents  →  Defense  →  Final Grades
```

| Actor | Role in the system |
|-------|--------------------|
| 👨‍💼 **Administrator** | Topic approval, jury assignment, grade publication, analytics |
| 👨‍🏫 **Supervisor** | Topic creation, student supervision, evaluation, milestone tracking |
| 👨‍⚖️ **Jury** | Project consultation, defense evaluation |
| 👨‍🎓 **Student** | Topic selection, document submission, progress tracking |

---

## ✨ Features by Role

<details>
<summary><b>👨‍💼 Administrator</b></summary>

- ✅ Global dashboard with metrics and charts (Recharts)
- ✅ Full user management (CRUD + enable/disable accounts)
- ✅ PFE topic validation and rejection
- ✅ Student subject-request approval
- ✅ Jury scheduling and project assignment
- ✅ Final grade calculation and publication (configurable weighting)
- ✅ Targeted notifications and announcements
- ✅ Analytics: submission rates, grade distribution, progression
</details>

<details>
<summary><b>👨‍🏫 Supervisor</b></summary>

- ✅ Create and edit PFE topics
- ✅ Track assigned students with milestone timelines
- ✅ Review and approve submitted documents
- ✅ Score and qualitatively evaluate students
- ✅ Direct communication with students (internal messaging)
- ✅ Flag documents for jury review
</details>

<details>
<summary><b>👨‍⚖️ Jury</b></summary>

- ✅ Access to assigned projects
- ✅ View defense documents (auto-unlocked on defense day)
- ✅ Enter defense scores with detailed criteria
- ✅ Consult results after publication
</details>

<details>
<summary><b>👨‍🎓 Student</b></summary>

- ✅ Browse available topics and submit requests
- ✅ Upload reports and deliverables (versioning)
- ✅ Real-time progress and milestone tracking
- ✅ View evaluations and supervisor remarks
- ✅ Defense schedule with automatic notifications
- ✅ Messaging with supervisor
</details>

---

## 🛠️ Tech Stack

<div align="center">

### Backend
[![My Skills](https://skillicons.dev/icons?i=python,django,postgres,nginx&theme=dark)](https://skillicons.dev)

### Frontend
[![My Skills](https://skillicons.dev/icons?i=react,ts,vite,bootstrap&theme=dark)](https://skillicons.dev)

</div>

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Backend Framework** | Django + DRF | 5.2.1 / 3.15.2 | REST API, business logic |
| **Authentication** | Django Simple JWT | 5.4.0 | JWT tokens (access 2h, refresh 7d) |
| **Database** | PostgreSQL | Latest | Primary persistence |
| **Frontend Framework** | React | 19.2.6 | SPA interface |
| **Language** | TypeScript | 5.x | Static typing on the frontend |
| **Build Tool** | Vite | 8.0.10 | HMR, optimized bundling |
| **UI Components** | React Bootstrap | 2.10.10 | Responsive components |
| **Animations** | Framer Motion | 12.38.0 | Smooth page transitions |
| **Charts** | Recharts | 3.8.1 | Analytics & visualizations |
| **HTTP Client** | Axios | 1.16.1 | API calls with auto-refresh interceptor |
| **Icons** | Lucide React | Latest | Consistent icon set |
| **CORS** | django-cors-headers | Latest | Cross-origin requests |

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "🌐 Client Layer"
        Browser["🖥️ Browser / SPA<br/>React + TypeScript"]
    end

    subgraph "⚡ Frontend (Vite + React)"
        Router["React Router v7<br/>Route Guards"]
        AppCtx["AppContext<br/>Global State Manager"]

        subgraph "📄 Pages"
            AdminUI["👨‍💼 Admin Dashboard"]
            StudentUI["👨‍🎓 Student Portal"]
            SupervUI["👨‍🏫 Supervisor Panel"]
            JuryUI["👨‍⚖️ Jury Interface"]
        end

        subgraph "🔌 API Layer"
            AxiosClient["Axios Client<br/>+ JWT Interceptor"]
        end
    end

    subgraph "🐍 Backend (Django DRF)"
        subgraph "🔑 Authentication"
            JWT["JWT Auth<br/>simplejwt"]
        end

        subgraph "📦 Apps"
            AuthApp["authentication/<br/>Custom User Model"]
            CommonApp["common/<br/>Core Models"]
            ProjectsApp["projects/<br/>Subject & Project CRUD"]
            StudentApp["student/<br/>Student ViewSets"]
            SupervApp["supervisor/<br/>Supervisor ViewSets"]
            JuryApp["jury/<br/>Jury ViewSets"]
            AdminApp["administration/<br/>Admin ViewSets"]
        end

        subgraph "🛡️ Permissions"
            Perms["Role-Based Permissions<br/>IsSupervisor / IsAdmin / IsJury"]
        end
    end

    subgraph "🗄️ Data Layer"
        PG[("🐘 PostgreSQL<br/>Database")]
        Media["📁 Media Storage<br/>Documents & Images"]
    end

    Browser --> Router
    Router --> AppCtx
    AppCtx --> AdminUI & StudentUI & SupervUI & JuryUI
    AppCtx --> AxiosClient
    AxiosClient -->|"HTTPS / REST"| JWT
    JWT --> Perms
    Perms --> AuthApp & CommonApp & ProjectsApp
    ProjectsApp --> StudentApp & SupervApp & JuryApp & AdminApp
    AuthApp --> PG
    CommonApp --> PG
    CommonApp --> Media

    style Browser fill:#1e1b4b,color:#fff
    style AppCtx fill:#4f46e5,color:#fff
    style JWT fill:#059669,color:#fff
    style PG fill:#1d4ed8,color:#fff
```

---

## 🗄️ Data Model

```mermaid
erDiagram
    USER {
        int id PK
        string email UK
        string username
        string role "admin|supervisor|jury|student"
        string first_name
        string last_name
        string phone
        string department
        bool is_active
        datetime created_at
    }

    SUBJECT {
        int id PK
        string title
        string description
        string technologies
        int supervisor_id FK
        bool is_approved
        bool is_available
        datetime created_at
    }

    SUBJECT_REQUEST {
        int id PK
        int student_id FK
        int subject_id FK
        string status "pending|approved|rejected"
        string motivation
        datetime requested_at
    }

    PROJECT {
        int id PK
        int student_id FK
        int supervisor_id FK
        int subject_id FK
        string status "active|completed|suspended"
        bool jury_documents_open
        datetime start_date
        datetime end_date
    }

    EVALUATION {
        int id PK
        int project_id FK "1-to-1"
        float supervisor_score
        float jury_score
        int supervisor_weight
        int jury_weight
        float final_grade
        bool is_published
        text supervisor_comment
        text jury_comment
    }

    DOCUMENT {
        int id PK
        int project_id FK
        int uploaded_by FK
        string title
        string document_type
        string target "supervisor|jury"
        string status "pending|approved|rejected"
        string file
        int version
        text remarks
        datetime uploaded_at
    }

    APPOINTMENT {
        int id PK
        int project_id FK
        string title
        string appointment_type "defense|milestone|meeting"
        datetime date
        string location
        bool is_completed
        text notes
    }

    JURY_ASSIGNMENT {
        int id PK
        int jury_id FK
        int project_id FK
        datetime assigned_at
    }

    MESSAGE {
        int id PK
        int sender_id FK
        int recipient_id FK
        text content
        bool is_read
        datetime sent_at
    }

    NOTIFICATION {
        int id PK
        int user_id FK
        string type "approved|rejected|grade|defense|message|info"
        string title
        text message
        bool is_read
        datetime created_at
    }

    USER ||--o{ SUBJECT : "creates (supervisor)"
    USER ||--o{ SUBJECT_REQUEST : "makes (student)"
    SUBJECT ||--o{ SUBJECT_REQUEST : "receives"
    SUBJECT_REQUEST ||--o| PROJECT : "creates upon approval"
    USER ||--o{ PROJECT : "student"
    USER ||--o{ PROJECT : "supervisor"
    PROJECT ||--|| EVALUATION : "has"
    PROJECT ||--o{ DOCUMENT : "contains"
    PROJECT ||--o{ APPOINTMENT : "schedules"
    PROJECT ||--o{ JURY_ASSIGNMENT : "has"
    USER ||--o{ JURY_ASSIGNMENT : "jury member"
    USER ||--o{ MESSAGE : "sends"
    USER ||--o{ NOTIFICATION : "receives"
```

---

## 🔄 Key Business Flows

### 1. Topic Selection Flow

```mermaid
sequenceDiagram
    actor S as 👨‍🎓 Student
    actor SV as 👨‍🏫 Supervisor
    actor A as 👨‍💼 Admin
    participant DB as 🗄️ Database

    SV->>DB: Creates a subject (is_approved=True auto)
    A->>DB: Approves subject → visible to students
    S->>DB: Submits SubjectRequest (status=pending)
    DB-->>A: 🔔 Notification: new request
    DB-->>SV: 🔔 Notification: new request

    alt Approved
        A->>DB: approve_request()
        DB->>DB: Creates Project + Evaluation (auto via save())
        DB-->>S: 🔔 "Your topic request has been approved"
    else Rejected
        A->>DB: reject_request()
        DB-->>S: 🔔 "Your topic request has been rejected"
    end
```

### 2. JWT Authentication Flow

```mermaid
sequenceDiagram
    actor U as 👤 User
    participant FE as ⚡ React Frontend
    participant API as 🐍 Django API
    participant DB as 🗄️ PostgreSQL

    U->>FE: POST /login (email + password)
    FE->>API: POST /api/auth/token/
    API->>DB: Verify credentials + role
    DB-->>API: User object
    API-->>FE: { access_token, refresh_token, role }
    FE->>FE: Store tokens in sessionStorage
    FE->>FE: Redirect to role-based dashboard

    loop Every request
        FE->>API: Request + Authorization: Bearer <token>
        API->>API: Validate JWT + extract role
        API-->>FE: Response 200
    end

    alt Token expired (401)
        FE->>API: POST /api/auth/token/refresh/
        API-->>FE: New access_token
        FE->>API: Retry original request
    end

    alt Refresh token expired
        FE->>FE: Auto-logout → redirect /login
    end
```

### 3. Document & Evaluation Workflow

```mermaid
stateDiagram-v2
    [*] --> Uploaded : 📤 Student uploads

    Uploaded --> PendingReview : Awaiting supervisor

    PendingReview --> ApprovedBySupervisor : ✅ Supervisor approves
    PendingReview --> RejectedBySupervisor : ❌ Supervisor rejects

    RejectedBySupervisor --> Uploaded : 🔄 Student re-submits

    ApprovedBySupervisor --> MarkedForJury : 📋 Supervisor flags for jury
    ApprovedBySupervisor --> [*] : End of supervisor cycle

    MarkedForJury --> JuryReview : 🔓 Unlocked on defense day

    JuryReview --> JuryApproved : ✅ Jury approves
    JuryReview --> JuryRejected : ❌ Jury rejects

    JuryApproved --> GradeEntered : 📊 Jury enters score
    GradeEntered --> GradePublished : 👨‍💼 Admin publishes
    GradePublished --> [*] : 🎓 Student views final grade
```

### 4. Final Grade Calculation

```mermaid
flowchart LR
    subgraph "📊 Score Input"
        NS["Supervisor Score\nsupervisor_score"]
        NJ["Jury Score\njury_score"]
        WS["Supervisor Weight\nsupervisor_weight\n(default: 50%)"]
        WJ["Jury Weight\njury_weight\n(default: 50%)"]
    end

    subgraph "🧮 Calculation"
        FORMULA["FinalGrade = NS × (WS/100) + NJ × (WJ/100)"]
    end

    subgraph "📤 Publication"
        VALIDATE{"WS + WJ\n= 100%?"}
        PUBLISH["✅ Admin publishes\nis_published = True"]
        NOTIFY["🔔 Notification\nto student"]
        ERROR["❌ Validation\nerror"]
    end

    NS --> FORMULA
    NJ --> FORMULA
    WS --> FORMULA
    WJ --> FORMULA
    FORMULA --> VALIDATE
    VALIDATE -->|Yes| PUBLISH
    VALIDATE -->|No| ERROR
    PUBLISH --> NOTIFY

    style FORMULA fill:#4f46e5,color:#fff
    style PUBLISH fill:#059669,color:#fff
    style ERROR fill:#dc2626,color:#fff
```

### 5. Role-Based Access Control

```mermaid
graph TD
    subgraph "🔐 Roles"
        A["👨‍💼 Admin"]
        S["👨‍🏫 Supervisor"]
        J["👨‍⚖️ Jury"]
        ST["👨‍🎓 Student"]
    end

    subgraph "🔒 Backend Permissions"
        IP["IsAdmin\nPermission"]
        ISP["IsSupervisor\nPermission"]
        IJP["IsJury\nPermission"]
        IST["IsStudent\nPermission"]
    end

    subgraph "🛣️ Protected Frontend Routes"
        AdminR["/admin/*"]
        SupervR["/supervisor/*"]
        JuryR["/jury/*"]
        StudentR["/student/*"]
    end

    A -->|"Full access"| IP
    S -->|"Supervisor access"| ISP
    J -->|"Jury access"| IJP
    ST -->|"Student access"| IST

    IP --> AdminR
    ISP --> SupervR
    IJP --> JuryR
    IST --> StudentR

    style A fill:#7c3aed,color:#fff
    style S fill:#2563eb,color:#fff
    style J fill:#d97706,color:#fff
    style ST fill:#059669,color:#fff
```

---

## 📂 Project Structure

```
📁 Projet Recherche Scientifique/
│
├── 📁 Backend/                          # Django REST API
│   ├── 📁 apps/
│   │   ├── 📁 authentication/           # Custom User model + JWT views
│   │   │   ├── models.py                # CustomUser with role field
│   │   │   ├── serializers.py           # UserSerializer, TokenSerializer
│   │   │   └── views.py                 # Login, Register, Profile
│   │   │
│   │   ├── 📁 common/                   # Shared models (core of the system)
│   │   │   ├── models.py                # Subject, Project, Document, Evaluation...
│   │   │   ├── serializers.py           # Common serializers
│   │   │   └── admin.py                 # Django Admin interface
│   │   │
│   │   ├── 📁 projects/                 # Project & subject ViewSets
│   │   ├── 📁 student/                  # Student-specific endpoints
│   │   ├── 📁 supervisor/               # Supervisor endpoints
│   │   ├── 📁 jury/                     # Jury endpoints
│   │   └── 📁 administration/           # Admin endpoints
│   │
│   ├── 📁 core/
│   │   ├── settings.py                  # Django config (DB, JWT, CORS)
│   │   ├── urls.py                      # Main API routing
│   │   └── wsgi.py / asgi.py
│   │
│   ├── requirements.txt                 # Python dependencies
│   └── manage.py                        # Django CLI
│
└── 📁 Frontend/                         # React + TypeScript SPA
    ├── 📁 src/
    │   ├── 📁 pages/
    │   │   ├── 📁 Admin/                # Dashboard, Users, Grades, Analytics
    │   │   │   ├── Dashboard/
    │   │   │   ├── Users/
    │   │   │   ├── Grades/              # computeFinal() → weighted grade
    │   │   │   ├── Subjects/
    │   │   │   ├── JuryPlanning/
    │   │   │   └── Analytics/
    │   │   │
    │   │   ├── 📁 Student/              # Dashboard, Reports, Subjects
    │   │   ├── 📁 Supervisor/           # Students, Evaluations, Documents
    │   │   ├── 📁 Jury/                 # Projects, Documents, Evaluation
    │   │   └── 📁 Auth/                 # Login (student & admin)
    │   │
    │   ├── 📁 context/
    │   │   └── AppContext.tsx            # ⭐ Global state (1038 lines)
    │   │                                #    Session, Projects, Documents,
    │   │                                #    Evaluations, Messages, Notifications
    │   │
    │   ├── 📁 api/
    │   │   ├── client.ts                # Axios + auto-refresh JWT interceptor
    │   │   ├── projects.ts              # CRUD projects, subjects, documents
    │   │   ├── users.ts                 # CRUD users
    │   │   ├── auth.ts                  # Login, logout, refresh
    │   │   └── communications.ts        # Messages & notifications
    │   │
    │   ├── 📁 types/                    # TypeScript interfaces
    │   ├── 📁 config/                   # Constants & endpoints
    │   ├── 📁 components/               # SidebarLink, NotificationItem, ErrorBoundary
    │   ├── App.tsx                      # Shell: Header + Sidebar + Routes (578 lines)
    │   └── main.tsx                     # React entry point
    │
    ├── package.json                     # Node dependencies
    └── vite.config.ts                   # Vite config + API proxy
```

---

## 🚀 Installation & Setup

### Prerequisites

```bash
Python >= 3.11
Node.js >= 18
PostgreSQL >= 14
```

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pfe-management-platform.git
cd pfe-management-platform
```

### 2. Backend (Django)

```bash
cd Backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Linux/Mac
# or: venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env:
#   DB_NAME=pfe_db
#   DB_USER=postgres
#   DB_PASSWORD=your_password
#   DB_HOST=localhost
#   DB_PORT=5432
#   SECRET_KEY=your-secret-key
#   DEBUG=True

# Apply migrations
python manage.py migrate

# Create admin superuser
python manage.py createsuperuser

# Start the server
python manage.py runserver
# API available at http://localhost:8000/api/
```

### 3. Frontend (React)

```bash
cd Frontend

# Install dependencies
npm install

# API is pre-proxied via vite.config.ts
# Default target: http://localhost:8000

# Start development server
npm run dev
# App available at http://localhost:5173

# Production build
npm run build
```

### 4. PostgreSQL Database

```sql
CREATE DATABASE pfe_db;
CREATE USER pfe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pfe_db TO pfe_user;
```

---

## 🔐 Authentication & Security

```mermaid
sequenceDiagram
    participant C as 🖥️ Client
    participant A as 🔑 /api/auth/token/
    participant R as 🔄 /api/auth/token/refresh/

    Note over C: Initial login
    C->>A: POST {email, password}
    A-->>C: {access (2h), refresh (7d)}
    C->>C: Store in sessionStorage

    Note over C: Authenticated request
    C->>A: GET /api/resource/<br/>Authorization: Bearer <access>
    A-->>C: 200 OK + data

    Note over C: Token expired
    C->>R: POST {refresh}
    R-->>C: {new_access}
    C->>A: Retry with new token

    Note over C: Refresh expired
    C->>C: Clear tokens
    C->>C: Redirect → /login
```

| Token | Lifetime | Storage | Usage |
|-------|----------|---------|-------|
| `access_token` | 2 hours | `sessionStorage` | Every API request |
| `refresh_token` | 7 days | `sessionStorage` | Silent token renewal |

**Storage keys:** `pfe_access_token`, `pfe_refresh_token`

---

## 📡 API Reference

### Main Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/token/` | All | Login → JWT tokens |
| `POST` | `/api/auth/token/refresh/` | All | Renew access token |
| `GET` | `/api/projects/subjects/` | All | List available topics |
| `POST` | `/api/projects/subjects/` | Supervisor | Create a topic |
| `POST` | `/api/projects/subject-requests/` | Student | Request a topic |
| `PATCH` | `/api/administration/subject-requests/{id}/` | Admin | Approve / reject |
| `GET` | `/api/projects/projects/` | All | List projects |
| `POST` | `/api/common/documents/` | Student | Submit a document |
| `PATCH` | `/api/supervisor/documents/{id}/` | Supervisor | Review a document |
| `GET` | `/api/jury/evaluations/` | Jury | View evaluations |
| `POST` | `/api/administration/grades/publish/` | Admin | Publish grades |
| `GET` | `/api/common/notifications/` | All | User notifications |
| `POST` | `/api/common/messages/` | All | Send a message |

### Response Format

```json
// Success
{
  "id": 1,
  "title": "ML Recommendation System",
  "status": "active",
  "supervisor": { "id": 5, "name": "Dr. Alami" },
  "student": { "id": 12, "name": "Youssef L." }
}

// Error
{
  "detail": "Authentication credentials were not provided.",
  "status_code": 401
}
```

---

## 🎨 User Interface

### Cross-Cutting Features

| Feature | Implementation |
|---------|---------------|
| 🌙 **Theme** | Light / Dark / System (CSS variables) |
| 📱 **Responsive** | React Bootstrap grid + collapsible sidebar |
| 🔔 **Notifications** | Real-time badge in header, dropdown panel |
| 💬 **Messaging** | Unread counter, message dropdown |
| ✨ **Animations** | Framer Motion page transitions |
| 📊 **Charts** | Recharts for admin analytics |

### Sidebar Navigation Map

```mermaid
graph LR
    Login["🔐 /login"] --> Role{Role?}

    Role -->|admin| AdminD["📊 /admin/dashboard"]
    Role -->|supervisor| SupervD["📊 /supervisor/dashboard"]
    Role -->|jury| JuryD["📊 /jury/dashboard"]
    Role -->|student| StudentD["📊 /student/dashboard"]

    AdminD --> AdminU["👥 Users"]
    AdminD --> AdminS["📚 Subjects"]
    AdminD --> AdminG["📊 Grades"]
    AdminD --> AdminJ["⚖️ Jury Planning"]
    AdminD --> AdminA["📈 Analytics"]

    SupervD --> SupervSt["👨‍🎓 Students"]
    SupervD --> SupervSu["📋 Subjects"]
    SupervD --> SupervEv["⭐ Evaluations"]
    SupervD --> SupervDo["📄 Documents"]

    JuryD --> JuryP["🗂️ Projects"]
    JuryD --> JuryDo["📄 Documents"]
    JuryD --> JuryEv["⭐ Evaluation"]

    StudentD --> StudentR["📝 Reports"]
    StudentD --> StudentS["📚 Subjects"]
    StudentD --> StudentEv["⭐ Evaluation"]
    StudentD --> StudentSch["📅 Schedule"]

    style Login fill:#1e1b4b,color:#fff
    style AdminD fill:#7c3aed,color:#fff
    style SupervD fill:#2563eb,color:#fff
    style JuryD fill:#d97706,color:#fff
    style StudentD fill:#059669,color:#fff
```

---

## ⚙️ Configuration

### Backend Environment Variables (`.env`)

```env
# Django
SECRET_KEY=your-very-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL
DB_NAME=pfe_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# JWT Tokens
JWT_ACCESS_TOKEN_LIFETIME_HOURS=2
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Vite API Proxy

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

---

## ⚠️ Critical Functions

> These functions are at the heart of the system. Any modification must be done with extreme care.

| Function | File | Risk |
|----------|------|------|
| `AppContext.requestSubject(id)` | `AppContext.tsx` | 🔴 Breaking this blocks project creation entirely |
| `AppContext.updateEvaluationByAdmin()` | `AppContext.tsx` | 🔴 Can corrupt evaluation records |
| `AppContext.publishEvaluation(id)` | `AppContext.tsx` | 🔴 Misconfiguration hides grades from students |
| `Project.save()` override | `common/models.py` | 🔴 Auto-creates Evaluation — do not remove |
| `SupervisorSubjectViewSet.perform_create()` | `supervisor/views.py` | 🟡 Forces `is_approved=True` directly |
| `AdminGrades.computeFinal()` | `AdminGrades.jsx` | 🔴 Math errors produce invalid final grades |

---

<div align="center">

---

**Built with ❤️ for EMSI**

[![GitHub](https://img.shields.io/badge/GitHub-Lagmouchyoussef-181717?style=for-the-badge&logo=github)](https://github.com/Lagmouchyoussef)
[![Email](https://img.shields.io/badge/Email-yousseflagmouxch%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:yousseflagmouxch@gmail.com)

*Final Year Project — EMSI 2025-2026*

</div>
