import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Modal, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Search, CheckCircle, Clock, XCircle,
  Trash2, Eye, Users, Bell, User,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const STATUS_CONFIG = {
  available: { label: 'Approuvé',  bg: 'success', icon: <CheckCircle size={12} /> },
  taken:     { label: 'Attribué',  bg: 'warning', icon: <Clock size={12} />       },
  archived:  { label: 'Archivé',   bg: 'secondary', icon: <XCircle size={12} />  },
};

const APPROVAL_CONFIG = {
  true:  { label: 'Approuvé',  cls: 'text-success' },
  false: { label: 'En attente', cls: 'text-warning' },
};

const Subjects = () => {
  const {
    subjects: rawSubjects,
    subjectRequests: rawRequests,
    createSubject, deleteSubject,
    approveSubjectRequest, rejectSubjectRequest,
  } = useApp();
  const requests = Array.isArray(rawRequests) ? rawRequests : [];
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const subjects = Array.isArray(rawSubjects) ? rawSubjects : [];

  const [searchTerm, setSearchTerm]       = useState('');
  const [showAddModal, setShowAddModal]   = useState(false);
  const [viewSubject, setViewSubject]     = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [saving, setSaving]               = useState(false);
  const [deleting, setDeleting]           = useState(false);
  const [form, setForm]                   = useState({ title: '', description: '', year: '' });
  const [busyReq, setBusyReq]            = useState({});

  const handleApproveReq = async (req) => {
    setBusyReq(b => ({ ...b, [req.id]: 'approve' }));
    try { await approveSubjectRequest(req.id); }
    finally { setBusyReq(b => ({ ...b, [req.id]: null })); }
  };

  const handleRejectReq = async (req) => {
    setBusyReq(b => ({ ...b, [req.id]: 'reject' }));
    try { await rejectSubjectRequest(req.id); }
    finally { setBusyReq(b => ({ ...b, [req.id]: null })); }
  };

  const filtered = subjects.filter(s =>
    !searchTerm ||
    (s.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total:    subjects.length,
    approved: subjects.filter(s => s.is_approved).length,
    pending:  subjects.filter(s => !s.is_approved).length,
    taken:    subjects.filter(s => s.status === 'taken').length,
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await createSubject({ title: form.title, description: form.description, year: form.year });
      setForm({ title: '', description: '', year: '' });
      setShowAddModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSubject(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy d-flex align-items-center gap-2">
              <BookOpen size={26} className="text-primary" /> Mes Sujets PFE
            </h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Proposez des sujets — ils seront visibles aux étudiants après validation admin
            </p>
          </motion.div>
          <Button className="btn-premium d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Proposer un sujet
          </Button>
        </header>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total',         value: stats.total,    color: 'primary', icon: <BookOpen size={22} />      },
            { label: 'Approuvés',     value: stats.approved, color: 'success', icon: <CheckCircle size={22} />   },
            { label: 'En attente',    value: stats.pending,  color: 'warning', icon: <Clock size={22} />         },
            { label: 'Pris par étud.', value: stats.taken,   color: 'info',    icon: <Users size={22} />         },
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

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Bell size={18} className="text-warning" />
              <h5 className="fw-bold text-navy mb-0">
                Demandes en attente
                <Badge bg="warning" className="ms-2 extra-small fw-bold px-2 py-1 rounded-pill">
                  {pendingRequests.length}
                </Badge>
              </h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {pendingRequests.map(req => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="glass-card border-0 shadow-sm rounded-4 p-4 d-flex align-items-center justify-content-between gap-3 border-start border-4 border-warning"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle bg-primary-soft text-primary flex-shrink-0" style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} />
                    </div>
                    <div>
                      <div className="fw-bold text-navy small">{req.student_name}</div>
                      <div className="extra-small text-muted fw-bold opacity-75">
                        a demandé : <strong>{req.subject_title}</strong>
                      </div>
                      <div className="extra-small text-muted opacity-50">
                        {new Date(req.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <Button
                      variant="success"
                      size="sm"
                      className="rounded-pill fw-bold extra-small px-3 d-flex align-items-center gap-1"
                      onClick={() => handleApproveReq(req)}
                      disabled={!!busyReq[req.id]}
                    >
                      {busyReq[req.id] === 'approve'
                        ? <span className="spinner-border spinner-border-sm" />
                        : <><CheckCircle size={13} /> Confirmer</>}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill fw-bold extra-small px-3 d-flex align-items-center gap-1"
                      onClick={() => handleRejectReq(req)}
                      disabled={!!busyReq[req.id]}
                    >
                      {busyReq[req.id] === 'reject'
                        ? <span className="spinner-border spinner-border-sm" />
                        : <><XCircle size={13} /> Refuser</>}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <Card className="glass-card border-0 shadow-sm overflow-hidden">
          <Card.Header className="p-4 bg-white d-flex justify-content-between align-items-center gap-3 border-0">
            <h5 className="mb-0 fw-bold text-navy">Mes propositions</h5>
            <InputGroup className="bg-surface-alt rounded-pill border px-3" style={{ width: '250px' }}>
              <InputGroup.Text className="bg-transparent border-0 pe-0">
                <Search size={15} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Filtrer…"
                className="bg-transparent border-0 py-2 extra-small shadow-none fw-bold"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card.Header>

          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Titre</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Année</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Validation Admin</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      <BookOpen size={40} className="mb-2 opacity-20" />
                      <p className="small fw-bold mb-0">Aucun sujet proposé.</p>
                    </td>
                  </tr>
                )}
                <AnimatePresence mode="popLayout">
                  {filtered.map((s, idx) => {
                    const stCfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.archived;
                    const appCfg = APPROVAL_CONFIG[String(s.is_approved)];
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
                            <div className="extra-small text-muted opacity-75 text-truncate" style={{ maxWidth: 300 }}>
                              {s.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="extra-small fw-bold text-muted">{s.year || '—'}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`extra-small fw-bold ${appCfg.cls}`}>{appCfg.label}</span>
                        </td>
                        <td className="py-3 text-center">
                          <Badge
                            bg={stCfg.bg}
                            className="d-inline-flex align-items-center gap-1 extra-small fw-bold px-3 py-1 rounded-pill"
                          >
                            {stCfg.icon} {stCfg.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Button
                              variant="link"
                              className="p-2 text-info border-0 shadow-none rounded-circle"
                              onClick={() => setViewSubject(s)}
                            >
                              <Eye size={17} />
                            </Button>
                            <Button
                              variant="link"
                              className="p-2 text-danger border-0 shadow-none rounded-circle"
                              onClick={() => setDeleteTarget(s)}
                              disabled={s.status === 'taken'}
                            >
                              <Trash2 size={17} />
                            </Button>
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

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Proposer un nouveau sujet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleAdd}>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Titre *</Form.Label>
              <Form.Control
                required
                placeholder="ex: Développement d'une application IA…"
                className="rounded-4 bg-surface-alt py-3 extra-small fw-bold shadow-none border-light"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Description</Form.Label>
              <Form.Control
                as="textarea" rows={3}
                placeholder="Décrivez le périmètre du projet…"
                className="rounded-4 bg-surface-alt py-3 extra-small fw-bold shadow-none border-light"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Année universitaire</Form.Label>
              <Form.Control
                placeholder="ex: 2025-2026"
                className="rounded-4 bg-surface-alt py-3 extra-small fw-bold shadow-none border-light"
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
              />
            </Form.Group>
            <div className="p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25 mb-4">
              <p className="extra-small fw-bold text-warning mb-0">
                Votre sujet sera soumis à l'administration pour validation avant d'être visible aux étudiants.
              </p>
            </div>
            <Button type="submit" className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm" disabled={saving}>
              {saving ? 'Envoi en cours…' : 'Soumettre le sujet'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Modal */}
      <Modal show={!!viewSubject} onHide={() => setViewSubject(null)} centered size="lg">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Détails du sujet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {viewSubject && (
            <>
              <h5 className="fw-bold text-navy mb-3">{viewSubject.title}</h5>
              <p className="extra-small text-muted fw-bold mb-4" style={{ lineHeight: 1.7 }}>
                {viewSubject.description || 'Aucune description fournie.'}
              </p>
              <Row className="g-3">
                <Col sm={4}>
                  <div className="extra-small text-muted fw-bold opacity-50 text-uppercase mb-1">Année</div>
                  <div className="small fw-bold text-navy">{viewSubject.year || '—'}</div>
                </Col>
                <Col sm={4}>
                  <div className="extra-small text-muted fw-bold opacity-50 text-uppercase mb-1">Statut</div>
                  <Badge bg={(STATUS_CONFIG[viewSubject.status] ?? STATUS_CONFIG.archived).bg}
                    className="extra-small fw-bold px-3 py-1 rounded-pill">
                    {(STATUS_CONFIG[viewSubject.status] ?? STATUS_CONFIG.archived).label}
                  </Badge>
                </Col>
                <Col sm={4}>
                  <div className="extra-small text-muted fw-bold opacity-50 text-uppercase mb-1">Validation</div>
                  <span className={`small fw-bold ${APPROVAL_CONFIG[String(viewSubject.is_approved)].cls}`}>
                    {APPROVAL_CONFIG[String(viewSubject.is_approved)].label}
                  </span>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button variant="light" className="rounded-pill fw-bold extra-small px-4" onClick={() => setViewSubject(null)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirm */}
      <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
        <Modal.Body className="p-4 text-center">
          <div className="p-4 rounded-circle bg-danger-soft text-danger d-inline-flex mb-3">
            <Trash2 size={32} />
          </div>
          <h5 className="fw-bold text-navy mb-2">Supprimer le sujet ?</h5>
          <p className="text-muted extra-small fw-bold mb-4">
            Le sujet <strong>"{deleteTarget?.title}"</strong> sera définitivement supprimé.
          </p>
          <div className="d-flex gap-3">
            <Button variant="light" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0"
              onClick={() => setDeleteTarget(null)}>Annuler</Button>
            <Button variant="danger" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm"
              onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Suppression…' : 'Supprimer'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Subjects;
