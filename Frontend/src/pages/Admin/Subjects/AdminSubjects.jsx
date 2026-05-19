import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, CheckCircle, XCircle, Clock,
  Eye, Trash2, X, Users, AlertCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const Pill = ({ children, color }) => (
  <Badge bg={color} className="extra-small fw-bold px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1">
    {children}
  </Badge>
);

const AdminSubjects = () => {
  const { subjects: rawSubjects, approveSubject, rejectSubject, deleteSubject } = useApp();
  const subjects = Array.isArray(rawSubjects) ? rawSubjects : [];

  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [viewSubject, setViewSubject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy]               = useState({});
  const [toast, setToast]             = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (s) => {
    setBusy(b => ({ ...b, [s.id]: 'approve' }));
    try {
      await approveSubject(s.id);
      showToast(`Le sujet "${s.title}" a été approuvé.`);
    } catch {
      showToast(`Erreur lors de l'approbation.`, false);
    } finally {
      setBusy(b => ({ ...b, [s.id]: null }));
    }
  };

  const handleReject = async (s) => {
    setBusy(b => ({ ...b, [s.id]: 'reject' }));
    try {
      await rejectSubject(s.id);
      showToast(`Le sujet "${s.title}" a été refusé.`);
    } catch {
      showToast(`Erreur lors du refus.`, false);
    } finally {
      setBusy(b => ({ ...b, [s.id]: null }));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(b => ({ ...b, [deleteTarget.id]: 'delete' }));
    try {
      await deleteSubject(deleteTarget.id);
      showToast(`Le sujet "${deleteTarget.title}" a été supprimé.`);
      setDeleteTarget(null);
    } catch {
      showToast('Erreur lors de la suppression.', false);
    } finally {
      setBusy(b => ({ ...b, [deleteTarget?.id]: null }));
    }
  };

  const stats = {
    total:    subjects.length,
    pending:  subjects.filter(s => !s.is_approved).length,
    approved: subjects.filter(s => s.is_approved && s.status === 'available').length,
    taken:    subjects.filter(s => s.status === 'taken').length,
  };

  const FILTERS = [
    { key: 'all',      label: `Tous (${stats.total})`,           color: 'primary' },
    { key: 'pending',  label: `En attente (${stats.pending})`,   color: 'warning' },
    { key: 'approved', label: `Approuvés (${stats.approved})`,   color: 'success' },
    { key: 'taken',    label: `Attribués (${stats.taken})`,      color: 'info'    },
  ];

  const filtered = subjects.filter(s => {
    const matchSearch = !search ||
      (s.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (s.supervisor_name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'pending'  && !s.is_approved) ||
      (filter === 'approved' && s.is_approved && s.status === 'available') ||
      (filter === 'taken'    && s.status === 'taken');
    return matchSearch && matchFilter;
  });

  return (
    <div className="py-4">
      <Container fluid className="px-4">

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`glass-card mb-4 p-4 rounded-4 shadow-sm d-flex justify-content-between align-items-center border-start border-4 border-${toast.ok ? 'success' : 'danger'}`}
            >
              <div className="d-flex align-items-center gap-3">
                <div className={`p-2 rounded-circle bg-${toast.ok ? 'success' : 'danger'}-soft text-${toast.ok ? 'success' : 'danger'}`}>
                  {toast.ok ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </div>
                <span className="extra-small fw-bold text-navy">{toast.msg}</span>
              </div>
              <Button variant="link" className="p-0 text-muted border-0 shadow-none" onClick={() => setToast(null)}>
                <X size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy d-flex align-items-center gap-2">
              <BookOpen size={26} className="text-primary" /> Validation des Sujets
            </h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Approuvez ou refusez les sujets proposés par les encadrants
            </p>
          </motion.div>
        </header>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total',      value: stats.total,    color: 'primary', icon: <BookOpen size={22} />    },
            { label: 'En attente', value: stats.pending,  color: 'warning', icon: <Clock size={22} />       },
            { label: 'Approuvés',  value: stats.approved, color: 'success', icon: <CheckCircle size={22} /> },
            { label: 'Attribués',  value: stats.taken,    color: 'info',    icon: <Users size={22} />       },
          ].map((s, i) => (
            <Col sm={6} lg={3} key={s.label}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card className="glass-card border-0 shadow-sm p-4 text-center">
                  <div className={`text-${s.color} mx-auto mb-2`}>{s.icon}</div>
                  <div className={`fs-2 fw-bold text-${s.color}`}>{s.value}</div>
                  <div className="small text-muted fw-bold">{s.label}</div>
                </Card>
              </motion.div>
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
                  filter === f.key ? `btn-${f.color} text-white` : `btn-outline-${f.color} opacity-75`
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
              placeholder="Rechercher…"
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
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Titre</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Encadrant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Année</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      <BookOpen size={40} className="mb-2 opacity-20" />
                      <p className="small fw-bold mb-0">Aucun sujet trouvé.</p>
                    </td>
                  </tr>
                )}
                <AnimatePresence mode="popLayout">
                  {filtered.map((s, idx) => {
                    const loading = busy[s.id];
                    const isApproved = s.is_approved && s.status !== 'taken';
                    const isTaken    = s.status === 'taken';
                    const isPending  = !s.is_approved;

                    return (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-bottom border-light border-opacity-10"
                      >
                        <td className="px-4 py-3">
                          <div className="fw-bold text-navy small">{s.title}</div>
                          {s.description && (
                            <div className="extra-small text-muted opacity-75 text-truncate" style={{ maxWidth: 280 }}>
                              {s.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="extra-small fw-bold text-muted">{s.supervisor_name || '—'}</span>
                        </td>
                        <td className="py-3">
                          <span className="extra-small fw-bold text-muted">{s.year || '—'}</span>
                        </td>
                        <td className="py-3 text-center">
                          {isTaken    && <Pill color="info">    <Users size={11} /> Attribué</Pill>}
                          {isApproved && <Pill color="success"> <CheckCircle size={11} /> Approuvé</Pill>}
                          {isPending  && <Pill color="warning"> <Clock size={11} /> En attente</Pill>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="d-flex justify-content-center gap-1">
                            <Button
                              variant="link"
                              className="p-2 text-info border-0 shadow-none rounded-circle"
                              onClick={() => setViewSubject(s)}
                              title="Voir détails"
                            >
                              <Eye size={16} />
                            </Button>
                            {isPending && (
                              <>
                                <Button
                                  variant="link"
                                  className="p-2 text-success border-0 shadow-none rounded-circle"
                                  onClick={() => handleApprove(s)}
                                  disabled={!!loading}
                                  title="Approuver"
                                >
                                  {loading === 'approve'
                                    ? <span className="spinner-border spinner-border-sm" />
                                    : <CheckCircle size={16} />}
                                </Button>
                                <Button
                                  variant="link"
                                  className="p-2 text-danger border-0 shadow-none rounded-circle"
                                  onClick={() => handleReject(s)}
                                  disabled={!!loading}
                                  title="Refuser"
                                >
                                  {loading === 'reject'
                                    ? <span className="spinner-border spinner-border-sm" />
                                    : <XCircle size={16} />}
                                </Button>
                              </>
                            )}
                            {isApproved && (
                              <Button
                                variant="link"
                                className="p-2 text-danger border-0 shadow-none rounded-circle"
                                onClick={() => handleReject(s)}
                                disabled={!!loading}
                                title="Annuler l'approbation"
                              >
                                {loading === 'reject'
                                  ? <span className="spinner-border spinner-border-sm" />
                                  : <XCircle size={16} />}
                              </Button>
                            )}
                            {!isTaken && (
                              <Button
                                variant="link"
                                className="p-2 text-secondary border-0 shadow-none rounded-circle"
                                onClick={() => setDeleteTarget(s)}
                                disabled={!!loading}
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* View Modal */}
      {viewSubject && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.4)' }} onClick={() => setViewSubject(null)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="fw-bold text-navy mb-0">{viewSubject.title}</h5>
                <Button variant="link" className="p-0 text-muted border-0 shadow-none" onClick={() => setViewSubject(null)}>
                  <X size={20} />
                </Button>
              </div>
              <p className="extra-small text-muted fw-bold mb-4" style={{ lineHeight: 1.7 }}>
                {viewSubject.description || 'Aucune description.'}
              </p>
              <Row className="g-3">
                <Col sm={4}>
                  <div className="extra-small text-muted fw-bold opacity-50 text-uppercase mb-1">Encadrant</div>
                  <div className="small fw-bold text-navy">{viewSubject.supervisor_name || '—'}</div>
                </Col>
                <Col sm={4}>
                  <div className="extra-small text-muted fw-bold opacity-50 text-uppercase mb-1">Année</div>
                  <div className="small fw-bold text-navy">{viewSubject.year || '—'}</div>
                </Col>
                <Col sm={4}>
                  <div className="extra-small text-muted fw-bold opacity-50 text-uppercase mb-1">Approbation</div>
                  <span className={`small fw-bold ${viewSubject.is_approved ? 'text-success' : 'text-warning'}`}>
                    {viewSubject.is_approved ? 'Approuvé' : 'En attente'}
                  </span>
                </Col>
              </Row>
              <div className="d-flex gap-2 mt-4">
                {!viewSubject.is_approved && (
                  <Button
                    variant="success"
                    className="rounded-pill fw-bold extra-small px-4"
                    onClick={() => { handleApprove(viewSubject); setViewSubject(null); }}
                  >
                    <CheckCircle size={14} className="me-1" /> Approuver
                  </Button>
                )}
                {viewSubject.is_approved && viewSubject.status !== 'taken' && (
                  <Button
                    variant="outline-danger"
                    className="rounded-pill fw-bold extra-small px-4"
                    onClick={() => { handleReject(viewSubject); setViewSubject(null); }}
                  >
                    <XCircle size={14} className="me-1" /> Annuler l'approbation
                  </Button>
                )}
                <Button variant="light" className="rounded-pill fw-bold extra-small px-4 ms-auto" onClick={() => setViewSubject(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.4)' }} onClick={() => setDeleteTarget(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg rounded-4 p-4 text-center">
              <div className="p-4 rounded-circle bg-danger-soft text-danger d-inline-flex mb-3 mx-auto">
                <Trash2 size={32} />
              </div>
              <h5 className="fw-bold text-navy mb-2">Supprimer le sujet ?</h5>
              <p className="text-muted extra-small fw-bold mb-4">
                <strong>"{deleteTarget.title}"</strong> sera définitivement supprimé.
              </p>
              <div className="d-flex gap-3">
                <Button variant="light" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0"
                  onClick={() => setDeleteTarget(null)}>Annuler</Button>
                <Button variant="danger" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm"
                  onClick={handleDelete} disabled={!!busy[deleteTarget?.id]}>
                  {busy[deleteTarget?.id] === 'delete' ? 'Suppression…' : 'Supprimer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubjects;
