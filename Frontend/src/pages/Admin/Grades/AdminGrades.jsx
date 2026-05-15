import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Modal, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Star, CheckCircle, AlertCircle,
  Edit3, Save, Search, Share2, Eye, Download, FileText
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const toNum = (v) => {
  const n = Number.parseFloat(v);
  return Number.isNaN(n) ? null : n;
};

const computeFinal = (supScore, juryScore, supW, juryW) => {
  const s = toNum(supScore);
  const j = toNum(juryScore);
  if (s !== null && j !== null) return (s * (supW / 100) + j * (juryW / 100)).toFixed(2);
  if (s !== null) return s.toFixed(2);
  if (j !== null) return j.toFixed(2);
  return null;
};

const AdminGrades = () => {
  const { evaluations, projects, publishEvaluation, pfeWeights } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p]));

  const rows = evaluations.map(ev => {
    const proj = projectMap[ev.project] || projects.find(p => p.evaluation?.id === ev.id) || {};
    return {
      ...ev,
      studentName:  proj.student?.name  || 'Unknown Student',
      projectTitle: proj.title          || `Project #${ev.project}`,
      supW:  ev.supervisor_weight ?? pfeWeights?.supervisor ?? 50,
      juryW: ev.jury_weight       ?? pfeWeights?.jury       ?? 50,
    };
  });

  const filtered = rows.filter(r =>
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePublish = async (ev) => {
    setPublishingId(ev.id);
    try {
      await publishEvaluation(ev.id);
      flash(`Grades published for ${ev.studentName}!`);
    } catch (err) {
      flash(`Error: ${err?.message || 'Could not publish.'}`);
    } finally {
      setPublishingId(null);
    }
  };

  const stats = {
    total: evaluations.length,
    published:   evaluations.filter(e => e.is_published).length,
    withSupScore: evaluations.filter(e => e.supervisor_score !== null).length,
    withJuryScore: evaluations.filter(e => e.jury_score !== null).length,
  };

  return (
    <div className="admin-grades-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">PFE Grades Management</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Validate and publish student final results
            </p>
          </motion.div>
        </header>

        {/* Flash */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card mb-4 p-3 rounded-4 border-start border-success border-4 d-flex align-items-center gap-3">
              <CheckCircle size={18} className="text-success shrink-0" />
              <span className="small fw-bold">{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total Evaluations', value: stats.total,      color: 'primary', icon: <Award size={24} /> },
            { label: 'Published',         value: stats.published,  color: 'success', icon: <CheckCircle size={24} /> },
            { label: 'Supervisor Scored', value: stats.withSupScore,  color: 'info',    icon: <Star size={24} /> },
            { label: 'Jury Scored',       value: stats.withJuryScore, color: 'warning', icon: <Star size={24} /> },
          ].map(s => (
            <Col lg={3} sm={6} key={s.label}>
              <Card className="glass-card border-0 shadow-sm p-4 text-center">
                <div className={`text-${s.color} mx-auto mb-2`}>{s.icon}</div>
                <div className={`fs-2 fw-bold text-${s.color}`}>{s.value}</div>
                <div className="small text-muted fw-bold">{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Table */}
        <Card className="glass-card border shadow-sm overflow-hidden">
          <Card.Header className="p-4 bg-white d-flex align-items-center justify-content-between gap-3 border-0">
            <div className="position-relative" style={{ width: '300px' }}>
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50" size={18} />
              <Form.Control
                type="text"
                placeholder="Search student or project…"
                className="rounded-pill ps-5 bg-surface-alt border-0 shadow-none extra-small fw-bold py-2"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 rounded-pill extra-small fw-bold">
              {evaluations.length} evaluations
            </Badge>
          </Card.Header>

          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student / Project</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Supervisor Score</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Jury Score</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Final Grade</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Decision</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-center">Status</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <Award size={40} className="mb-2 opacity-25" />
                      <p className="small fw-bold">No evaluations found.</p>
                    </td>
                  </tr>
                )}
                {filtered.map(ev => {
                  const final = computeFinal(ev.supervisor_score, ev.jury_score, ev.supW, ev.juryW);
                  const passed = final !== null && Number.parseFloat(final) >= 10;
                  return (
                    <tr key={ev.id} className="border-bottom border-light border-opacity-10">
                      <td className="px-4 py-3">
                        <div className="fw-bold text-navy small">{ev.studentName}</div>
                        <div className="extra-small text-muted fw-bold opacity-50 text-truncate" style={{ maxWidth: '220px' }}>{ev.projectTitle}</div>
                      </td>
                      <td className="py-3">
                        <span className="fw-bold text-primary small">
                          {ev.supervisor_score !== null ? `${ev.supervisor_score}/20` : '—'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="fw-bold text-success small">
                          {ev.jury_score !== null ? `${ev.jury_score}/20` : '—'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="fw-bold text-navy small">{final !== null ? `${final}/20` : '—'}</div>
                      </td>
                      <td className="py-3 text-center">
                        {final !== null ? (
                          <Badge className={`border-0 px-3 py-1 rounded-pill extra-small fw-bold ${passed ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                            {passed ? 'PASSED' : 'FAILED'}
                          </Badge>
                        ) : (
                          <Badge className="bg-surface-alt text-muted border-0 px-3 py-1 rounded-pill extra-small fw-bold">PENDING</Badge>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        <Badge bg={ev.is_published ? 'success' : 'warning'} className="extra-small">
                          {ev.is_published ? 'Published' : 'Unpublished'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button variant="link" className="p-2 text-primary hover-bg-surface-alt rounded-circle border-0 shadow-none"
                            onClick={() => { setSelectedEval(ev); setShowViewModal(true); }}>
                            <Eye size={16} />
                          </Button>
                          {!ev.is_published && (
                            <Button
                              variant="link"
                              className="p-2 text-success hover-bg-surface-alt rounded-circle border-0 shadow-none"
                              onClick={() => handlePublish(ev)}
                              disabled={publishingId === ev.id}
                              title="Publish grades"
                            >
                              {publishingId === ev.id ? <Spinner size="sm" /> : <Share2 size={16} />}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="glass-card border-0 shadow-sm p-4 bg-primary text-white mt-4">
          <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
            <AlertCircle size={18} /> Publication Rule
          </h6>
          <p className="small mb-0 opacity-75">
            Once grades are published, students, supervisors, and jury members can view them. Use the{' '}
            <Share2 size={14} className="mx-1" /> button to publish individual evaluations.
          </p>
        </Card>
      </Container>

      {/* View Details Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Evaluation: {selectedEval?.studentName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedEval && (
            <>
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <Card className="rounded-4 bg-surface-alt p-4 border-0 h-100">
                    <h6 className="extra-small fw-bold text-primary text-uppercase mb-3">Supervisor Evaluation</h6>
                    <div className="h3 fw-bold text-navy mb-2">
                      {selectedEval.supervisor_score !== null ? `${selectedEval.supervisor_score}/20` : 'Not graded'}
                    </div>
                    {selectedEval.supervisor_comment && (
                      <p className="small text-muted fw-bold mb-0">{selectedEval.supervisor_comment}</p>
                    )}
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="rounded-4 bg-surface-alt p-4 border-0 h-100">
                    <h6 className="extra-small fw-bold text-success text-uppercase mb-3">Jury Evaluation</h6>
                    <div className="h3 fw-bold text-navy mb-2">
                      {selectedEval.jury_score !== null ? `${selectedEval.jury_score}/20` : 'Not graded'}
                    </div>
                    {selectedEval.jury_comment && (
                      <p className="small text-muted fw-bold mb-0">{selectedEval.jury_comment}</p>
                    )}
                  </Card>
                </Col>
              </Row>
              <Card className="rounded-4 border-primary border-opacity-25 bg-primary-soft p-4 border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="extra-small fw-bold text-primary text-uppercase mb-1">Final Result</h6>
                    <p className="extra-small text-muted mb-0 fw-bold opacity-75">
                      Supervisor {selectedEval.supW}% + Jury {selectedEval.juryW}%
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="h2 fw-bold text-navy mb-0">
                      {computeFinal(selectedEval.supervisor_score, selectedEval.jury_score, selectedEval.supW, selectedEval.juryW) ?? '—'}
                      <small className="h6 text-muted ms-1 opacity-50">/20</small>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminGrades;
