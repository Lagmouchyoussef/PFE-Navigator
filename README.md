<div align="center">

<img src="Frontend/public/logo_emsi.png" alt="EMSI" height="90" />

# PFE Navigator

**A full-stack platform to manage the complete lifecycle of Final Year Projects (PFE)**
from topic selection to grade publication.

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com)
[![DRF](https://img.shields.io/badge/DRF-3.15-A30000?style=flat-square)](https://www.django-rest-framework.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Screenshots](#screenshots)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Architecture](#architecture)
6. [Data Model](#data-model)
7. [Business Flows](#business-flows)
8. [Project Structure](#project-structure)
9. [Getting Started](#getting-started)
10. [Configuration](#configuration)
11. [Authentication & Security](#authentication--security)
12. [API Reference](#api-reference)
13. [Critical Areas of the Codebase](#critical-areas-of-the-codebase)
14. [Author](#author)

---

## Overview

PFE Navigator centralizes and automates the management of final year projects at **EMSI**. It replaces spreadsheets, emails and paper forms with a single role-based web application.

```
Topic proposal  →  Student request  →  Follow-up & documents  →  Defense  →  Published grade
```

| Role | Responsibilities |
|------|------------------|
| **Administrator** | Validates topics and requests, assigns juries, publishes grades, monitors analytics |
| **Supervisor** | Proposes topics, follows students, reviews documents, evaluates |
| **Jury member** | Consults assigned projects and documents, scores the defense |
| **Student** | Chooses a topic, submits deliverables, tracks progress and results |

---

## Screenshots

> Images are stored in [`docs/screenshots/`](docs/screenshots). See the [naming guide](docs/screenshots/README.md) to add or replace them.

### Authentication

<p align="center">
  <img src="docs/screenshots/login.png" alt="Login page" width="85%" />
</p>

### Administrator

| Dashboard | Analytics |
|:---:|:---:|
| ![Admin dashboard](docs/screenshots/admin-dashboard.png) | ![Admin analytics](docs/screenshots/admin-analytics.png) |

| Users management | Grades & publication |
|:---:|:---:|
| ![Admin users](docs/screenshots/admin-users.png) | ![Admin grades](docs/screenshots/admin-grades.png) |

### Supervisor

| Dashboard | My students |
|:---:|:---:|
| ![Supervisor dashboard](docs/screenshots/supervisor-dashboard.png) | ![Supervisor students](docs/screenshots/supervisor-students.png) |

### Student

| Dashboard | Reports & documents |
|:---:|:---:|
| ![Student dashboard](docs/screenshots/student-dashboard.png) | ![Student reports](docs/screenshots/student-reports.png) |

### Jury

| Projects | Defense evaluation |
|:---:|:---:|
| ![Jury projects](docs/screenshots/jury-projects.png) | ![Jury evaluation](docs/screenshots/jury-evaluation.png) |

### Theming

<p align="center">
  <img src="docs/screenshots/dark-mode.png" alt="Dark mode" width="85%" />
</p>

---

## Features

<details open>
<summary><b>Administrator</b></summary>

- Global dashboard with metrics and charts
- User management (create, edit, enable/disable accounts)
- Topic validation and subject-request approval
- Jury scheduling and project assignment
- Final grade calculation with configurable weighting, then publication
- Targeted notifications and announcements
- Analytics: submission rates, grade distribution, progression
</details>

<details>
<summary><b>Supervisor</b></summary>

- Create and edit PFE topics
- Follow assigned students with milestones and planning
- Review, approve or reject submitted documents
- Score and comment on student work
- Internal messaging with students
- Flag documents for jury review
</details>

<details>
<summary><b>Jury member</b></summary>

- Access to assigned projects and schedule
- Defense documents, unlocked on the defense day
- Defense scoring with detailed comments
- Results consultation after publication
</details>

<details>
<summary><b>Student</b></summary>

- Browse available topics and submit requests
- Upload reports and deliverables with versioning
- Progress and milestone tracking
- View evaluations and supervisor remarks
- Defense schedule with automatic notifications
- Messaging with the supervisor
</details>

**Cross-cutting:** light / dark / system theme, responsive layout, in-app notifications and messaging, resource hub, animated page transitions.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend | Django 5.2, Django REST Framework 3.15 | REST API and business logic |
| Authentication | Simple JWT 5.4 | Access / refresh tokens |
| Database | PostgreSQL (SQLite for quick local start) | Persistence |
| Frontend | React 19, TypeScript, Vite 8 | Single-page application |
| UI | React Bootstrap, Lucide React, Framer Motion | Components, icons, animation |
| Data viz | Recharts | Admin analytics |
| HTTP | Axios | API client with token-refresh interceptor |
| Routing | React Router 7 | Role-protected routes |

---

## Architecture

```mermaid
graph TB
    Browser["Browser<br/>React + TypeScript SPA"]

    subgraph Frontend["Frontend (Vite)"]
        Router["React Router<br/>role-based guards"]
        Ctx["AppContext<br/>global state"]
        Axios["Axios client<br/>JWT interceptor"]
    end

    subgraph Backend["Backend (Django REST)"]
        JWT["JWT authentication"]
        Perms["Role permissions<br/>IsAdmin / IsSupervisor / IsJury / IsStudent"]
        Apps["Apps: authentication, common, projects,<br/>student, supervisor, jury, administration"]
    end

    DB[("PostgreSQL")]
    Media["Media storage<br/>documents and avatars"]

    Browser --> Router --> Ctx --> Axios
    Axios -->|"HTTPS / REST"| JWT --> Perms --> Apps
    Apps --> DB
    Apps --> Media
```

---

## Data Model

```mermaid
erDiagram
    USER ||--o{ SUBJECT : "proposes (supervisor)"
    USER ||--o{ SUBJECT_REQUEST : "submits (student)"
    SUBJECT ||--o{ SUBJECT_REQUEST : "receives"
    SUBJECT_REQUEST ||--o| PROJECT : "creates on approval"
    USER ||--o{ PROJECT : "student / supervisor"
    PROJECT ||--|| EVALUATION : "has"
    PROJECT ||--o{ DOCUMENT : "contains"
    PROJECT ||--o{ APPOINTMENT : "schedules"
    PROJECT ||--o{ JURY_ASSIGNMENT : "assigned to"
    USER ||--o{ JURY_ASSIGNMENT : "jury member"
    USER ||--o{ MESSAGE : "sends"
    USER ||--o{ NOTIFICATION : "receives"

    USER {
        int id PK
        string email UK
        string role "admin | supervisor | jury | student"
        bool is_active
    }
    SUBJECT {
        int id PK
        string title
        int supervisor_id FK
        bool is_approved
        bool is_available
    }
    SUBJECT_REQUEST {
        int id PK
        int student_id FK
        int subject_id FK
        string status "pending | approved | rejected"
    }
    PROJECT {
        int id PK
        int student_id FK
        int supervisor_id FK
        int subject_id FK
        bool jury_documents_open
    }
    EVALUATION {
        int id PK
        int project_id FK
        float supervisor_score
        float jury_score
        int supervisor_weight
        int jury_weight
        float final_grade
        bool is_published
    }
    DOCUMENT {
        int id PK
        int project_id FK
        string target "supervisor | jury"
        string status "pending | approved | rejected"
        int version
    }
    APPOINTMENT {
        int id PK
        int project_id FK
        string appointment_type "defense | milestone | meeting"
        datetime date
    }
    JURY_ASSIGNMENT {
        int id PK
        int jury_id FK
        int project_id FK
    }
    MESSAGE {
        int id PK
        int sender_id FK
        int recipient_id FK
        bool is_read
    }
    NOTIFICATION {
        int id PK
        int user_id FK
        string type
        bool is_read
    }
```

---

## Business Flows

### Topic selection

```mermaid
sequenceDiagram
    actor S as Student
    actor SV as Supervisor
    actor A as Admin
    participant DB as Database

    SV->>DB: Create subject
    A->>DB: Approve subject (visible to students)
    S->>DB: Submit subject request (pending)
    DB-->>A: Notification
    DB-->>SV: Notification

    alt Approved
        A->>DB: approve request
        DB->>DB: Create Project + Evaluation
        DB-->>S: Notification: approved
    else Rejected
        A->>DB: reject request
        DB-->>S: Notification: rejected
    end
```

### Document lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending : Student uploads
    Pending --> Approved : Supervisor approves
    Pending --> Rejected : Supervisor rejects
    Rejected --> Pending : Student re-submits (new version)
    Approved --> MarkedForJury : Supervisor flags for jury
    MarkedForJury --> JuryReview : Unlocked on defense day
    JuryReview --> Scored : Jury enters score
    Scored --> Published : Admin publishes grade
    Published --> [*]
```

### Final grade

```
FinalGrade = SupervisorScore × (SupervisorWeight / 100) + JuryScore × (JuryWeight / 100)
```

Publication is only allowed when `SupervisorWeight + JuryWeight = 100`. Default weighting is 50 / 50. The student is notified on publication.

---

## Project Structure

```
PFE-Navigator/
├── Backend/                      Django REST API
│   ├── apps/
│   │   ├── authentication/       Custom user model, JWT, permissions
│   │   ├── common/               Core models: Subject, Project, Document, Evaluation...
│   │   ├── projects/             Subject and project endpoints
│   │   ├── student/              Student endpoints
│   │   ├── supervisor/           Supervisor endpoints
│   │   ├── jury/                 Jury endpoints
│   │   └── administration/       Admin endpoints
│   ├── core/                     Settings, root URLs, WSGI/ASGI
│   ├── database/                 SQL schema, seed data, deploy helper
│   ├── seed_all.py               Demo accounts
│   └── requirements.txt
│
├── Frontend/                     React + TypeScript SPA
│   ├── src/
│   │   ├── pages/                Admin, Supervisor, Jury, Student, Auth, Common, Portal
│   │   ├── context/AppContext.tsx  Global state (session, projects, evaluations...)
│   │   ├── api/                  Axios client and endpoint modules
│   │   ├── components/           Shared UI components
│   │   ├── config/ · types/      Constants and TypeScript interfaces
│   │   ├── App.tsx               Shell and routes
│   │   └── main.tsx
│   └── vite.config.ts
│
└── docs/screenshots/             README images
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+ (optional: SQLite is used by default for local development)

### 1. Clone

```bash
git clone https://github.com/Lagmouchyoussef/PFE-Navigator.git
cd PFE-Navigator
```

### 2. Backend

```bash
cd Backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create Backend/.env (see Configuration below)

python manage.py migrate
python seed_all.py                # demo accounts (see below)
python manage.py runserver        # http://localhost:8000
```

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev                       # http://localhost:5173
```

The Vite dev server proxies API calls to the Django backend.

### Demo accounts

Created by `seed_all.py`. **For local development only, never use these in production.**

| Role | Email | Password |
|------|-------|----------|
| Administrator | `admin@emsi.ma` | `admin123` |
| Supervisor | `supervisor@emsi.ma` | `password123` |
| Jury | `jury@emsi.ma` | `password123` |
| Student | `student@emsi.ma` | `password123` |

### PostgreSQL (optional)

```sql
CREATE DATABASE recherche_db;
```

Then set `DB_ENGINE=postgresql` and the `DB_*` variables in `Backend/.env`.

---

## Configuration

`Backend/.env`:

```env
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Database: "sqlite" (default) or "postgresql"
DB_ENGINE=sqlite
DB_NAME=recherche_db
DB_USER=postgres
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=5432
```

---

## Authentication & Security

- JWT authentication with a short-lived **access token (2 h)** and a **refresh token (7 d)**.
- The Axios interceptor transparently refreshes an expired access token and retries the request; if the refresh token has expired, the user is logged out.
- Authorization is enforced **server-side** by role permissions (`IsAdmin`, `IsSupervisor`, `IsJury`, `IsStudent`); frontend route guards are only a UX layer.
- Tokens are kept in `sessionStorage` (`pfe_access_token`, `pfe_refresh_token`).

---

## API Reference

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login/` | All | Log in, returns JWT pair |
| `POST` | `/api/auth/refresh/` | All | Renew access token |
| `GET` | `/api/auth/me/` | All | Current user |
| `GET` `POST` | `/api/projects/subjects/` | All / Supervisor | List or create topics |
| `POST` | `/api/projects/subject-requests/` | Student | Request a topic |
| `POST` | `/api/projects/subject-requests/{id}/{action}/` | Admin | Approve / reject a request |
| `GET` | `/api/projects/projects/` | All | List projects |
| `GET` `POST` | `/api/student/documents/` | Student | List / submit documents |
| `GET` | `/api/supervisor/dashboard/` | Supervisor | Supervisor dashboard data |
| `GET` `POST` | `/api/supervisor/evaluations/` | Supervisor | Score students |
| `GET` | `/api/jury/projects/` | Jury | Assigned projects |
| `GET` `POST` | `/api/jury/evaluations/` | Jury | Defense evaluations |
| `GET` | `/api/admin/stats/` · `/api/admin/analytics/` | Admin | Platform metrics |
| `GET` | `/api/admin/evaluations/` | Admin | Review and publish grades |
| `GET` | `/api/notifications/` | All | List notifications |
| `GET` `POST` | `/api/messages/` | All | Messaging |

Errors follow the DRF format, e.g. `{ "detail": "Authentication credentials were not provided." }`.

---

## Critical Areas of the Codebase

Changes here need extra care and manual testing.

| Area | Location | Why it matters |
|------|----------|----------------|
| `requestSubject()` | `Frontend/src/context/AppContext.tsx` | Drives project creation |
| `updateEvaluationByAdmin()`, `publishEvaluation()` | `AppContext.tsx` | Can corrupt or hide evaluation records |
| `Project.save()` override | `Backend/apps/common/models.py` | Auto-creates the linked `Evaluation` |
| `SupervisorSubjectViewSet.perform_create()` | `Backend/apps/supervisor/views.py` | Sets subject approval state |
| Final grade computation | `Frontend/src/pages/Admin/Grades` | Weighted grade formula |

---

## Author

**Youssef Lagmouch**: [GitHub](https://github.com/Lagmouchyoussef) · [yousseflagmouxch@gmail.com](mailto:yousseflagmouxch@gmail.com)

Final Year Project, EMSI 2025-2026.
