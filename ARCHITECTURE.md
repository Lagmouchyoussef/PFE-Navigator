# System Architecture

## Overview

The Scientific Research Portal follows a modern, layered architecture pattern with clear separation of concerns between backend and frontend components.

## Backend Architecture

### Layered Structure

```
┌─────────────────────────────────────────────┐
│         REST API (Django REST Framework)    │
├─────────────────────────────────────────────┤
│         Views/ViewSets (Request Handling)   │
├─────────────────────────────────────────────┤
│    Serializers (Data Validation & Formatting)│
├─────────────────────────────────────────────┤
│  Business Logic (Services/Managers Layer)   │
├─────────────────────────────────────────────┤
│     Models (Data Persistence Layer)         │
├─────────────────────────────────────────────┤
│    Database (SQLite/PostgreSQL)             │
└─────────────────────────────────────────────┘
```

### Core Components

#### 1. Core Configuration (`Backend/core/`)
- **settings.py** - Django configuration (environment-based)
- **urls.py** - Main URL routing
- **wsgi.py** - WSGI application entry point
- **asgi.py** - ASGI application entry point (async support)

#### 2. Applications (`Backend/apps/`)

Each application follows Django best practices with:
- `models.py` - Database models
- `views.py` - Request handlers (ViewSets)
- `serializers.py` - Data serialization/validation
- `urls.py` - Application-specific routing
- `admin.py` - Django admin configuration
- `tests.py` - Unit tests
- `migrations/` - Database migrations

**Applications:**
- `core/` - Shared functionality and utilities
- `users/` - User management and authentication
- `students/` - Student profiles and data
- `supervisors/` - Supervisor profiles and data
- `juries/` - Jury member profiles and data
- `projects/` - Project management and evaluations

#### 3. Shared Utilities (`Backend/shared/`)
- `exceptions.py` - Custom exception classes
- `permissions.py` - Role-based permission classes
- `middleware.py` - Custom middleware
- `serializers.py` - Base serializer classes
- `utils.py` - Utility functions

### Database Schema

#### User Relationships
```
User (Base)
├── Student (OneToOne)
├── Supervisor (OneToOne)
└── Jury (OneToOne)
```

#### Project Flow
```
Project
├── Student (ForeignKey)
├── Supervisor (ForeignKey)
└── Evaluation (OneToOne)
    └── Jury/Evaluator (ForeignKey)
```

### API Design

**RESTful Endpoints Structure:**
```
/api/
├── auth/
│   ├── login/
│   └── logout/
├── students/
│   └── {id}/projects/
├── supervisors/
│   └── {id}/students/
├── juries/
│   └── {id}/evaluations/
└── projects/
    ├── {id}/submit/
    └── {id}/evaluate/
```

**Response Format:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* Response data */ },
  "errors": null
}
```

## Frontend Architecture

### Module-Based Structure

```
src/
├── modules/           # Feature modules (feature-based organization)
│   ├── auth/         # Authentication
│   ├── dashboard/    # Dashboard views
│   ├── students/     # Student module
│   ├── supervisors/  # Supervisor module
│   ├── juries/       # Jury module
│   ├── projects/     # Project management
│   └── admin/        # Admin panel
│
├── common/           # Shared across modules
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API services
│   ├── types/        # TypeScript types
│   └── utils/        # Utility functions
│
├── config/           # Application configuration
│   ├── constants.ts  # App constants
│   └── endpoints.ts  # API endpoints
│
├── context/          # Global state management
├── styles/           # Global styles
├── App.tsx           # Root component
└── main.tsx          # Application entry
```

### Component Hierarchy

```
App
├── Router Setup
│   ├── Login (Anonymous)
│   ├── Student Dashboard
│   │   ├── ProjectList
│   │   ├── Evaluation
│   │   └── Schedule
│   ├── Supervisor Dashboard
│   ├── Jury Dashboard
│   └── Admin Dashboard
└── Context Providers
    └── AppProvider (Global State)
```

### State Management

**Global State (Context API):**
- User authentication state
- Notifications
- Theme (Light/Dark)
- User permissions

**Local State (React Hooks):**
- Component-specific data
- Form state
- UI state (modals, dropdowns)

### Service Layer

**API Service (`common/services/api.ts`):**
- Centralized API communication
- Request/response interceptors
- Error handling
- Authentication headers

**Custom Hooks:**
- `useAuth` - Authentication logic
- `useNotifications` - Notification handling
- `useForm` - Form management
- `useFetch` - Data fetching

## Data Flow

### Authentication Flow
```
Login Form
    ↓
API Request (POST /api/auth/login/)
    ↓
Backend Validation
    ↓
Token Generation
    ↓
Store Token & User Data (Context)
    ↓
Redirect to Dashboard
```

### Project Submission Flow
```
Project Form
    ↓
Validation (Frontend + Backend)
    ↓
API Request (POST /api/projects/)
    ↓
Database Update
    ↓
Notification (Email + In-App)
    ↓
Update UI State
```

## Security Architecture

### Backend Security Layers
1. **CORS Middleware** - Cross-origin request validation
2. **CSRF Protection** - Token-based protection
3. **Authentication** - Token or Session-based
4. **Authorization** - Role-based permissions
5. **Input Validation** - Serializer-level validation
6. **SQL Injection Prevention** - ORM usage

### Frontend Security
1. **HTTPS** - Encrypted communication
2. **Token Storage** - Secure token management
3. **XSS Protection** - React's built-in escaping
4. **CSRF Tokens** - Included in requests
5. **Input Sanitization** - Client-side validation

## Deployment Architecture

### Development Environment
```
Client (localhost:5173)
    ↓ HTTP
Server (localhost:8000)
    ↓
SQLite Database
```

### Production Environment
```
CDN (Static Files)
    ↓
Nginx (Reverse Proxy)
    ↓
Docker Container (Django App)
    ↓
PostgreSQL Database
```

## Performance Considerations

### Backend Optimization
- Database query optimization with `select_related()` and `prefetch_related()`
- Pagination for list endpoints
- Caching strategies for frequently accessed data
- Async task processing for heavy operations

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- CSS-in-JS for dynamic styling
- Component memoization for expensive renders
- API response caching

## Scalability Design

### Horizontal Scaling
- Stateless backend services
- Database replication
- Load balancing
- Session management via Redis

### Vertical Scaling
- Database indexing
- Query optimization
- Caching layers
- Background job processing

## Error Handling

### Backend Error Handling
```python
# Custom exception classes
- InvalidCredentialsException (401)
- InsufficientPermissionsException (403)
- ResourceNotFoundException (404)
- ValidationException (400)
- ConflictException (409)
```

### Frontend Error Handling
- API error catching
- User-friendly error messages
- Error logging
- Retry mechanisms

## Testing Strategy

### Backend Testing
- Unit tests (models, serializers)
- Integration tests (views, endpoints)
- Permission tests (authorization)
- Database tests (migrations)

### Frontend Testing
- Component unit tests
- Integration tests
- E2E tests
- Visual regression tests

---

**Architecture Version**: 1.0  
**Last Updated**: December 2024
