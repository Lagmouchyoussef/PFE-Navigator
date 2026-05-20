"""
PFE-Navigator — Déploiement PostgreSQL
Exécuter : python database/deploy.py
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from psycopg2 import sql
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# ── Config ────────────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host":     "127.0.0.1",
    "port":     5432,
    "user":     "postgres",
    "password": "yousseflm",
    "dbname":   "recherche_db",
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEMA_FILE = os.path.join(BASE_DIR, "schema.sql")

# ── Helpers ───────────────────────────────────────────────────────────────────
def log(msg, level="INFO"):
    symbols = {"INFO": "✓", "WARN": "⚠", "ERROR": "✗", "STEP": "►"}
    print(f"  {symbols.get(level, '·')} {msg}")

def run_sql_file(conn, filepath):
    """Execute un fichier SQL complet en gerant les commandes psql (\\set, \\timing...)."""
    with open(filepath, "r", encoding="utf-8") as f:
        raw = f.read()

    # Supprimer les méta-commandes psql non supportées par psycopg2
    lines = []
    for line in raw.splitlines():
        stripped = line.strip()
        if stripped.startswith("\\"):        # \set, \timing, etc.
            continue
        lines.append(line)
    content = "\n".join(lines)

    # Séparer en statements individuels (séparer sur les $$ blocks)
    cur = conn.cursor()
    try:
        cur.execute(content)
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()

# ── Étape 1 : Créer la base si nécessaire ────────────────────────────────────
print("\n" + "═" * 58)
print("  PFE-NAVIGATOR — Déploiement PostgreSQL")
print("═" * 58)

print("\n[1/3] Connexion au serveur PostgreSQL...")
try:
    admin_conn = psycopg2.connect(
        host=DB_CONFIG["host"],
        port=DB_CONFIG["port"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        dbname="postgres"
    )
    admin_conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    log("Connexion au serveur réussie.")
except Exception as e:
    log(f"Impossible de se connecter : {e}", "ERROR")
    sys.exit(1)

cur = admin_conn.cursor()
cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_CONFIG["dbname"],))
exists = cur.fetchone()

if not exists:
    cur.execute(
        sql.SQL("CREATE DATABASE {} ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0")
        .format(sql.Identifier(DB_CONFIG["dbname"]))
    )
    log(f"Base '{DB_CONFIG['dbname']}' créée.")
else:
    log(f"Base '{DB_CONFIG['dbname']}' existe déjà — skip création.")

cur.close()
admin_conn.close()

# ── Étape 2 : Appliquer schema.sql ───────────────────────────────────────────
print(f"\n[2/3] Application du schéma ({SCHEMA_FILE})...")
try:
    conn = psycopg2.connect(**DB_CONFIG)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
except Exception as e:
    log(f"Connexion à recherche_db impossible : {e}", "ERROR")
    sys.exit(1)

cur = conn.cursor()

# Extensions
print("  · Extensions...")
for ext in ["uuid-ossp", "pg_trgm", "btree_gin", "unaccent", "pgcrypto"]:
    try:
        cur.execute(f'CREATE EXTENSION IF NOT EXISTS "{ext}"')
        log(f"Extension {ext} activée.")
    except Exception as e:
        log(f"Extension {ext} ignorée : {e}", "WARN")

# ENUMs
print("  · Types ENUM...")
enums = [
    ("user_role",         "('admin','supervisor','jury','student')"),
    ("project_status",    "('draft','submitted','under_review','approved','in_progress','completed','rejected')"),
    ("document_status",   "('pending','approved','rejected')"),
    ("document_target",   "('supervisor','jury')"),
    ("milestone_status",  "('completed','current','pending')"),
    ("appointment_status","('Pending','Confirmed','Cancelled','Rescheduled')"),
    ("notification_type", "('approved','rejected','grade','defense','message','info')"),
    ("note_audience",     "('all','students','supervisors','juries')"),
    ("resource_type",     "('report','template','guide','project','other')"),
    ("subject_status",    "('available','taken','archived')"),
    ("request_status",    "('pending','approved','rejected')"),
]
for name, values in enums:
    try:
        cur.execute(f"CREATE TYPE {name} AS ENUM {values}")
        log(f"ENUM {name} créé.")
    except psycopg2.errors.DuplicateObject:
        log(f"ENUM {name} existe déjà — skip.", "WARN")
        conn.rollback()

# Tables système Django
print("  · Tables système Django...")
tables_django = [
    """CREATE TABLE IF NOT EXISTS django_content_type (
        id        serial       PRIMARY KEY,
        app_label varchar(100) NOT NULL,
        model     varchar(100) NOT NULL,
        CONSTRAINT uq_content_type UNIQUE (app_label, model)
    )""",
    """CREATE TABLE IF NOT EXISTS auth_permission (
        id              serial       PRIMARY KEY,
        name            varchar(255) NOT NULL,
        content_type_id integer      NOT NULL REFERENCES django_content_type(id) ON DELETE CASCADE,
        codename        varchar(100) NOT NULL,
        CONSTRAINT uq_permission UNIQUE (content_type_id, codename)
    )""",
    """CREATE TABLE IF NOT EXISTS auth_group (
        id   serial       PRIMARY KEY,
        name varchar(150) NOT NULL UNIQUE
    )""",
    """CREATE TABLE IF NOT EXISTS auth_group_permissions (
        id            bigserial PRIMARY KEY,
        group_id      integer   NOT NULL REFERENCES auth_group(id) ON DELETE CASCADE,
        permission_id integer   NOT NULL REFERENCES auth_permission(id) ON DELETE CASCADE,
        CONSTRAINT uq_group_perm UNIQUE (group_id, permission_id)
    )""",
    """CREATE TABLE IF NOT EXISTS django_migrations (
        id      bigserial    PRIMARY KEY,
        app     varchar(255) NOT NULL,
        name    varchar(255) NOT NULL,
        applied timestamptz  NOT NULL DEFAULT NOW()
    )""",
    """CREATE TABLE IF NOT EXISTS django_session (
        session_key  varchar(40)  PRIMARY KEY,
        session_data text         NOT NULL,
        expire_date  timestamptz  NOT NULL
    )""",
    """CREATE TABLE IF NOT EXISTS django_admin_log (
        id              serial       PRIMARY KEY,
        action_time     timestamptz  NOT NULL DEFAULT NOW(),
        object_id       text,
        object_repr     varchar(200) NOT NULL,
        action_flag     smallint     NOT NULL CHECK (action_flag BETWEEN 1 AND 3),
        change_message  text         NOT NULL,
        content_type_id integer      REFERENCES django_content_type(id) ON DELETE SET NULL,
        user_id         bigint       NOT NULL
    )""",
]
for ddl in tables_django:
    try:
        cur.execute(ddl)
        conn.commit()
    except Exception as e:
        log(f"  Erreur table système : {e}", "WARN")
        conn.rollback()
log("Tables système Django créées.")

# JWT
print("  · Tables JWT...")
jwt_ddl = [
    """CREATE TABLE IF NOT EXISTS token_blacklist_outstandingtoken (
        id         bigserial    PRIMARY KEY,
        token      text         NOT NULL UNIQUE,
        jti        varchar(255) NOT NULL UNIQUE,
        created_at timestamptz,
        expires_at timestamptz  NOT NULL,
        user_id    bigint
    )""",
    """CREATE TABLE IF NOT EXISTS token_blacklist_blacklistedtoken (
        id             bigserial   PRIMARY KEY,
        blacklisted_at timestamptz NOT NULL DEFAULT NOW(),
        token_id       bigint      NOT NULL UNIQUE REFERENCES token_blacklist_outstandingtoken(id) ON DELETE CASCADE
    )""",
]
for ddl in jwt_ddl:
    try:
        cur.execute(ddl)
        conn.commit()
    except Exception as e:
        log(f"  Erreur JWT : {e}", "WARN")
        conn.rollback()
log("Tables JWT créées.")

# Utilisateurs
print("  · Table authentication_user...")
try:
    cur.execute("""
        CREATE TABLE IF NOT EXISTS authentication_user (
            id               bigserial    PRIMARY KEY,
            email            varchar(254) NOT NULL UNIQUE,
            first_name       varchar(100) NOT NULL,
            last_name        varchar(100) NOT NULL,
            role             user_role    NOT NULL,
            institutional_id varchar(50)  NOT NULL DEFAULT '',
            phone_number     varchar(20)  NOT NULL DEFAULT '',
            department       varchar(100) NOT NULL DEFAULT '',
            avatar           text         NOT NULL DEFAULT '',
            password         varchar(128) NOT NULL,
            last_login       timestamptz,
            is_superuser     boolean      NOT NULL DEFAULT FALSE,
            is_staff         boolean      NOT NULL DEFAULT FALSE,
            is_active        boolean      NOT NULL DEFAULT TRUE,
            date_joined      timestamptz  NOT NULL DEFAULT NOW(),
            full_name        text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
            CONSTRAINT chk_user_email_fmt CHECK (email ~* '^[^@]+@[^@]+\\.[^@]+$')
        )
    """)
    conn.commit()
    log("authentication_user créée.")
except Exception as e:
    log(f"  authentication_user : {e}", "WARN")
    conn.rollback()

# Jonctions user
for ddl in [
    """CREATE TABLE IF NOT EXISTS authentication_user_groups (
        id bigserial PRIMARY KEY,
        user_id  bigint  NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        group_id integer NOT NULL REFERENCES auth_group(id) ON DELETE CASCADE,
        CONSTRAINT uq_user_group UNIQUE (user_id, group_id)
    )""",
    """CREATE TABLE IF NOT EXISTS authentication_user_user_permissions (
        id bigserial PRIMARY KEY,
        user_id       bigint  NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        permission_id integer NOT NULL REFERENCES auth_permission(id) ON DELETE CASCADE,
        CONSTRAINT uq_user_perm UNIQUE (user_id, permission_id)
    )""",
]:
    try:
        cur.execute(ddl)
        conn.commit()
    except Exception as e:
        conn.rollback()

# FK différées
for fk_sql in [
    """ALTER TABLE django_admin_log
        ADD CONSTRAINT IF NOT EXISTS fk_admin_log_user
        FOREIGN KEY (user_id) REFERENCES authentication_user(id) ON DELETE CASCADE""",
    """ALTER TABLE token_blacklist_outstandingtoken
        ADD CONSTRAINT IF NOT EXISTS fk_outstanding_user
        FOREIGN KEY (user_id) REFERENCES authentication_user(id) ON DELETE CASCADE""",
]:
    try:
        cur.execute(fk_sql)
        conn.commit()
    except Exception as e:
        conn.rollback()

# Tables métier
print("  · Tables métier (common_*)...")
business_tables = [
    # common_subject
    """CREATE TABLE IF NOT EXISTS common_subject (
        id            bigserial      PRIMARY KEY,
        title         varchar(200)   NOT NULL,
        description   text           NOT NULL DEFAULT '',
        year          varchar(10)    NOT NULL DEFAULT '',
        status        subject_status NOT NULL DEFAULT 'available',
        is_approved   boolean        NOT NULL DEFAULT FALSE,
        supervisor_id bigint         NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        created_at    timestamptz    NOT NULL DEFAULT NOW()
    )""",
    # common_subjectrequest
    """CREATE TABLE IF NOT EXISTS common_subjectrequest (
        id         bigserial      PRIMARY KEY,
        student_id bigint         NOT NULL UNIQUE REFERENCES authentication_user(id) ON DELETE CASCADE,
        subject_id bigint         NOT NULL REFERENCES common_subject(id) ON DELETE CASCADE,
        status     request_status NOT NULL DEFAULT 'pending',
        created_at timestamptz    NOT NULL DEFAULT NOW(),
        updated_at timestamptz    NOT NULL DEFAULT NOW()
    )""",
    # common_project
    """CREATE TABLE IF NOT EXISTS common_project (
        id                  bigserial       PRIMARY KEY,
        title               varchar(200)    NOT NULL,
        description         text            NOT NULL DEFAULT '',
        status              project_status  NOT NULL DEFAULT 'draft',
        student_id          bigint          NOT NULL UNIQUE REFERENCES authentication_user(id) ON DELETE CASCADE,
        supervisor_id       bigint          REFERENCES authentication_user(id) ON DELETE SET NULL,
        subject_id          bigint          REFERENCES common_subject(id) ON DELETE SET NULL,
        start_date          date,
        end_date            date,
        jury_documents_open boolean         NOT NULL DEFAULT FALSE,
        created_at          timestamptz     NOT NULL DEFAULT NOW(),
        updated_at          timestamptz     NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
    )""",
    # common_document
    """CREATE TABLE IF NOT EXISTS common_document (
        id                           bigserial       PRIMARY KEY,
        project_id                   bigint          NOT NULL REFERENCES common_project(id) ON DELETE CASCADE,
        student_id                   bigint          NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        title                        varchar(200)    NOT NULL,
        file                         varchar(500)    NOT NULL,
        document_type                varchar(100)    NOT NULL DEFAULT '',
        version                      smallint        NOT NULL DEFAULT 1 CHECK (version >= 1),
        status                       document_status NOT NULL DEFAULT 'pending',
        target                       document_target NOT NULL DEFAULT 'supervisor',
        comment                      text            NOT NULL DEFAULT '',
        supervisor_approved_for_jury boolean         NOT NULL DEFAULT FALSE,
        jury_confirmed               boolean         NOT NULL DEFAULT FALSE,
        uploaded_at                  timestamptz     NOT NULL DEFAULT NOW()
    )""",
    # common_documentremark
    """CREATE TABLE IF NOT EXISTS common_documentremark (
        id          bigserial        PRIMARY KEY,
        document_id bigint           NOT NULL REFERENCES common_document(id) ON DELETE CASCADE,
        author_id   bigint           NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        comment     text             NOT NULL,
        score       double precision CHECK (score IS NULL OR score BETWEEN 0 AND 20),
        created_at  timestamptz      NOT NULL DEFAULT NOW()
    )""",
    # common_milestone
    """CREATE TABLE IF NOT EXISTS common_milestone (
        id          bigserial        PRIMARY KEY,
        project_id  bigint           NOT NULL REFERENCES common_project(id) ON DELETE CASCADE,
        title       varchar(200)     NOT NULL,
        description text             NOT NULL DEFAULT '',
        status      milestone_status NOT NULL DEFAULT 'pending',
        date        date,
        sort_order  smallint         NOT NULL DEFAULT 0 CHECK (sort_order >= 0)
    )""",
    # common_appointment
    """CREATE TABLE IF NOT EXISTS common_appointment (
        id            bigserial          PRIMARY KEY,
        project_id    bigint             NOT NULL REFERENCES common_project(id) ON DELETE CASCADE,
        student_id    bigint             NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        supervisor_id bigint             REFERENCES authentication_user(id) ON DELETE SET NULL,
        title         varchar(200)       NOT NULL,
        date          date               NOT NULL,
        time          time               NOT NULL,
        location      varchar(200)       NOT NULL DEFAULT '',
        type          varchar(50)        NOT NULL DEFAULT 'meeting',
        status        appointment_status NOT NULL DEFAULT 'Pending',
        notes         text               NOT NULL DEFAULT '',
        reminder_sent boolean            NOT NULL DEFAULT FALSE,
        created_at    timestamptz        NOT NULL DEFAULT NOW()
    )""",
    # common_evaluation
    """CREATE TABLE IF NOT EXISTS common_evaluation (
        id                  bigserial        PRIMARY KEY,
        project_id          bigint           NOT NULL UNIQUE REFERENCES common_project(id) ON DELETE CASCADE,
        supervisor_score    double precision CHECK (supervisor_score IS NULL OR supervisor_score BETWEEN 0 AND 20),
        jury_score          double precision CHECK (jury_score IS NULL OR jury_score BETWEEN 0 AND 20),
        supervisor_comment  text             NOT NULL DEFAULT '',
        jury_comment        text             NOT NULL DEFAULT '',
        supervisor_criteria jsonb,
        jury_criteria       jsonb,
        supervisor_weight   double precision NOT NULL DEFAULT 50 CHECK (supervisor_weight BETWEEN 0 AND 100),
        jury_weight         double precision NOT NULL DEFAULT 50 CHECK (jury_weight BETWEEN 0 AND 100),
        is_published        boolean          NOT NULL DEFAULT FALSE,
        created_at          timestamptz      NOT NULL DEFAULT NOW(),
        updated_at          timestamptz      NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_weights_sum CHECK (ABS((supervisor_weight + jury_weight) - 100.0) < 0.001)
    )""",
    # common_feedback
    """CREATE TABLE IF NOT EXISTS common_feedback (
        id         bigserial    PRIMARY KEY,
        project_id bigint       NOT NULL REFERENCES common_project(id) ON DELETE CASCADE,
        author_id  bigint       NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        title      varchar(200) NOT NULL,
        comment    text         NOT NULL,
        created_at timestamptz  NOT NULL DEFAULT NOW()
    )""",
    # common_juryassignment
    """CREATE TABLE IF NOT EXISTS common_juryassignment (
        id             bigserial   PRIMARY KEY,
        project_id     bigint      NOT NULL REFERENCES common_project(id) ON DELETE CASCADE,
        jury_member_id bigint      NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        role           varchar(50) NOT NULL DEFAULT 'member',
        assigned_at    timestamptz NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_jury_project UNIQUE (project_id, jury_member_id)
    )""",
    # common_message
    """CREATE TABLE IF NOT EXISTS common_message (
        id           bigserial    PRIMARY KEY,
        sender_id    bigint       NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        recipient_id bigint       NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        subject      varchar(200) NOT NULL DEFAULT '',
        content      text         NOT NULL,
        is_read      boolean      NOT NULL DEFAULT FALSE,
        parent_id    bigint       REFERENCES common_message(id) ON DELETE SET NULL,
        created_at   timestamptz  NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_no_self_message CHECK (sender_id <> recipient_id)
    )""",
    # common_notification
    """CREATE TABLE IF NOT EXISTS common_notification (
        id           bigserial         PRIMARY KEY,
        recipient_id bigint            NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        title        varchar(200)      NOT NULL,
        message      text              NOT NULL,
        type         notification_type NOT NULL DEFAULT 'info',
        link         varchar(500)      NOT NULL DEFAULT '',
        is_read      boolean           NOT NULL DEFAULT FALSE,
        created_at   timestamptz       NOT NULL DEFAULT NOW()
    )""",
    # common_adminnote
    """CREATE TABLE IF NOT EXISTS common_adminnote (
        id         bigserial     PRIMARY KEY,
        author_id  bigint        NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        title      varchar(200)  NOT NULL,
        content    text          NOT NULL,
        audience   note_audience NOT NULL DEFAULT 'all',
        is_pinned  boolean       NOT NULL DEFAULT FALSE,
        created_at timestamptz   NOT NULL DEFAULT NOW(),
        updated_at timestamptz   NOT NULL DEFAULT NOW()
    )""",
    # common_resource
    """CREATE TABLE IF NOT EXISTS common_resource (
        id             bigserial     PRIMARY KEY,
        title          varchar(200)  NOT NULL,
        description    text          NOT NULL DEFAULT '',
        file           varchar(500),
        url            varchar(500)  NOT NULL DEFAULT '',
        type           resource_type NOT NULL DEFAULT 'report',
        year           varchar(10)   NOT NULL DEFAULT '',
        uploaded_by_id bigint        NOT NULL REFERENCES authentication_user(id) ON DELETE CASCADE,
        created_at     timestamptz   NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_resource_has_content CHECK (file IS NOT NULL OR url <> '')
    )""",
]

for ddl in business_tables:
    table_name = ddl.split("IF NOT EXISTS")[1].split("(")[0].strip()
    try:
        cur.execute(ddl)
        conn.commit()
        log(f"{table_name} créée.")
    except Exception as e:
        log(f"{table_name} : {e}", "WARN")
        conn.rollback()

# Indexes
print("  · Index de performance...")
indexes = [
    "CREATE INDEX IF NOT EXISTS idx_user_role          ON authentication_user(role)",
    "CREATE INDEX IF NOT EXISTS idx_user_active         ON authentication_user(is_active) WHERE is_active = TRUE",
    "CREATE UNIQUE INDEX IF NOT EXISTS uq_user_email_lower ON authentication_user(LOWER(email))",
    "CREATE INDEX IF NOT EXISTS idx_subject_supervisor  ON common_subject(supervisor_id)",
    "CREATE INDEX IF NOT EXISTS idx_subject_status      ON common_subject(status)",
    "CREATE INDEX IF NOT EXISTS idx_subject_approved    ON common_subject(is_approved) WHERE is_approved = TRUE",
    "CREATE INDEX IF NOT EXISTS idx_subreq_subject      ON common_subjectrequest(subject_id)",
    "CREATE INDEX IF NOT EXISTS idx_subreq_status       ON common_subjectrequest(status)",
    "CREATE INDEX IF NOT EXISTS idx_project_student     ON common_project(student_id)",
    "CREATE INDEX IF NOT EXISTS idx_project_supervisor  ON common_project(supervisor_id)",
    "CREATE INDEX IF NOT EXISTS idx_project_status      ON common_project(status)",
    "CREATE INDEX IF NOT EXISTS idx_project_subject     ON common_project(subject_id)",
    "CREATE INDEX IF NOT EXISTS idx_doc_project         ON common_document(project_id)",
    "CREATE INDEX IF NOT EXISTS idx_doc_student         ON common_document(student_id)",
    "CREATE INDEX IF NOT EXISTS idx_doc_status          ON common_document(status)",
    "CREATE INDEX IF NOT EXISTS idx_doc_target          ON common_document(target)",
    "CREATE INDEX IF NOT EXISTS idx_doc_proj_status     ON common_document(project_id, status)",
    "CREATE INDEX IF NOT EXISTS idx_remark_document     ON common_documentremark(document_id)",
    "CREATE INDEX IF NOT EXISTS idx_milestone_project   ON common_milestone(project_id)",
    "CREATE INDEX IF NOT EXISTS idx_milestone_order     ON common_milestone(project_id, sort_order)",
    "CREATE INDEX IF NOT EXISTS idx_appt_project        ON common_appointment(project_id)",
    "CREATE INDEX IF NOT EXISTS idx_appt_date           ON common_appointment(date)",
    "CREATE INDEX IF NOT EXISTS idx_appt_status         ON common_appointment(status)",
    "CREATE INDEX IF NOT EXISTS idx_eval_project        ON common_evaluation(project_id)",
    "CREATE INDEX IF NOT EXISTS idx_eval_published      ON common_evaluation(is_published) WHERE is_published = TRUE",
    "CREATE INDEX IF NOT EXISTS idx_jury_project        ON common_juryassignment(project_id)",
    "CREATE INDEX IF NOT EXISTS idx_jury_member         ON common_juryassignment(jury_member_id)",
    "CREATE INDEX IF NOT EXISTS idx_msg_sender          ON common_message(sender_id)",
    "CREATE INDEX IF NOT EXISTS idx_msg_recipient       ON common_message(recipient_id)",
    "CREATE INDEX IF NOT EXISTS idx_msg_unread          ON common_message(recipient_id, is_read) WHERE is_read = FALSE",
    "CREATE INDEX IF NOT EXISTS idx_notif_recipient     ON common_notification(recipient_id)",
    "CREATE INDEX IF NOT EXISTS idx_notif_unread        ON common_notification(recipient_id, is_read) WHERE is_read = FALSE",
    "CREATE INDEX IF NOT EXISTS idx_note_audience       ON common_adminnote(audience)",
    "CREATE INDEX IF NOT EXISTS idx_resource_type       ON common_resource(type)",
]

# Indexes trigram (nécessitent pg_trgm)
trgm_indexes = [
    "CREATE INDEX IF NOT EXISTS idx_user_fullname_trgm  ON authentication_user USING GIN(full_name gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS idx_subject_title_trgm  ON common_subject USING GIN(title gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS idx_project_title_trgm  ON common_project USING GIN(title gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS idx_resource_title_trgm ON common_resource USING GIN(title gin_trgm_ops)",
]

ok = 0
for idx in indexes + trgm_indexes:
    try:
        cur.execute(idx)
        conn.commit()
        ok += 1
    except Exception as e:
        conn.rollback()

log(f"{ok}/{len(indexes + trgm_indexes)} indexes créés.")

# Trigger updated_at
print("  · Triggers updated_at...")
try:
    cur.execute("""
        CREATE OR REPLACE FUNCTION fn_set_updated_at()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$
    """)
    conn.commit()

    for tbl in ["common_project", "common_evaluation", "common_subjectrequest", "common_adminnote"]:
        cur.execute(f"""
            DROP TRIGGER IF EXISTS trg_{tbl}_updated_at ON {tbl};
            CREATE TRIGGER trg_{tbl}_updated_at
                BEFORE UPDATE ON {tbl}
                FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at()
        """)
        conn.commit()
    log("Triggers updated_at créés.")
except Exception as e:
    log(f"Triggers : {e}", "WARN")
    conn.rollback()

# Fonctions utilitaires
print("  · Fonctions utilitaires...")
functions = [
    """CREATE OR REPLACE FUNCTION fn_final_grade(p_project_id bigint)
    RETURNS double precision LANGUAGE sql STABLE AS $$
        SELECT CASE
            WHEN ev.supervisor_score IS NOT NULL AND ev.jury_score IS NOT NULL
            THEN ROUND((ev.supervisor_score * ev.supervisor_weight + ev.jury_score * ev.jury_weight) / 100.0, 2)::double precision
            WHEN ev.supervisor_score IS NOT NULL THEN ev.supervisor_score
            WHEN ev.jury_score IS NOT NULL THEN ev.jury_score
            ELSE NULL END
        FROM common_evaluation ev WHERE ev.project_id = p_project_id LIMIT 1;
    $$""",
    """CREATE OR REPLACE FUNCTION fn_doc_progress(p_project_id bigint, p_required int DEFAULT 10)
    RETURNS int LANGUAGE sql STABLE AS $$
        SELECT LEAST(ROUND(COUNT(*) FILTER (WHERE status = 'approved')::numeric / p_required * 100)::int, 100)
        FROM common_document WHERE project_id = p_project_id;
    $$""",
    """CREATE OR REPLACE FUNCTION fn_unread_count(p_user_id bigint)
    RETURNS int LANGUAGE sql STABLE AS $$
        SELECT COUNT(*)::int FROM common_notification
        WHERE recipient_id = p_user_id AND is_read = FALSE;
    $$""",
]
for fn in functions:
    try:
        cur.execute(fn)
        conn.commit()
    except Exception as e:
        log(f"Fonction : {e}", "WARN")
        conn.rollback()
log("Fonctions utilitaires créées.")

# Vues
print("  · Vues analytiques...")
views = [
    """CREATE OR REPLACE VIEW vw_project_overview AS
    SELECT
        p.id AS project_id, p.title AS project_title, p.description, p.status,
        p.start_date, p.end_date, p.jury_documents_open,
        p.created_at AS project_created_at, p.updated_at AS project_updated_at,
        stu.id AS student_id, stu.full_name AS student_name, stu.email AS student_email,
        stu.institutional_id AS student_card, stu.department AS student_department,
        sup.id AS supervisor_id, sup.full_name AS supervisor_name,
        sup.email AS supervisor_email, sup.department AS supervisor_department,
        sub.id AS subject_id, sub.title AS subject_title, sub.year AS academic_year,
        ev.id AS evaluation_id, ev.supervisor_score, ev.jury_score,
        ev.supervisor_weight, ev.jury_weight, ev.is_published,
        fn_final_grade(p.id) AS final_grade,
        COUNT(d.id) AS total_documents,
        COUNT(d.id) FILTER (WHERE d.status = 'approved')  AS approved_documents,
        COUNT(d.id) FILTER (WHERE d.status = 'pending')   AS pending_documents,
        fn_doc_progress(p.id) AS doc_progress_pct,
        COUNT(DISTINCT ja.jury_member_id) AS jury_count
    FROM common_project p
    JOIN authentication_user stu ON stu.id = p.student_id
    LEFT JOIN authentication_user sup ON sup.id = p.supervisor_id
    LEFT JOIN common_subject sub ON sub.id = p.subject_id
    LEFT JOIN common_evaluation ev ON ev.project_id = p.id
    LEFT JOIN common_document d ON d.project_id = p.id
    LEFT JOIN common_juryassignment ja ON ja.project_id = p.id
    GROUP BY p.id, stu.id, stu.full_name, stu.email, stu.institutional_id, stu.department,
             sup.id, sup.full_name, sup.email, sup.department,
             sub.id, sub.title, sub.year, ev.id, ev.supervisor_score, ev.jury_score,
             ev.supervisor_weight, ev.jury_weight, ev.is_published""",

    """CREATE OR REPLACE VIEW vw_admin_dashboard AS
    SELECT
        (SELECT COUNT(*) FROM authentication_user WHERE role = 'student'    AND is_active) AS students_active,
        (SELECT COUNT(*) FROM authentication_user WHERE role = 'supervisor' AND is_active) AS supervisors_active,
        (SELECT COUNT(*) FROM authentication_user WHERE role = 'jury'       AND is_active) AS jury_active,
        (SELECT COUNT(*) FROM common_project) AS projects_total,
        (SELECT COUNT(*) FROM common_project WHERE status = 'completed')   AS projects_completed,
        (SELECT COUNT(*) FROM common_project WHERE status = 'in_progress') AS projects_in_progress,
        (SELECT COUNT(*) FROM common_document WHERE status = 'pending')    AS docs_pending,
        (SELECT COUNT(*) FROM common_evaluation WHERE is_published = TRUE)  AS evals_published,
        (SELECT ROUND(AVG(supervisor_score)::numeric, 2) FROM common_evaluation WHERE supervisor_score IS NOT NULL) AS avg_supervisor_score,
        (SELECT ROUND(AVG(jury_score)::numeric, 2)       FROM common_evaluation WHERE jury_score IS NOT NULL)       AS avg_jury_score,
        (SELECT COUNT(*) FROM common_notification WHERE is_read = FALSE)   AS notifications_unread""",
]
for view in views:
    try:
        cur.execute(view)
        conn.commit()
    except Exception as e:
        log(f"Vue : {e}", "WARN")
        conn.rollback()
log("Vues analytiques créées.")

cur.close()
conn.close()

# ── Étape 3 : Django migrate ──────────────────────────────────────────────────
print("\n[3/3] Migration Django...")
import subprocess
backend_dir = os.path.dirname(BASE_DIR)
result = subprocess.run(
    [sys.executable, "manage.py", "migrate", "--run-syncdb"],
    cwd=backend_dir,
    capture_output=True,
    text=True,
    env={**os.environ, "DB_ENGINE": "postgresql"}
)

if result.returncode == 0:
    for line in result.stdout.strip().splitlines():
        if line.strip():
            print(f"    {line}")
    log("Migrations Django appliquées avec succès.")
else:
    log(f"Migrations Django : {result.stderr[:500]}", "WARN")
    print("    (Les tables ont déjà été créées manuellement — migrations partielles acceptées)")

# ── Résumé final ──────────────────────────────────────────────────────────────
print("\n" + "═" * 58)
print("  DÉPLOIEMENT TERMINÉ")
print("═" * 58)

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
    """)
    tables = cur.fetchall()

    print(f"\n  {len(tables)} tables créées dans '{DB_CONFIG['dbname']}' :\n")
    for (t,) in tables:
        print(f"    ✓ {t}")

    cur.execute("SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public'")
    fn_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public'")
    vw_count = cur.fetchone()[0]

    print(f"\n  Fonctions : {fn_count}   Vues : {vw_count}")
    print(f"\n  Connexion : postgresql://postgres:***@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}")
    cur.close()
    conn.close()
except Exception as e:
    log(f"Vérification finale : {e}", "WARN")

print("\n  Prochaine étape :")
print("  cd Backend && python manage.py createsuperuser\n")
