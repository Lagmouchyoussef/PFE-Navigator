-- =============================================================================
--  PFE-NAVIGATOR  ·  Schéma PostgreSQL Professionnel
--  Auteur  : Lagmouch Youssef
--  Base    : recherche_db
--  SGBD    : PostgreSQL 15+
--  Django  : 5.x  |  Apps : authentication · common · student · supervisor
--                           jury · administration · projects
-- =============================================================================
--
--  UTILISATION
--  -----------
--  1. psql -U postgres -c "CREATE DATABASE recherche_db;"
--  2. psql -U postgres -d recherche_db -f schema.sql
--  3. cd Backend && python manage.py migrate --run-syncdb
--
--  STRUCTURE
--  ---------
--  §01  Extensions
--  §02  Types énumérés (ENUMs)
--  §03  Tables système Django
--  §04  JWT token blacklist (simplejwt)
--  §05  authentication_user
--  §06  common_subject / common_subjectrequest
--  §07  common_project
--  §08  common_document / common_documentremark
--  §09  common_milestone
--  §10  common_appointment
--  §11  common_evaluation
--  §12  common_feedback
--  §13  common_juryassignment
--  §14  common_message
--  §15  common_notification
--  §16  common_adminnote
--  §17  common_resource
--  §18  Triggers (updated_at automatique)
--  §19  Fonctions utilitaires
--  §20  Vues analytiques
--  §21  Indexes composites supplémentaires
--  §22  Permissions (rôle applicatif)
-- =============================================================================

\set ON_ERROR_STOP on
\timing on

-- =============================================================================
-- §01  EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";          -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";            -- Fuzzy / trigram search
CREATE EXTENSION IF NOT EXISTS "btree_gin";          -- Composite GIN indexes
CREATE EXTENSION IF NOT EXISTS "unaccent";           -- Accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "pgcrypto";           -- Cryptographic functions

-- Full-text search dictionary (French + English)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'french_english') THEN
    CREATE TEXT SEARCH CONFIGURATION french_english (COPY = simple);
  END IF;
END
$$;

-- =============================================================================
-- §02  TYPES ÉNUMÉRÉS
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'supervisor', 'jury', 'student');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM (
    'draft', 'submitted', 'under_review', 'approved',
    'in_progress', 'completed', 'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE document_target AS ENUM ('supervisor', 'jury');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE milestone_status AS ENUM ('completed', 'current', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM (
    'Pending', 'Confirmed', 'Cancelled', 'Rescheduled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'approved', 'rejected', 'grade', 'defense', 'message', 'info'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE note_audience AS ENUM ('all', 'students', 'supervisors', 'juries');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE resource_type AS ENUM (
    'report', 'template', 'guide', 'project', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE subject_status AS ENUM ('available', 'taken', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- §03  TABLES SYSTÈME DJANGO
--       (requises par le framework avant les apps métier)
-- =============================================================================

-- ─── django_content_type ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS django_content_type (
    id        serial       PRIMARY KEY,
    app_label varchar(100) NOT NULL,
    model     varchar(100) NOT NULL,
    CONSTRAINT uq_content_type UNIQUE (app_label, model)
);

COMMENT ON TABLE  django_content_type              IS 'Registre des types de contenu Django (généricité, permissions).';
COMMENT ON COLUMN django_content_type.app_label    IS 'Label de l'app Django (ex: common, authentication).';
COMMENT ON COLUMN django_content_type.model        IS 'Nom du modèle en minuscule (ex: project, user).';

-- ─── auth_permission ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auth_permission (
    id              serial       PRIMARY KEY,
    name            varchar(255) NOT NULL,
    content_type_id integer      NOT NULL
                    REFERENCES django_content_type (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
    codename        varchar(100) NOT NULL,
    CONSTRAINT uq_permission UNIQUE (content_type_id, codename)
);

COMMENT ON TABLE auth_permission IS 'Permissions atomiques Django (add/change/delete/view par modèle).';

CREATE INDEX IF NOT EXISTS idx_auth_perm_ct ON auth_permission (content_type_id);

-- ─── auth_group ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auth_group (
    id   serial       PRIMARY KEY,
    name varchar(150) NOT NULL UNIQUE
);

COMMENT ON TABLE auth_group IS 'Groupes de permissions Django.';

-- ─── auth_group_permissions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auth_group_permissions (
    id            bigserial PRIMARY KEY,
    group_id      integer   NOT NULL REFERENCES auth_group      (id) ON DELETE CASCADE,
    permission_id integer   NOT NULL REFERENCES auth_permission (id) ON DELETE CASCADE,
    CONSTRAINT uq_group_perm UNIQUE (group_id, permission_id)
);

-- ─── django_migrations ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS django_migrations (
    id      bigserial    PRIMARY KEY,
    app     varchar(255) NOT NULL,
    name    varchar(255) NOT NULL,
    applied timestamptz  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE django_migrations IS 'Journal des migrations Django appliquées.';
CREATE INDEX IF NOT EXISTS idx_migrations_app ON django_migrations (app);

-- ─── django_session ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS django_session (
    session_key  varchar(40)  PRIMARY KEY,
    session_data text         NOT NULL,
    expire_date  timestamptz  NOT NULL
);

COMMENT ON TABLE django_session IS 'Sessions Django (cookie-based).';
CREATE INDEX IF NOT EXISTS idx_session_expire ON django_session (expire_date);

-- ─── django_admin_log ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS django_admin_log (
    id              serial       PRIMARY KEY,
    action_time     timestamptz  NOT NULL DEFAULT NOW(),
    object_id       text,
    object_repr     varchar(200) NOT NULL,
    action_flag     smallint     NOT NULL CHECK (action_flag BETWEEN 1 AND 3),
    change_message  text         NOT NULL,
    content_type_id integer      REFERENCES django_content_type (id) ON DELETE SET NULL,
    user_id         bigint       NOT NULL   -- FK ajouté après création de authentication_user
);

COMMENT ON TABLE  django_admin_log             IS 'Audit trail de toutes les actions effectuées via l'interface admin Django.';
COMMENT ON COLUMN django_admin_log.action_flag IS '1=ADDITION, 2=CHANGE, 3=DELETION.';
COMMENT ON COLUMN django_admin_log.object_repr IS 'Représentation texte de l'objet modifié.';

CREATE INDEX IF NOT EXISTS idx_admin_log_ct   ON django_admin_log (content_type_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_user ON django_admin_log (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_time ON django_admin_log (action_time DESC);

-- =============================================================================
-- §04  JWT TOKEN BLACKLIST  (rest_framework_simplejwt)
-- =============================================================================

CREATE TABLE IF NOT EXISTS token_blacklist_outstandingtoken (
    id         bigserial    PRIMARY KEY,
    token      text         NOT NULL UNIQUE,
    jti        varchar(255) NOT NULL UNIQUE,
    created_at timestamptz,
    expires_at timestamptz  NOT NULL,
    user_id    bigint        -- FK ajouté après authentication_user
);

COMMENT ON TABLE  token_blacklist_outstandingtoken            IS 'Tous les JWT émis par le serveur (simplejwt).';
COMMENT ON COLUMN token_blacklist_outstandingtoken.jti        IS 'JWT ID — identifiant unique du token.';
COMMENT ON COLUMN token_blacklist_outstandingtoken.expires_at IS 'Date d'expiration du token.';

CREATE INDEX IF NOT EXISTS idx_outstanding_user ON token_blacklist_outstandingtoken (user_id);
CREATE INDEX IF NOT EXISTS idx_outstanding_exp  ON token_blacklist_outstandingtoken (expires_at);

CREATE TABLE IF NOT EXISTS token_blacklist_blacklistedtoken (
    id             bigserial   PRIMARY KEY,
    blacklisted_at timestamptz NOT NULL DEFAULT NOW(),
    token_id       bigint      NOT NULL UNIQUE
                   REFERENCES token_blacklist_outstandingtoken (id)
                   ON DELETE CASCADE
);

COMMENT ON TABLE token_blacklist_blacklistedtoken IS 'Tokens JWT révoqués/invalidés (logout, rotation).';
CREATE INDEX IF NOT EXISTS idx_blacklisted_at ON token_blacklist_blacklistedtoken (blacklisted_at DESC);

-- =============================================================================
-- §05  AUTHENTICATION_USER
-- =============================================================================

CREATE TABLE IF NOT EXISTS authentication_user (
    -- ── Identité ──────────────────────────────────────────────────────────────
    id               bigserial    PRIMARY KEY,
    email            varchar(254) NOT NULL UNIQUE,
    first_name       varchar(100) NOT NULL,
    last_name        varchar(100) NOT NULL,
    role             user_role    NOT NULL,

    -- ── Profil ────────────────────────────────────────────────────────────────
    institutional_id varchar(50)  NOT NULL DEFAULT '',
    phone_number     varchar(20)  NOT NULL DEFAULT '',
    department       varchar(100) NOT NULL DEFAULT '',
    avatar           text         NOT NULL DEFAULT '',

    -- ── Sécurité Django ───────────────────────────────────────────────────────
    password         varchar(128) NOT NULL,
    last_login       timestamptz,
    is_superuser     boolean      NOT NULL DEFAULT FALSE,
    is_staff         boolean      NOT NULL DEFAULT FALSE,
    is_active        boolean      NOT NULL DEFAULT TRUE,
    date_joined      timestamptz  NOT NULL DEFAULT NOW(),

    -- ── Colonne générée ───────────────────────────────────────────────────────
    full_name        text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,

    -- ── Contraintes ───────────────────────────────────────────────────────────
    CONSTRAINT chk_user_email_fmt CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$')
);

COMMENT ON TABLE  authentication_user                  IS 'Compte utilisateur unique — remplace auth.User de Django. Rôles : admin · supervisor · jury · student.';
COMMENT ON COLUMN authentication_user.role             IS 'Rôle fonctionnel déterminant les droits d'accès.';
COMMENT ON COLUMN authentication_user.institutional_id IS 'Numéro de carte ou identifiant institutionnel.';
COMMENT ON COLUMN authentication_user.avatar           IS 'URL ou données base64 de la photo de profil.';
COMMENT ON COLUMN authentication_user.full_name        IS 'Colonne générée : prénom + espace + nom.';

-- ── Indexes authentication_user ───────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_email_lower
    ON authentication_user (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_user_role
    ON authentication_user (role);

CREATE INDEX IF NOT EXISTS idx_user_active
    ON authentication_user (is_active)
    WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_fullname_trgm
    ON authentication_user USING GIN (full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_user_department
    ON authentication_user (department)
    WHERE department <> '';

-- ── Jonctions utilisateur ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS authentication_user_groups (
    id       bigserial PRIMARY KEY,
    user_id  bigint    NOT NULL REFERENCES authentication_user (id) ON DELETE CASCADE,
    group_id integer   NOT NULL REFERENCES auth_group          (id) ON DELETE CASCADE,
    CONSTRAINT uq_user_group UNIQUE (user_id, group_id)
);

CREATE TABLE IF NOT EXISTS authentication_user_user_permissions (
    id            bigserial PRIMARY KEY,
    user_id       bigint    NOT NULL REFERENCES authentication_user (id) ON DELETE CASCADE,
    permission_id integer   NOT NULL REFERENCES auth_permission     (id) ON DELETE CASCADE,
    CONSTRAINT uq_user_perm UNIQUE (user_id, permission_id)
);

-- ── FK différées vers user ────────────────────────────────────────────────────
ALTER TABLE django_admin_log
    ADD CONSTRAINT IF NOT EXISTS fk_admin_log_user
    FOREIGN KEY (user_id)
    REFERENCES authentication_user (id)
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE token_blacklist_outstandingtoken
    ADD CONSTRAINT IF NOT EXISTS fk_outstanding_user
    FOREIGN KEY (user_id)
    REFERENCES authentication_user (id)
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED;

-- =============================================================================
-- §06  COMMON_SUBJECT  ·  COMMON_SUBJECTREQUEST
-- =============================================================================

-- ─── common_subject ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS common_subject (
    id            bigserial      PRIMARY KEY,
    title         varchar(200)   NOT NULL,
    description   text           NOT NULL DEFAULT '',
    year          varchar(10)    NOT NULL DEFAULT '',
    status        subject_status NOT NULL DEFAULT 'available',
    is_approved   boolean        NOT NULL DEFAULT FALSE,
    supervisor_id bigint         NOT NULL
                  REFERENCES authentication_user (id)
                  ON DELETE CASCADE,
    created_at    timestamptz    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_subject_supervisor_role
        CHECK (supervisor_id IS NOT NULL)   -- renforcé via trigger
);

COMMENT ON TABLE  common_subject             IS 'Sujets de PFE proposés par les encadreurs.';
COMMENT ON COLUMN common_subject.is_approved IS 'Validation admin obligatoire avant que les étudiants puissent postuler.';
COMMENT ON COLUMN common_subject.year        IS 'Année académique visée (ex: 2024-2025).';
COMMENT ON COLUMN common_subject.status      IS 'available → disponible · taken → attribué · archived → archivé.';

CREATE INDEX IF NOT EXISTS idx_subject_supervisor  ON common_subject (supervisor_id);
CREATE INDEX IF NOT EXISTS idx_subject_status      ON common_subject (status);
CREATE INDEX IF NOT EXISTS idx_subject_approved    ON common_subject (is_approved) WHERE is_approved = TRUE;
CREATE INDEX IF NOT EXISTS idx_subject_year        ON common_subject (year);
CREATE INDEX IF NOT EXISTS idx_subject_title_trgm  ON common_subject USING GIN (title gin_trgm_ops);

-- ─── common_subjectrequest ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS common_subjectrequest (
    id         bigserial      PRIMARY KEY,
    student_id bigint         NOT NULL UNIQUE    -- 1 demande active max par étudiant
                REFERENCES authentication_user (id)
                ON DELETE CASCADE,
    subject_id bigint         NOT NULL
                REFERENCES common_subject (id)
                ON DELETE CASCADE,
    status     request_status NOT NULL DEFAULT 'pending',
    created_at timestamptz    NOT NULL DEFAULT NOW(),
    updated_at timestamptz    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  common_subjectrequest        IS 'Demande d'affectation de sujet par un étudiant. OneToOne : un seul sujet demandé à la fois.';
COMMENT ON COLUMN common_subjectrequest.status IS 'pending → en attente · approved → accepté · rejected → refusé.';

CREATE INDEX IF NOT EXISTS idx_subreq_subject ON common_subjectrequest (subject_id);
CREATE INDEX IF NOT EXISTS idx_subreq_status  ON common_subjectrequest (status);

-- =============================================================================
-- §07  COMMON_PROJECT
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_project (
    id                  bigserial       PRIMARY KEY,
    title               varchar(200)    NOT NULL,
    description         text            NOT NULL DEFAULT '',
    status              project_status  NOT NULL DEFAULT 'draft',

    -- ── Relations ─────────────────────────────────────────────────────────────
    student_id          bigint          NOT NULL UNIQUE      -- 1 projet par étudiant
                        REFERENCES authentication_user (id)
                        ON DELETE CASCADE,
    supervisor_id       bigint
                        REFERENCES authentication_user (id)
                        ON DELETE SET NULL,
    subject_id          bigint
                        REFERENCES common_subject (id)
                        ON DELETE SET NULL,

    -- ── Calendrier ────────────────────────────────────────────────────────────
    start_date          date,
    end_date            date,

    -- ── Workflow jury ─────────────────────────────────────────────────────────
    jury_documents_open boolean         NOT NULL DEFAULT FALSE,

    -- ── Audit ─────────────────────────────────────────────────────────────────
    created_at          timestamptz     NOT NULL DEFAULT NOW(),
    updated_at          timestamptz     NOT NULL DEFAULT NOW(),

    -- ── Contraintes ───────────────────────────────────────────────────────────
    CONSTRAINT chk_project_dates
        CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE  common_project                      IS 'Entité centrale du PFE. OneToOne avec l'étudiant. Cycle : draft → submitted → under_review → approved → in_progress → completed | rejected.';
COMMENT ON COLUMN common_project.jury_documents_open  IS 'Quand TRUE, le jury peut accéder aux documents soumis.';
COMMENT ON COLUMN common_project.status               IS 'Statut du cycle de vie du projet.';

CREATE INDEX IF NOT EXISTS idx_project_student    ON common_project (student_id);
CREATE INDEX IF NOT EXISTS idx_project_supervisor ON common_project (supervisor_id);
CREATE INDEX IF NOT EXISTS idx_project_subject    ON common_project (subject_id);
CREATE INDEX IF NOT EXISTS idx_project_status     ON common_project (status);
CREATE INDEX IF NOT EXISTS idx_project_updated    ON common_project (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_title_trgm ON common_project USING GIN (title gin_trgm_ops);

-- =============================================================================
-- §08  COMMON_DOCUMENT  ·  COMMON_DOCUMENTREMARK
-- =============================================================================

-- ─── common_document ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS common_document (
    id                          bigserial       PRIMARY KEY,
    project_id                  bigint          NOT NULL
                                REFERENCES common_project      (id) ON DELETE CASCADE,
    student_id                  bigint          NOT NULL
                                REFERENCES authentication_user  (id) ON DELETE CASCADE,

    -- ── Contenu ───────────────────────────────────────────────────────────────
    title                       varchar(200)    NOT NULL,
    file                        varchar(500)    NOT NULL,           -- chemin relatif MEDIA_ROOT
    document_type               varchar(100)    NOT NULL DEFAULT '',
    version                     smallint        NOT NULL DEFAULT 1
                                CHECK (version >= 1),

    -- ── Workflow ──────────────────────────────────────────────────────────────
    status                      document_status NOT NULL DEFAULT 'pending',
    target                      document_target NOT NULL DEFAULT 'supervisor',
    comment                     text            NOT NULL DEFAULT '',
    supervisor_approved_for_jury boolean        NOT NULL DEFAULT FALSE,
    jury_confirmed              boolean         NOT NULL DEFAULT FALSE,

    -- ── Audit ─────────────────────────────────────────────────────────────────
    uploaded_at                 timestamptz     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  common_document                              IS 'Documents soumis par les étudiants (rapports, présentations, specs…).';
COMMENT ON COLUMN common_document.file                         IS 'Chemin relatif au MEDIA_ROOT Django (ex: documents/2025/05/rapport.pdf).';
COMMENT ON COLUMN common_document.version                      IS 'Numéro de version — permet le versionning de documents.';
COMMENT ON COLUMN common_document.target                       IS 'Destinataire : supervisor (encadreur) ou jury.';
COMMENT ON COLUMN common_document.supervisor_approved_for_jury IS 'L'encadreur a validé ce doc pour transmission au jury.';
COMMENT ON COLUMN common_document.jury_confirmed               IS 'Le jury a confirmé la réception/lecture de ce document.';

CREATE INDEX IF NOT EXISTS idx_doc_project     ON common_document (project_id);
CREATE INDEX IF NOT EXISTS idx_doc_student     ON common_document (student_id);
CREATE INDEX IF NOT EXISTS idx_doc_status      ON common_document (status);
CREATE INDEX IF NOT EXISTS idx_doc_target      ON common_document (target);
CREATE INDEX IF NOT EXISTS idx_doc_uploaded    ON common_document (uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_doc_proj_status ON common_document (project_id, status);

-- ─── common_documentremark ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS common_documentremark (
    id          bigserial        PRIMARY KEY,
    document_id bigint           NOT NULL
                REFERENCES common_document    (id) ON DELETE CASCADE,
    author_id   bigint           NOT NULL
                REFERENCES authentication_user (id) ON DELETE CASCADE,
    comment     text             NOT NULL,
    score       double precision CHECK (score IS NULL OR score BETWEEN 0 AND 20),
    created_at  timestamptz      NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  common_documentremark       IS 'Annotations et notes laissées par l'encadreur ou le jury sur un document.';
COMMENT ON COLUMN common_documentremark.score IS 'Note optionnelle sur 20 attribuée au document.';

CREATE INDEX IF NOT EXISTS idx_remark_document ON common_documentremark (document_id);
CREATE INDEX IF NOT EXISTS idx_remark_author   ON common_documentremark (author_id);

-- =============================================================================
-- §09  COMMON_MILESTONE
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_milestone (
    id          bigserial        PRIMARY KEY,
    project_id  bigint           NOT NULL
                REFERENCES common_project (id) ON DELETE CASCADE,
    title       varchar(200)     NOT NULL,
    description text             NOT NULL DEFAULT '',
    status      milestone_status NOT NULL DEFAULT 'pending',
    date        date,
    sort_order  smallint         NOT NULL DEFAULT 0 CHECK (sort_order >= 0)
);

COMMENT ON TABLE  common_milestone            IS 'Jalons / points de contrôle du projet PFE.';
COMMENT ON COLUMN common_milestone.sort_order IS 'Ordre d'affichage dans le tableau de bord (ascendant).';
COMMENT ON COLUMN common_milestone.status     IS 'pending · current · completed.';

CREATE INDEX IF NOT EXISTS idx_milestone_project ON common_milestone (project_id);
CREATE INDEX IF NOT EXISTS idx_milestone_status  ON common_milestone (status);
CREATE INDEX IF NOT EXISTS idx_milestone_order   ON common_milestone (project_id, sort_order);

-- =============================================================================
-- §10  COMMON_APPOINTMENT
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_appointment (
    id            bigserial          PRIMARY KEY,
    project_id    bigint             NOT NULL
                  REFERENCES common_project      (id) ON DELETE CASCADE,
    student_id    bigint             NOT NULL
                  REFERENCES authentication_user  (id) ON DELETE CASCADE,
    supervisor_id bigint
                  REFERENCES authentication_user  (id) ON DELETE SET NULL,

    -- ── Détail ────────────────────────────────────────────────────────────────
    title         varchar(200)       NOT NULL,
    date          date               NOT NULL,
    time          time               NOT NULL,
    location      varchar(200)       NOT NULL DEFAULT '',
    type          varchar(50)        NOT NULL DEFAULT 'meeting',
    status        appointment_status NOT NULL DEFAULT 'Pending',
    notes         text               NOT NULL DEFAULT '',
    reminder_sent boolean            NOT NULL DEFAULT FALSE,

    -- ── Audit ─────────────────────────────────────────────────────────────────
    created_at    timestamptz        NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  common_appointment               IS 'Rendez-vous planifiés entre un étudiant et son encadreur.';
COMMENT ON COLUMN common_appointment.type          IS 'Type de réunion : meeting · defense · progress · other.';
COMMENT ON COLUMN common_appointment.status        IS 'Pending · Confirmed · Cancelled · Rescheduled.';
COMMENT ON COLUMN common_appointment.reminder_sent IS 'TRUE si le rappel par email/notification a été envoyé.';

CREATE INDEX IF NOT EXISTS idx_appt_project    ON common_appointment (project_id);
CREATE INDEX IF NOT EXISTS idx_appt_student    ON common_appointment (student_id);
CREATE INDEX IF NOT EXISTS idx_appt_supervisor ON common_appointment (supervisor_id);
CREATE INDEX IF NOT EXISTS idx_appt_date       ON common_appointment (date);
CREATE INDEX IF NOT EXISTS idx_appt_status     ON common_appointment (status);

-- =============================================================================
-- §11  COMMON_EVALUATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_evaluation (
    id                  bigserial        PRIMARY KEY,
    project_id          bigint           NOT NULL UNIQUE
                        REFERENCES common_project (id) ON DELETE CASCADE,

    -- ── Notes ─────────────────────────────────────────────────────────────────
    supervisor_score    double precision CHECK (supervisor_score    IS NULL OR supervisor_score    BETWEEN 0 AND 20),
    jury_score          double precision CHECK (jury_score          IS NULL OR jury_score          BETWEEN 0 AND 20),

    -- ── Commentaires ──────────────────────────────────────────────────────────
    supervisor_comment  text             NOT NULL DEFAULT '',
    jury_comment        text             NOT NULL DEFAULT '',

    -- ── Critères détaillés (JSON) ─────────────────────────────────────────────
    supervisor_criteria jsonb,
    jury_criteria       jsonb,

    -- ── Pondérations ──────────────────────────────────────────────────────────
    supervisor_weight   double precision NOT NULL DEFAULT 50
                        CHECK (supervisor_weight BETWEEN 0 AND 100),
    jury_weight         double precision NOT NULL DEFAULT 50
                        CHECK (jury_weight        BETWEEN 0 AND 100),

    -- ── Publication ───────────────────────────────────────────────────────────
    is_published        boolean          NOT NULL DEFAULT FALSE,

    -- ── Audit ─────────────────────────────────────────────────────────────────
    created_at          timestamptz      NOT NULL DEFAULT NOW(),
    updated_at          timestamptz      NOT NULL DEFAULT NOW(),

    -- ── Cohérence des pondérations ────────────────────────────────────────────
    CONSTRAINT chk_weights_sum
        CHECK (ABS((supervisor_weight + jury_weight) - 100.0) < 0.001)
);

COMMENT ON TABLE  common_evaluation                   IS 'Évaluation finale OneToOne par projet. Contient les notes superviseur et jury, leurs critères et pondérations.';
COMMENT ON COLUMN common_evaluation.supervisor_criteria IS 'JSON des critères superviseur : {"innovation":16,"méthodologie":18,…}.';
COMMENT ON COLUMN common_evaluation.jury_criteria       IS 'JSON des critères jury : {"présentation":17,"docs":15,…}.';
COMMENT ON COLUMN common_evaluation.supervisor_weight   IS 'Poids (%) de la note superviseur dans la note finale (défaut 50%).';
COMMENT ON COLUMN common_evaluation.jury_weight         IS 'Poids (%) de la note jury dans la note finale (défaut 50%).';
COMMENT ON COLUMN common_evaluation.is_published        IS 'Quand TRUE, la note est visible par l'étudiant.';

CREATE INDEX IF NOT EXISTS idx_eval_project   ON common_evaluation (project_id);
CREATE INDEX IF NOT EXISTS idx_eval_published ON common_evaluation (is_published) WHERE is_published = TRUE;

-- Colonne virtuelle : note finale calculée (stockée via Vue)
-- note_finale = supervisor_score * (supervisor_weight/100) + jury_score * (jury_weight/100)

-- =============================================================================
-- §12  COMMON_FEEDBACK
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_feedback (
    id         bigserial   PRIMARY KEY,
    project_id bigint      NOT NULL REFERENCES common_project      (id) ON DELETE CASCADE,
    author_id  bigint      NOT NULL REFERENCES authentication_user  (id) ON DELETE CASCADE,
    title      varchar(200) NOT NULL,
    comment    text         NOT NULL,
    created_at timestamptz  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE common_feedback IS 'Retours / commentaires de l'encadreur sur un projet.';

CREATE INDEX IF NOT EXISTS idx_feedback_project ON common_feedback (project_id);
CREATE INDEX IF NOT EXISTS idx_feedback_author  ON common_feedback (author_id);
CREATE INDEX IF NOT EXISTS idx_feedback_date    ON common_feedback (created_at DESC);

-- =============================================================================
-- §13  COMMON_JURYASSIGNMENT
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_juryassignment (
    id             bigserial    PRIMARY KEY,
    project_id     bigint       NOT NULL REFERENCES common_project      (id) ON DELETE CASCADE,
    jury_member_id bigint       NOT NULL REFERENCES authentication_user  (id) ON DELETE CASCADE,
    role           varchar(50)  NOT NULL DEFAULT 'member',
    assigned_at    timestamptz  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_jury_project UNIQUE (project_id, jury_member_id)
);

COMMENT ON TABLE  common_juryassignment        IS 'Affectation des membres du jury à un projet. Contrainte : un juré ne peut être affecté qu'une fois par projet.';
COMMENT ON COLUMN common_juryassignment.role   IS 'Rôle dans le jury : member · president · rapporteur · examiner.';

CREATE INDEX IF NOT EXISTS idx_jury_project ON common_juryassignment (project_id);
CREATE INDEX IF NOT EXISTS idx_jury_member  ON common_juryassignment (jury_member_id);

-- =============================================================================
-- §14  COMMON_MESSAGE
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_message (
    id           bigserial    PRIMARY KEY,
    sender_id    bigint       NOT NULL
                 REFERENCES authentication_user (id) ON DELETE CASCADE,
    recipient_id bigint       NOT NULL
                 REFERENCES authentication_user (id) ON DELETE CASCADE,
    subject      varchar(200) NOT NULL DEFAULT '',
    content      text         NOT NULL,
    is_read      boolean      NOT NULL DEFAULT FALSE,
    parent_id    bigint
                 REFERENCES common_message (id) ON DELETE SET NULL,
    created_at   timestamptz  NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_no_self_message
        CHECK (sender_id <> recipient_id)
);

COMMENT ON TABLE  common_message           IS 'Messagerie interne entre utilisateurs. Supporte les fils de discussion via parent_id.';
COMMENT ON COLUMN common_message.parent_id IS 'Message parent pour les conversations imbriquées.';

CREATE INDEX IF NOT EXISTS idx_msg_sender    ON common_message (sender_id);
CREATE INDEX IF NOT EXISTS idx_msg_recipient ON common_message (recipient_id);
CREATE INDEX IF NOT EXISTS idx_msg_unread    ON common_message (recipient_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_msg_parent    ON common_message (parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_msg_date      ON common_message (created_at DESC);

-- =============================================================================
-- §15  COMMON_NOTIFICATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_notification (
    id           bigserial         PRIMARY KEY,
    recipient_id bigint            NOT NULL
                 REFERENCES authentication_user (id) ON DELETE CASCADE,
    title        varchar(200)      NOT NULL,
    message      text              NOT NULL,
    type         notification_type NOT NULL DEFAULT 'info',
    link         varchar(500)      NOT NULL DEFAULT '',
    is_read      boolean           NOT NULL DEFAULT FALSE,
    created_at   timestamptz       NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  common_notification        IS 'Notifications système envoyées aux utilisateurs.';
COMMENT ON COLUMN common_notification.type   IS 'approved · rejected · grade · defense · message · info.';
COMMENT ON COLUMN common_notification.link   IS 'URL relative de redirection au clic (ex: /student/evaluation).';

CREATE INDEX IF NOT EXISTS idx_notif_recipient ON common_notification (recipient_id);
CREATE INDEX IF NOT EXISTS idx_notif_unread    ON common_notification (recipient_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notif_type      ON common_notification (type);
CREATE INDEX IF NOT EXISTS idx_notif_date      ON common_notification (created_at DESC);

-- =============================================================================
-- §16  COMMON_ADMINNOTE
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_adminnote (
    id         bigserial      PRIMARY KEY,
    author_id  bigint         NOT NULL REFERENCES authentication_user (id) ON DELETE CASCADE,
    title      varchar(200)   NOT NULL,
    content    text           NOT NULL,
    audience   note_audience  NOT NULL DEFAULT 'all',
    is_pinned  boolean        NOT NULL DEFAULT FALSE,
    created_at timestamptz    NOT NULL DEFAULT NOW(),
    updated_at timestamptz    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  common_adminnote           IS 'Annonces et notes administratives ciblées par audience.';
COMMENT ON COLUMN common_adminnote.audience  IS 'Cible : all · students · supervisors · juries.';
COMMENT ON COLUMN common_adminnote.is_pinned IS 'Notes épinglées affichées en tête de liste.';

CREATE INDEX IF NOT EXISTS idx_note_author   ON common_adminnote (author_id);
CREATE INDEX IF NOT EXISTS idx_note_audience ON common_adminnote (audience);
CREATE INDEX IF NOT EXISTS idx_note_pinned   ON common_adminnote (is_pinned, created_at DESC);

-- =============================================================================
-- §17  COMMON_RESOURCE
-- =============================================================================

CREATE TABLE IF NOT EXISTS common_resource (
    id             bigserial     PRIMARY KEY,
    title          varchar(200)  NOT NULL,
    description    text          NOT NULL DEFAULT '',
    file           varchar(500),
    url            varchar(500)  NOT NULL DEFAULT '',
    type           resource_type NOT NULL DEFAULT 'report',
    year           varchar(10)   NOT NULL DEFAULT '',
    uploaded_by_id bigint        NOT NULL
                   REFERENCES authentication_user (id) ON DELETE CASCADE,
    created_at     timestamptz   NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_resource_has_content
        CHECK (file IS NOT NULL OR url <> '')
);

COMMENT ON TABLE  common_resource                IS 'Centre de ressources partagées : guides, templates, anciens rapports.';
COMMENT ON COLUMN common_resource.file           IS 'Chemin relatif au MEDIA_ROOT si fichier uploadé.';
COMMENT ON COLUMN common_resource.url            IS 'URL externe si ressource en ligne.';
COMMENT ON COLUMN common_resource.type           IS 'report · template · guide · project · other.';
COMMENT ON COLUMN common_resource.year           IS 'Année académique de référence (ex: 2024-2025).';

CREATE INDEX IF NOT EXISTS idx_resource_uploader   ON common_resource (uploaded_by_id);
CREATE INDEX IF NOT EXISTS idx_resource_type       ON common_resource (type);
CREATE INDEX IF NOT EXISTS idx_resource_year       ON common_resource (year);
CREATE INDEX IF NOT EXISTS idx_resource_date       ON common_resource (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_title_trgm ON common_resource USING GIN (title gin_trgm_ops);

-- =============================================================================
-- §18  TRIGGERS  —  updated_at automatique
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION fn_set_updated_at IS 'Trigger générique : met à jour updated_at à chaque modification de ligne.';

-- Appliquer le trigger à toutes les tables avec updated_at
DO $$
DECLARE
    tbl text;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'common_project',
        'common_evaluation',
        'common_subjectrequest',
        'common_adminnote'
    ] LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON %1$s;
             CREATE TRIGGER trg_%1$s_updated_at
                 BEFORE UPDATE ON %1$s
                 FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();',
            tbl
        );
    END LOOP;
END;
$$;

-- =============================================================================
-- §19  FONCTIONS UTILITAIRES
-- =============================================================================

-- ─── note_finale(project_id) ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_final_grade(p_project_id bigint)
RETURNS double precision
LANGUAGE sql STABLE AS
$$
    SELECT
        CASE
            WHEN ev.supervisor_score IS NOT NULL AND ev.jury_score IS NOT NULL
            THEN ROUND(
                (ev.supervisor_score * ev.supervisor_weight +
                 ev.jury_score       * ev.jury_weight) / 100.0 , 2
            )::double precision
            WHEN ev.supervisor_score IS NOT NULL THEN ev.supervisor_score
            WHEN ev.jury_score       IS NOT NULL THEN ev.jury_score
            ELSE NULL
        END
    FROM common_evaluation ev
    WHERE ev.project_id = p_project_id
    LIMIT 1;
$$;

COMMENT ON FUNCTION fn_final_grade IS 'Calcule la note finale pondérée d'un projet (superviseur × poids + jury × poids) / 100.';

-- ─── progression_documents(project_id, required) ─────────────────────────────
CREATE OR REPLACE FUNCTION fn_doc_progress(p_project_id bigint, p_required int DEFAULT 10)
RETURNS int
LANGUAGE sql STABLE AS
$$
    SELECT LEAST(
        ROUND(
            COUNT(*) FILTER (WHERE status = 'approved')::numeric / p_required * 100
        )::int,
        100
    )
    FROM common_document
    WHERE project_id = p_project_id;
$$;

COMMENT ON FUNCTION fn_doc_progress IS 'Pourcentage de progression documentaire d'un projet (docs approuvés / requis × 100, plafonné à 100).';

-- ─── notifications_non_lues(user_id) ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_unread_count(p_user_id bigint)
RETURNS int
LANGUAGE sql STABLE AS
$$
    SELECT COUNT(*)::int
    FROM common_notification
    WHERE recipient_id = p_user_id AND is_read = FALSE;
$$;

COMMENT ON FUNCTION fn_unread_count IS 'Nombre de notifications non lues pour un utilisateur.';

-- =============================================================================
-- §20  VUES ANALYTIQUES
-- =============================================================================

-- ─── vw_project_overview ─────────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_project_overview AS
SELECT
    -- Projet
    p.id                           AS project_id,
    p.title                        AS project_title,
    p.description,
    p.status,
    p.start_date,
    p.end_date,
    p.jury_documents_open,
    p.created_at                   AS project_created_at,
    p.updated_at                   AS project_updated_at,

    -- Étudiant
    stu.id                         AS student_id,
    stu.full_name                  AS student_name,
    stu.email                      AS student_email,
    stu.institutional_id           AS student_card,
    stu.department                 AS student_department,

    -- Encadreur
    sup.id                         AS supervisor_id,
    sup.full_name                  AS supervisor_name,
    sup.email                      AS supervisor_email,
    sup.department                 AS supervisor_department,

    -- Sujet
    sub.id                         AS subject_id,
    sub.title                      AS subject_title,
    sub.year                       AS academic_year,

    -- Évaluation
    ev.id                          AS evaluation_id,
    ev.supervisor_score,
    ev.jury_score,
    ev.supervisor_weight,
    ev.jury_weight,
    ev.is_published,
    fn_final_grade(p.id)           AS final_grade,

    -- Statistiques documents
    COUNT(d.id)                    AS total_documents,
    COUNT(d.id) FILTER (WHERE d.status = 'approved')  AS approved_documents,
    COUNT(d.id) FILTER (WHERE d.status = 'pending')   AS pending_documents,
    COUNT(d.id) FILTER (WHERE d.status = 'rejected')  AS rejected_documents,
    fn_doc_progress(p.id)          AS doc_progress_pct,

    -- Jury
    COUNT(DISTINCT ja.jury_member_id) AS jury_count

FROM  common_project       p
JOIN  authentication_user  stu ON stu.id = p.student_id
LEFT JOIN authentication_user  sup ON sup.id = p.supervisor_id
LEFT JOIN common_subject       sub ON sub.id = p.subject_id
LEFT JOIN common_evaluation    ev  ON ev.project_id = p.id
LEFT JOIN common_document      d   ON d.project_id  = p.id
LEFT JOIN common_juryassignment ja ON ja.project_id = p.id

GROUP BY
    p.id, stu.id, stu.full_name, stu.email, stu.institutional_id, stu.department,
    sup.id, sup.full_name, sup.email, sup.department,
    sub.id, sub.title, sub.year,
    ev.id, ev.supervisor_score, ev.jury_score,
    ev.supervisor_weight, ev.jury_weight, ev.is_published;

COMMENT ON VIEW vw_project_overview IS 'Vue dénormalisée complète d'un projet : étudiant, encadreur, sujet, évaluation, documents, jury.';

-- ─── vw_admin_dashboard ──────────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_admin_dashboard AS
SELECT
    -- Utilisateurs
    (SELECT COUNT(*) FROM authentication_user WHERE role = 'student'    AND is_active) AS students_active,
    (SELECT COUNT(*) FROM authentication_user WHERE role = 'supervisor' AND is_active) AS supervisors_active,
    (SELECT COUNT(*) FROM authentication_user WHERE role = 'jury'       AND is_active) AS jury_active,
    (SELECT COUNT(*) FROM authentication_user WHERE role = 'admin'      AND is_active) AS admins_active,

    -- Projets
    (SELECT COUNT(*) FROM common_project)                                               AS projects_total,
    (SELECT COUNT(*) FROM common_project WHERE status = 'completed')                   AS projects_completed,
    (SELECT COUNT(*) FROM common_project WHERE status = 'in_progress')                 AS projects_in_progress,
    (SELECT COUNT(*) FROM common_project WHERE status = 'submitted')                   AS projects_submitted,
    (SELECT COUNT(*) FROM common_project WHERE status IN ('draft'))                    AS projects_draft,

    -- Documents
    (SELECT COUNT(*) FROM common_document)                                              AS docs_total,
    (SELECT COUNT(*) FROM common_document WHERE status = 'pending')                    AS docs_pending,
    (SELECT COUNT(*) FROM common_document WHERE status = 'approved')                   AS docs_approved,
    (SELECT COUNT(*) FROM common_document WHERE status = 'rejected')                   AS docs_rejected,

    -- Évaluations
    (SELECT COUNT(*) FROM common_evaluation WHERE is_published = TRUE)                 AS evals_published,
    (SELECT COUNT(*) FROM common_evaluation WHERE supervisor_score IS NOT NULL)        AS evals_supervisor_scored,
    (SELECT COUNT(*) FROM common_evaluation WHERE jury_score IS NOT NULL)              AS evals_jury_scored,
    (SELECT ROUND(AVG(supervisor_score)::numeric, 2)
     FROM common_evaluation WHERE supervisor_score IS NOT NULL)                        AS avg_supervisor_score,
    (SELECT ROUND(AVG(jury_score)::numeric, 2)
     FROM common_evaluation WHERE jury_score IS NOT NULL)                              AS avg_jury_score,

    -- Sujets
    (SELECT COUNT(*) FROM common_subject WHERE status = 'available' AND is_approved)  AS subjects_available,
    (SELECT COUNT(*) FROM common_subject WHERE status = 'taken')                       AS subjects_taken,
    (SELECT COUNT(*) FROM common_subjectrequest WHERE status = 'pending')             AS subject_requests_pending,

    -- Messages & Notifications
    (SELECT COUNT(*) FROM common_message      WHERE is_read = FALSE)                   AS messages_unread_total,
    (SELECT COUNT(*) FROM common_notification WHERE is_read = FALSE)                   AS notifications_unread_total;

COMMENT ON VIEW vw_admin_dashboard IS 'KPIs agrégés en temps réel pour le tableau de bord administrateur.';

-- ─── vw_supervisor_workload ───────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_supervisor_workload AS
SELECT
    sup.id                                         AS supervisor_id,
    sup.full_name                                  AS supervisor_name,
    sup.department,
    COUNT(p.id)                                    AS total_projects,
    COUNT(p.id) FILTER (WHERE p.status = 'in_progress') AS active_projects,
    COUNT(p.id) FILTER (WHERE p.status = 'completed')   AS completed_projects,
    COUNT(d.id) FILTER (WHERE d.status = 'pending')     AS docs_awaiting_review,
    ROUND(AVG(ev.supervisor_score)::numeric, 2)    AS avg_score_given
FROM authentication_user   sup
LEFT JOIN common_project    p   ON p.supervisor_id  = sup.id
LEFT JOIN common_document   d   ON d.project_id     = p.id
LEFT JOIN common_evaluation ev  ON ev.project_id    = p.id
WHERE sup.role = 'supervisor'
GROUP BY sup.id, sup.full_name, sup.department
ORDER BY active_projects DESC;

COMMENT ON VIEW vw_supervisor_workload IS 'Charge de travail de chaque encadreur : projets, documents en attente, note moyenne.';

-- ─── vw_jury_assignments ─────────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_jury_assignments AS
SELECT
    j.id                                           AS assignment_id,
    p.id                                           AS project_id,
    p.title                                        AS project_title,
    stu.full_name                                  AS student_name,
    sup.full_name                                  AS supervisor_name,
    jury.full_name                                 AS jury_name,
    jury.department                                AS jury_department,
    j.role                                         AS jury_role,
    j.assigned_at,
    ev.jury_score,
    ev.is_published
FROM common_juryassignment  j
JOIN common_project          p    ON p.id   = j.project_id
JOIN authentication_user     stu  ON stu.id = p.student_id
LEFT JOIN authentication_user sup ON sup.id = p.supervisor_id
JOIN authentication_user     jury ON jury.id = j.jury_member_id
LEFT JOIN common_evaluation   ev  ON ev.project_id = p.id;

COMMENT ON VIEW vw_jury_assignments IS 'Affectations jury avec détail projet, étudiant, encadreur, note jury.';

-- =============================================================================
-- §21  INDEXES COMPOSITES SUPPLÉMENTAIRES
-- =============================================================================

-- Recherche mixte projet + statut + publié
CREATE INDEX IF NOT EXISTS idx_eval_score_summary
    ON common_evaluation (project_id, supervisor_score, jury_score, is_published);

-- Messages entre deux utilisateurs (conversation)
CREATE INDEX IF NOT EXISTS idx_msg_conversation
    ON common_message (LEAST(sender_id, recipient_id), GREATEST(sender_id, recipient_id), created_at DESC);

-- Documents jury (filtrage fréquent)
CREATE INDEX IF NOT EXISTS idx_doc_jury_workflow
    ON common_document (project_id, target, supervisor_approved_for_jury, jury_confirmed)
    WHERE target = 'jury';

-- Rendez-vous futurs par encadreur
CREATE INDEX IF NOT EXISTS idx_appt_upcoming
    ON common_appointment (supervisor_id, date, status)
    WHERE status IN ('Pending', 'Confirmed');

-- Full-text search sur description projet
CREATE INDEX IF NOT EXISTS idx_project_desc_fts
    ON common_project USING GIN (to_tsvector('simple', COALESCE(description, '')));

-- =============================================================================
-- §22  CONTENU INITIAL  —  Django content types
-- =============================================================================

INSERT INTO django_content_type (app_label, model) VALUES
    ('authentication',   'user'),
    ('common',           'subject'),
    ('common',           'subjectrequest'),
    ('common',           'project'),
    ('common',           'document'),
    ('common',           'documentremark'),
    ('common',           'milestone'),
    ('common',           'appointment'),
    ('common',           'evaluation'),
    ('common',           'feedback'),
    ('common',           'juryassignment'),
    ('common',           'message'),
    ('common',           'notification'),
    ('common',           'adminnote'),
    ('common',           'resource'),
    ('admin',            'logentry'),
    ('auth',             'permission'),
    ('auth',             'group'),
    ('contenttypes',     'contenttype'),
    ('sessions',         'session'),
    ('token_blacklist',  'blacklistedtoken'),
    ('token_blacklist',  'outstandingtoken')
ON CONFLICT (app_label, model) DO NOTHING;

-- =============================================================================
-- §22  PERMISSIONS  —  rôle applicatif PostgreSQL
-- =============================================================================

-- Décommenter et adapter selon votre environnement de production :
--
-- CREATE ROLE pfe_app LOGIN PASSWORD 'ChangeMe_StrongPass_2025!';
-- GRANT CONNECT ON DATABASE recherche_db TO pfe_app;
-- GRANT USAGE  ON SCHEMA public TO pfe_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES    IN SCHEMA public TO pfe_app;
-- GRANT USAGE, SELECT                  ON ALL SEQUENCES IN SCHEMA public TO pfe_app;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
--     GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES    TO pfe_app;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
--     GRANT USAGE, SELECT                  ON SEQUENCES TO pfe_app;
--
-- Lecture seule pour reporting / BI :
-- CREATE ROLE pfe_readonly LOGIN PASSWORD 'ReadOnly_StrongPass_2025!';
-- GRANT CONNECT ON DATABASE recherche_db TO pfe_readonly;
-- GRANT USAGE  ON SCHEMA public TO pfe_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO pfe_readonly;

-- =============================================================================
--  FIN DU SCHÉMA
--  Tables         : 22  (dont 6 système Django + 2 JWT)
--  ENUMs          : 11
--  Indexes        : 50+
--  Triggers       :  4
--  Fonctions      :  3
--  Vues           :  4
-- =============================================================================
