# PFE-Navigator — Base de données PostgreSQL

## Déploiement en 3 étapes

### Étape 1 — Créer la base de données
```bash
psql -U postgres -c "CREATE DATABASE recherche_db;"
```

### Étape 2 — Appliquer le schéma
```bash
psql -U postgres -d recherche_db -f Backend/database/schema.sql
```

### Étape 3 — Lancer les migrations Django
```bash
cd Backend
python manage.py migrate
```

> **Note :** Si la base est déjà peuplée par `schema.sql`, Django détectera que les tables existent et ne les recréera pas.

---

### (Optionnel) Données de test
```bash
psql -U postgres -d recherche_db -f Backend/database/seed_data.sql
```

---

## Structure du schéma

| # | Table | Rôle |
|---|-------|------|
| 1 | `authentication_user` | Comptes utilisateurs (admin / supervisor / jury / student) |
| 2 | `common_subject` | Sujets PFE proposés par les encadreurs |
| 3 | `common_subjectrequest` | Demandes d'affectation de sujet |
| 4 | `common_project` | Projets PFE (OneToOne étudiant) |
| 5 | `common_document` | Documents soumis par les étudiants |
| 6 | `common_documentremark` | Annotations sur les documents |
| 7 | `common_milestone` | Jalons de progression |
| 8 | `common_appointment` | Rendez-vous encadreur ↔ étudiant |
| 9 | `common_evaluation` | Évaluation finale (OneToOne projet) |
| 10 | `common_feedback` | Retours de l'encadreur |
| 11 | `common_juryassignment` | Affectations jury ↔ projet |
| 12 | `common_message` | Messagerie interne |
| 13 | `common_notification` | Notifications système |
| 14 | `common_adminnote` | Annonces administratives |
| 15 | `common_resource` | Centre de ressources |

## Vues disponibles

| Vue | Description |
|-----|-------------|
| `vw_project_overview` | Vue complète projet + étudiant + encadreur + évaluation + stats docs |
| `vw_admin_dashboard` | KPIs agrégés pour le tableau de bord admin |
| `vw_supervisor_workload` | Charge de travail par encadreur |
| `vw_jury_assignments` | Affectations jury avec détail scores |

## Fonctions utilitaires

```sql
-- Note finale pondérée d'un projet
SELECT fn_final_grade(1);

-- Progression documentaire (%)
SELECT fn_doc_progress(1, 10);

-- Nombre de notifications non lues
SELECT fn_unread_count(7);
```
