# PFE-NAVIGATOR
## Plateforme Académique de Gestion Intégrée des Projets de Fin d'Études

> **Solution enterprise de gestion académique complète - Backend Django REST + PostgreSQL**

<div align="center">
    <img src="https://img.shields.io/badge/Status-Stable-success?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />
    <img src="https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge" />
</div>

---

## 📋 Table des Matières

1. [Executive Summary](#executive-summary)
2. [Architecture Technique Complète](#architecture-technique-complète)
3. [Infrastructure & Déploiement](#infrastructure--déploiement)
4. [Modèle de Données PostgreSQL](#modèle-de-données-postgresql)
5. [Diagrammes UML Avancés](#diagrammes-uml-avancés)
6. [Sécurité & Authentification](#sécurité--authentification)
7. [Workflows Métier Détaillés](#workflows-métier-détaillés)
8. [API REST Django Documentation](#api-rest-django-documentation)
9. [Performance & Optimisation](#performance--optimisation)
10. [Guide d'Installation Précis](#guide-dinstallation-précis)

---

## Executive Summary

PFE-Navigator est une plateforme web enterprise de gestion académique conçue pour l'École Marocaine des Sciences de l'Ingénieur (EMSI). Le système répond aux besoins suivants :

| Domaine | Solution Proposée |
|---------|-------------------|
| **Gestion Documentaire** | Versionnage automatique, validation workflow, stockage sécurisé PDF |
| **Planification** | Algorithme d'optimisation des créneaux, détection de conflits |
| **Évaluation** | Grille de notation configurable, calcul automatique des moyennes |
| **Communication** | Messagerie interne, notifications temps réel, alertes email |
| **Analyse** | Tableaux de bord analytiques, KPIs de progression, export de données |

---

## Architecture Technique Complète

### Vue d'Ensemble Stratifiée (N-Tier Architecture)

```mermaid
graph TB
    subgraph "CLIENT PRESENTATION LAYER"
        direction TB
        WEB[React 19 SPA<br/>Vite + TypeScript]
        PWA[PWA Support<br/>Offline Capability]
        CHARTS[Recharts Analytics<br/>Data Visualization]
    end
    
    subgraph "API MIDDLEWARE LAYER"
        direction TB
        NGINX[Nginx Reverse Proxy<br/>SSL Termination<br/>Rate Limiting]
        GATEWAY[Django REST Framework<br/>ViewSets + Routers]
        PERM[Role-Based ACL<br/>Custom Permissions]
    end
    
    subgraph "BUSINESS LOGIC LAYER"
        direction TB
        AUTH[JWT Service<br/>Token Management]
        WORKFLOW[State Machine Engine<br/>Project Lifecycle]
        VALIDATION[Document Validator<br/>PDF Processing]
        GRADING[Evaluation Engine<br/>Score Calculation]
        NOTIFY[Notification Service<br/>Real-time Events]
    end
    
    subgraph "DATA ACCESS LAYER"
        direction TB
        ORM[SQLAlchemy/Django ORM<br/>Query Builder]
        CACHE[Redis Cache<br/>Session + Rate Limit]
        QUEUE[Celery Broker<br/>Async Tasks]
    end
    
    subgraph "PERSISTENCE LAYER"
        direction TB
        PG[(PostgreSQL 15<br/>Primary Database)]
        BACKUP[(Automated Backups<br/>Daily Snapshots)]
        STORAGE[Object Storage<br/>PDF Documents<br/>AWS S3 Compatible]
    end
    
    WEB <-- HTTPS --> NGINX
    PWA <-- HTTPS --> NGINX
    CHARTS <-- API --> GATEWAY
    NGINX <-- REST --> GATEWAY
    GATEWAY --> PERM
    PERM --> AUTH
    PERM --> WORKFLOW
    WORKFLOW --> VALIDATION
    VALIDATION --> GRADING
    GRADING --> NOTIFY
    AUTH --> ORM
    WORKFLOW --> ORM
    VALIDATION --> ORM
    GRADING --> ORM
    NOTIFY --> ORM
    ORM --> PG
    ORM --> CACHE
    CACHE --> QUEUE
    NOTIFY --> QUEUE
    VALIDATION --> STORAGE
```

### Architecture des Modules Django

```mermaid
graph TD
    subgraph "Django Project Structure"
        CONFIG[config/]
        AUTH[auth/]
        USERS[users/]
        PROJECTS[projects/]
        SUBMISSIONS[submissions/]
        DEFENSES[defenses/]
        EVALUATIONS[evaluations/]
        SHOWCASE[showcase/]
        NOTIFICATIONS[notifications/]
        COMMON[common/]
    end
    
    subgraph "Shared Components"
        MODELS[Shared Models]
        PERMS[Permission Decorators]
        SIGNALS[Django Signals]
        UTILS[Utility Functions]
    end
    
    AUTH --> MODELS
    USERS --> MODELS
    PROJECTS --> MODELS
    SUBMISSIONS --> MODELS
    DEFENSES --> MODELS
    EVALUATIONS --> MODELS
    SHOWCASE --> MODELS
    NOTIFICATIONS --> MODELS
    
    AUTH --> PERMS
    USERS --> PERMS
    PROJECTS --> PERMS
```

---

## Infrastructure & Déploiement

### Diagramme de Déploiement Détaillé

```mermaid
graph BT
    U1((Utilisateur))
    U2((Admin))
    U3((Jury))
    
    subgraph "Client Access Layer"
        CDN[Cloudflare CDN<br/>WAF + DDoS]
    end
    
    subgraph "Load Balanced Cluster"
        LB1[Nginx LB Node 1<br/>Port 443]
        LB2[Nginx LB Node 2<br/>Port 443]
    end
    
    subgraph "Application Stack (Primary)"
        WEB1[Frontend React<br/>Container:3000]
        API1[Django REST<br/>Container:8000<br/>Gunicorn 4 workers]
        WORKER1[Celery Worker<br/>Container:5000]
    end
    
    subgraph "Application Stack (Replica)"
        WEB2[Frontend React<br/>Container:3001]
        API2[Django REST<br/>Container:8001<br/>Gunicorn 4 workers]
        WORKER2[Celery Worker<br/>Container:5001]
    end
    
    subgraph "Data Services"
        PG1[(PostgreSQL<br/>Master<br/>Port:5432)]
        PG2[(PostgreSQL<br/>Replica<br/>Port:5433)]
        RED1[(Redis<br/>Primary<br/>Port:6379)]
        RED2[(Redis<br/>Replica<br/>Port:6380)]
    end
    
    subgraph "Storage & External Services"
        S3[MinIO S3<br/>PDF Storage]
        SMTP[Mailgun SMTP<br/>Transactional Email]
        MONITOR[Grafana<br/>Metrics & Alerts]
    end
    
    U1 --> CDN
    U2 --> CDN
    U3 --> CDN
    CDN --> LB1
    CDN --> LB2
    LB1 --> WEB1
    LB1 --> API1
    LB2 --> WEB2
    LB2 --> API2
    API1 --> PG1
    API1 --> RED1
    API2 --> PG1
    API2 --> RED1
    WORKER1 --> PG1
    WORKER1 --> RED1
    WORKER2 --> PG1
    WORKER2 --> RED1
    PG1 <--> PG2
    RED1 <--> RED2
    API1 --> S3
    WORKER1 --> SMTP
    API1 --> MONITOR
```

### Architecture des Répertoires

```
pfe-navigator/
├── Backend/                        # Django REST API
│   ├── config/                     # Django settings
│   │   ├── __init__.py
│   │   ├── settings/
│   │   │   ├── base.py            # Base configuration
│   │   │   ├── development.py     # Dev overrides
│   │   │   ├── testing.py         # Test settings
│   │   │   └── production.py      # Production settings
│   │   ├── urls.py                # Root URL router
│   │   ├── asgi.py               # ASGI entry point
│   │   └── wsgi.py               # WSGI entry point
│   │
│   ├── apps/
│   │   ├── authentication/        # JWT Auth module
│   │   ├── users/                 # User management
│   │   ├── projects/              # Project CRUD operations
│   │   ├── submissions/           # Document workflow
│   │   ├── defenses/              # Defense scheduling
│   │   ├── evaluations/           # Grading system
│   │   ├── showcase/              # Public gallery
│   │   └── notifications/         # Real-time alerts
│   │
│   ├── requirements/
│   │   ├── base.txt               # Core dependencies
│   │   ├── development.txt        # Dev tools
│   │   ├── testing.txt            # Test frameworks
│   │   └── production.txt         # Production deps
│   │
│   ├── scripts/
│   │   ├── entrypoint.sh          # Docker entrypoint
│   │   └── wait-for-db.sh         # DB readiness check
│   │
│   └── Dockerfile
│
├── Frontend/                       # React SPA
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Route-based views
│   │   ├── services/              # API clients
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # State management
│   │   ├── utils/                 # Helper functions
│   │   ├── assets/                # Static resources
│   │   └── styles/                # Global CSS
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml              # Multi-container orchestration
├── docker-compose.prod.yml         # Production overrides
├── nginx.conf                      # Reverse proxy config
└── .env.example                    # Environment template
```

---

## Modèle de Données PostgreSQL

### Schéma de Base de Données (ERD)

```mermaid
erDiagram
    AUTH_USER ||--o{ PROJECT_PROJECT : "supervises"
    AUTH_USER ||--|| PROJECT_PROJECT : "owns"
    PROJECT_PROJECT ||--|{ SUBMISSION_SUBMISSION : "contains"
    PROJECT_PROJECT ||--|| DEFENSE_DEFENSE : "scheduled_for"
    SUBMISSION_SUBMISSION ||--|| EVALUATION_EVALUATION : "evaluated_by"
    DEFENSE_DEFENSE }|--o{ DEFENSE_JURYMEMBER : "jury_assignments"
    AUTH_USER ||--o{ NOTIFICATION_NOTIFICATION : "receives"
    PROJECT_PROJECT ||--o{ SHOWCASE_PROJECTSHOWCASE : "featured_as"
    
    AUTH_USER {
        uuid id PK "UUID Primary Key"
        varchar email "Unique Email"
        varchar first_name "First Name"
        varchar last_name "Last Name"
        varchar phone "Phone Number"
        varchar role "student|supervisor|jury|admin"
        boolean is_active "Account Status"
        datetime date_joined "Creation Timestamp"
        datetime last_login "Last Login"
    }
    
    PROJECT_PROJECT {
        uuid id PK
        uuid student_id FK "Foreign Key to User"
        uuid supervisor_id FK "Foreign Key to User"
        varchar title "Project Title"
        text description "Detailed Description"
        date start_date "Project Start"
        date deadline "Submission Deadline"
        varchar status "draft|in_progress|submitted|validated|completed"
        decimal final_grade "Computed Grade"
        boolean is_showcase "Featured Flag"
        datetime created_at "Creation Timestamp"
        datetime updated_at "Last Update"
        index idx_student "Index on student_id"
        index idx_status "Index on status"
    }
    
    SUBMISSION_SUBMISSION {
        uuid id PK
        uuid project_id FK
        varchar file_path "S3/Object Storage Path"
        varchar original_filename "Original Filename"
        varchar version "Semantic Version (v1.0.0)"
        varchar status "pending|approved|rejected"
        text comment "Supervisor Feedback"
        decimal file_size "Bytes Size"
        varchar mime_type "application/pdf"
        datetime submitted_at "Submission Timestamp"
        datetime validated_at "Validation Timestamp"
        unique project_version "Unique per project version"
    }
    
    DEFENSE_DEFENSE {
        uuid id PK
        uuid project_id FK "One-to-One"
        datetime scheduled_time "Scheduled DateTime"
        varchar room "Location Room"
        integer duration_minutes "Planned Duration"
        decimal presentation_score "0-20 Scale"
        decimal technical_score "0-20 Scale"
        decimal methodology_score "0-20 Scale"
        text jury_comments "Combined Feedback"
        varchar status "scheduled|completed|canceled"
        datetime created_at
        datetime updated_at
        check chk_duration "15-120 minutes"
    }
    
    EVALUATION_EVALUATION {
        uuid id PK
        uuid submission_id FK "One-to-One"
        decimal technical_score "Innovation Score"
        decimal presentation_score "Oral Score"
        decimal methodology_score "Methodology Score"
        decimal originality_score "Originality (0-20)"
        text detailed_comments "Structured Feedback"
        uuid evaluated_by FK "User ID"
        datetime evaluated_at "Evaluation Timestamp"
        check chk_scores "All scores 0-20"
    }
    
    SHOWCASE_PROJECTSHOWCASE {
        uuid id PK
        uuid project_id FK "Unique Reference"
        date featured_date "Showcase Date"
        varchar technology_stack "JSON Array"
        text project_abstract "Public Abstract"
        varchar github_url "Repository Link"
        integer view_count "Analytics Counter"
        integer like_count "Community Likes"
        datetime created_at
    }
    
    NOTIFICATION_NOTIFICATION {
        uuid id PK
        uuid recipient_id FK "User Reference"
        varchar notification_type "submission|evaluation|schedule"
        varchar title "Notification Title"
        text message "Full Message Body"
        varchar link_url "Frontend Route"
        boolean is_read "Read Status"
        datetime created_at "Creation Time"
        datetime read_at "Read Timestamp"
        index idx_recipient "Performance Index"
    }
    
    DEFENSE_JURYMEMBER {
        uuid id PK
        uuid defense_id FK
        uuid user_id FK "Jury Member"
        varchar role "president|examiner|observer"
        datetime assigned_at "Assignment Time"
        check chk_role "Valid Role"
    }
```

### Indexation PostgreSQL

```sql
-- Performance Indexes
CREATE INDEX idx_submissions_project_status ON submissions (project_id, status);
CREATE INDEX idx_projects_student_status ON projects (student_id, status);
CREATE INDEX idx_defenses_scheduled ON defenses (scheduled_time);
CREATE INDEX idx_notifications_unread ON notifications (recipient_id, is_read);
CREATE INDEX idx_evaluations_submission ON evaluations (submission_id);

-- Full-text Search Indexes
CREATE INDEX idx_projects_title_search ON projects USING gin(to_tsvector('french', title));
CREATE INDEX idx_showcase_abstract_search ON showcase USING gin(to_tsvector('french', abstract));
```

---

## Diagrammes UML Avancés

### Diagramme de Séquence : Processus de Soumission Complète

```mermaid
sequenceDiagram
    participant STUDENT as Étudiant
    participant FRONTEND as React Frontend
    participant VALIDATOR as Document Validator
    participant API as Django API
    participant DB as PostgreSQL
    participant STORAGE as Object Storage (S3)
    participant CELERY as Celery Worker
    participant EMAIL as SMTP Service
    participant SUPERVISOR as Encadrant
    
    STUDENT->>FRONTEND: Sélectionne fichier PDF
    FRONTEND->>FRONTEND: Vérification côté client<br/>(Taille max 50MB, extension .pdf)
    FRONTEND->>API: POST /api/submissions/<br/>multipart/form-data + JWT
    
    API->>API: Valid JWT Token<br/>Extract user claims
    API->>API: Permission Check<br/>(Is student owner of project?)
    
    API->>VALIDATOR: Valider contenu PDF<br/>(MIME type, taille, pages)
    VALIDATOR-->>API: Validation OK + Checksum
    
    API->>STORAGE: Upload vers S3<br/>Path: /submissions/{uuid}.pdf
    STORAGE-->>API: ETag + URL signée
    
    API->>DB: INSERT INTO submissions<br/>(id, project_id, file_path, version)
    DB-->>API: Retourne ID généré
    
    API->>CELERY: task.send_notification.delay()<br/>Args: supervisor_id, message
    CELERY->>DB: INSERT INTO notifications<br/>notification_type='submission'
    CELERY-->>EMAIL: Send email via SMTP
    EMAIL-->>SUPERVISOR: Notification email
    
    API-->>FRONTEND: 201 Created<br/>{submission_id, status: "pending"}
    FRONTEND-->>STUDENT: Toast "Rapport déposé avec succès"
```

### Diagramme de Communication : Validation Multi-niveaux

```mermaid
sequenceDiagram
    title Workflow de Validation Hiérarchique

    participant SUPERVISOR as Encadrant
    participant API as Django API
    participant DB as PostgreSQL
    participant NOTIFY as Notification Service
    participant STUDENT as Étudiant
    participant ADMIN as Administrateur
    
    SUPERVISOR->>API: PATCH /api/submissions/{id}/<br/>{status: "approved", comment: ""}
    
    API->>API: Verify JWT + Role<br/>(Must be supervisor of project)
    API->>DB: UPDATE submissions SET<br/>status='approved', validated_at=NOW()
    DB-->>API: Rows affected
    
    API->>DB: SELECT project_id FROM submissions<br/>WHERE id = {id}
    DB-->>API: project_id
    
    API->>DB: UPDATE projects SET<br/>status='validated'<br/>WHERE id = project_id
    DB-->>API: OK
    
    rect rgb(240, 255, 240)
        Note over API,NOTIFY: Broadcast Notifications
        
        API->>NOTIFY: send_to_user(student_id,<br/>"Rapport validé")
        API->>NOTIFY: send_to_admins(<br/>"Projet validé - Prêt soutenance")
        
        NOTIFY->>STUDENT: Push notification + Email
        NOTIFY->>ADMIN: Dashboard notification
    end
    
    API-->>SUPERVISOR: 200 OK<br/>{"status": "approved"}
```

### Diagramme de Paquetages (Packages)

```mermaid
graph TD
    subgraph "com.pfe-navigator.backend"
        subgraph "com.pfe-navigator.auth"
            JWT[JWT Utilities]
            PERM[Permission Decorators]
            TOKEN[Token Services]
        end
        
        subgraph "com.pfe-navigator.models"
            USER[User Model]
            PROJECT[Project Model]
            SUBMISSION[Submission Model]
            DEFENSE[Defense Model]
        end
        
        subgraph "com.pfe-navigator.api.v1"
            AUTH_API[Auth Endpoints]
            USER_API[User Endpoints]
            PROJECT_API[Project Endpoints]
            SUBMISSION_API[Submission Endpoints]
        end
        
        subgraph "com.pfe-navigator.services"
            EMAIL_SVC[Email Service]
            STORAGE_SVC[Storage Service]
            VALIDATION_SVC[Validation Service]
        end
        
        subgraph "com.pfe-navigator.tasks"
            NOTIFY_TASK[Notification Tasks]
            REPORT_TASK[Report Generation]
        end
    end
    
    JWT --> USER
    PERM --> USER_API
    TOKEN --> AUTH_API
```

---

## Sécurité & Authentification

### Architecture JWT Détaillée

```mermaid
flowchart LR
    A[Login Request] --> B{Validate<br/>Credentials}
    B -- Invalid --> C[401 Unauthorized]
    B -- Valid --> D[Generate Token Pair]
    
    subgraph "Token Generation"
        D --> E[Access Token<br/>Expires: 15min]
        D --> F[Refresh Token<br/>Expires: 7days]
    end
    
    subgraph "Access Token Payload"
        E --> G[user_id: uuid]
        E --> H[role: string]
        E --> I[exp: timestamp]
        E --> J[iat: timestamp]
        E --> K[token_type: access]
    end
    
    subgraph "Refresh Token Payload"
        F --> L[user_id: uuid]
        F --> M[exp: timestamp]
        F --> N[iat: timestamp]
        F --> O[token_type: refresh]
    end
    
    G --> P[Response]
    H --> P
    I --> P
    P --> Q[Client Stores<br/>Secure HttpOnly Cookie]
    
    Q --> R[API Request<br/>Authorization: Bearer]
    R --> S{Verify Token}
    S -- Invalid --> T[403 Forbidden]
    S -- Expired --> U[Redirect to<br/>Refresh Endpoint]
    S -- Valid --> V[Process Request]
```

### Configuration CORS & CSRF

```python
# settings/production.py
CORS_ALLOWED_ORIGINS = [
    "https://pfe-navigator.emsi.ma",
    "https://www.pfe-navigator.emsi.ma",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://pfe-navigator.emsi.ma",
]

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
```

### RBAC (Role-Based Access Control)

| Ressource | Student | Supervisor | Jury | Admin |
|-----------|---------|-----------|------|-------|
| Voir son projet | ✅ | ✅ | ❌ | ✅ |
| Déposer rapport | ✅ | ❌ | ❌ | ✅ |
| Valider rapport | ❌ | ✅ | ❌ | ✅ |
| Planifier soutenance | ❌ | ❌ | ❌ | ✅ |
| Évaluer soutenance | ❌ | ❌ | ✅ | ✅ |
| Publier showcase | ❌ | ❌ | ❌ | ✅ |
| Gérer utilisateurs | ❌ | ❌ | ❌ | ✅ |
| Voir stats globales | ❌ | ✅ | ❌ | ✅ |

---

## Workflows Métier Détaillés

### Workflow de Planification de Soutenance

```mermaid
flowchart TD
    A[Début - Projet Validé] --> B{Admin ouvre<br/>Module Planning}
    
    B --> C[Sélection des projets<br/>à planifier]
    C --> D[Algorithme d'optimisation<br/>(Constraint Satisfaction)]
    
    D --> E{Conflits détectés ?}
    E -- Oui --> F[Proposition alternatives<br/>(Salles, créneaux)]
    E -- Non --> G[Calendrier validé]
    
    F --> H[Admin valide<br/>ou ajuste manuellement]
    H --> G
    
    G --> I[Génération notifications<br/>pour jury + étudiant]
    
    I --> J{Envoi confirmations}
    J -- OK --> K[Soutenance confirmée]
    J -- KO --> L[Relance automatique<br/>+ Alertes admin]
    
    K --> M[Fin du workflow]
    L --> J
    
    style A fill:#e1f5fe
    style M fill:#c8e6c9
```

### Algorithme de Calcul de Note Finale

```mermaid
flowchart LR
    A[Scores Jury] --> B[Validation<br/>cohérence]
    B --> C[Moyenne pondérée]
    
    subgraph "Pondération"
        D[technique: 30%]
        E[présentation: 25%]
        F[méthodologie: 25%]
        G[originalité: 20%]
    end
    
    C --> D
    C --> E
    C --> F
    C --> G
    
    D --> H[Note Finale]
    E --> H
    F --> H
    G --> H
    
    H --> I{Seuil<br/>Showcase ?}
    I -- ≥ 16/20 --> J[Projet éligible<br/>Showcase]
    I -- < 16/20 --> K[Archivage standard]
    
    J --> L[Notification<br/>administration]
```

---

## API REST Django Documentation

### Schéma OpenAPI 3.0

```yaml
openapi: 3.0.0
info:
  title: PFE-Navigator API
  version: 1.0.0
  description: API de gestion académique pour les PFEs

paths:
  /api/v1/auth/login/:
    post:
      summary: Authentification utilisateur
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  format: password
      responses:
        '200':
          description: Authentification réussie
          content:
            application/json:
              schema:
                type: object
                properties:
                  access:
                    type: string
                    description: JWT Access Token
                  refresh:
                    type: string
                    description: JWT Refresh Token
                  user:
                    $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
        first_name:
          type: string
        last_name:
          type: string
        role:
          type: string
          enum: [student, supervisor, jury, admin]
```

### Endpoints par Module

#### Authentication Endpoints
| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/v1/auth/login/` | JWT Login | 5/min |
| POST | `/api/v1/auth/refresh/` | Refresh token | 10/min |
| POST | `/api/v1/auth/logout/` | Blacklist refresh token | - |

#### Projects Endpoints
| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/api/v1/projects/` | List projects | Authenticated |
| POST | `/api/v1/projects/` | Create project | Admin |
| GET | `/api/v1/projects/{id}/` | Get project detail | Owner/Related |
| PATCH | `/api/v1/projects/{id}/` | Update project | Admin |

#### Submissions Endpoints
| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/api/v1/submissions/` | List submissions | Authenticated |
| POST | `/api/v1/submissions/` | Create submission | Student |
| GET | `/api/v1/submissions/{id}/` | Get submission | Related users |
| PATCH | `/api/v1/submissions/{id}/` | Update status | Supervisor |

---

## Performance & Optimisation

### Stratégie de Cache Multi-niveau

```mermaid
graph TD
    REQUEST[Incoming Request] --> L1{L1 Cache<br/>(In-Memory)}
    L1 -- HIT --> RESPONSE1[Return Cached Data]
    L1 -- MISS --> L2{L2 Cache<br/>(Redis)}
    
    L2 -- HIT --> RESPONSE2[Return Cached<br/>Store in L1]
    L2 -- MISS --> DB[Database Query]
    
    DB --> RESPONSE3[Return Data<br/>Cache in L2 + L1]
    
    RESPONSE1 --> CLIENT
    RESPONSE2 --> CLIENT
    RESPONSE3 --> CLIENT
    
    style L1 fill:#fff3e0
    style L2 fill:#e8f5e9
    style DB fill:#ffebee
```

### Optimisations PostgreSQL

```sql
-- Connection Pooling
-- Configure in Django settings:
CONN_MAX_AGE = 60  -- Persistent connections

-- Query Optimization Examples
-- 1. Use select_related for FK joins
SELECT * FROM projects 
SELECT_RELATED supervisor, student;

-- 2. Use prefetch_related for reverse FK
SELECT * FROM users 
PREFETCH_RELATED projects__submissions;
```

### Monitoring & Métriques

| Métrique | Seuil | Action |
|----------|-------|--------|
| Response Time | > 200ms | Alert |
| Error Rate | > 1% | Page team lead |
| DB Connections | > 80% pool | Scale read replicas |
| Cache Hit Ratio | < 90% | Review caching strategy |

---

## Guide d'Installation Précis

### Configuration Environnementale

```bash
# Fichier .env (à la racine du projet)
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=pfe-navigator.emsi.ma,localhost
DATABASE_URL=postgresql://user:password@postgres:5432/pfe_navigator
REDIS_URL=redis://redis:6379/0

# Email Settings
EMAIL_HOST=smtp.mailgun.org
EMAIL_HOST_USER=postmaster@pfe-navigator.emsi.ma
EMAIL_HOST_PASSWORD=your-password

# File Storage
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=pdf-submissions
```

### Commandes de Déploiement Production

```bash
# 1. Build des images Docker
docker-compose -f docker-compose.prod.yml build

# 2. Migrer la base de données
docker-compose -f docker-compose.prod.yml run --rm backend python manage.py migrate

# 3. Collecter les fichiers statiques
docker-compose -f docker-compose.prod.yml run --rm backend python manage.py collectstatic --noinput

# 4. Créer superutilisateur
docker-compose -f docker-compose.prod.yml run --rm backend python manage.py createsuperuser

# 5. Démarrer les services
docker-compose -f docker-compose.prod.yml up -d

# 6. Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Tests Automatisés

```bash
# Backend Tests (pytest + factory-boy)
cd Backend
pytest --cov=apps --cov-report=html tests/

# Frontend Tests (Jest + React Testing Library)
cd Frontend
npm test -- --coverage

# Linting & Type Checking
npm run lint
python -m mypy apps/
```

---

## Support & Maintenance

| Service | Responsable | SLA |
|---------|-------------|-----|
| Développement | Youssef LAGMOUCH | 24-48h |
| Infrastructure | Saad BOUFERRA | 4h |
| Sécurité | M. MOURCHID | 24h |

---

*© 2026 PFE-Navigator - École Marocaine des Sciences de l'Ingénieur*