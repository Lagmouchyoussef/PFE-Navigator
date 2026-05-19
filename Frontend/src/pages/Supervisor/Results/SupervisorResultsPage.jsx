import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Form, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  Trophy, CheckCircle, AlertTriangle, Clock, XCircle,
  Search, TrendingUp, User, BookOpen
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const computeFinal = (supScore, juryScore, supW, juryW) => {
  const s = Number.parseFloat(supScore);
  const j = Number.parseFloat(juryScore);
  const sw = (supW ?? 50) / 100;
  const jw = (juryW ?? 50) / 100;
  if (!Number.isNaN(s) && !Number.isNaN(j)) return (s * sw + j * jw);
  if (!Number.isNaN(s)) return s;
  if (!Number.isNaN(j)) return j;
  return null;
};

const getStatus = (final) => {
  if (final === null) return 'pending';
  if (final >= 10) return 'valide';
  if (final >= 7)  return 'rattrapage';
  return 'ajourne';
};

const STATUS_CONFIG = {
  valide:     { label: 'Validé',     bg: 'success',   icon: <CheckCircle size={13} />   },
  rattrapage: { label: 'Rattrapage', bg: 'warning',   icon: <AlertTriangle size={13} /> },
  ajourne:    { label: 'Ajourné',    bg: 'danger',    icon: <XCircle size={13} />       },
  pending:    { label: 'En attente', bg: 'secondary', icon: <Clock size={13} />         },
};

const MentionBadge = ({ score }) => {
  if (score === null) return <span className="text-muted extra-small fw-bold">—</span>;
  const n = Number.parseFloat(score);
  if (n >= 16) return <span className="extra-small fw-bold text-success">Très Bien</span>;
  if (n >= 14) return <span className="extra-small fw-bold text-primary">Bien</span>;
  if (n >= 12) return <span className="extra-small fw-bold text-info">Assez Bien</span>;
  if (n >= 10) return <span className="extra-small fw-bold text-warning">Passable</span>;
  return <span className="extra-small fw-bold text-danger">Insuffisant</span>;
};

const SupervisorResultsPage = () => {
  const { evaluations: rawEvals, projects: rawProjects } = useApp();
  const evaluations = Array.isArray(rawEvals) ? rawEvals : [];
  const projects    = Array.isArray(rawProjects) ? rawProjects : [];

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const projectMap = Object.fromEntries(
    projects.filter(p => p?.id).map(p => [p.id, p])
  );

  const allRows = evaluations.map(ev => {
    const proj         = projectMap[ev.project] || projects.find(p => p.evaluation?.id === ev.id) || {};
    const studentName  = proj.student?.name  || ev.student_name  || 'Étudiant inconnu';
    const projectTitle = proj.title          || `Projet #${ev.project}`;
    const final        = ev.is_published ? computeFinal(
      ev.supervisor_score, ev.jury_score, ev.supervisor_weight, ev.jury_weight
    ) : null;
    const status = ev.is_published ? getStatus(final) : 'pending';
    return { ...ev, studentName, projectTitle, finalNum: final, status };
  });

  const stats = {
    total:      allRows.length,
    valide:     allRows.filter(r => r.status === 'valide').length,
    rattrapage: allRows.filter(r => r.status === 'rattrapage').length,
    ajourne:    allRows.filter(r => r.status === 'ajourne').length,
    pending:    allRows.filter(r => r.status === 'pending').length,
  };

  const filtered = allRows.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchSearch = !search ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.projectTitle.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const FILTERS = [
    { key: 'all',        label: `Tous (${stats.total})`,            color: 'primary'   },
    { key: 'valide',     label: `Validé (${stats.valide})`,         color: 'success'   },
    { key: 'rattrapage', label: `Rattrapage (${stats.rattrapage})`, color: 'warning'   },
    { key: 'ajourne',    label: `Ajourné (${stats.ajourne})`,       color: 'danger'    },
    { key: 'pending',    label: `En attente (${stats.pending})`,    color: 'secondary' },
  ];

  return (
    <div className="py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <header className="mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy d-flex align-items-center gap-2">
              <Trophy size={26} className="text-primary" /> Résultats Étudiants
            </h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Notes publiées — Validé / Rattrapage / Ajourné
            </p>
          </motion.div>
        </header>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total',      value: stats.total,      color: 'primary', icon: <BookOpen size={24} />      },
            { label: 'Validé',     value: stats.valide,     color: 'success', icon: <CheckCircle size={24} />   },
            { label: 'Rattrapage', value: stats.rattrapage, color: 'warning', icon: <AlertTriangle size={24} /> },
            { label: 'Ajourné',    value: stats.ajourne,    color: 'danger',  icon: <XCircle size={24} />       },
          ].map(s => (
            <Col sm={6} lg={3} key={s.label}>
              <Card className="glass-card border-0 shadow-sm p-4 text-center">
                <div className={`text-${s.color} mx-auto mb-2`}>{s.icon}</div>
                <div className={`fs-2 fw-bold text-${s.color}`}>{s.value}</div>
                <div className="small text-muted fw-bold">{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Filters + Search */}
        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
          <div className="d-flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`btn btn-sm rounded-pill fw-bold extra-small px-3 border-2 ${
                  filter === f.key
                    ? `btn-${f.color} text-white`
                    : `btn-outline-${f.color} opacity-75`
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <InputGroup className="ms-auto bg-surface-alt rounded-pill border px-3" style={{ maxWidth: '280px' }}>
            <InputGroup.Text className="bg-transparent border-0 text-muted ps-0 pe-1">
              <Search size={15} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Rechercher étudiant…"
              className="bg-transparent border-0 shadow-none extra-small fw-bold text-navy py-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Table */}
        <Card className="glass-card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Étudiant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Projet</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Note Superviseur</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Note Jury</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Note Finale</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Mention</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-center">Décision</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <Trophy size={40} className="mb-2 opacity-20" />
                      <p className="small fw-bold mb-0">Aucun résultat trouvé.</p>
                    </td>
                  </tr>
                )}
                {filtered.map(row => {
                  const cfg = STATUS_CONFIG[row.status];
                  const finalDisplay = row.finalNum !== null ? `${row.finalNum.toFixed(2)}/20` : '—';
                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-bottom border-light border-opacity-10"
                    >
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="p-2 rounded-circle bg-primary-soft text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 32, height: 32 }}>
                            <User size={14} />
                          </div>
                          <span className="small fw-bold text-navy">{row.studentName}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="extra-small fw-bold text-muted opacity-75 text-truncate d-block" style={{ maxWidth: 200 }}>
                          {row.projectTitle}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="small fw-bold text-primary">
                          {row.supervisor_score !== null ? `${row.supervisor_score}/20` : '—'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="small fw-bold text-success">
                          {row.jury_score !== null ? `${row.jury_score}/20` : '—'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="small fw-bold text-navy">{finalDisplay}</span>
                      </td>
                      <td className="py-3 text-center">
                        <MentionBadge score={row.finalNum} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          bg={cfg.bg}
                          className="d-inline-flex align-items-center gap-1 extra-small fw-bold px-3 py-1 rounded-pill"
                        >
                          {cfg.icon} {cfg.label}
                        </Badge>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Legend */}
        <div className="mt-4 p-3 glass-card rounded-4 border-0 shadow-sm d-flex flex-wrap gap-4 align-items-center">
          <span className="extra-small fw-bold text-muted text-uppercase opacity-50 me-2">Légende :</span>
          {[
            { color: 'success', label: 'Validé — Note ≥ 10/20'      },
            { color: 'warning', label: 'Rattrapage — 7 ≤ Note < 10' },
            { color: 'danger',  label: 'Ajourné — Note < 7'         },
          ].map(l => (
            <div key={l.label} className="d-flex align-items-center gap-2">
              <span className={`rounded-circle bg-${l.color} d-inline-block`} style={{ width: 10, height: 10 }} />
              <span className="extra-small fw-bold text-muted">{l.label}</span>
            </div>
          ))}
          <div className="ms-auto d-flex align-items-center gap-2">
            <TrendingUp size={14} className="text-muted opacity-50" />
            <span className="extra-small fw-bold text-muted opacity-50">
              Coefficients : Superviseur {allRows[0]?.supervisor_weight ?? 50}% · Jury {allRows[0]?.jury_weight ?? 50}%
            </span>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default SupervisorResultsPage;
