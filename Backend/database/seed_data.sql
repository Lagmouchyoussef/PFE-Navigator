-- =============================================================================
--  PFE-NAVIGATOR  ·  Données de Test (Seed)
--  Exécuter APRÈS schema.sql
--  psql -U postgres -d recherche_db -f seed_data.sql
-- =============================================================================

BEGIN;

-- ─── 1. Utilisateurs ─────────────────────────────────────────────────────────
--  Mot de passe haché = "Emsi2026!" via Django pbkdf2_sha256
--  (généré avec : python -c "from django.contrib.auth.hashers import make_password; print(make_password('Emsi2026!'))")
--  En production, laisser Django gérer les mots de passe via l'API.

INSERT INTO authentication_user
    (email, first_name, last_name, role, institutional_id, department, phone_number, password, is_active, is_staff)
VALUES
-- Admin
('admin@pfe.emsi.ma',          'Karim',   'Benali',    'admin',      'ADM-001', 'Direction Pédagogique', '+212661000001', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, TRUE),
-- Superviseurs
('s.amrani@pfe.emsi.ma',       'Samir',   'Amrani',    'supervisor', 'SUP-001', 'Informatique',          '+212661000002', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, FALSE),
('n.ziani@pfe.emsi.ma',        'Nadia',   'Ziani',     'supervisor', 'SUP-002', 'Génie Logiciel',        '+212661000003', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, FALSE),
('m.elhassani@pfe.emsi.ma',    'Mohamed', 'El Hassani','supervisor', 'SUP-003', 'Réseaux & Sécurité',    '+212661000004', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, FALSE),
-- Jurys
('jury1@pfe.emsi.ma',          'Ahmed',   'Ouali',     'jury',       'JUR-001', 'Informatique',          '+212661000005', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, FALSE),
('jury2@pfe.emsi.ma',          'Fatima',  'Tahri',     'jury',       'JUR-002', 'Génie Logiciel',        '+212661000006', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, FALSE),
-- Étudiants
('e.lagmouch@pfe.emsi.ma',     'Youssef', 'Lagmouch',  'student',    'ETU-2021-001', 'Informatique',    '+212661000007', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, FALSE),
('a.bensalem@pfe.emsi.ma',     'Amine',   'Ben Salem', 'student',    'ETU-2021-002', 'Génie Logiciel',  '+212661000008', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, FALSE),
('s.mokhtar@pfe.emsi.ma',      'Sara',    'Mokhtar',   'student',    'ETU-2021-003', 'Réseaux',         '+212661000009', 'pbkdf2_sha256$600000$placeholder$placeholder=', TRUE, FALSE);

-- ─── 2. Sujets ───────────────────────────────────────────────────────────────
INSERT INTO common_subject (title, description, year, status, is_approved, supervisor_id)
SELECT
    s.title, s.description, '2024-2025', 'available'::subject_status, TRUE,
    (SELECT id FROM authentication_user WHERE email = s.sup_email)
FROM (VALUES
    ('Système de gestion de PFE avec IA',
     'Développement d'une plateforme intelligente de gestion des projets de fin d'études avec recommandation de sujets par IA.',
     's.amrani@pfe.emsi.ma'),
    ('Application mobile de suivi de santé',
     'Conception et développement d'une app mobile cross-platform pour le suivi des constantes vitales via IoT.',
     'n.ziani@pfe.emsi.ma'),
    ('Blockchain pour la certification académique',
     'Système décentralisé de vérification et certification des diplômes sur blockchain Ethereum.',
     'm.elhassani@pfe.emsi.ma'),
    ('Détection d'intrusion par Machine Learning',
     'Modèle ML pour la détection en temps réel d'anomalies réseau et d'intrusions cybersécurité.',
     'm.elhassani@pfe.emsi.ma'),
    ('Plateforme e-learning adaptative',
     'LMS avec parcours pédagogiques adaptatifs basés sur le profil d'apprentissage de l'étudiant.',
     's.amrani@pfe.emsi.ma')
) AS s(title, description, sup_email);

-- ─── 3. Projets ──────────────────────────────────────────────────────────────
INSERT INTO common_project (title, description, status, student_id, supervisor_id, subject_id, start_date, end_date)
SELECT
    sub.title,
    sub.description,
    p.status::project_status,
    (SELECT id FROM authentication_user WHERE email = p.stu_email),
    (SELECT id FROM authentication_user WHERE email = p.sup_email),
    sub.id,
    '2025-01-15'::date,
    '2025-06-30'::date
FROM (VALUES
    ('e.lagmouch@pfe.emsi.ma', 's.amrani@pfe.emsi.ma',    'Système de gestion de PFE avec IA',          'in_progress'),
    ('a.bensalem@pfe.emsi.ma', 'n.ziani@pfe.emsi.ma',     'Application mobile de suivi de santé',        'submitted'),
    ('s.mokhtar@pfe.emsi.ma',  'm.elhassani@pfe.emsi.ma', 'Détection d'intrusion par Machine Learning',  'in_progress')
) AS p(stu_email, sup_email, subj_title, status)
JOIN common_subject sub ON sub.title = p.subj_title;

-- ─── 4. Jalons ───────────────────────────────────────────────────────────────
INSERT INTO common_milestone (project_id, title, description, status, date, sort_order)
SELECT p.id, m.title, m.desc, m.status::milestone_status, m.date::date, m.ord
FROM common_project p
JOIN authentication_user stu ON stu.id = p.student_id AND stu.email = 'e.lagmouch@pfe.emsi.ma'
CROSS JOIN (VALUES
    ('Analyse des besoins',        'Rédaction du cahier des charges complet.',   'completed', '2025-02-01', 1),
    ('Architecture système',       'Conception de l'architecture technique.',    'completed', '2025-02-28', 2),
    ('Développement Backend',      'API REST Django et modèles de données.',     'current',   '2025-04-15', 3),
    ('Développement Frontend',     'Interface React avec design system.',        'pending',   '2025-05-15', 4),
    ('Tests & Déploiement',        'Tests d'intégration et mise en production.','pending',   '2025-06-20', 5)
) AS m(title, desc, status, date, ord);

-- ─── 5. Évaluations ──────────────────────────────────────────────────────────
INSERT INTO common_evaluation
    (project_id, supervisor_score, jury_score, supervisor_comment, jury_comment,
     supervisor_criteria, jury_criteria, supervisor_weight, jury_weight, is_published)
SELECT
    p.id,
    16.5, 17.0,
    'Excellent travail, autonomie remarquable et rigueur dans la démarche scientifique.',
    'Présentation claire, résultats probants. Légères améliorations suggérées sur la documentation.',
    '{"méthodologie": 17, "qualité_code": 16, "autonomie": 17, "documentation": 16}'::jsonb,
    '{"présentation": 17, "innovation": 18, "résultats": 17, "docs": 16}'::jsonb,
    40.0, 60.0,
    TRUE
FROM common_project p
JOIN authentication_user stu ON stu.id = p.student_id AND stu.email = 'e.lagmouch@pfe.emsi.ma';

-- Évaluation non publiée (projet Amine)
INSERT INTO common_evaluation (project_id, supervisor_score, supervisor_comment, supervisor_weight, jury_weight, is_published)
SELECT p.id, 14.0, 'Bon travail mais quelques axes d'amélioration sur la partie mobile.', 50.0, 50.0, FALSE
FROM common_project p
JOIN authentication_user stu ON stu.id = p.student_id AND stu.email = 'a.bensalem@pfe.emsi.ma';

-- ─── 6. Affectations jury ────────────────────────────────────────────────────
INSERT INTO common_juryassignment (project_id, jury_member_id, role)
SELECT p.id, j.id, r.role
FROM common_project       p
JOIN authentication_user  stu ON stu.id = p.student_id AND stu.email = 'e.lagmouch@pfe.emsi.ma'
CROSS JOIN (VALUES
    ('jury1@pfe.emsi.ma', 'president'),
    ('jury2@pfe.emsi.ma', 'member')
) AS r(jemail, role)
JOIN authentication_user j ON j.email = r.jemail;

-- ─── 7. Notifications ────────────────────────────────────────────────────────
INSERT INTO common_notification (recipient_id, title, message, type, link, is_read)
SELECT
    (SELECT id FROM authentication_user WHERE email = 'e.lagmouch@pfe.emsi.ma'),
    'Votre note finale est disponible',
    'Votre évaluation PFE a été publiée. Note finale : 16.8/20. Félicitations !',
    'grade'::notification_type,
    '/student/evaluation',
    FALSE
UNION ALL
SELECT
    (SELECT id FROM authentication_user WHERE email = 'a.bensalem@pfe.emsi.ma'),
    'Document en attente de validation',
    'Votre rapport intermédiaire est en cours de révision par votre encadreur.',
    'info'::notification_type,
    '/student/reports',
    FALSE;

-- ─── 8. Messages ─────────────────────────────────────────────────────────────
INSERT INTO common_message (sender_id, recipient_id, subject, content, is_read)
SELECT
    (SELECT id FROM authentication_user WHERE email = 's.amrani@pfe.emsi.ma'),
    (SELECT id FROM authentication_user WHERE email = 'e.lagmouch@pfe.emsi.ma'),
    'Retour sur votre rapport intermédiaire',
    'Bonjour Youssef, j'ai examiné votre rapport. Le travail est de bonne qualité. Quelques points à améliorer sur la section architecture. Merci de prendre en compte mes remarques pour la version finale.',
    FALSE;

-- ─── 9. Ressources ───────────────────────────────────────────────────────────
INSERT INTO common_resource (title, description, type, year, url, uploaded_by_id)
VALUES
    ('Guide de rédaction du rapport PFE',
     'Modèle officiel et guide complet pour la rédaction du rapport de projet de fin d'études.',
     'template'::resource_type, '2024-2025',
     'https://emsi.ma/pfe/guide-rapport.pdf',
     (SELECT id FROM authentication_user WHERE email = 'admin@pfe.emsi.ma')),
    ('Template PowerPoint soutenance',
     'Présentation officielle pour la soutenance PFE EMSI — format 16:9.',
     'template'::resource_type, '2024-2025',
     'https://emsi.ma/pfe/template-soutenance.pptx',
     (SELECT id FROM authentication_user WHERE email = 'admin@pfe.emsi.ma')),
    ('Exemples de projets PFE primés 2023-2024',
     'Recueil des meilleurs projets PFE de l'année académique 2023-2024.',
     'project'::resource_type, '2023-2024',
     'https://emsi.ma/pfe/best-projects-2024.pdf',
     (SELECT id FROM authentication_user WHERE email = 'admin@pfe.emsi.ma'));

-- ─── 10. Note administrative ──────────────────────────────────────────────────
INSERT INTO common_adminnote (author_id, title, content, audience, is_pinned)
SELECT
    (SELECT id FROM authentication_user WHERE email = 'admin@pfe.emsi.ma'),
    'Calendrier des soutenances 2024-2025',
    'Les soutenances PFE auront lieu du 25 au 30 juin 2025. Merci de vérifier votre affectation sur la plateforme. Tout document doit être soumis avant le 10 juin 2025.',
    'all'::note_audience,
    TRUE;

COMMIT;

-- =============================================================================
-- Vérification rapide
-- =============================================================================
SELECT 'authentication_user' AS table_name, COUNT(*) FROM authentication_user
UNION ALL SELECT 'common_subject',       COUNT(*) FROM common_subject
UNION ALL SELECT 'common_project',       COUNT(*) FROM common_project
UNION ALL SELECT 'common_milestone',     COUNT(*) FROM common_milestone
UNION ALL SELECT 'common_evaluation',    COUNT(*) FROM common_evaluation
UNION ALL SELECT 'common_juryassignment',COUNT(*) FROM common_juryassignment
UNION ALL SELECT 'common_notification',  COUNT(*) FROM common_notification
UNION ALL SELECT 'common_message',       COUNT(*) FROM common_message
UNION ALL SELECT 'common_resource',      COUNT(*) FROM common_resource
ORDER BY 1;
