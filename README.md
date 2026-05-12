# PFE-NAVIGATOR
## Plateforme Académique de Gestion des Projets de Fin d'Études

> **Système d'information complet pour la gestion, le suivi et la valorisation des PFEs**

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Technique](#architecture-technique)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Structure du Projet](#structure-du-projet)
5. [Diagrammes UML](#diagrammes-uml)
6. [Flux de Travail Détaillé](#flux-de-travail-détaillé)
7. [API REST Django](#api-rest-django)
8. [Installation & Configuration](#installation--configuration)
9. [Guide de Développement](#guide-de-développement)

---

## Vue d'Ensemble

PFE-Navigator est une plateforme web complète conçue pour moderniser la gestion des Projets de Fin d'Études (PFE) au sein de l'EMSI. Le système automatise le cycle complet de gestion académique :

- **Dépôt et versionnage des rapports** (étudiants)
- **Validation et feedback** (encadrants)
- **Planification des soutenances** (administrateurs)
- **Évaluation par le jury** (jury et encadrants)
- **Valorisation publique** (showcase des meilleurs projets)

---

## Architecture Technique

### Architecture Globale (3-Tier)

```mermaid
graph TB
    subgraph "CLIENT LAYER"
        UI[React SPA<br/>Vite + Bootstrap]
    end
    
    subgraph "API GATEWAY"
        NGINX[Nginx Reverse Proxy<br/>SSL Termination]
    end
    
    subgraph "APPLICATION SERVER"
        Django[Django REST Framework<br/>Business Logic]
        Celery[Celery Workers<br/>Background Tasks]
    end
    
    subgraph "DATA LAYER"
        PG[(PostgreSQL<br/>Primary DB)]
        REDIS[(Redis<br/>Cache + Broker)]
        STORAGE[Cloud Storage<br/>PDF Documents]
    end
    
    UI <-- HTTPS --> NGINX
    NGINX <-- REST API --> Django
    Django <-- Async --> Celery
    Django <-- ORM --> PG
    Django <-- Cache --> REDIS
    Django <-- Files --> STORAGE
    Celery <-- Queue --> REDIS
```

### Architecture des Microservices Internes

```mermaid
graph LR
    subgraph "Backend Django Modules"
        AUTH[auth<br/>JWT Authentication]
        USERS[users<br/>User Management]
        PROJECTS[projects<br/>Project Entities]
        SUBMISSIONS[submissions<br/>Document Flow]
        DEFENSES[defenses<br/>Defense Scheduling]
        EVALUATIONS[evaluations<br/>Grading System]
        SHOWCASE[showcase<br/>Public Gallery]
        NOTIFICATIONS[notifications<br/>Real-time Alerts]
    end
    
    AUTH --> USERS
    USERS --> PROJECTS
    PROJECTS --> SUBMISSIONS
    SUBMISSIONS --> EVALUATIONS
    PROJECTS --> DEFENSES
    EVALUATIONS --> SHOWCASE
    NOTIFICATIONS -.-> ALL[All Modules]
```

---

## Technologies Utilisées

### Frontend (Client)
| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 19.2.6 | Bibliothèque UI principale |
| Vite | 8.0.10 | Build tool et dev server |
| React Router | 7.14.2 | Routing SPA |
| Bootstrap | 5.3.8 | Framework CSS UI |
| React Bootstrap | 2.10.10 | Composants React Bootstrap |
| Recharts | 3.8.1 | Visualisations graphiques |
| Framer Motion | 12.38.0 | Animations fluides |
| Lucide React | 1.11.0 | Bibliothèque d'icônes |

### Backend (Serveur) - **Django REST + PostgreSQL**

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Python** | 3.11+ | Langage serveur |
| **Django** | 4.2 LTS | Framework web |
| **Django REST Framework** | 3.15+ | API REST |
| **Simple JWT** | 5.3+ | Authentification token |
| **PostgreSQL** | 15+ | Base de données |
| **Redis** | 7+ | Cache & message broker |
| **Celery** | 5.4+ | Tâches asynchrones |
| **Docker** | - | Conteneurisation |

---

## Structure du Projet

```
├── Backend/                    # Django REST API
│   ├── config/                # Settings & WSGI
│   ├── auth/                  # JWT Authentication
│   ├── users/                 # User models & serializers
│   ├── projects/              # Project management
│   ├── submissions/           # Document submission flow
│   ├── defenses/              # Defense scheduling
│   ├── evaluations/           # Grading system
│   ├── showcase/              # Public projects gallery
│   └── notifications/         # Real-time notifications
│
├── Frontend/                  # React SPA
│   ├── src/
│   │   ├── pages/            # Page components by role
│   │   │   ├── Admin/
│   │   │   ├── Jury/
│   │   │   ├── Supervisor/
│   │   │   ├── Student/
│   │   │   └── Common/
│   │   ├── context/          # AppContext state management
│   │   └── assets/
│   └── package.json
│
└── docker-compose.yml          # Multi-container setup
```

---

## Diagrammes UML

### Diagramme de Cas d'Utilisation Complet

```mermaid
graph TD
    STUDENT((Étudiant))
    SUPERVISOR((Encadrant))
    ADMIN((Administrateur))
    JURY((Membre Jury))
    VISITOR((Visiteur))
    
    subgraph "Authentification"
        UC1[Se connecter]
        UC2[Gérer profil]
    end
    
    subgraph "Gestion des Documents"
        UC3[Déposer rapport]
        UC4[Consulter statut]
        UC5[Uploader nouvelle version]
        UC6[Valider rapport]
        UC7[Ajouter commentaires]
    end
    
    subgraph "Planification"
        UC8[Planifier soutenance]
        UC9[Assigner jury]
        UC10[Consulter planning]
    end
    
    subgraph "Évaluation"
        UC11[Noter soutenance]
        UC12[Calculer moyenne]
        UC13[Exporter notes]
    end
    
    subgraph "Showcase"
        UC14[Publier projet]
        UC15[Rechercher projets]
        UC16[Consulter détails]
    end
    
    STUDENT --> UC1
    STUDENT --> UC2
    STUDENT --> UC3
    STUDENT --> UC4
    STUDENT --> UC5
    
    SUPERVISOR --> UC1
    SUPERVISOR --> UC6
    SUPERVISOR --> UC7
    
    ADMIN --> UC1
    ADMIN --> UC8
    ADMIN --> UC9
    
    JURY --> UC1
    JURY --> UC10
    JURY --> UC11
    
    VISITOR --> UC15
    VISITOR --> UC16
```

### Diagramme de Classes (Domain Model)

```mermaid
classDiagram
    direction TB
    
    class User {
        <<abstract>>
        +UUID id
        +string email
        +string first_name
        +string last_name
        +string phone
        +Enum role
        +DateTime created_at
        +DateTime updated_at
        +login()
        +logout()
    }
    
    class Student {
    }
    
    class Supervisor {
        +List projects
    }
    
    class JuryMember {
        +List defenses
    }
    
    class Administrator {
    }
    
    class Project {
        +UUID id
        +string title
        +string description
        +Date start_date
        +Date deadline
        +Enum status
        +Boolean is_showcase
        +get_submissions()
    }
    
    class Submission {
        +UUID id
        +string file_path
        +string version
        +Enum status
        +DateTime submitted_at
        +String comment
    }
    
    class Defense {
        +UUID id
        +DateTime scheduled_time
        +String room
        +Integer duration
        +Enum status
    }
    
    class Evaluation {
        +UUID id
        +Float technical_score
        +Float presentation_score
        +Float methodology_score
        +Text comments
        +DateTime evaluated_at
    }
    
    class Notification {
        +UUID id
        +Enum type
        +String message
        +Boolean read
        +DateTime created_at
    }
    
    User <|-- Student
    User <|-- Supervisor
    User <|-- JuryMember
    User <|-- Administrator
    
    User "1" -- "0..*" Project : supervise
    Student "1" -- "1" Project : owns
    Project "1" -- "0..*" Submission : contains
    Submission "1" -- "0..1" Evaluation : evaluated_by
    Project "1" -- "0..1" Defense : scheduled_for
    Defense "1" -- "2..4" JuryMember : jury_members
    User "1" -- "0..*" Notification : receives
```

### Diagramme de Séquence : Authentification JWT

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant API as Django API
    participant DB as PostgreSQL
    
    Client->>API: POST /api/auth/login<br/>{email, password}
    API->>DB: SELECT * FROM users WHERE email=
    DB-->>API: User data
    API->>API: Validate password
    API->>API: Generate JWT pair (access + refresh)
    API-->>Client: 200 OK<br/>{access_token, refresh_token, user}
    
    Note over Client,API: Toutes les requêtes suivantes incluent<br/>Authorization: Bearer {access_token}
    
    Client->>API: GET /api/projects/<br/>Authorization: Bearer {token}
    API->>API: Verify JWT signature
    API->>DB: SELECT projects WHERE user_id=
    DB-->>API: Projects
    API-->>Client: 200 OK<br/>{projects[]}
```

### Diagramme de Séquence : Dépôt et Validation d'un Rapport

```mermaid
sequenceDiagram
    participant S as Étudiant
    participant F as Frontend React
    participant A as Django API
    participant D as PostgreSQL
    participant C as Celery
    
    S->>F: Upload rapport.pdf
    F->>A: POST /api/submissions/<br/>file + JWT
    A->>A: Vérifier token JWT
    A->>D: INSERT INTO submissions<br/>(project_id, file_path, version)
    D-->>A: ID submission
    A-->>F: 201 Created
    F-->>S: Succès : "Rapport en attente"
    
    rect rgb(240, 248, 255)
        Note over A,C: Background Task
        A->>C: Send notification email
        C->>D: UPDATE notifications
        C->>A: Confirm sent
    end
    
    S->>F: Voir notification
    F->>A: GET /api/notifications/
    A-->>F: Notifications array
    F-->>S: Badge rouge : 1 nouvelle notif
```

### Diagramme d'Activités : Workflow de Soutenance

```mermaid
flowchart TD
    Start([Début]) --> Create[Projet créé<br/>statut: Brouillon]
    Create --> Assign{Encadrant<br/>assigné ?}
    Assign -- Non --> Draft[Statut: Brouillon]
    Assign -- Oui --> InProgress[Statut: En Cours]
    
    InProgress --> Submit{Rapport<br/>déposé ?}
    Submit -- Non --> InProgress
    Submit -- Oui --> PendingValidation[Statut: Soumis<br/>En attente validation]
    
    PendingValidation --> Review{Correction<br/>nécessaire ?}
    Review -- Oui --> Corrections[Statut: À corriger]
    Corrections --> Submit
    
    Review -- Non --> Approved[Statut: Validé]
    Approved --> Schedule{Soutenance<br/>planifiée ?}
    Schedule -- Non --> Approved
    Schedule -- Oui --> Scheduled[Statut: Soutenu]
    
    Scheduled --> Grade{Note<br/>saisie ?}
    Grade -- Non --> Scheduled
    Grade -- Oui --> Completed[Statut: Terminé]
    
    Completed --> Showcase{Projets<br/>sélectionnés ?}
    Showcase -- Oui --> Published[Statut: Showcase]
    Showcase -- Non --> Completed
    
    Published --> End([Fin])
```

### Diagramme d'États : Machine d'État du Projet

```mermaid
stateDiagram-v2
    [*] --> Draft: Initialisation
    Draft --> InProgress: Encadrant assigné
    InProgress --> Submitted: Dépôt rapport
    Submitted --> ToRevise: Feedback négatif
    ToRevise --> Submitted: Nouvelle version
    Submitted --> Approved: Validation encadrant
    Approved --> Scheduled: Soutenance planifiée
    Scheduled --> Evaluated: Note du jury
    Evaluated --> Showcase: Sélection showcase
    Evaluated --> Archive: Archivage standard
    Showcase --> Archive: Fin de diffusion
    Archive --> [*]
    
    note right of Submitted
        Le système vérifie automatiquement
        la taille du fichier et le format PDF
    end note
    
    note right of Approved
        Notification email envoyée
        au jury et à l'admin
    end note
```

### Diagramme de Déploiement

```mermaid
graph TD
    Client((Utilisateur))
    
    subgraph "Zone DMZ"
        LB[Nginx Load Balancer<br/>SSL/TLS Termination]
    end
    
    subgraph "Cluster Docker"
        FE[Container : React SPA<br/>Port 3000]
        BE[Container : Django API<br/>Port 8000]
        WORKER[Container : Celery<br/>Background Tasks]
        WEB[Container : Nginx<br/>Static Files]
    end
    
    subgraph "Services Externes"
        PG[(PostgreSQL<br/>Volume: pg_data)]
        RED[Redis Server<br/>Cache + Broker]
        S3[Cloud Storage<br/>Documents PDF]
        SMTP[SMTP Server<br/>Email Queue]
    end
    
    Client <-- HTTPS --> LB
    LB --> FE
    LB --> BE
    BE --> PG
    BE --> RED
    BE --> S3
    WORKER --> RED
    WORKER --> PG
    WORKER --> SMTP
    WEB --> FE
```

---

## Flux de Travail Détaillé

### 1. Cycle de Vie d'un Projet PFE

#### Phase 1 : Initialisation
```mermaid
flowchart LR
    A[Admin crée projet] --> B[Assignation thème]
    B --> C[Association étudiant]
    C --> D[Notification étudiant]
```

#### Phase 2 : Développement
```mermaid
flowchart LR
    A[Étudiant dépose rapport] --> B[Encadrant notifié]
    B --> C{Validation}
    C -->|OK| D[Statut: Validé]
    C -->|Corrections| E[Retour étudiant]
    E --> A
```

#### Phase 3 : Soutenance
```mermaid
flowchart LR
    A[Admin planifie soutenance] --> B[Jury assigné]
    B --> C[Jury reçoit documents]
    C --> D[Jury notent soutenance]
    D --> E[Note finale calculée]
    E --> F[Archive/Projet Showcase]
```

### 2. Architecture des Données PostgreSQL

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : supervises
    USERS ||--|| PROJECTS : owns
    PROJECTS ||--|{ SUBMISSIONS : has
    PROJECTS ||--|| DEFENSES : scheduled_for
    SUBMISSIONS ||--|| EVALUATIONS : evaluated_by
    DEFENSES }|--o{ JURY_MEMBERS : participates_in
    USERS ||--o{ NOTIFICATIONS : receives
    
    USERS {
        uuid id PK
        varchar email
        varchar first_name
        varchar last_name
        varchar role
        timestamp created_at
    }
    
    PROJECTS {
        uuid id PK
        uuid student_id FK
        uuid supervisor_id FK
        varchar title
        text description
        enum status
        boolean is_showcase
    }
    
    SUBMISSIONS {
        uuid id PK
        uuid project_id FK
        varchar file_path
        varchar version
        enum status
        text comment
    }
    
    DEFENSES {
        uuid id PK
        uuid project_id FK
        datetime scheduled_time
        varchar room
        integer duration
    }
    
    EVALUATIONS {
        uuid id PK
        uuid submission_id FK
        float technical_score
        float presentation_score
        float methodology_score
    }
```

---

## API REST Django

### Endpoints Principaux

| Méthode | Endpoint | Description | Permissions |
|---------|----------|-------------|-------------|
| POST | `/api/auth/login/` | Authentification JWT | Public |
| POST | `/api/auth/refresh/` | Renouveler access token | Public |
| GET | `/api/users/me/` | Profil utilisateur | Authenticated |
| GET | `/api/projects/` | Liste des projets | Authenticated |
| POST | `/api/projects/` | Créer projet | Admin |
| GET | `/api/submissions/` | Liste des dépôts | Authenticated |
| POST | `/api/submissions/` | Déposer rapport | Student |
| PATCH | `/api/submissions/{id}/` | Valider/Commenter | Supervisor |
| GET | `/api/defenses/` | Planning soutenances | Authenticated |
| POST | `/api/defenses/` | Planifier soutenance | Admin |
| POST | `/api/evaluations/` | Saisir notes | Jury |
| GET | `/api/showcase/` | Projets publiés | Public |

### Exemple de Réponse API

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Système de recommandation intelligent",
  "description": "Plateforme d'IA pour la recommandation...",
  "student": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Youssef LAGMOUCH",
    "email": "youssef.lagmouch@emsi.ma"
  },
  "supervisor": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Dr. Saad BOUFERRA"
  },
  "status": "validated",
  "created_at": "2026-01-15T10:30:00Z",
  "is_showcase": true
}
```

---

## Installation & Configuration

### Prérequis
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (recommandé)

### Installation Backend (Django)

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Installation Frontend (React)

```bash
cd Frontend
npm install
npm run dev
```

### Docker Compose (Production)

```bash
docker-compose up -d
# Services démarrés:
# - frontend: http://localhost:3000
# - backend: http://localhost:8000
# - postgres: localhost:5432
# - redis: localhost:6379
```

---

## Guide de Développement

### Structure des Apps Django

```
Backend/
├── config/
│   ├── settings/
│   │   ├── base.py      # Settings communs
│   │   ├── dev.py       # Development
│   │   └── prod.py      # Production
│   └── urls.py
│
├── users/
│   ├── models.py        # User, Profile
│   ├── serializers.py   # DRF Serializers
│   ├── views.py         # API Views
│   └── permissions.py   # RBAC Custom
│
├── projects/
│   ├── models.py        # Project model
│   └── api/             # ViewSets & Routers
│
└── requirements/
    ├── base.txt
    ├── dev.txt
    └── prod.txt
```

### Exemple de Modèle Django

```python
# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('supervisor', 'Supervisor'),
        ('jury', 'Jury Member'),
        ('admin', 'Administrator'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        db_table = 'users'
```

---

## 📞 Contact & Support

- **Développeurs** : Youssef LAGMOUCH & Saad BOUFERRA
- **Encadrant** : M. MOURCHID
- **Institution** : École Marocaine des Sciences de l'Ingénieur (EMSI)

---

*Documentation générée pour le projet PFE-Navigator - Année Universitaire 2025-2026*