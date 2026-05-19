import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, User, Calendar, CheckCircle,
  Clock, XCircle, Tag, FileText, AlertCircle, X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';


const StudentSubjectsPage = () => {
  const {
    subjects: rawSubjects,
    currentProject,
    mySubjectRequest,
    requestSubject,
    cancelSubjectRequest,
  } = useApp();

  const subjects = Array.isArray(rawSubjects) ? rawSubjects : [];

  const [search, setSearch]       = useState('');
  const [confirm, setConfirm]     = useState(null);
  const [sending, setSending]     = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 5000);
  };

  const alreadyAssigned  = !!currentProject?.subject;
  const pendingRequest   = mySubjectRequest?.status === 'pending'  ? mySubjectRequest : null;
  const approvedRequest  = mySubjectRequest?.status === 'approved' ? mySubjectRequest : null;
  const rejectedRequest  = mySubjectRequest?.status === 'rejected' ? mySubjectRequest : null;

  // Student can request if: no approved assignment, no pending request
  const canRequest = !alreadyAssigned && !pendingRequest && !approvedRequest;

  const filtered = subjects.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (s.title ?? '').toLowerCase().includes(q) ||
      (s.supervisor_name ?? '').toLowerCase().includes(q) ||
      (s.description ?? '').toLowerCase().includes(q)
    );
  });

  const handleRequest = async () => {
    if (!confirm) return;
    setSending(true);
    try {
      await requestSubject(confirm.id);
      showToast(`Demande envoyée pour "${confirm.title}". En attente de confirmation.`);
      setConfirm(null);
    } catch (e) {
      showToast(e?.message || 'Une erreur est survenue.', false);
    } finally {
      setSending(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelSubjectRequest();
      showToast('Demande annulée.');
    } catch {
      showToast('Erreur lors de l\'annulation.', false);
    } finally {
      setCancelling(false);
    }
  };

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
              <BookOpen size={26} className="text-primary" /> Sujets de PFE
            </h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Sujets disponibles, validés par l'administration
            </p>
          </motion.div>
        </header>

        {/* Status banners */}
        <AnimatePresence>

          {/* Approved assignment */}
          {alreadyAssigned && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-4 glass-card rounded-4 border-start border-4 border-success d-flex align-items-center gap-3">
              <div className="p-2 rounded-circle bg-success-soft text-success flex-shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <div className="fw-bold text-navy small">Sujet attribué</div>
                <div className="extra-small text-muted fw-bold opacity-75">
                  Votre sujet PFE est confirmé : <strong>{currentProject?.subject_title || currentProject?.subject?.title}</strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pending request */}
          {pendingRequest && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-4 glass-card rounded-4 border-start border-4 border-warning d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-warning-soft text-warning flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="fw-bold text-navy small">Demande en cours</div>
                  <div className="extra-small text-muted fw-bold opacity-75">
                    Vous avez demandé le sujet <strong>"{pendingRequest.subject_title}"</strong>.
                    En attente de confirmation de l'encadrant ou de l'administration.
                  </div>
                </div>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                className="rounded-pill fw-bold extra-small px-3 flex-shrink-0"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? '…' : 'Annuler'}
              </Button>
            </motion.div>
          )}

          {/* Approved request (before project shows it) */}
          {approvedRequest && !alreadyAssigned && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-4 glass-card rounded-4 border-start border-4 border-success d-flex align-items-center gap-3">
              <div className="p-2 rounded-circle bg-success-soft text-success flex-shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <div className="fw-bold text-navy small">Demande approuvée !</div>
                <div className="extra-small text-muted fw-bold opacity-75">
                  Votre demande pour <strong>"{approvedRequest.subject_title}"</strong> a été approuvée.
                </div>
              </div>
            </motion.div>
          )}

          {/* Rejected request */}
          {rejectedRequest && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-4 glass-card rounded-4 border-start border-4 border-danger d-flex align-items-center gap-3">
              <div className="p-2 rounded-circle bg-danger-soft text-danger flex-shrink-0">
                <XCircle size={20} />
              </div>
              <div>
                <div className="fw-bold text-navy small">Demande refusée</div>
                <div className="extra-small text-muted fw-bold opacity-75">
                  Votre demande pour <strong>"{rejectedRequest.subject_title}"</strong> a été refusée.
                  Vous pouvez choisir un autre sujet.
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Disponibles', value: subjects.length,                            color: 'primary', icon: <FileText size={24} />   },
            { label: 'Approuvés',   value: subjects.filter(s => s.is_approved).length, color: 'success', icon: <CheckCircle size={24} /> },
          ].map(s => (
            <Col sm={6} key={s.label}>
              <Card className="glass-card border-0 shadow-sm p-4 text-center">
                <div className={`text-${s.color} mx-auto mb-2`}>{s.icon}</div>
                <div className={`fs-2 fw-bold text-${s.color}`}>{s.value}</div>
                <div className="small text-muted fw-bold">{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Search */}
        <div className="d-flex justify-content-end mb-4">
          <InputGroup className="bg-surface-alt rounded-pill border px-3" style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-0 text-muted ps-0 pe-1">
              <Search size={15} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Rechercher un sujet…"
              className="bg-transparent border-0 shadow-none extra-small fw-bold text-navy py-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <BookOpen size={48} className="mb-3 opacity-20" />
            <p className="small fw-bold mb-0">Aucun sujet disponible pour le moment.</p>
          </div>
        ) : (
          <Row className="g-4">
            {filtered.map((subject, idx) => {
              const isMyPending = pendingRequest?.subject === subject.id;
              return (
                <Col md={6} xl={4} key={subject.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }} className="h-100"
                  >
                    <Card className={`glass-card border-0 shadow-sm h-100 p-4 d-flex flex-column ${isMyPending ? 'border border-warning border-2' : ''}`}>

                      {/* Top row */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        {isMyPending ? (
                          <Badge bg="warning" className="extra-small fw-bold px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1">
                            <Clock size={11} /> En attente
                          </Badge>
                        ) : (
                          <Badge bg="success" className="extra-small fw-bold px-3 py-1 rounded-pill d-inline-flex align-items-center gap-1">
                            <CheckCircle size={11} /> Disponible
                          </Badge>
                        )}
                        {subject.year && (
                          <span className="d-flex align-items-center gap-1 extra-small text-muted fw-bold opacity-75">
                            <Calendar size={12} /> {subject.year}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h6 className="fw-bold text-navy mb-2 lh-sm">{subject.title}</h6>

                      {/* Description */}
                      {subject.description ? (
                        <p className="extra-small text-muted fw-bold opacity-75 mb-3 flex-grow-1"
                          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {subject.description}
                        </p>
                      ) : (
                        <p className="extra-small text-muted fst-italic mb-3 flex-grow-1">Aucune description.</p>
                      )}

                      {/* Supervisor */}
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="p-1 rounded-circle bg-primary-soft text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 28, height: 28 }}>
                          <User size={13} />
                        </div>
                        <span className="extra-small fw-bold text-muted">
                          {subject.supervisor_name ?? 'Encadrant non assigné'}
                        </span>
                      </div>

                      {/* Action */}
                      {isMyPending ? (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="w-100 py-2 fw-bold extra-small rounded-3 mt-auto"
                          onClick={handleCancel}
                          disabled={cancelling}
                        >
                          {cancelling ? 'Annulation…' : 'Annuler ma demande'}
                        </Button>
                      ) : canRequest ? (
                        <Button
                          className="btn-premium w-100 py-2 fw-bold extra-small rounded-3 shadow-sm mt-auto"
                          onClick={() => setConfirm(subject)}
                        >
                          Choisir ce sujet
                        </Button>
                      ) : null}
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Footer info */}
        <div className="mt-5 p-3 glass-card rounded-4 border-0 shadow-sm d-flex flex-wrap gap-4 align-items-center">
          <span className="extra-small fw-bold text-muted opacity-50 me-2">INFO :</span>
          <span className="extra-small fw-bold text-muted">
            Votre choix est soumis à confirmation par l'encadrant ou l'administration avant d'être définitif.
          </span>
          <div className="ms-auto d-flex align-items-center gap-1">
            <Tag size={13} className="text-muted opacity-50" />
            <span className="extra-small fw-bold text-muted opacity-50">
              {subjects.length} sujet{subjects.length !== 1 ? 's' : ''} disponible{subjects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

      </Container>

      {/* Confirm Modal */}
      <Modal show={!!confirm} onHide={() => !sending && setConfirm(null)} centered>
        <Modal.Body className="p-4 text-center">
          <div className="p-4 rounded-circle bg-primary-soft text-primary d-inline-flex mb-3">
            <BookOpen size={32} />
          </div>
          <h5 className="fw-bold text-navy mb-2">Confirmer votre demande ?</h5>
          <p className="text-muted extra-small fw-bold mb-1">Vous souhaitez demander le sujet :</p>
          <p className="fw-bold text-navy small mb-3">"{confirm?.title}"</p>
          <p className="extra-small text-muted opacity-75 mb-4">
            Encadrant : <strong>{confirm?.supervisor_name || 'Non assigné'}</strong><br />
            Votre demande sera envoyée à l'encadrant et à l'administration pour confirmation.
          </p>
          <div className="d-flex gap-3">
            <Button variant="light" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0"
              onClick={() => setConfirm(null)} disabled={sending}>
              Annuler
            </Button>
            <Button className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm btn-premium"
              onClick={handleRequest} disabled={sending}>
              {sending ? 'Envoi…' : 'Envoyer la demande'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentSubjectsPage;
