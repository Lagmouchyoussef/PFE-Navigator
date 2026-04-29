# RAPPORT DE PROJET DE FIN D'ÉTUDES

---

<div align="center">

**École Marocaine des Sciences de l'Ingénieur (EMSI)**

*Filière : Ingénierie Informatique — 3IIR*

*Année Académique : 2025 / 2026*

---

## Plateforme Numérique de Gestion des Projets de Fin d'Études
### PFE PORTAL — Système Académique de Gestion Intégrée

---

**Présenté par :**

| Étudiant | N° Apogée |
| :--- | :--- |
| **Youssef LAGMOUCH** | xxxxxxx |
| **Saad BOUFERRA** | xxxxxxx |

---

**Encadrant Académique :**  Pr. [Nom du Professeur]

**Soutenu le :** ........................ 2026

---

*Rapport de Projet de Fin d'Études soumis en vue de l'obtention du Diplôme d'Ingénieur d'État*

</div>

---

## REMERCIEMENTS

Nous tenons à exprimer notre profonde gratitude envers toutes les personnes qui ont contribué à la réussite de ce projet.

Nous remercions en premier lieu notre encadrant académique pour ses orientations précieuses, sa disponibilité et ses conseils avisés tout au long de ce travail.

Nous remercions également la direction de l'**EMSI** pour avoir mis à notre disposition les ressources nécessaires à la réalisation de ce projet.

Enfin, nous adressons nos sincères remerciements à nos familles et amis pour leur soutien moral constant.

---

## RÉSUMÉ

Ce rapport présente la conception et la réalisation d'une **Plateforme Numérique de Gestion des Projets de Fin d'Études** baptisée **PFE Portal**. Il s'agit d'une application web SaaS (Software as a Service) développée avec une architecture moderne basée sur **React.js** pour le Frontend, **Django REST Framework** pour le Backend, et **PostgreSQL** comme système de gestion de base de données.

Le système vise à centraliser et automatiser l'ensemble du cycle de vie du PFE : depuis le dépôt de candidatures par les étudiants jusqu'à la validation finale par le jury, en passant par la planification des soutenances et le suivi de progression par les encadrants. Une fonctionnalité innovante — l'**Espace Visiteur (Showcase)** — permet à l'administration de valoriser les meilleurs travaux académiques auprès des futurs étudiants.

**Mots-clés :** PFE, React.js, Django REST Framework, PostgreSQL, Gestion Académique, SaaS, API REST, JWT.

---

## ABSTRACT

This report presents the design and implementation of a **Digital Platform for Final Year Project Management** called **PFE Portal**. It is a SaaS web application built with a modern architecture: **React.js** for the Frontend, **Django REST Framework** for the Backend, and **PostgreSQL** as the database management system.

The system aims to centralize and automate the entire PFE lifecycle: from student submissions to final jury validation, including defense scheduling and progress tracking by supervisors. An innovative feature — the **Visitor Showcase Space** — allows the administration to highlight the best academic works for future students.

**Keywords:** Final Year Project, React.js, Django REST Framework, PostgreSQL, Academic Management, SaaS, REST API, JWT.

---

## TABLE DES MATIÈRES

- [Introduction Générale](#1-introduction-générale)
- [Chapitre 1 — Analyse et Spécification des Besoins](#chapitre-1--analyse-et-spécification-des-besoins)
- [Chapitre 2 — Architecture Technique](#chapitre-2--architecture-technique)
- [Chapitre 3 — Conception UML](#chapitre-3--conception-uml)
- [Chapitre 4 — Présentation des Modules](#chapitre-4--présentation-des-modules)
- [Chapitre 5 — Espace Visiteur (Showcase)](#chapitre-5--espace-visiteur-showcase)
- [Chapitre 6 — Implémentation Technique](#chapitre-6--implémentation-technique)
- [Conclusion et Perspectives](#conclusion-et-perspectives)
- [Annexes](#annexes)
- [Bibliographie](#bibliographie)

---

## 1. INTRODUCTION GÉNÉRALE

### 1.1. Contexte du Projet

Dans le cadre de leur formation d'ingénieur, les étudiants de l'EMSI réalisent un **Projet de Fin d'Études (PFE)** qui représente l'aboutissement de leur cursus académique. La gestion administrative et pédagogique de ces projets mobilise de nombreux acteurs — étudiants, encadrants et jury — et génère une quantité importante de documents et d'interactions.

La gestion traditionnelle par email et tableurs s'avère insuffisante, source d'erreurs et de perte d'information. C'est dans ce contexte que s'inscrit le développement du **PFE Portal**.

### 1.2. Problématique

Comment centraliser, automatiser et sécuriser l'ensemble du processus de gestion des PFEs — de la candidature à la validation — tout en offrant une expérience utilisateur moderne et adaptée à chaque profil d'acteur ?

### 1.3. Objectifs du Projet

- Fournir un portail unique pour tous les acteurs du PFE.
- Automatiser la planification des jurys et la détection des conflits.
- Assurer un suivi de progression en temps réel.
- Valoriser les meilleurs travaux via une vitrine publique.

---

## CHAPITRE 1 — ANALYSE ET SPÉCIFICATION DES BESOINS

### 1.1. Identification des Acteurs

Le système est articulé autour de cinq profils utilisateurs distincts :

| Acteur | Rôle dans le Système |
| :--- | :--- |
| **Administrateur** | Gestion globale du système, planification, audit et publication des meilleurs PFEs. |
| **Encadrant** | Suivi des étudiants, validation des rapports intermédiaires, feedback technique. |
| **Jury** | Évaluation des soutenances via une grille de notation structurée. |
| **Étudiant** | Dépôt de livrables, consultation du planning et suivi des feedbacks. |
| **Visiteur** | Consultation publique des meilleurs PFEs sans nécessiter de compte. |

### 1.2. Besoins Fonctionnels

| N° | Besoin | Priorité |
| :--- | :--- | :--- |
| BF01 | Authentification sécurisée par rôle | Haute |
| BF02 | Gestion CRUD des utilisateurs | Haute |
| BF03 | Dépôt et suivi de l'avancement du rapport | Haute |
| BF04 | Planification automatique des jurys | Haute |
| BF05 | Validation des rapports par l'encadrant | Haute |
| BF06 | Évaluation des soutenances par le jury | Haute |
| BF07 | Système de notifications et alertes | Moyenne |
| BF08 | Messagerie interne | Moyenne |
| BF09 | Exportation PDF des données | Moyenne |
| BF10 | Espace Visiteur (Showcase public) | Haute |

### 1.3. Besoins Non-Fonctionnels

- **Sécurité :** Authentification JWT, protection des routes, pas de fuite de données personnelles dans l'espace public.
- **Performance :** Temps de réponse API < 200 ms grâce à l'indexation PostgreSQL.
- **Disponibilité :** Architecture découplée (Frontend / Backend) garantissant la haute disponibilité.
- **Maintenabilité :** Code modulaire, composants React réutilisables, API RESTful bien documentée.

---

## CHAPITRE 2 — ARCHITECTURE TECHNIQUE

### 2.1. Architecture Globale

Le système suit une architecture en **3 couches** (Three-Tier Architecture) :

```mermaid
graph TD
    subgraph "Couche Présentation (Frontend)"
        A["React.js"]
        B["React Bootstrap / Lucide Icons"]
        C["Recharts — Visualisation"]
        D["Framer Motion — Animations"]
    end

    subgraph "Couche Métier (Backend)"
        E["Django REST Framework"]
        F["JWT Authentication"]
        G["Serializers / Views / URLs"]
    end

    subgraph "Couche Données (Persistance)"
        H[("PostgreSQL")]
    end

    A <-->|"HTTP / API REST / JSON"| E
    E <--> F
    E <--> H
```

### 2.2. Stack Technologique

| Couche | Technologie | Version | Rôle |
| :--- | :--- | :--- | :--- |
| Frontend | React.js | 18.x | Interface utilisateur dynamique |
| Frontend | React Bootstrap | 2.x | Design system et composants UI |
| Frontend | Recharts | 2.x | Graphiques et analytics |
| Frontend | Framer Motion | 11.x | Micro-animations et transitions |
| Backend | Django | 5.x | Framework web Python |
| Backend | Django REST Framework | 3.x | Exposition des APIs REST |
| Backend | Simple JWT | 5.x | Authentification par tokens |
| Base de données | PostgreSQL | 16.x | Stockage relationnel robuste |

### 2.3. Flux de Communication

Le Frontend React communique exclusivement avec le Backend via des requêtes **HTTP/JSON** sécurisées. Chaque requête sur une route privée doit inclure un `Bearer Token` JWT dans l'en-tête `Authorization`. Les routes publiques (Espace Visiteur) n'ont pas cette contrainte.

---

## CHAPITRE 3 — CONCEPTION UML

### 3.1. Diagramme de Cas d'Utilisation

```mermaid
graph LR
    Admin["Administrateur"]
    Enc["Encadrant"]
    Stud["Étudiant"]
    Jury["Jury"]
    Vis["Visiteur"]

    subgraph "Système PFE Portal"
        UC1["Gérer les Utilisateurs"]
        UC2["Planifier la Soutenance"]
        UC3["Déposer un Rapport"]
        UC4["Valider un Rapport"]
        UC5["Évaluer la Soutenance"]
        UC6["Publier dans Showcase"]
        UC7["Consulter les Meilleurs PFEs"]
        UC8["Consulter les Notifications"]
    end

    Admin --> UC1
    Admin --> UC2
    Admin --> UC6
    Stud --> UC3
    Stud --> UC8
    Enc --> UC4
    Enc --> UC8
    Jury --> UC5
    Vis --> UC7
```

### 3.2. Diagramme de Classes

```mermaid
classDiagram
    direction LR
    class User {
        +int id
        +String username
        +String email
        +String password_hash
        +Enum role
        +Boolean is_active
        +login()
        +logout()
    }
    class Project {
        +int id
        +String title
        +String description
        +Date deadline
        +Enum status
        +Boolean is_showcase
        +Float final_grade
        +publishToShowcase()
    }
    class Submission {
        +int id
        +File file_path
        +DateTime upload_date
        +String version
        +Enum validation_status
    }
    class Evaluation {
        +int id
        +Float technical_score
        +Float methodology_score
        +Float presentation_score
        +String comments
        +DateTime evaluated_at
        +computeFinalGrade()
    }
    class Defense {
        +int id
        +DateTime scheduled_at
        +String room
        +Boolean conflict_detected
    }

    User "1" -- "*" Project : "encadre / appartient"
    Project "1" -- "*" Submission : "contient"
    Submission "1" -- "0..1" Evaluation : "reçoit"
    Project "1" -- "1" Defense : "planifiée pour"
    User "*" -- "1" Defense : "jury de"
```

### 3.3. Diagramme de Séquence — Validation de Rapport

```mermaid
sequenceDiagram
    participant Etudiant as Étudiant
    participant React as Frontend React
    participant Django as Backend Django
    participant DB as PostgreSQL

    Etudiant->>React: Upload rapport PDF
    React->>Django: POST /api/submissions/ + JWT
    Django->>DB: INSERT INTO submissions
    DB-->>Django: 201 Created
    Django-->>React: Submission créée
    React-->>Etudiant: Notification success

    Note over Django,DB: Alerte automatique à l'Encadrant

    participant Enc as Encadrant
    Enc->>React: Consulte et valide le rapport
    React->>Django: PATCH /api/submissions/{id}/validate/
    Django->>DB: UPDATE status="approved"
    DB-->>Django: OK
    Django-->>React: 200 OK
    React-->>Etudiant: Rapport validé
```

### 3.4. Diagramme de Séquence — Publication Showcase

```mermaid
sequenceDiagram
    participant Admin
    participant React as Frontend React
    participant Django as Backend Django
    participant DB as PostgreSQL
    participant Visiteur

    Admin->>React: Clique "Promouvoir en Vitrine"
    React->>Django: PATCH /api/projects/{id}/set_showcase/
    Django->>DB: UPDATE is_showcase=True
    DB-->>Django: OK
    Django-->>React: Project publié
    React-->>Admin: Confirmation

    Note over Visiteur,DB: Accès public, pas d'authentification

    Visiteur->>React: Visite /showcase
    React->>Django: GET /api/projects/showcase/
    Django->>DB: SELECT WHERE is_showcase=True
    DB-->>Django: Liste des meilleurs PFEs
    Django-->>React: JSON
    React-->>Visiteur: Galerie des Meilleurs PFEs
```

---

## CHAPITRE 4 — PRÉSENTATION DES MODULES

### 4.1. Module Administrateur (`/admin/*`)

Le tableau de bord administrateur est le **centre de contrôle** du système. Il offre une vue à 360° sur l'ensemble de la plateforme.

**Fonctionnalités clés :**
- **Dashboard** : KPIs en temps réel (Total Utilisateurs, Projets Actifs, Soutenances Planifiées).
- **Gestion des Utilisateurs** : Création, modification, suspension de comptes par rôle.
- **Planification des Jurys** : Interface calendrier avec détection automatique des conflits de salles.
- **Archive des Projets** : Historique consultable par année, département et note.
- **Journaux d'Audit** : Traçabilité complète des actions effectuées sur la plateforme.

### 4.2. Module Encadrant (`/supervisor/*`)

L'espace encadrant est centré sur la **productivité et le suivi pédagogique**.

**Fonctionnalités clés :**
- **Suivi de Cohorte** : Vue d'ensemble de la progression de chaque étudiant avec indicateurs de risque.
- **Espace de Validation** : Révision et approbation/rejet des rapports soumis.
- **Analytiques** : Graphiques de progression réelle vs. objectifs attendus.
- **Liste de Tâches** : Checklist des actions prioritaires.

### 4.3. Module Étudiant (`/student/*`)

Le portail étudiant est conçu pour être **intuitif et informatif**.

**Fonctionnalités clés :**
- **Tableau de Bord Personnel** : Indicateur de progression, score de probabilité de succès.
- **Dépôt de Livrables** : Interface d'upload sécurisée pour les rapports PDF.
- **Suivi des Feedbacks** : Consultation des commentaires de l'encadrant.
- **Planning de Soutenance** : Affichage de la date, l'heure et la salle assignées.

### 4.4. Module Jury (`/jury/*`)

L'espace jury permet une **évaluation structurée et rigoureuse**.

**Fonctionnalités clés :**
- **Planning Personnel** : Agenda des soutenances à évaluer.
- **Grille d'Évaluation** : Formulaire de notation par critères (Technique, Méthodologie, Présentation).
- **Calcul Automatique** : La note finale est calculée automatiquement à partir des sous-scores.
- **Consultation de Documents** : Accès au rapport soumis directement depuis la fiche d'évaluation.

---

## CHAPITRE 5 — ESPACE VISITEUR (SHOWCASE)

### 5.1. Concept et Valeur Ajoutée

L'**Espace Visiteur** est une innovation distincte de ce projet. Inspiré des portails d'excellence académique des grandes écoles, il constitue une **vitrine publique** permettant à n'importe quelle personne — futurs étudiants, entreprises, partenaires — de consulter les projets les plus remarquables.

Cet espace transforme le PFE Portal d'un simple outil de gestion interne en une véritable plateforme de **valorisation du capital intellectuel** de l'école.

### 5.2. Processus de Publication

1. L'administration identifie les projets à valoriser (basé sur la note finale).
2. Un clic sur **"Promouvoir en Vitrine"** rend le projet public.
3. Le projet apparaît instantanément dans la galerie accessible à l'URL `/showcase`.
4. Les visiteurs peuvent filtrer par **Département**, **Technologie** ou **Année académique**.

### 5.3. Données Exposées Publiquement

| Information | Exposée | Non Exposée |
| :--- | :--- | :--- |
| Titre du Projet | ✅ | — |
| Résumé (Abstract) | ✅ | — |
| Département | ✅ | — |
| Année Académique | ✅ | — |
| Prénom(s) de l'étudiant | ✅ | — |
| Email / Note / Données personnelles | — | ❌ |

---

## CHAPITRE 6 — IMPLÉMENTATION TECHNIQUE

### 6.1. Gestion de l'Authentification (JWT)

L'authentification est basée sur le protocole **JWT (JSON Web Token)**. À la connexion, le backend génère deux tokens :
- **Access Token** : Valide 15 minutes, utilisé pour chaque requête API.
- **Refresh Token** : Valide 24 heures, utilisé pour renouveler l'Access Token sans reconnexion.

### 6.2. Sécurisation des Routes (React)

```
/login → PublicRoute
/admin/* → ProtectedRoute (role="admin")
/supervisor/* → ProtectedRoute (role="supervisor")
/jury/* → ProtectedRoute (role="jury")
/student/* → ProtectedRoute (role="student")
/showcase → PublicRoute (aucune authentification requise)
```

### 6.3. Exemple de Modèle Django

```python
class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('in_progress', 'En cours'),
        ('submitted', 'Soumis'),
        ('validated', 'Validé'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(choices=STATUS_CHOICES, default='pending', max_length=20)
    is_showcase = models.BooleanField(default=False, db_index=True)
    final_grade = models.FloatField(null=True)
    deadline = models.DateField()

    def __str__(self):
        return self.title
```

---

## CONCLUSION ET PERSPECTIVES

### Bilan du Projet

Ce projet a permis de concevoir et développer une solution numérique complète, moderne et sécurisée pour la gestion des PFEs. L'ensemble des besoins fonctionnels identifiés a été couvert, avec un accent particulier sur l'expérience utilisateur et la séparation claire des responsabilités entre les différents acteurs.

L'architecture **React / Django / PostgreSQL** s'est révélée être un choix technologique solide, garantissant la performance, la maintenabilité et l'extensibilité de la solution.

### Perspectives d'Amélioration

1. **Intelligence Artificielle** : Intégration d'un module de prédiction de succès basé sur le profil de l'étudiant.
2. **Détection de Plagiat** : Intégration d'un algorithme de comparaison des rapports soumis.
3. **Application Mobile** : Développement d'une application React Native pour les notifications push.
4. **Déploiement Cloud** : Migration sur une infrastructure cloud (AWS / GCP) pour une haute disponibilité.

---

## ANNEXES

### Annexe A : Glossaire des Technologies

| Terme | Définition |
| :--- | :--- |
| **React.js** | Bibliothèque JavaScript open-source pour la création d'interfaces utilisateur réactives et modulaires. |
| **Django REST Framework** | Extension de Django pour la construction d'APIs Web RESTful robustes et sécurisées. |
| **PostgreSQL** | Système de gestion de base de données relationnelle-objet (SGBDRO) de référence. |
| **JWT** | Standard RFC 7519 de tokens JSON pour l'authentification sans état (stateless). |
| **SaaS** | Software as a Service — modèle où le logiciel est hébergé et accessible via internet. |
| **API REST** | Architecture d'interface de programmation basée sur le protocole HTTP. |

### Annexe B : Tableau des Endpoints API

| Endpoint | Méthode | Action | Authentification |
| :--- | :--- | :--- | :--- |
| `/api/auth/login/` | POST | Connexion & obtention du token JWT | Publique |
| `/api/auth/refresh/` | POST | Renouvellement du token | Token requis |
| `/api/users/` | GET/POST | Liste et création d'utilisateurs | Admin |
| `/api/projects/` | GET/POST | Liste et création de projets | Privé |
| `/api/projects/showcase/` | GET | Meilleurs PFEs (vitrine publique) | Publique |
| `/api/projects/{id}/set_showcase/` | PATCH | Publier dans la vitrine | Admin |
| `/api/submissions/` | GET/POST | Dépôt de rapports | Étudiant |
| `/api/submissions/{id}/validate/` | PATCH | Validation de rapport | Encadrant |
| `/api/evaluations/` | GET/POST | Saisie des notes de soutenance | Jury |
| `/api/defenses/` | GET/POST | Gestion du planning des soutenances | Admin |

### Annexe C : Guide de Déploiement

**1. Frontend :**
```bash
cd frontend
npm install
npm run dev
```

**2. Backend :**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**3. Variables d'Environnement (`.env`) :**
```
SECRET_KEY=votre_cle_secrete_django
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/pfe_db
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## BIBLIOGRAPHIE

1. Django Software Foundation. *Django REST Framework Documentation*. https://www.django-rest-framework.org
2. Meta Open Source. *React — Documentation Officielle*. https://react.dev
3. The PostgreSQL Global Development Group. *PostgreSQL 16 Documentation*. https://www.postgresql.org/docs
4. Auth0. *JSON Web Tokens — Introduction*. https://jwt.io/introduction
5. Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.
6. Richardson, L. & Amundsen, M. (2013). *RESTful Web APIs*. O'Reilly Media.

---

*Document rédigé par **Youssef LAGMOUCH** et **Saad BOUFERRA** — EMSI, Promotion 2026.*
